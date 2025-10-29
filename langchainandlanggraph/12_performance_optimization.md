# Performance Optimization and Monitoring for LLM Apps

## Learning Objectives
By the end of this lesson, you will be able to:
- Establish baselines and define SLIs/SLOs for LLM systems
- Optimize prompts, tokens, and context for cost/latency
- Batch and parallelize workloads safely (async, semaphores)
- Implement result and embedding caches effectively
- Build model routing for cost-aware quality control
- Profile code paths and instrument token/time metrics
- Add monitoring, tracing, and error budgets for production

## 1) Establishing a Baseline

Define what “fast enough” and “cheap enough” mean. Recommended SLIs:
- p50/p95 latency per request
- Token usage (input/output) per request
- Error rate (LLM/tool failures)
- Cache hit rate (response, embeddings, retrieval)
- Cost per thousand requests

Minimal measurement harness:

```python
import time
from typing import Dict, Any
import tiktoken

def count_tokens(text: str, model="gpt-3.5-turbo") -> int:
    try:
        enc = tiktoken.encoding_for_model(model)
    except KeyError:
        enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text))

class Metrics:
    def __init__(self):
        self.requests = 0
        self.errors = 0
        self.total_time = 0.0
        self.total_tokens = 0

    def record(self, start: float, in_tokens: int, out_tokens: int, error=False):
        self.requests += 1
        self.errors += int(error)
        self.total_time += (time.time() - start)
        self.total_tokens += (in_tokens + out_tokens)

    def summary(self) -> Dict[str, Any]:
        return {
            "requests": self.requests,
            "errors": self.errors,
            "avg_ms": (self.total_time / max(1, self.requests)) * 1000,
            "avg_tokens": self.total_tokens / max(1, self.requests),
        }
```

## 2) Prompt and Context Optimization

Strategies:
- Keep instructions short and specific; avoid redundancy across turns
- Use structured formats (lists, JSON) to control output size
- Compress history: maintain a rolling summary and retain only critical facts
- Bound retrieved context: 2–5 top passages, trimmed to N chars/tokens
- Prefer few-shot exemplars that are short but representative

Template refactor example:

```python
from langchain_core.prompts import PromptTemplate

rag_prompt = PromptTemplate(
    template=(
        "Answer using only the context. If missing, say 'I don't know'.\n"
        "Context:\n{context}\n\n"
        "Question: {question}\n"
        "Answer (concise, 2-3 sentences):"
    ),
    input_variables=["context", "question"]
)
```

## 3) Token Budgeting and Early Exit

- Pre-truncate long inputs by token limits
- Add “stop” signals or strict word counts
- For chat models, stream and stop when answer conditions are met

Example truncation:

```python
def truncate_by_tokens(text: str, max_tokens: int = 500, model="gpt-3.5-turbo") -> str:
    try:
        enc = tiktoken.encoding_for_model(model)
    except KeyError:
        enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(text)
    if len(tokens) <= max_tokens:
        return text
    return enc.decode(tokens[:max_tokens])
```

## 4) Batching and Concurrency

- Batch embeddings offline; avoid per-document API calls in tight loops
- For independent LLM prompts, use asyncio with Semaphore to cap concurrency
- Use exponential backoff on rate-limit errors

Async skeleton:

```python
import asyncio
from asyncio import Semaphore

async def call_model(prompt: str):
    # Replace with async client if available; else run in thread pool
    await asyncio.sleep(0.01)  # simulate latency
    return f"out:{prompt[:20]}"

async def run_batch(prompts, max_concurrency=5):
    sem = Semaphore(max_concurrency)
    results = []
    async def worker(p):
        async with sem:
            return await call_model(p)
    return await asyncio.gather(*(worker(p) for p in prompts))

# usage: asyncio.run(run_batch(list_of_prompts, max_concurrency=8))
```

## 5) Caching Layers

- Prompt/response cache keyed by prompt, model, params
- Embeddings cache keyed by content hash
- Retrieval cache keyed by query+filters (store doc IDs and snippets)
- Set TTLs and invalidation policy; prefer Redis for shared cache

Prompt/response cache:

```python
import hashlib, json

class ResponseCache:
    def __init__(self):
        self.store = {}

    def key(self, prompt: str, **params) -> str:
        payload = json.dumps({"prompt": prompt, **params}, sort_keys=True)
        return hashlib.md5(payload.encode()).hexdigest()

    def get(self, prompt: str, **params):
        return self.store.get(self.key(prompt, **params))

    def set(self, prompt: str, value: str, **params):
        self.store[self.key(prompt, **params)] = value
```

## 6) Model Routing (Smart LLM Selection)

Route easy tasks to small/cheap models; complex to larger ones.

```python
from langchain_openai import ChatOpenAI

class Router:
    def __init__(self):
        self.simple = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
        self.complex = ChatOpenAI(model="gpt-4", temperature=0)

    def is_complex(self, text: str) -> bool:
        long = len(text.split()) > 60
        hard_kw = any(k in text.lower() for k in ["analyze", "compare", "synthesize", "proof"])
        return long or hard_kw

    def choose(self, text: str):
        return self.complex if self.is_complex(text) else self.simple
```

## 7) Retrieval Efficiency

- Chunk size: 200–1000 tokens; overlap 10–20%
- Use MMR to reduce redundancy
- Limit k to 2–5; trim each passage to a cap
- Hybrid search (BM25 + vectors) when queries are keyword-y
- Re-rank top-N with a lightweight scorer before LLM

