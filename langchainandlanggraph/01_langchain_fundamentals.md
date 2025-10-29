# LangChain Fundamentals and Basic Concepts

## Learning Objectives
By the end of this lesson, you will understand:
- What LangChain is and its core architecture
- Key components of the LangChain ecosystem
- Basic terminology and concepts
- How to initialize and configure LangChain

## What is LangChain?

LangChain is an open-source framework designed to simplify the development of applications powered by Large Language Models (LLMs). It provides a structured way to:

- Connect LLMs to external data sources
- Build complex chains of operations
- Create memory-enabled applications
- Develop AI agents with tool capabilities

## Core Architecture

### 1. Components
LangChain is built around modular components that can be combined in various ways:

```python
# Example: Basic component structure
from langchain_core.components import BaseComponent

class CustomComponent(BaseComponent):
    def __init__(self, param1, param2):
        self.param1 = param1
        self.param2 = param2
    
    def run(self, input_data):
        # Process input data
        return processed_data
```

### 2. Models
LangChain supports various types of models:

- **LLMs**: Basic text completion models
- **Chat Models**: Conversational models with message-based interfaces
- **Text Embedding Models**: Convert text to vector representations

### 3. Prompts
Prompt templates provide a structured way to format inputs for models:

```python
from langchain_core.prompts import PromptTemplate

template = "Question: {question}\nAnswer: {answer}"
prompt = PromptTemplate(template=template, input_variables=["question", "answer"])
```

### 4. Chains
Chains are sequences of calls to components, models, or other chains:

```python
from langchain_core.chains import LLMChain
from langchain_core.prompts import PromptTemplate

# Create a simple chain
prompt = PromptTemplate(template="Tell me a joke about {topic}")
chain = LLMChain(llm=llm, prompt=prompt)
```

### 5. Memory
Memory components enable persistent state across interactions:

```python
from langchain_core.memory import ConversationBufferMemory

memory = ConversationBufferMemory()
memory.chat_memory.add_user_message("Hi!")
memory.chat_memory.add_ai_message("Hello! How can I help you?")
```

### 6. Indexes
Indexes provide structured access to external data:

```python
from langchain_core.indexes import VectorStoreIndexCreator

# Create an index from documents
index = VectorStoreIndexCreator().from_loaders([document_loader])
```

### 7. Agents
Agents use LLMs to determine which actions to take:

```python
from langchain_core.agents import AgentExecutor, create_react_agent

# Create an agent with tools
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)
```

## Key Terminology

| Term | Definition |
|------|------------|
| **LLM** | Large Language Model - AI model trained on vast amounts of text |
| **Chain** | Sequence of components that process data |
| **Agent** | System that uses LLMs to decide actions and use tools |
| **Prompt** | Input text given to an LLM to generate output |
| **Memory** | Component that stores and retrieves conversation history |
| **Embedding** | Vector representation of text for semantic similarity |
| **Tool** | Function or capability that an agent can use |
| **Document** | Piece of text with associated metadata |
| **Retriever** | Component that fetches relevant documents |

## Basic Setup and Configuration

### 1. Importing LangChain

```python
# Core imports
from langchain_core.prompts import PromptTemplate
from langchain_core.chains import LLMChain
from langchain_core.memory import ConversationBufferMemory

# Provider-specific imports
from langchain_openai import ChatOpenAI, OpenAI
from langchain_huggingface import HuggingFaceHub
```

### 2. Environment Configuration

```python
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure API keys
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv("HUGGINGFACEHUB_API_TOKEN")
```

### 3. Model Initialization

```python
# OpenAI models
openai_llm = OpenAI(model_name="gpt-3.5-turbo-instruct", temperature=0.7)
chat_model = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

# Hugging Face models
hf_model = HuggingFaceHub(
    repo_id="google/flan-t5-large",
    model_kwargs={"temperature": 0.5, "max_length": 64}
)
```

## Exercise: Your First LangChain Application

Let's create a simple application that demonstrates the basic concepts:

```python
from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.chains import LLMChain
from langchain_core.memory import ConversationBufferMemory

# 1. Initialize the model
llm = OpenAI(temperature=0.7)

# 2. Create a prompt template
template = """
You are a helpful assistant. Answer the following question:

Question: {question}

Context: {context}

Answer:"""

prompt = PromptTemplate(
    template=template,
    input_variables=["question", "context"]
)

# 3. Create a chain
chain = LLMChain(llm=llm, prompt=prompt)

# 4. Add memory
memory = ConversationBufferMemory()

# 5. Use the chain
question = "What is LangChain?"
context = "LangChain is a framework for building LLM applications"

result = chain.run(question=question, context=context)
print(result)

# Save to memory
memory.chat_memory.add_user_message(question)
memory.chat_memory.add_ai_message(result)
```

## Practice Exercise

Create a simple LangChain application that:
1. Initializes an OpenAI model
2. Creates a prompt template for a story generator
3. Builds a chain that generates stories based on a topic
4. Includes memory to remember previous stories

**Solution Template:**
```python
# Your code here

# 1. Initialize model
# llm = ...

# 2. Create prompt template
# template = ...
# prompt = ...

# 3. Create chain
# chain = ...

# 4. Add memory
# memory = ...

# 5. Test the chain
# result = chain.run(topic="space exploration")
# print(result)
```

## Key Takeaways

1. **Modularity**: LangChain is built from interchangeable components
2. **Flexibility**: Components can be combined in various ways
3. **Extensibility**: Custom components can be created for specific needs
4. **State Management**: Memory systems enable persistent conversations
5. **Tool Integration**: Agents can use external tools and APIs

## Next Steps

In the next lesson, we'll dive deeper into implementing simple chains and prompt templates to build more sophisticated applications.