# LangGraph Workflows and State Machines

## Learning Objectives
- Build LangGraph stateful workflows with nodes and edges
- Use conditional routing and loops
- Stream execution events
- Add persistent state with a checkpointer
- Integrate LLM/tool calls inside nodes
- Handle errors and retries
- Exercises to practice

## Prerequisites
- langgraph installed (already in requirements)
- OPENAI_API_KEY for LLM examples
- Python 3.9+

## 1) LangGraph basics: State, nodes, edges
LangGraph composes state machines. You define:
- a State type (dict-like)
- node functions that read/update state
- edges between nodes (including START/END)
- compile the graph into a runnable

Example: minimal linear flow

```python
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, START, END

class AppState(TypedDict, total=False):
    input_text: str
    processed: str

def normalize(state: AppState) -> AppState:
    text = state.get("input_text", "")
    return {"processed": text.strip().lower()}

def finalize(state: AppState) -> AppState:
    return state  # nothing more to add

builder = StateGraph(AppState)
builder.add_node("normalize", normalize)
builder.add_node("finalize", finalize)
builder.add_edge(START, "normalize")
builder.add_edge("normalize", "finalize")
builder.add_edge("finalize", END)
graph = builder.compile()

out = graph.invoke({"input_text": "  Hello LangGraph  "})
print(out)  # {'processed': 'hello langgraph'}
```

Notes
- Nodes return partial state updates (merged into global state)
- State keys accumulate across nodes

## 2) Streaming execution events
You can stream node-level events for debugging/UX.

```python
for event in graph.astream_events({"input_text": "  Hi  "}):
    print(event["event"], event.get("name"))
```

## 3) Conditional routing
Use a small router node or add_conditional_edges to branch based on state.

```python
from langgraph.graph import add_condition

def is_long(state: AppState) -> str:
    text = state.get("input_text", "")
    return "long" if len(text) > 20 else "short"

def handle_long(state: AppState) -> AppState:
    return {"processed": f"LONG::{state.get('input_text','')}"}

def handle_short(state: AppState) -> AppState:
    return {"processed": f"SHORT::{state.get('input_text','')}"}

builder = StateGraph(AppState)
builder.add_node("handle_long", handle_long)
builder.add_node("handle_short", handle_short)
builder.add_conditional_edges(START, is_long, {"long": "handle_long", "short": "handle_short"})
builder.add_edge("handle_long", END)
builder.add_edge("handle_short", END)
graph = builder.compile()
print(graph.invoke({"input_text": "tiny"}))
print(graph.invoke({"input_text": "this string is definitely long"}))
```

## 4) Loops
Loops are done by adding an edge from a node back to itself or an earlier node; use a counter in state.

```python
class LoopState(TypedDict, total=False):
    step: int
    log: list[str]

def stepper(state: LoopState) -> LoopState:
    n = state.get("step", 0) + 1
    log = (state.get("log") or []) + [f"step {n}"]
    return {"step": n, "log": log}

builder = StateGraph(LoopState)
builder.add_node("stepper", stepper)
builder.add_edge(START, "stepper")
# loop while step < 3 using a small router
def check(state: LoopState) -> str:
    return "again" if state.get("step", 0) < 3 else "done"
builder.add_conditional_edges("stepper", check, {"again": "stepper", "done": END})
graph = builder.compile()
print(graph.invoke({}))
```

## 5) Integrate LLM/tool calls inside nodes
You can call LLMs or tools from any node body.

```python
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

def summarize(state: AppState) -> AppState:
    text = state.get("input_text","")
    if not text:
        return {}
    from langchain_core.prompts import ChatPromptTemplate
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Summarize concisely"),
        ("human", "{text}")
    ])
    messages = prompt.format_messages(text=text)
    resp = llm.invoke(messages)
    return {"processed": resp.content}

builder = StateGraph(AppState)
builder.add_node("summarize", summarize)
builder.add_edge(START, "summarize")
builder.add_edge("summarize", END)
graph = builder.compile()
print(graph.invoke({"input_text": "LangGraph builds stateful LLM workflows."}))
```

