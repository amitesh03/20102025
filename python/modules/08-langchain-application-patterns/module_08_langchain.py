#!/usr/bin/env python3
"""
LangChain Application Patterns — Module 8 teaching script.

This script demonstrates:
- Prompt templates and simple chains (LangChain Expression Language)
- Using OpenAI chat models via langchain-openai (with fallback fake model)
- Output parsing with StrOutputParser
- Composable chains: retrieval + generation (RAG-style) without heavy dependencies
- Conversation memory (ChatMessageHistory)
- Basic tool/function-calling schema (illustrative)
- Robust error handling and simple backoff for API calls

Run:
  python modules/08-langchain-application-patterns/module_08_langchain.py

Prerequisites:
- Optional: pip install langchain langchain-openai openai
- For embeddings demo: set OPENAI_API_KEY in environment (or fallback will be used)
"""

from __future__ import annotations

import os
import time
from dataclasses import dataclass
from typing import Callable, Dict, Iterable, List, Optional, Tuple

import math
import numpy as np

# Attempt imports with graceful fallbacks
try:
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.messages import AIMessage, HumanMessage
    from langchain_core.runnables import RunnableLambda
    from langchain_core.chat_history import InMemoryChatMessageHistory
except Exception as e:
    ChatPromptTemplate = None  # type: ignore
    StrOutputParser = None  # type: ignore
    AIMessage = None  # type: ignore
    HumanMessage = None  # type: ignore
    RunnableLambda = None  # type: ignore
    InMemoryChatMessageHistory = None  # type: ignore

try:
    from langchain_openai import ChatOpenAI
except Exception as e:
    ChatOpenAI = None  # type: ignore


def section(title: str) -> None:
    print("\n=== " + title + " ===")


# -----------------------------
# Simple "model" abstraction
# -----------------------------

class FakeChatModel:
    """
    Fallback model used when OpenAI/ChatOpenAI is unavailable.
    It performs extremely simple template filling and echoing.
    """

    def __init__(self, temperature: float = 0.0):
        self.temperature = temperature

    def invoke(self, messages: List[Dict[str, str]]) -> str:
        # messages: [{"role": "system"/"user"/"assistant", "content": "..."}]
        # Produce a naive response based on last user message
        last_user = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        return f"(fake-model) You said: {last_user}. Here's a structured response."


def get_model(temperature: float = 0.0):
    """
    Return a ChatOpenAI model if available & API key set; otherwise FakeChatModel.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if ChatOpenAI is not None and api_key:
        try:
            return ChatOpenAI(model="gpt-4o-mini", temperature=temperature)
        except Exception as e:
            print("ChatOpenAI init failed; using FakeChatModel:", e)
    return FakeChatModel(temperature=temperature)


# -----------------------------
# Prompting and simple chains
# -----------------------------

def prompt_chain_demo() -> None:
    section("Prompt templates and simple chain")

    # If LangChain core not available, fall back to manual formatting
    if ChatPromptTemplate is None or StrOutputParser is None:
        print("LangChain core not installed; falling back to manual demo.")
        tmpl = "You are a helpful assistant.\nTask: Summarize the following text in one sentence.\nText: {text}"
        text = "Python is widely used for AI development due to its rich ecosystem of libraries."
        prompt = tmpl.format(text=text)
        model = get_model()
        messages = [{"role": "system", "content": "You are helpful."}, {"role": "user", "content": prompt}]
        result = model.invoke(messages)
        print("Result:", result)
        return

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You are a helpful assistant. Provide concise, clear answers."),
            ("user", "Summarize the following text in one sentence:\n\n{text}"),
        ]
    )
    parser = StrOutputParser()
    model = get_model(temperature=0.1)

    # Expression Language composition: prompt | model | parser
    chain = prompt | model | parser

    text = "LangChain enables composable pipelines and clear separation of concerns in LLM apps."
    out = chain.invoke({"text": text})
    print("Summary:", out)


# -----------------------------
# Robust backoff wrapper
# -----------------------------

def with_backoff(fn: Callable[[], str], max_attempts: int = 5) -> str:
    for i in range(max_attempts):
        try:
            return fn()
        except Exception as e:
            delay = min(2 ** i, 10)
            print(f"Attempt {i+1} failed: {e}; sleeping {delay}s")
            time.sleep(delay)
    return "(error) giving up"


# -----------------------------
# Embeddings and simple retrieval
# -----------------------------

def embed_texts_openai(texts: List[str]) -> Optional[np.ndarray]:
    """
    Try using OpenAI embeddings (text-embedding-3-small).
    Returns matrix [n, d] or None if unavailable.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        r = client.embeddings.create(model="text-embedding-3-small", input=texts)
        vecs = np.array([np.array(d.embedding, dtype=np.float32) for d in r.data])
        return vecs
    except Exception as e:
        print("OpenAI embeddings error:", e)
        return None


