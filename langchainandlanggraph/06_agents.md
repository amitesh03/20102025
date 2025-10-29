# Developing Basic Agents in LangChain

## Learning Objectives
- Build and run a basic ReAct-style agent
- Define and register custom tools
- Use OpenAI tool/function-calling style agents
- Add memory and streaming to agents
- Handle parsing/errors and retries
- Exercises to practice tool design and agent behaviors

## Overview
Agents decide what to do next (which tool to call, what to ask) from intermediate reasoning steps. This lesson focuses on the classic ReAct pattern and OpenAI tool-calling.

Prerequisites:
- Environment set up, API keys in .env
- Packages from requirements.txt installed

## 1) Defining Tools
Use the tool decorator to turn Python functions into tools with input schemas and docstrings used by the model for selection.

```python
from typing import Optional
from langchain_core.tools import tool

@tool
def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression like '2 + 3 * 4'."""
    try:
        result = eval(expression, {}, {})  # never eval untrusted input in production
        return str(result)
    except Exception as e:
        return f"calc-error: {e}"

@tool
def search_local_docs(query: str, corpus: Optional[str] = None) -> str:
    """Fake search over a small in-memory corpus. Provide a short answer from local notes."""
    notes = (corpus or "LangChain supports prompts, chains, agents, memory.")
    if query.lower() in notes.lower():
        return f"Found mention of '{query}': ... {notes[:120]} ..."
    return "No relevant snippets found."
```

Tips:
- Keep tool signatures small and explicit
- Return compact, factual strings
- Add validation, timeouts, and guardrails for real tools

## 2) Building a ReAct Agent
The ReAct pattern alternates between reasoning (Thought), tool use (Action), and observation (Observation).

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_react_agent, AgentExecutor  # if unavailable, see note below

tools = [calculator, search_local_docs]

react_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use tools when helpful. Think step-by-step."),
    ("human", "{input}")
])

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# Build a ReAct agent from the LLM, tools, and prompt
agent = create_react_agent(llm=llm, tools=tools, prompt=react_prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

response = agent_executor.invoke({"input": "What is (12+8)/5? Then check if 'agents' appear in our local notes."})
print(response["output"])
```

Import note:
- If your installation does not expose create_react_agent or AgentExecutor under langchain.agents, install or upgrade the meta package: pip install -U langchain
- In some versions, imports may live under langchain_experimental or be constructed via LCEL runnables. The concepts remain the same.

### Handling tool and parsing errors

```python
from langchain.agents import AgentExecutor

safe_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    handle_parsing_errors=True,   # let the agent try to recover from output format issues
)
try:
    result = safe_executor.invoke({"input": "Compute 3 * (4 + bad)"})
    print(result["output"])
except Exception as e:
    print("Agent failed gracefully:", e)
```

## 3) OpenAI Tool-Calling Agent
OpenAI chat models can call tools via function-calling. LangChain exposes utilities to build such agents.

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_openai_tools_agent, AgentExecutor  # availability varies by version

tools = [calculator, search_local_docs]
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a precise assistant. Use tools when necessary."),
    ("human", "{input}")
])

tool_agent = create_openai_tools_agent(llm, tools, prompt)
tool_exec = AgentExecutor(agent=tool_agent, tools=tools, verbose=True)
out = tool_exec.invoke({"input": "Use the calculator to evaluate (7*9)-8 and tell me the result."})
print(out["output"])
```

Caveats:
- Function names and descriptions from the @tool decorator inform the model
- Keep tool outputs terse; the model will compose the final answer

## 4) Adding Memory to Agents
Use a conversational prompt and buffer memory to keep recent context available to the agent.

```python
from langchain_core.memory import ConversationBufferMemory
from langchain_core.prompts import ChatPromptTemplate

memory = ConversationBufferMemory(memory_key="chat_history", input_key="input")
mem_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are helpful. Use the chat history as needed."),
    ("placeholder", "{chat_history}"),
    ("human", "{input}")
])

mem_agent = create_react_agent(llm=llm, tools=tools, prompt=mem_prompt)
mem_exec = AgentExecutor(agent=mem_agent, tools=tools, verbose=True, memory=memory)

print(mem_exec.invoke({"input": "Remember that I like short answers."})["output"])
print(mem_exec.invoke({"input": "What did I say about answer style?"})["output"])
```

Tip: For larger histories, summarize periodically to control token usage.

## 5) Streaming Intermediate Steps
Stream tokens and tool steps for better UX and observability.

```python
from langchain_core.callbacks import StreamingStdOutCallbackHandler

stream_llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0, streaming=True, callbacks=[StreamingStdOutCallbackHandler()])
stream_agent = create_react_agent(llm=stream_llm, tools=tools, prompt=react_prompt)
stream_exec = AgentExecutor(agent=stream_agent, tools=tools, verbose=True)
_ = stream_exec.invoke({"input": "Show your reasoning and compute 17*19 using the calculator."})
```

## 6) Testing and Reliability
- Unit-test tools directly (pure functions are easier to test)
- Use timeouts and circuit breakers around network tools
- Add retries with exponential backoff for flaky APIs
- Consider tool result schemas (Pydantic) and validate outputs

## 7) Exercises
A) Calculator+Units Agent
- Add a unit_convert(value: float, from_unit: str, to_unit: str) tool (e.g., km<->miles)
- Build an agent that chooses calculator or unit_convert as appropriate
- Test with: "What is 150 miles in km plus 12?"

B) Local Notes QA Agent
- Create a tool load_notes(topic: str) that returns a small snippet from a folder of .txt files
- Combine with search_local_docs to answer: "Find any mention of 'vector memory' and summarize it in one sentence"

C) Robustness
- Wrap AgentExecutor with handle_parsing_errors=True
- Simulate a tool failure and show a graceful fallback message

D) Memory-Aware Agent
- Integrate ConversationBufferMemory
- Ask a follow-up question that depends on the previous answer to verify recall

E) Observability
- Log tool inputs/outputs and timings; print a trace after each run

## 8) Troubleshooting
- Missing imports: upgrade/install the meta package (pip install -U langchain) or consult current docs for your versions
- Tool never selected: ensure docstrings are clear; reduce temperature to 0
- Hallucinated numbers: force calculator tool for arithmetic and verify results
- Token limits: prefer short tool outputs and summarized history

## Key Takeaways
- ReAct agents reason with intermediate steps and call tools as needed
- Tool ergonomics (clean signatures, clear docstrings) directly affect agent quality
- Memory improves coherence; summarize to control token growth
- Handle errors and add streaming for practical UX

## Next Steps
- Next lesson: Tools deep-dive and custom tool composition