Tip
- Keep node bodies small; delegate to helper functions for testability.

## 6) Persistence with a checkpointer
Persist state and resume with thread IDs.

```python
from langgraph.checkpoint.sqlite import SqliteSaver
checkpointer = SqliteSaver.from_conn_string("sqlite:///langgraph_state.db")

graph = builder.compile(checkpointer=checkpointer)

# identify a conversation/thread
config = {"configurable": {"thread_id": "user-123"}}
graph.invoke({"input_text": "hello"}, config=config)
# later:
graph.invoke({"input_text": "continue"}, config=config)
```

Notes
- Use one thread_id per conversation or workflow instance
- The checkpointer stores intermediate states so you can inspect/rewind

## 7) Error handling and retries
Wrap node logic with try/except; record errors in state and branch accordingly.

```python
def robust(state: AppState) -> AppState:
    try:
        assert "input_text" in state, "missing input_text"
        return {"processed": state["input_text"].upper()}
    except Exception as e:
        return {"error": str(e)}

def route_errors(state: AppState) -> str:
    return "err" if "error" in state else "ok"

builder = StateGraph(AppState)
builder.add_node("robust", robust)
builder.add_node("on_ok", lambda s: s)
builder.add_node("on_err", lambda s: s)
builder.add_edge(START, "robust")
builder.add_conditional_edges("robust", route_errors, {"ok": "on_ok", "err": "on_err"})
builder.add_edge("on_ok", END)
builder.add_edge("on_err", END)
graph = builder.compile()
print(graph.invoke({}))
print(graph.invoke({"input_text": "ok"}))
```

## 8) Observability and streaming
- Use astream_events to see node starts/ends and timing
- Print or persist events for debugging

```python
async def run():
    async for ev in graph.astream_events({"input_text": "trace me"}):
        print(ev["event"], ev.get("name"), ev.get("timestamp"))
# asyncio.run(run())
```

## 9) Capstone: Branching summarize-or-classify
Build a graph that:
- routes to summarize if input contains many words
- routes to classify otherwise
- loops until a "confirm" flag is in state

Skeleton:
```python
class PipelineState(TypedDict, total=False):
    text: str
    mode: str
    summary: str
    label: str
    confirm: bool

def choose(state: PipelineState) -> str:
    words = len((state.get("text") or "").split())
    return "summarize" if words > 12 else "classify"

def classify(state: PipelineState) -> PipelineState:
    txt = (state.get("text") or "").lower()
    label = "tech" if "langgraph" in txt or "llm" in txt else "other"
    return {"label": label}

def summarize_node(state: PipelineState) -> PipelineState:
    # call LLM here as shown earlier
    return {"summary": (state.get("text") or "")[:50] + "..."}

def should_continue(state: PipelineState) -> str:
    return "again" if not state.get("confirm") else "done"

b = StateGraph(PipelineState)
b.add_node("classify", classify)
b.add_node("summarize", summarize_node)
b.add_conditional_edges(START, choose, {"summarize": "summarize", "classify": "classify"})
b.add_conditional_edges("classify", should_continue, {"again": "classify", "done": END})
b.add_conditional_edges("summarize", should_continue, {"again": "summarize", "done": END})
capstone = b.compile()
print(capstone.invoke({"text": "LangGraph builds stateful LLM apps", "confirm": True}))
```

## 10) Exercises
1. Add a tool-calling node that decides to call a calculator when the text has math, else passes through
2. Add a SQLite checkpointer and demonstrate resuming after process restart (simulate by creating a new compiled graph with same DB)
3. Replace the summarize node with a retrieval-augmented node that reads from your Chroma store
4. Add a retry counter in state; after 3 failures route to END with an error message

## Key Takeaways
- LangGraph models workflows as typed state machines
- Nodes are plain functions; edges wire control flow
- Conditional edges and loops enable sophisticated routing
- Checkpointers persist and resume state across runs
- Stream events for observability and debugging