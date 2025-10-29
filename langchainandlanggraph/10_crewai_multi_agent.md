# Multi‑Agent Systems with CrewAI

## Learning Objectives
By the end of this lesson, you will be able to:
- Define CrewAI agents (roles, goals, backstories) and tasks
- Configure sequential vs hierarchical processes
- Integrate web/tools and memory into a crew
- Orchestrate multi‑agent research and report generation
- Add retry, timeouts, and guardrails for reliability
- Design and implement exercises for hands‑on practice

## Prerequisites
- Python 3.9+
- Installed via `pip install crewai crewai-tools` (already included in requirements.txt)
- OPENAI_API_KEY set in your `.env` (or other LLM provider envs supported by CrewAI)

## CrewAI Concepts
- Agent: An autonomous role with a goal, backstory, LLM settings, and tool permissions
- Task: A concrete assignment with input/output expectations and optional tools
- Crew: A group of agents and tasks with an execution process (sequential/hierarchical)
- Process:
  - Sequential: Tasks run in defined order, passing outputs forward
  - Hierarchical: A manager delegates/subtasks to workers dynamically
- Tools: Functions/resources agents may call (web search, scraping, RAG, code, etc.)
- Memory: Persist or pass context between tasks/agents

Tip: Keep each agent’s role and tool permissions minimal and explicit.

## Quick Start: Sequential Crew

```python
# pip install crewai crewai-tools
from dotenv import load_dotenv
load_dotenv()

from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, WebsiteSearchTool, ScrapeWebsiteTool

# Tools (configure your SERPER_API_KEY in .env to use SerperDevTool)
web_search = WebsiteSearchTool()
web_scrape = ScrapeWebsiteTool()
serper_search = SerperDevTool()

# Agents
researcher = Agent(
    role="AI Researcher",
    goal="Discover accurate, up-to-date information about the topic.",
    backstory="Methodical, cites sources, avoids speculation.",
    allow_delegation=False,
    verbose=True,
    tools=[serper_search, web_search, web_scrape]
)

analyst = Agent(
    role="Analyst",
    goal="Synthesize research into concise, structured insights.",
    backstory="Transforms raw notes into executive-level takeaways.",
    allow_delegation=False,
    verbose=True
)

writer = Agent(
    role="Technical Writer",
    goal="Write a clear, well-structured report with references.",
    backstory="Senior writer focused on clarity and correctness.",
    allow_delegation=False,
    verbose=True
)

# Tasks
t1 = Task(
    description=(
        "Research the topic: '{topic}'. Identify 5 key facts, "
        "include source URLs, and note any uncertainties."
    ),
    expected_output=(
        "A bulleted list of 5 facts with short citations (URL), "
        "plus a short 'uncertainties' note."
    ),
    agent=researcher
)

t2 = Task(
    description=(
        "Analyze the research output and extract 3 key insights for decision-makers. "
        "Each insight should be one sentence."
    ),
    expected_output="3 bullet-point insights with one sentence each.",
    agent=analyst
)

t3 = Task(
    description=(
        "Create a 300-500 word report synthesizing the insights. "
        "Add a brief references section citing the sources."
    ),
    expected_output="A markdown report with a References section.",
    agent=writer
)

# Crew with sequential process
crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[t1, t2, t3],
    process=Process.SEQUENTIAL,
    verbose=True
)

# Run the crew
result = crew.kickoff(inputs={"topic": "LangGraph use-cases in production"})
print(result)
```

Notes:
- Sequential processes pass context (e.g., prior task outputs) along the chain.
- Use small, well-defined tasks; avoid overloaded descriptions.

## Hierarchical Crew (Manager + Workers)

```python
from crewai import Agent, Task, Crew, Process

manager = Agent(
    role="Project Manager",
    goal="Decide plan, assign work, and ensure quality.",
    backstory="Experienced coordinator who creates subtasks for the team.",
    allow_delegation=True,  # manager can create subtasks
    verbose=True
)

worker_researcher = Agent(
    role="Research Specialist",
    goal="Find reliable information; cite sources succinctly.",
    backstory="Expert in using search and verification.",
    allow_delegation=False,
    verbose=True
)

worker_writer = Agent(
    role="Writer",
    goal="Produce a structured summary with references.",
    backstory="Strong editor and communicator.",
    allow_delegation=False,
    verbose=True
)

# Single high-level task; manager will decompose it
master_task = Task(
    description=(
        "Investigate '{topic}' and produce a 400-word executive summary "
        "with 5 bullet references."
    ),
    expected_output="A 400-word summary with 5 references (URLs).",
    agent=manager
)

crew = Crew(
    agents=[manager, worker_researcher, worker_writer],
    tasks=[master_task],
    process=Process.HIERARCHICAL,  # manager orchestrates
    verbose=True
)

res = crew.kickoff(inputs={"topic": "Retrieval-Augmented Generation (RAG) best practices"})
print(res)
```

Notes:
- In hierarchical mode, the manager may create dynamic subtasks and delegate to workers.
- Keep worker agents scoped to specific skills; permissions to the minimal tools required.

## Tools and Guardrails

