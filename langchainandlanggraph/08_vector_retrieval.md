# Vector Databases and Retrieval (RAG) in LangChain

## Learning Objectives
- Build and persist vector indexes (Chroma, FAISS)
- Generate embeddings and choose chunking strategies
- Create retrievers with similarity, MMR, and thresholding
- Add metadata filters and hybrid search (BM25 + vectors)
- Wire a Retrieval-Augmented Generation (RAG) chain
- Evaluate and tune retrieval quality

## Prerequisites
- OPENAI_API_KEY in .env for embeddings and LLM
- Packages from requirements.txt installed (chromadb, faiss-cpu)

## 1) Embeddings: Overview and Setup
Embeddings map text to high-dimensional vectors where semantic similarity ≈ vector closeness.

Example: create an embedder

```python
from dotenv import load_dotenv
load_dotenv()

from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()
vector = embeddings.embed_query("LangChain makes RAG easy")
print(len(vector), vector[:5])
```

Notes:
- Use one embedder instance and reuse it.
- Pick model family to match the LLM if possible.

## 2) Text Chunking That Respects Semantics
Chunk size, overlap, and boundaries greatly influence retrieval.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter, TokenTextSplitter

text = ("LangChain is a framework for developing applications powered by LLMs. "
        "It provides prompts, chains, agents, memory, and integrations.")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=400, chunk_overlap=60, separators=["\n\n", "\n", " ", ""]
)
chunks = splitter.split_text(text)
print(len(chunks), len(chunks[0]))
```

Guidelines:
- Prefer RecursiveCharacterTextSplitter; tune chunk_size 200–1000 and overlap 10–20%.
- Keep semantic units intact where possible (paragraphs, headings).

## 3) Build a Chroma Index (persistent)

```python
import os
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma

persist_dir = "./chroma_rag"
os.makedirs(persist_dir, exist_ok=True)

docs = [
    Document(page_content="LangChain supports prompts, chains, agents, and memory.",
            metadata={"source": "notes", "topic": "langchain"}),
    Document(page_content="Vector databases enable semantic search via embeddings.",
            metadata={"source": "notes", "topic": "vectors"}),
]

vectordb = Chroma(collection_name="demo",
                  embedding_function=embeddings,
                  persist_directory=persist_dir)
vectordb.add_documents(docs)
vectordb.persist()
print(vectordb._collection.count())
```

You can reopen later with the same persist_directory and collection_name.

### Metadata filtering

```python
retriever = vectordb.as_retriever(search_kwargs={"k": 3})
filtered = vectordb.similarity_search("semantic search", k=3, 
                                     filter={"topic": "vectors"})
for d in filtered:
    print(d.metadata, d.page_content[:60])
```

## 4) FAISS Index (in-memory, file-backed)

```python
from langchain_community.vectorstores import FAISS

faiss_db = FAISS.from_documents(docs, embeddings)
hits = faiss_db.similarity_search("What enables semantic search?", k=2)
for h in hits:
    print(h.metadata, h.page_content[:60])

# Save / load
faiss_db.save_local("./faiss_demo")
faiss_loaded = FAISS.load_local("./faiss_demo", embeddings, allow_dangerous_deserialization=True)
```

FAISS is fast and portable, but filtering by metadata is manual unless you manage sidecar stores.

## 5) Retriever Strategies

```python
# Simple similarity
sim_retriever = vectordb.as_retriever(search_kwargs={"k": 4})
docs_sim = sim_retriever.get_relevant_documents("What is in LangChain?")

# Maximal Marginal Relevance (MMR) trades relevance vs novelty
mmr_retriever = vectordb.as_retriever(search_type="mmr",
                                      search_kwargs={"k": 5, "lambda_mult": 0.5})
docs_mmr = mmr_retriever.get_relevant_documents("semantic search and vectors")

# Score threshold (when supported by the store)
thresh_retriever = vectordb.as_retriever(search_type="similarity_score_threshold",
                                         search_kwargs={"score_threshold": 0.2, "k": 8})
docs_thr = thresh_retriever.get_relevant_documents("obscure topic")
```

Tips:
- Use MMR for diverse contexts to reduce redundancy.
- Thresholding can avoid polluted context on weak matches.

## 6) Hybrid Search (BM25 + Vectors) with RRF

```python
from langchain_community.retrievers import BM25Retriever
from collections import defaultdict