MMR retriever example:

```python
retriever = vectordb.as_retriever(search_type="mmr", search_kwargs={"k": 5, "lambda_mult": 0.5})
docs = retriever.get_relevant_documents("vector search vs bm25")
context = "\n\n".join(d.page_content[:600] for d in docs)
```

## 8) Profiling Hot Paths

- Use time.perf_counter around critical sections
- cProfile for CPU-bound sections
- For I/O-heavy code, inspect concurrency and awaiting patterns

Simple profiler:

```python
import time

def timed(fn):
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        out = fn(*args, **kwargs)
        dt = (time.perf_counter() - t0) * 1000
        print(f"[timed] {fn.__name__} took {dt:.1f} ms")
        return out
    return wrapper
```

## 9) Monitoring and Tracing

Key metrics:
- request_latency_ms (histogram p50/p95)
- token_in/out (counters)
- error_rate
- cache_hit_ratio
- queue_depth (if applicable)

Skeleton counters:

```python
class Counters:
    def __init__(self):
        self.token_in = 0
        self.token_out = 0
        self.requests = 0
        self.errors = 0

    def log_req(self, in_t, out_t, ok=True):
        self.requests += 1
        self.token_in += in_t
        self.token_out += out_t
        if not ok: self.errors += 1
```

Tracing ideas:
- Wrap LLM invocations with spans (OpenTelemetry)
- Use LangGraph `astream_events` to record node timings and failures
- Integrate an observability backend (e.g., Maxim AI, Jaeger, Tempo)

LangGraph events:

```python
for ev in graph.astream_events({"input_text": "trace"}):
    print(ev["event"], ev.get("name"), ev.get("timestamp"))
```

## 10) Reliability Patterns Revisited

- Retry: exponential backoff on transient failures (429, 5xx)
- Circuit breaker: short-circuit repeated failures for a cool-down window
- Rate limiter: token bucket per user/API key
- Dead-letter queue: persist failed jobs for later inspection

Circuit breaker (concept):

```python
class CircuitBreaker:
    def __init__(self, threshold=5, cooldown=30):
        self.failures = 0
        self.open_until = 0
        self.threshold = threshold
        self.cooldown = cooldown

    def call(self, fn, *args, **kwargs):
        import time
        now = time.time()
        if now < self.open_until:
            return {"error": "circuit-open"}
        try:
            res = fn(*args, **kwargs)
            self.failures = 0
            return res
        except Exception as e:
            self.failures += 1
            if self.failures >= self.threshold:
                self.open_until = now + self.cooldown
            return {"error": str(e)}
```

## 11) A/B Testing and Prompt Iteration

- Create prompt variants A/B
- Randomly assign variant; measure latency, tokens, satisfaction signal
- Keep immutable logs for comparisons

Example scaffold:

```python
import random

def choose_variant() -> str:
    return "A" if random.random() < 0.5 else "B"

def build_prompt(variant: str, context: str, question: str) -> str:
    if variant == "A":
        return f"Answer using only context:\n{context}\nQ: {question}\nA:"
    else:
        return f"Use context below. If unknown, say 'I don't know'.\n{context}\nQ: {question}\nA (concise):"
```

## 12) Putting It Together (Mini Framework)

```python
class LLMService:
    def __init__(self, model, cache=None, counters=None):
        self.model = model
        self.cache = cache
        self.counters = counters or Counters()

    def invoke(self, prompt: str, **params):
        from tiktoken import encoding_for_model
        start = time.time()
        in_toks = count_tokens(prompt, getattr(self.model, "model_name", "gpt-3.5-turbo"))
        cached = self.cache.get(prompt, **params) if self.cache else None
        if cached:
            self.counters.log_req(in_toks, 0, ok=True)
            return cached

        try:
            resp = self.model.invoke(prompt, **params)
            out_text = getattr(resp, "content", str(resp))
            out_toks = count_tokens(out_text)
            self.counters.log_req(in_toks, out_toks, ok=True)
            if self.cache:
                self.cache.set(prompt, out_text, **params)
            return out_text
        except Exception as e:
            self.counters.log_req(in_toks, 0, ok=False)
            return f"error: {e}"
```

## 13) Exercises

A) End-to-end metrics
- Wrap your main chain/agent with Metrics and Counters; print p95 latency (approximate by sorting collected times) and average tokens per request

B) Batch embeddings
- Write a function that takes a list of texts, hashes them, and computes only missing vectors; measure throughput (texts/sec)

C) Router tuning
- Implement a 2-tier router (fast vs accurate) and measure cost vs quality on a small eval set

D) Cache strategy
- Add a Redis-backed response cache with TTL; measure cache hit ratio improvements on repeated queries

E) Tracing integration
- Stream LangGraph events to a log with timestamps; generate a simple Gantt-like timeline for one run

## Key Takeaways
- Start with a baseline and optimize the largest contributors (tokens, context, concurrency)
- Use caches everywhere they make sense; design invalidation up-front
- Route “easy” traffic to smaller models; escalate when needed
- Measure and trace; enforce error budgets with SLOs
- Optimization is iterative; automate A/B and monitoring in CI/CD

## Next Steps
Use this module to harden your capstone project: apply routing, caching, batching, and observability to achieve target latency and cost.