# Production Deployment Strategies for LLM Applications

## Learning Objectives
By the end of this lesson, you will be able to:
- Design robust deployment architectures for LangChain/LangGraph applications
- Implement reliability patterns (retries, circuit breakers, rate limits, queues)
- Add caching and persistence layers to control cost and latency
- Instrument observability (metrics, logs, traces) and performance monitoring
- Secure secrets, data, and tool usage with best practices
- Ship via CI/CD to serverless or containerized environments

## Prerequisites
- Python 3.9+
- Packages from `requirements.txt` installed
- Valid API keys in `.env`
- Basic familiarity with FastAPI, Redis, and OpenTelemetry concepts (optional)

## 1) Architecture Patterns

Common deployment patterns:
- Stateless API + external state: Deploy a FastAPI app and use managed services (Redis/DB/object storage) for memory, vector stores, and queues
- Worker pattern: Frontend submits jobs to a queue; workers (Celery or distributed tasks) process LLM workloads asynchronously
- RAG microservice: Separate services for indexing (offline) and querying (online); share a persistent vector store (Chroma or FAISS-backed)
- Graph orchestrator: LangGraph state machine compiled with a checkpointer (SQLite/Postgres) to resume conversations and workflows

Guidelines:
- Keep app stateless per instance; externalize memory and caches
- Use structured interfaces (Pydantic schemas) for tools and endpoints
- Isolate heavy tasks behind queues for resilience and scaling

## 2) Environment and Secrets Management

Use `.env` and safe loaders:
```python
from dotenv import load_dotenv
import os

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY")
```

Best practices:
- Never hardcode secrets; load from env/secret manager (AWS Secrets Manager, GCP Secret Manager, Vault)
- Scope keys to least privilege; rotate keys periodically
- Audit env usage; avoid leaking in logs or error messages

## 3) Caching and Persistence

Types of caches:
- Prompt/response cache: Cache deterministic prompts with normalized parameters
- Embeddings cache: Cache vector results by content hash to avoid recomputation
- RAG context cache: Persist retrieved passages for common queries
- Memory persistence: Use SQLite/Redis/JSON+Fernet for session state

Example: content hashing and cache
```python
import hashlib, json
from typing import Dict, Any

class ResponseCache:
    def __init__(self):
        self.cache: Dict[str, Any] = {}

    def key(self, prompt: str, params: Dict[str, Any]) -> str:
        payload = json.dumps({"prompt": prompt, **params}, sort_keys=True)
        return hashlib.md5(payload.encode()).hexdigest()

    def get(self, prompt: str, **params):
        return self.cache.get(self.key(prompt, params))

    def set(self, prompt: str, value: Any, **params):
        self.cache[self.key(prompt, params)] = value
```

Redis-based cache (production):
```python
import redis, json, hashlib

r = redis.Redis(host="localhost", port=6379, db=0)

def cache_key(prompt: str, params: dict) -> str:
    payload = json.dumps({"prompt": prompt, **params}, sort_keys=True)
    return hashlib.md5(payload.encode()).hexdigest()

def cache_get(prompt: str, params: dict):
    val = r.get(cache_key(prompt, params))
    return json.loads(val) if val else None

def cache_set(prompt: str, params: dict, value: dict, ttl=300):
    r.setex(cache_key(prompt, params), ttl, json.dumps(value))
```

Embeddings cache by content hash:
```python
def text_hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()

emb_cache: Dict[str, list] = {}

def get_or_embed(text: str, embedder):
    h = text_hash(text)
    if h in emb_cache:
        return emb_cache[h]
    vec = embedder.embed_query(text)
    emb_cache[h] = vec
    return vec
```

## 4) Concurrency and Queues

Patterns:
- Async endpoints: Use `async` with streaming for chat responses
- Background tasks: Offload indexing and long-running jobs to Celery/Arq/RQ
- Queue backends: Redis, RabbitMQ, SQS

