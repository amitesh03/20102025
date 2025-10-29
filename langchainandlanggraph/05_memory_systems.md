# Memory Systems in LangChain

## Learning Objectives
By the end of this lesson, you will be able to:
- Implement conversation buffer memory
- Build summary-style memory
- Store and retrieve long-term memories with vector databases
- Maintain lightweight knowledge graph memory
- Persist memory across sessions
- Apply best practices for memory scaling

## What Is Memory?
Memory stores state across interactions, letting chains and agents use prior context.

Types we'll cover:
- Conversation Buffer Memory (verbatim history)
- Summary Memory (compressed history)
- Vector Memory (semantic recall)
- Knowledge Graph Memory (structured facts)
- Persistence (saving/restoring memory)

## Prerequisites
- OpenAI API key in your .env
- Installed packages from requirements.txt

## 1. Conversation Buffer Memory
ConversationBufferMemory captures and replays the full dialogue history.

Example: Use memory with a chat chain

```python
from dotenv import load_dotenv
load_dotenv()

from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.chains import LLMChain
from langchain_core.memory import ConversationBufferMemory

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.4)

prompt_text = """You are a helpful assistant.
{chat_history}
Human: {input}
Assistant:"""

prompt = PromptTemplate(
    template=prompt_text,
    input_variables=["input", "chat_history"]
)

memory = ConversationBufferMemory(memory_key="chat_history", input_key="input")

chain = LLMChain(llm=llm, prompt=prompt, memory=memory, verbose=True)

print(chain.run(input="Hi, I'm learning memory systems."))
print(chain.run(input="What did I say earlier?"))
```

Key points:
- Use memory_key to inject history into your prompt
- input_key tells memory which variable holds the human message

### Exercise A
Modify the prompt to include a system role instruction like "Always answer concisely" and observe responses after multiple turns.

## 2. Summary Memory Strategy
Summary memory compresses prior turns into a concise summary to fit within the token window.

Implement a simple summary strategy:

```python
from langchain_core.prompts import PromptTemplate
from langchain_core.chains import LLMChain
from langchain_openai import ChatOpenAI

summarizer_prompt = PromptTemplate(
    template="""Summarize the following conversation in 2-3 sentences.
{conversation}
Summary:""",
    input_variables=["conversation"]
)

summarizer = LLMChain(llm=ChatOpenAI(model="gpt-3.5-turbo", temperature=0), prompt=summarizer_prompt)

conversation_log = []

def append_and_summarize(user_text, ai_text=None):
    if ai_text is not None:
        conversation_log.append(f"Human: {user_text}")
        conversation_log.append(f"Assistant: {ai_text}")
    else:
        conversation_log.append(f"Human: {user_text}")

    joined = "\n".join(conversation_log[-20:])  # window
    summary = summarizer.run(conversation=joined)
    return summary

# Example usage:
summary1 = append_and_summarize("Plan a 3-day trip to Goa.", "Day-by-day itinerary...")
summary2 = append_and_summarize("Make it budget-friendly.", "Updated itinerary with budget tips...")
print(summary2)
```

Notes:
- Summarize at checkpoints (e.g., after each turn or every N turns)
- Keep a rolling summary and drop raw turns when necessary

### Exercise B
Adapt the summarizer to constrain summary length to 100 tokens and evaluate its effect on recall quality.

## 3. Vector Memory with Chroma
Semantic memory stores embeddings of messages/documents for retrieval.

Example: store conversation snippets in a local Chroma DB

```python
import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

persist_dir = "./chroma_memory"
emb = OpenAIEmbeddings()
vs = Chroma(collection_name="memories", embedding_function=emb, persist_directory=persist_dir)

def remember(text, metadata=None):
    doc = Document(page_content=text, metadata=metadata or {})
    vs.add_documents([doc])
    vs.persist()

def recall(query, k=3):
    retriever = vs.as_retriever(search_kwargs={"k": k})
    return retriever.get_relevant_documents(query)

# Save some memories
remember("User prefers concise answers", {"type": "preference"})
remember("Project is about LangChain memory", {"type": "context"})

# Recall
docs = recall("What does the user prefer?")
for d in docs:
    print(d.metadata, d.page_content)
```

Tips:
- Use metadata to tag memory types (preference, profile, intent)
- Persist directory lets you keep memory across sessions

### Exercise C
Insert at least five conversation facts and build a function that returns a merged context string for prompts.

## 4. Knowledge Graph Memory (Lightweight)
Structured memory models entities and relations for precise recall.

Example: minimal triple store