# Build a small BM25 index from texts
bm25 = BM25Retriever.from_texts([d.page_content for d in docs])
bm25.k = 4

def rrf(ranks, k=60):
    return sum(1.0 / (k + r) for r in ranks)

def hybrid_search(query, top_k=5):
    bm25_hits = bm25.get_relevant_documents(query)
    vec_hits = vectordb.similarity_search_with_score(query, k=top_k)

    # Build rank maps
    rank = defaultdict(list)
    for i, d in enumerate(bm25_hits):
        rank[hash(d.page_content)].append(i+1)
    for j, (d, _) in enumerate(vec_hits):
        rank[hash(d.page_content)].append(j+1)

    # Score with RRF
    scored = []
    for hsh, ranks in rank.items():
        scored.append((rrf(ranks), hsh))
    scored.sort(reverse=True)

    # Recover docs
    needle = {hash(d.page_content): d for d in [*bm25_hits, *[d for d,_ in vec_hits]]}
    return [needle[h] for _, h in scored[:top_k]]

combo = hybrid_search("semantic search")
for d in combo:
    print(d.page_content[:80])
```

Hybrid often improves recall for short, keyworded queries while keeping semantic matching for paraphrases.

## 7) Wire a Minimal RAG Chain

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.chains import LLMChain

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2)

rag_prompt = PromptTemplate(
    template=("""You are a helpful assistant. Use only the context to answer.\n\n"""
              "Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"),
    input_variables=["context", "question"]
)

def answer(question: str, retriever=sim_retriever):
    ctx_docs = retriever.get_relevant_documents(question)
    context = "\n\n".join(d.page_content for d in ctx_docs)
    chain = LLMChain(llm=llm, prompt=rag_prompt)
    return chain.run(context=context, question=question)

print(answer("What components does LangChain provide?"))
```

Production tips:
- Consider LCEL with RunnablePassthrough and format_docs for composability.
- Limit per-doc length and number of docs to control tokens.
- Add citations by returning doc.metadata alongside answers.

## 8) Persistence, Updates, and Data Freshness
- For Chroma, call persist() after writes; reopen with same path.
- For FAISS, persist with save_local/load_local.
- Add document IDs and implement upsert semantics to avoid duplicates.
- Track source hashes to detect stale chunks; rebuild as needed.

## 9) Measuring Retrieval Quality (Quick-and-Dirty)

```python
from typing import Tuple

gold = {
    "What is LangChain?": "LangChain supports prompts, chains, agents, and memory.",
    "How do we search semantically?": "Vector databases enable semantic search via embeddings."
}

def hit_rate(retriever, k=3) -> float:
    hits = 0
    for q, must_have in gold.items():
        docs = retriever.get_relevant_documents(q)
        snapshot = "\n".join(d.page_content for d in docs[:k])
        if must_have.lower() in snapshot.lower():
            hits += 1
    return hits / len(gold)

print("Similarity@3:", hit_rate(sim_retriever, k=3))
print("MMR@3:", hit_rate(mmr_retriever, k=3))
```

Better options include synthetic Q/A generation plus graded relevance, and evaluation frameworks.

## 10) Exercises
A) Chroma vs FAISS
- Index a larger text corpus with both backends; compare latency and hit_rate@k.

B) MMR Tuning
- Sweep lambda_mult in [0.2, 0.8] and plot hit_rate@k; choose the best setting.

C) Hybrid Improvements
- Replace the simple RRF with weighted RRF (favor vector ranks slightly).
- Add metadata filters to hybrid_search (e.g., topic in {vectors, langchain}).

D) Source-Grounded Answers
- Modify answer() to return citations (source file, paragraph).
- Truncate long contexts and show only the best 3 passages.

E) Freshness and Upserts
- Add an upsert() helper that deletes older chunks for a source before inserting new ones.

## Key Takeaways
- Quality retrieval starts with good chunking and metadata.
- Pick a vector store that matches your persistence and filtering needs.
- Use MMR and hybrid search to balance relevance and coverage.
- Persist indexes, monitor freshness, and measure retrieval quality regularly.