Celery task example:
```python
# celery_app.py
from celery import Celery
celery = Celery("app", broker="redis://localhost:6379/0", backend="redis://localhost:6379/1")

@celery.task(name="tasks.embed_docs", max_retries=3, default_retry_delay=5)
def embed_docs(docs: list[str]) -> list[list[float]]:
    # call embeddings; retry on transient errors
    try:
        # ... compute vectors ...
        return [[0.1, 0.2]] * len(docs)
    except Exception as e:
        embed_docs.retry(exc=e)
```

Use queues to:
- Smooth spikes in traffic
- Isolate costly operations
- Increase reliability via retries and backoff

## 5) Reliability Patterns

Retries with exponential backoff:
```python
import time
from functools import wraps

def with_retry(retries=3, backoff=0.5):
    def deco(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            last = None
            for i in range(retries):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    last = e
                    time.sleep(backoff * (2 ** i))
            raise RuntimeError(f"retry-error: {last}")
        return wrapper
    return deco
```

Circuit breaker:
```python
class CircuitBreaker:
    def __init__(self, threshold=5, window=60):
        self.failures = 0
        self.open_until = 0
        self.threshold = threshold
        self.window = window

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
                self.open_until = now + self.window
            return {"error": str(e)}
```

Rate limiting (token bucket):
```python
import time

class TokenBucket:
    def __init__(self, rate_per_sec=2, capacity=10):
        self.rate = rate_per_sec
        self.capacity = capacity
        self.tokens = capacity
        self.last = time.time()

    def allow(self) -> bool:
        now = time.time()
        delta = now - self.last
        self.tokens = min(self.capacity, self.tokens + delta * self.rate)
        self.last = now
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
```

## 6) Observability and Monitoring

Key signals:
- Latency per request
- Token counts (input/output)
- Error rates per tool/model
- Cache hit/miss
- Queue depth

Minimal metrics/logging:
```python
import time

class Metrics:
    def __init__(self):
        self.requests = 0
        self.errors = 0
        self.total_time = 0
        self.tokens = 0

    def record(self, start, input_tokens, output_tokens, error=False):
        self.requests += 1
        self.total_time += (time.time() - start)
        self.tokens += (input_tokens + output_tokens)
        if error: self.errors += 1

    def summary(self):
        avg_t = self.total_time / max(1, self.requests)
        avg_tokens = self.tokens / max(1, self.requests)
        return {"requests": self.requests, "errors": self.errors, "avg_ms": avg_t * 1000, "avg_tokens": avg_tokens}
```

OpenTelemetry (conceptual):
- Install `opentelemetry-sdk`, `opentelemetry-exporter-otlp`
- Instrument HTTP server (FastAPI/ASGI) and custom spans around LLM calls
- Export to Grafana Tempo/Jaeger

LangGraph events:
```python
# Stream node-level events and log them for tracing
for ev in graph.astream_events({"input_text": "trace"}):
    print(ev["event"], ev.get("name"), ev.get("timestamp"))
```

Maxim AI (observability for LangGraph):
- Configure tracing middleware to visualize state transitions and tool calls
- Track per-node latency and failures

## 7) Cost Management

Strategies:
- Cache aggressively for deterministic operations
- Use smaller/cheaper models for simple tasks; fallback to larger models for complex prompts
- Control max tokens, temperature, and top_p to stabilize outputs
- Batch embedding jobs (indexing) offline

Token counting:
```python
import tiktoken

def count_tokens(text: str, model="gpt-3.5-turbo"):
    try:
        enc = tiktoken.encoding_for_model(model)
    except KeyError:
        enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text))
```

Budget guard:
```python
class Budget:
    def __init__(self, max_tokens_per_day=1_000_000):
        self.used = 0
        self.max = max_tokens_per_day

    def can_spend(self, tokens: int) -> bool:
        return (self.used + tokens) <= self.max

    def spend(self, tokens: int):
        if not self.can_spend(tokens):
            raise RuntimeError("Token budget exceeded")
        self.used += tokens
```

## 8) Security and Privacy