def embed_texts_fallback(texts: List[str]) -> np.ndarray:
    """
    Very naive embedding: normalized bag-of-words counts.
    Returns matrix [n, vocab_size].
    """
    # Build vocabulary
    vocab: Dict[str, int] = {}
    tokenized: List[List[str]] = []
    for t in texts:
        toks = [w.lower() for w in t.split()]
        tokenized.append(toks)
        for w in toks:
            if w not in vocab:
                vocab[w] = len(vocab)
    mat = np.zeros((len(texts), len(vocab)), dtype=np.float32)
    for i, toks in enumerate(tokenized):
        for w in toks:
            mat[i, vocab[w]] += 1.0
    # L2 normalize
    norms = np.linalg.norm(mat, axis=1, keepdims=True) + 1e-12
    return mat / norms


def cosine(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-12))


def build_corpus() -> List[str]:
    return [
        "Build a Gradio UI to demo ML classifiers",
        "Serve models with FastAPI and Pydantic validation",
        "Use LangChain to compose prompt templates and memory",
        "Train scikit-learn pipelines on tabular data",
        "Optimize PyTorch loops with AMP and check TensorBoard",
    ]


def retrieve(query: str, docs: List[str], k: int = 2) -> List[str]:
    """
    Retrieve top-k docs by cosine similarity using OpenAI embeddings if possible,
    otherwise fallback bag-of-words embeddings.
    """
    doc_vecs = embed_texts_openai(docs)
    if doc_vecs is None:
        doc_vecs = embed_texts_fallback(docs)
    q_vecs = embed_texts_openai([query])
    if q_vecs is None:
        q_vecs = embed_texts_fallback([query])
    qv = q_vecs[0]
    sims = [cosine(qv, dv) for dv in doc_vecs]
    idx = np.argsort(sims)[::-1][:k]
    return [docs[i] for i in idx]


def rag_chain_demo() -> None:
    section("Composable RAG-style chain (retrieve + generate)")
    docs = build_corpus()
    query = "How do I serve ML models with validation?"
    top_docs = retrieve(query, docs, k=2)

    context = "\n".join(f"- {d}" for d in top_docs)

    if ChatPromptTemplate is None or StrOutputParser is None:
        print("LangChain core not installed; manual composition.")
        tmpl = "Answer the user using the CONTEXT.\nCONTEXT:\n{context}\n\nQuestion:\n{question}\n"
        prompt = tmpl.format(context=context, question=query)
        model = get_model()
        messages = [{"role": "system", "content": "Answer based on context only."}, {"role": "user", "content": prompt}]
        out = model.invoke(messages)
        print("Answer:", out)
        return

    model = get_model(temperature=0.2)
    parser = StrOutputParser()
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You answer strictly based on the provided context."),
            ("user", "CONTEXT:\n{context}\n\nQUESTION:\n{question}"),
        ]
    )
    chain = prompt | model | parser
    answer = chain.invoke({"context": context, "question": query})
    print("Answer:", answer)


# -----------------------------
# Conversation memory
# -----------------------------

def conversation_memory_demo() -> None:
    section("Conversation memory demo")
    if InMemoryChatMessageHistory is None:
        print("LangChain chat history unavailable; using a simple list fallback.")
        history: List[Dict[str, str]] = []
        model = get_model()
        # turn 1
        history.append({"role": "user", "content": "Hello, who are you?"})
        print("AI:", model.invoke(history))
        # turn 2
        history.append({"role": "user", "content": "Remember my name is Alex."})
        print("AI:", model.invoke(history))
        return

    history = InMemoryChatMessageHistory()
    # We manually store messages; a full LC agent would manage this for you
    model = get_model()
    # Turn 1
    user1 = HumanMessage(content="Hello, who are you?")
    ai1 = AIMessage(content=model.invoke([{"role": "user", "content": user1.content}]))
    history.add_message(user1)
    history.add_message(ai1)
    print("AI1:", ai1.content)
    # Turn 2
    user2 = HumanMessage(content="Please remember my name is Alex.")
    ai2 = AIMessage(content=model.invoke([{"role": "user", "content": user2.content}]))
    history.add_message(user2)
    history.add_message(ai2)
    print("AI2:", ai2.content)
    # Turn 3 (memory conceptually would affect responses in a real LLM)
    user3 = HumanMessage(content="What is my name?")
    ai3 = AIMessage(content="You said your name is Alex.")  # illustrative
    history.add_message(user3)
    history.add_message(ai3)
    print("AI3:", ai3.content)


# -----------------------------
# Tool / function calling (illustrative)
# -----------------------------

@dataclass
class WeatherRequest:
    city: str


def fake_weather_tool(req: WeatherRequest) -> str:
    # Pretend to call an API; return deterministic data
    return f"The weather in {req.city} is sunny, 28°C."


def tool_calling_demo() -> None:
    section("Tool/function-calling demo (illustrative)")
    # In actual ChatOpenAI, you'd define JSON schema tools and let the model pick
    # Here we simulate with a simple parser that triggers a tool on keywords.
    model = get_model()
    user = "tool:weather city=Mumbai"
    if "tool:weather" in user:
        city = user.split("city=", 1)[-1].strip()
        resp = fake_weather_tool(WeatherRequest(city=city))
    else:
        resp = model.invoke([{"role": "user", "content": user}])
    print("Response:", resp)


# -----------------------------
# Main
# -----------------------------

def main() -> int:
    prompt_chain_demo()
    rag_chain_demo()
    conversation_memory_demo()
    tool_calling_demo()
    print("\nModule 8 complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())