CrewAI supports various tools (from `crewai-tools` and your custom ones). Examples:
- Web: SerperDevTool (Google‑like search via Serper), WebsiteSearchTool, ScrapeWebsiteTool
- File/Code: local file readers, code execution (guard this carefully)
- RAG: vector DB retrievers (integrate as custom tools)
- APIs: News, GitHub, etc.

Security and reliability tips:
- Restrict tools by agent role (least privilege).
- Add timeouts and retries in tool implementations.
- Sanitize inputs; strip/validate URLs for scraping.
- Rate-limit tools calling external APIs.

## Memory Patterns

Simple patterns for carrying context:
- Use task outputs as inputs for subsequent tasks (sequential process).
- Have agents summarize their own findings to limit tokens.
- Maintain a global reference list in context and append as agents cite.
- For long‑running crews, combine with a lightweight vector store to recall earlier facts.

## Adding Retries and Timeouts

Wrap tool functions or incorporate robust request logic. Example (conceptual):

```python
import time, requests

def with_retry(fn, retries=3, backoff=0.5):
    def wrapper(*args, **kwargs):
        last = None
        for i in range(retries):
            try:
                return fn(*args, **kwargs)
            except Exception as e:
                last = e
                time.sleep(backoff * (2 ** i))
        return f"tool-error: {last}"
    return wrapper

@with_retry
def fetch_json(url, timeout=8):
    r = requests.get(url, timeout=timeout)
    r.raise_for_status()
    return r.json()
```

Integrate such robust helpers into your custom CrewAI tools.

## Example: Web‑Augmented Research Crew

```python
from crewai import Agent, Task, Crew, Process
from crewai_tools import WebsiteSearchTool, ScrapeWebsiteTool

find = WebsiteSearchTool()
scrape = ScrapeWebsiteTool()

researcher = Agent(
    role="Web Researcher",
    goal="Find the most reliable, current information about '{query}'.",
    backstory="Careful verifier who avoids stale or dubious sources.",
    tools=[find, scrape],
    verbose=True
)

curator = Agent(
    role="Content Curator",
    goal="Select the 3 most relevant pieces of info and discard noise.",
    backstory="Focus on precision and source credibility.",
    verbose=True
)

summarizer = Agent(
    role="Summarizer",
    goal="Compose a 250-word summary with source attributions.",
    backstory="Expert technical summarizer.",
    verbose=True
)

task_research = Task(
    description="Search and collect 6 relevant snippets for '{query}' with URLs.",
    expected_output="6 bullet snippets with URLs.",
    agent=researcher
)

task_curate = Task(
    description="From the research, select the 3 best snippets and justify selection.",
    expected_output="3 curated bullets with justification.",
    agent=curator
)

task_summarize = Task(
    description="Write a 250-word summary with a references section (URLs).",
    expected_output="A 250-word markdown summary with citations.",
    agent=summarizer
)

crew = Crew(
    agents=[researcher, curator, summarizer],
    tasks=[task_research, task_curate, task_summarize],
    process=Process.SEQUENTIAL,
    verbose=True
)

print(crew.kickoff(inputs={"query": "LangChain vs LangGraph design patterns"}))
```

## Reliability and Observability
- Use `verbose=True` to log per‑step reasoning (helpful during development).
- Wrap external tools with retry/backoff and timeouts.
- Validate outputs at each step (e.g., ensure citations exist and are URLs).
- For production, add tracing/metrics around tool calls.

## Common Pitfalls and Fixes
- Agents not selecting tools: Ensure tool docstrings are clear and specific; lower temperature to 0.
- Hallucinated facts: Force agents to cite with URLs; post‑validate references and request corrections.
- Token bloat: Summarize outputs between steps (e.g., have Curator produce a tight shortlist).
- Stale results: Include “current year” or “as of today” hints in the researcher prompt; use date filters in tools when available.

## Exercises

A) Research + Compare
- Agents: Two researchers (Framework A and B) and an analyst to compare.
- Output: A comparison table of 5 criteria with source URLs.
- Constraints: Each researcher must cite at least 3 unique sources.

B) RAG‑Augmented Crew
- Add a Retriever tool to answer domain‑specific questions before web search.
- The analyst merges RAG context and web snippets into final insights.

C) Hierarchical Orchestration
- Manager agent creates subtasks for “market size”, “competitor list”, “SWOT”.
- Workers complete subtasks; manager compiles a 1‑page brief.

D) Guardrails
- Implement a URL whitelist and a maximum page fetch count per run.
- If more sources are needed, ask the user (human‑in‑the‑loop) to confirm.

E) Reference Validator
- Add a post‑processing step to validate URLs (status code 200, domain whitelist).
- If a link fails, agent must replace it with an alternative.

## Key Takeaways
- CrewAI enables modular, role‑based multi‑agent workflows with explicit tasks.
- Choose sequential vs hierarchical processes based on orchestration needs.
- Tools and guardrails are critical to reliability and safety.
- Memory and summarization keep token usage in check.
- Observable logs and validations help prevent silent failures.

## Next Steps
Proceed to production deployment strategies (caching, tracing, cost control) and performance monitoring. Then explore multi‑agent orchestration patterns with LangGraph and CrewAI together.