PII redaction:
```python
import re

def redact_pii(text: str) -> str:
    text = re.sub(r"\\b\\d{10}\\b", "[REDACTED_PHONE]", text)
    text = re.sub(r"\\b[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}\\b", "[REDACTED_EMAIL]", text)
    return text
```

Encrypt memory at rest:
```python
from cryptography.fernet import Fernet
import json

key = Fernet.generate_key()
fernet = Fernet(key)

def save_encrypted(path: str, data: dict):
    payload = json.dumps(data).encode()
    token = fernet.encrypt(payload)
    with open(path, "wb") as f:
        f.write(token)

def load_encrypted(path: str) -> dict:
    with open(path, "rb") as f:
        token = f.read()
    payload = fernet.decrypt(token)
    return json.loads(payload.decode())
```

Tool governance:
- Restrict tool access per role
- Validate inputs (Pydantic schemas) and sanitize URLs
- Add audit logs for tool usage

Supply chain:
- Pin dependencies; run SCA scans (pip-audit)
- Keep SBOM (CycloneDX) in CI/CD

## 9) Deployment Options

Serverless (API Gateway/Lambda):
- Pros: no infra management, scale-to-zero
- Cons: cold starts, limited duration

Containers (Kubernetes):
- Pros: control over scaling, networking, sidecars (Redis, vector DB)
- Cons: operational complexity

Edge workers (Cloudflare Workers):
- Pros: proximity to users, low latency
- Cons: model hosting constraints; use remote API for LLMs

## 10) CI/CD

Pipeline steps:
- Lint + tests (pytest)
- Security scan (pip-audit)
- Build image (Docker)
- Deploy (Helm to K8s or serverless CLI)
- Post-deploy smoke tests

Example GitHub Actions (conceptual YAML):
```yaml
name: deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - run: pip install -r requirements.txt
      - run: pytest -q
      - run: pip install pip-audit && pip-audit || true
      - run: docker build -t myorg/llm-app:latest .
      - run: echo "deploy step here (helm/serverless)"
```

## 11) Example: FastAPI RAG Endpoint

```python
# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

app = FastAPI()
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2)
emb = OpenAIEmbeddings()
db = Chroma(collection_name="rag", embedding_function=emb, persist_directory="./rag_store")

class Question(BaseModel):
    query: str

@app.post("/rag")
def rag(q: Question):
    try:
        retriever = db.as_retriever(search_kwargs={"k": 4})
        docs = retriever.get_relevant_documents(q.query)
        context = "\\n\\n".join(d.page_content for d in docs)
        prompt = f"Answer using only this context:\\n\\n{context}\\n\\nQuestion: {q.query}\\nAnswer:"
        resp = llm.invoke(prompt)
        return {"answer": getattr(resp, "content", str(resp))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

Deploy as:
- `uvicorn app:app --host 0.0.0.0 --port 8080`
- Behind an API gateway with rate limits and auth

## 12) Exercises

A) Caching layer
- Implement Redis-backed prompt/response cache with normalization
- Add cache hit/miss metrics and TTL strategy

B) Circuit breaker + rate limit
- Wrap outbound API calls with circuit breaker and token bucket
- Simulate failures and verify resilience

C) Observability
- Instrument FastAPI with OpenTelemetry and export traces to Tempo/Jaeger
- Add per-tool metrics (latency, errors)

D) Security
- Add PII redaction before persistence
- Encrypt memory at rest with Fernet; rotate keys

E) CI/CD
- Build a GitHub Actions pipeline to run tests, security scans, and deploy to a container registry

## Key Takeaways
- Externalize state and caches; keep app instances stateless
- Use reliability patterns to tolerate transient failures
- Observe and measure token usage, latency, and errors early
- Secure data and tools; validate, sanitize, encrypt
- Choose deployment targets based on cost, scale, and operational maturity

## Next Steps
Proceed to performance optimization and monitoring (profiling, batching, concurrency tuning), and build a final capstone project integrating end-to-end best practices.