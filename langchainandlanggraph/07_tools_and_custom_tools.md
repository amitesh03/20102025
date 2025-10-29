# Tool Integration and Custom Tools in LangChain

## Learning Objectives
- Design and implement custom tools with safe interfaces
- Integrate external APIs and local resources as tools
- Validate inputs and outputs with Pydantic
- Build agents that select and compose tools
- Add observability, timeouts, retries, and rate limits
- Implement async tools for concurrency
- Exercises for hands-on practice

## Prerequisites
- API keys in .env as needed (e.g., OPENAI_API_KEY, GITHUB_TOKEN, NEWSAPI_KEY)
- Installed packages from requirements.txt

## 1) Tool Design Principles
- Keep tools small, single-purpose, deterministic
- Validate inputs; return compact, factual strings or typed data
- Handle exceptions; never raise raw stack traces to the model
- Add docstrings that describe capability, inputs, and constraints
- Avoid eval/exec; sanitize any file or network access

## 2) Quick Start: Function Tools with @tool

```python
from langchain_core.tools import tool
from math import isfinite

@tool
def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression like '2 + 3 * 4'."""
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        if isinstance(result, (int, float)) and isfinite(result):
            return str(result)
        return "calc-error: non-finite result"
    except Exception as e:
        return f"calc-error: {e}"
```

- Pros: minimal boilerplate; docstring becomes tool description
- Cons: no strong input validation without extra code

## 3) Typed Tools with Pydantic Validation

```python
from pydantic import BaseModel, Field, validator
from langchain_core.tools import StructuredTool

class WeatherInput(BaseModel):
    city: str = Field(..., description="City name, e.g., 'London'")
    units: str = Field("metric", description="'metric' or 'imperial'")

def fetch_weather(city: str, units: str = "metric") -> dict:
    # Replace with real API; here we mock
    if not city or len(city) < 2:
        raise ValueError("city too short")
    return {"city": city, "units": units, "temp": 24.0}

weather_tool = StructuredTool.from_function(
    func=fetch_weather,
    name="weather",
    description="Get current weather for a city.",
    args_schema=WeatherInput
)
```

- Pros: automatic JSON schema, robust validation
- Tip: return small dicts or strings; agents synthesize final prose

## 4) External API Tool with Requests

```python
import os, requests
from pydantic import BaseModel, Field
from langchain_core.tools import StructuredTool

class NewsInput(BaseModel):
    query: str = Field(..., description="Topic to search")
    max_results: int = Field(3, ge=1, le=10)

def search_news(query: str, max_results: int = 3) -> list[dict]:
    api_key = os.getenv("NEWSAPI_KEY")
    if not api_key:
        return [{"error": "missing NEWSAPI_KEY"}]
    url = "https://newsapi.org/v2/everything"
    params = {"q": query, "pageSize": max_results, "sortBy": "relevancy", "apiKey": api_key}
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        articles = data.get("articles", [])[:max_results]
        return [{"title": a.get("title",""), "url": a.get("url","")} for a in articles]
    except Exception as e:
        return [{"error": str(e)}]

news_tool = StructuredTool.from_function(
    func=search_news,
    name="news_search",
    description="Search recent news via NewsAPI.org",
    args_schema=NewsInput
)
```

Security
- Use timeouts
- Limit result sizes
- Sanitize/whitelist URLs if fetching remote content

## 5) Local Resource Tools

```python
from pathlib import Path
from langchain_core.tools import tool

@tool
def read_local_file(path: str, max_bytes: int = 4000) -> str:
    """Read a small local text file; caps bytes to prevent large loads."""
    p = Path(path)
    if not p.exists() or not p.is_file():
        return "read-error: file not found"
    data = p.read_bytes()[:max_bytes]
    try:
        return data.decode("utf-8", errors="replace")
    except Exception:
        return "read-error: decode failure"
```

- Never expose arbitrary file system without constraints
- Prefer read-only, sandboxed directories

## 6) Async Tools for Concurrency

```python
import asyncio, aiohttp
from pydantic import BaseModel, Field
from langchain_core.tools import StructuredTool

class HttpGetInput(BaseModel):
    url: str = Field(..., description="HTTP/HTTPS URL")

async def http_get_async(url: str) -> dict:
    timeout = aiohttp.ClientTimeout(total=10)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        try:
            async with session.get(url) as resp:
                text = await resp.text()
                return {"status": resp.status, "length": len(text)}
        except Exception as e:
            return {"error": str(e)}

http_get_tool = StructuredTool.from_function(
    func=http_get_async,
    name="http_get",
    description="Fetch a URL asynchronously and return status and length",
    args_schema=HttpGetInput,
    coroutine=http_get_async
)
```

- Agents that support async can run multiple calls concurrently

## 7) Timeouts, Retries, and Rate Limits

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
                    time.sleep(backoff * (2**i))
            return f"retry-error: {last}"
        return wrapper
    return deco

@tool
@with_retry(retries=2, backoff=0.2)
def fragile_operation(x: int) -> str:
    """Sometimes fails; returns x squared on success."""
    if x % 2:
        raise RuntimeError("simulated intermittent error")
    return str(x * x)
```

Add rate limits using tokens/leaky bucket around network tools as needed.

## 8) Composing Tools in Agents

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_openai_tools_agent, AgentExecutor

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
tools = [calculator, weather_tool, news_tool, read_local_file]
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a precise assistant. Prefer tools when helpful."),
    ("human", "{input}")
])
agent = create_openai_tools_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
out = executor.invoke({"input": "What's 17*19, then fetch 2 recent AI articles."})
print(out["output"])
```

- Ensure each tool’s description is precise; the model relies on it

## 9) Observability for Tools

```python
import time

def log_tool_call(fn):
    def wrapper(*args, **kwargs):
        t0 = time.time()
        res = fn(*args, **kwargs)
        dt = (time.time() - t0) * 1000
        print(f"[tool] {fn.__name__} took {dt:.1f} ms")
        return res
    return wrapper

calculator_logged = log_tool_call(calculator.func)
print("calculator 2+2:", calculator_logged("2+2"))
```

For production, consider tracing (OpenTelemetry), metrics, and structured logs.

## 10) Exercises

A) Build a Unit Converter Tool
- Implement unit_convert(value: float, from_unit: str, to_unit: str) with km<->miles, C<->F
- Compose with calculator; agent decides which to use

B) GitHub Repo Info Tool
- Use GitHub API to fetch repo stars/forks for "owner/repo"
- Validate input with Pydantic; add timeout and retry

C) Web Retriever Tool
- Given a URL list, fetch titles and first 200 chars concurrently (async)
- Summarize with the LLM

D) Safe File Reader
- Restrict to ./notes; reject paths with .. or absolute
- Test against path traversal attempts

E) Rate-Limited News Tool
- Add simple per-minute counter; when exceeded, return a polite error

## Key Takeaways
- Tools are the I/O backbone for agents—design them as stable, typed services
- Validate inputs/outputs, add timeouts, retries, and limits
- Keep outputs compact; let the LLM compose the final narrative
- Prefer StructuredTool with Pydantic for reliability
- Use async where concurrency helps

Next: vector databases and retrieval.