```python
from collections import defaultdict

class TripleStore:
    def __init__(self):
        self.forward = defaultdict(set)  # (subject, predicate) -> {object}
        self.reverse = defaultdict(set)  # (object, predicate) -> {subject}

    def add(self, s, p, o):
        self.forward[(s, p)].add(o)
        self.reverse[(o, p)].add(s)

    def objects(self, s, p):
        return list(self.forward.get((s, p), []))

    def subjects(self, o, p):
        return list(self.reverse.get((o, p), []))

kg = TripleStore()
kg.add("Alice", "likes", "RAG")
kg.add("Alice", "role", "Engineer")
kg.add("ProjectX", "uses", "LangChain")

print("Alice likes:", kg.objects("Alice", "likes"))
print("Who uses LangChain:", kg.subjects("LangChain", "uses"))
```

Integration idea:
- Extract triples from user statements with an LLM and store them
- Compose prompt context from graph queries

### Exercise D
Implement a function extract_triples(text) that uses an LLM to return (s, p, o) tuples and insert them into the TripleStore.

## 5. Persistence Patterns
Combine multiple memory forms and save to disk.

Example: JSON persistence for buffer + summary

```python
import json

state = {
    "buffer": [],
    "summary": ""
}

def save_state(path="memory_state.json"):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

def load_state(path="memory_state.json"):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"buffer": [], "summary": ""}

# Update and persist
state["buffer"].append({"role": "user", "content": "Hello again"})
state["summary"] = "User greeted; topic pending."
save_state()
```

Chroma persistence:
- Use persist_directory for long-term vector memory
- Call vs.persist() after writes

### Exercise E
Add encryption-at-rest for JSON memory using a simple symmetric key, and discuss trade-offs.

## 6. Best Practices
- Keep prompts explicit about how memory should be used
- Segment memory by purpose (profile vs task vs context)
- Periodically summarize to control token growth
- Use metadata and TTLs for stale facts
- Log memory operations for auditability

## 7. Capstone: Memory-Enabled Assistant
Combine buffer, summary, vector, and graph memory into a single assistant wrapper.

```python
from typing import Optional, List
from langchain_core.prompts import PromptTemplate
from langchain_core.chains import LLMChain
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

class MemoryAssistant:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.3)
        self.buffer = ConversationBufferMemory(memory_key="chat_history", input_key="input")
        self.summary = ""
        self.kg = TripleStore()
        self.vs = Chroma(collection_name="assistant_mem", embedding_function=OpenAIEmbeddings(), persist_directory="./assistant_mem")
        self.summarizer = LLMChain(llm=ChatOpenAI(model="gpt-3.5-turbo", temperature=0), prompt=PromptTemplate(
            template="""Summarize:
{conversation}
Summary:""",
            input_variables=["conversation"]
        ))

        self.chat_prompt = PromptTemplate(
            template="""System: Use prior context when helpful.
{chat_history}
Facts: {facts}
Retrieved: {retrieved}
Human: {input}
Assistant:""",
            input_variables=["chat_history", "facts", "retrieved", "input"]
        )

        self.chat_chain = LLMChain(llm=self.llm, prompt=self.chat_prompt, memory=self.buffer)

    def add_fact(self, s, p, o):
        self.kg.add(s, p, o)
        self.vs.add_texts([f"{s} {p} {o}"])
        self.vs.persist()

    def summarize(self):
        convo = self.buffer.buffer
        self.summary = self.summarizer.run(conversation=convo)
        return self.summary

    def ask(self, text: str) -> str:
        # Retrieve
        retrieved_docs = self.vs.as_retriever(search_kwargs={"k": 3}).get_relevant_documents(text)
        retrieved = " \n".join([d.page_content for d in retrieved_docs])

        # Facts
        facts = ", ".join(self.kg.objects("Alice", "likes")) if self.kg.objects("Alice", "likes") else ""

        # Run chat
        return self.chat_chain.run(input=text, facts=facts, retrieved=retrieved)

assistant = MemoryAssistant()
assistant.add_fact("Alice", "likes", "RAG")
print(assistant.ask("What do we know about Alice?"))
```

### Exercise F (Capstone)
- Extend MemoryAssistant to drop old turns when summary is updated
- Add per-user namespaces to vector memory
- Provide a method export_state() that saves all memory types to disk

## Key Takeaways
- Choose memory type based on need: verbatim, compressed, semantic, structured
- Control token growth with summarization and retrieval
- Persist important facts; expire the rest
- Treat memory like a database: schema, lifecycle, and governance

## Next Steps
Next lesson: Agents — tools, decision making, and execution with LangChain and LangGraph.