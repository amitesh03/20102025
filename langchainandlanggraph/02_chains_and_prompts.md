# Simple Chains and Prompt Templates

## Learning Objectives
By the end of this lesson, you will be able to:
- Create and customize prompt templates
- Build different types of chains
- Chain multiple operations together
- Implement conditional logic in chains
- Handle errors and edge cases in chains

## Prompt Templates Deep Dive

### 1. Basic Prompt Templates

Prompt templates are the foundation of effective LLM interactions. They provide structure and consistency to your prompts.

```python
from langchain_core.prompts import PromptTemplate

# Simple template with one variable
simple_template = PromptTemplate(
    template="What is the capital of {country}?",
    input_variables=["country"]
)

# Template with multiple variables
multi_var_template = PromptTemplate(
    template="Translate the following text from {source_lang} to {target_lang}: {text}",
    input_variables=["source_lang", "target_lang", "text"]
)

# Template with partial variables (pre-filled)
partial_template = PromptTemplate(
    template="As a {role}, explain {topic} in a {tone} manner.",
    input_variables=["topic", "tone"],
    partial_variables={"role": "expert educator"}
)
```

### 2. Advanced Prompt Template Features

```python
from langchain_core.prompts import FewShotPromptTemplate
from langchain_core.prompts.example_selector import LengthBasedExampleSelector

# Example-based prompting
examples = [
    {"question": "What is 2+2?", "answer": "4"},
    {"question": "What is 5*3?", "answer": "15"},
    {"question": "What is 10-7?", "answer": "3"}
]

example_prompt = PromptTemplate(
    input_variables=["question", "answer"],
    template="Question: {question}\nAnswer: {answer}"
)

# Create a few-shot prompt template
few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="Here are some examples of math problems:",
    suffix="Question: {input}\nAnswer:",
    input_variables=["input"],
    example_separator="\n\n"
)

# Example selector for dynamic examples
example_selector = LengthBasedExampleSelector(
    examples=examples,
    example_prompt=example_prompt,
    max_length=100  # Maximum length of examples
)

dynamic_prompt = FewShotPromptTemplate(
    example_selector=example_selector,
    example_prompt=example_prompt,
    prefix="Here are some examples:",
    suffix="Question: {input}\nAnswer:",
    input_variables=["input"],
    example_separator="\n\n"
)
```

### 3. Chat Prompt Templates

```python
from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

# Create a chat prompt template
system_template = "You are a helpful assistant that specializes in {subject}."
human_template = "{user_input}"

system_message_prompt = SystemMessagePromptTemplate.from_template(system_template)
human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

# Format the chat prompt
formatted_messages = chat_prompt.format_messages(
    subject="history",
    user_input="Tell me about the Renaissance period."
)
```

## Chain Types and Implementations

### 1. Simple LLM Chains

```python
from langchain_core.chains import LLMChain
from langchain_openai import OpenAI

# Basic LLM chain
llm = OpenAI(temperature=0.7)
prompt = PromptTemplate(
    template="Explain {concept} in simple terms.",
    input_variables=["concept"]
)

explanation_chain = LLMChain(llm=llm, prompt=prompt)

# Run the chain
result = explanation_chain.run(concept="quantum computing")
print(result)
```

### 2. Sequential Chains

```python
from langchain_core.chains import SequentialChain, LLMChain

# First chain: Generate a topic
topic_prompt = PromptTemplate(
    template="Generate an interesting topic about {subject}.",
    input_variables=["subject"]
)
topic_chain = LLMChain(llm=llm, prompt=topic_prompt, output_key="topic")

# Second chain: Create content about the topic
content_prompt = PromptTemplate(
    template="Write a short paragraph about {topic}.",
    input_variables=["topic"]
)
content_chain = LLMChain(llm=llm, prompt=content_prompt, output_key="content")

# Third chain: Summarize the content
summary_prompt = PromptTemplate(
    template="Summarize this content in one sentence: {content}",
    input_variables=["content"]
)
summary_chain = LLMChain(llm=llm, prompt=summary_prompt, output_key="summary")

# Combine into a sequential chain
overall_chain = SequentialChain(
    chains=[topic_chain, content_chain, summary_chain],
    input_variables=["subject"],
    output_variables=["topic", "content", "summary"],
    verbose=True
)

# Run the sequential chain
result = overall_chain({"subject": "artificial intelligence"})
print(f"Topic: {result['topic']}")
print(f"Content: {result['content']}")
print(f"Summary: {result['summary']}")
```

### 3. Conditional Chains

```python
from langchain_core.chains import LLMChain
from langchain_core.prompts import PromptTemplate
import re

# Create a conditional chain
def classify_input(input_text):
    """Classify input as question, statement, or command"""
    if input_text.endswith("?"):
        return "question"
    elif any(word in input_text.lower() for word in ["please", "can you", "would you"]):
        return "command"
    else:
        return "statement"

# Different prompts for different input types
question_prompt = PromptTemplate(
    template="Answer this question: {input}",
    input_variables=["input"]
)

statement_prompt = PromptTemplate(
    template="Respond to this statement: {input}",
    input_variables=["input"]
)

command_prompt = PromptTemplate(
    template="Acknowledge and respond to this command: {input}",
    input_variables=["input"]
)

# Create chains for each type
question_chain = LLMChain(llm=llm, prompt=question_prompt)
statement_chain = LLMChain(llm=llm, prompt=statement_prompt)
command_chain = LLMChain(llm=llm, prompt=command_prompt)

# Conditional chain function
def conditional_chain(input_text):
    input_type = classify_input(input_text)
    
    if input_type == "question":
        return question_chain.run(input=input_text)
    elif input_type == "command":
        return command_chain.run(input=input_text)
    else:
        return statement_chain.run(input=input_text)

# Test the conditional chain
print(conditional_chain("What is the meaning of life?"))
print(conditional_chain("Please explain machine learning."))
print(conditional_chain("Machine learning is fascinating."))
```

### 4. Transform Chains

```python
from langchain_core.chains import TransformChain
import json

# Create a transform chain to process input
def transform_func(inputs):
    """Transform input data"""
    text = inputs["text"]
    words = text.split()
    word_count = len(words)
    char_count = len(text)
    
    return {
        "original_text": text,
        "word_count": word_count,
        "char_count": char_count,
        "analysis": f"The text has {word_count} words and {char_count} characters."
    }

transform_chain = TransformChain(
    input_variables=["text"],
    output_variables=["original_text", "word_count", "char_count", "analysis"],
    transform=transform_func
)

# Create a summary chain
summary_prompt = PromptTemplate(
    template="Analyze this text: {original_text}\n\n{analysis}\n\nProvide insights:",
    input_variables=["original_text", "analysis"]
)
summary_chain = LLMChain(llm=llm, prompt=summary_prompt)

# Combine chains
from langchain_core.chains import SequentialChain

full_chain = SequentialChain(
    chains=[transform_chain, summary_chain],
    input_variables=["text"],
    output_variables=["analysis", "word_count", "char_count", "text"]
)

# Test the transform + LLM chain
result = full_chain.run(text="LangChain is a powerful framework for building applications with large language models.")
print(result)
```

## Advanced Chain Techniques

### 1. Chain with Memory Integration

```python
from langchain_core.memory import ConversationBufferMemory
from langchain_core.chains import LLMChain

# Create a chain with integrated memory
memory = ConversationBufferMemory(memory_key="chat_history", input_key="input")

prompt_template = """
You are a helpful assistant. Here's your conversation history:

{chat_history}

Human: {input}
Assistant:"""

prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["input", "chat_history"]
)

memory_chain = LLMChain(
    llm=llm,
    prompt=prompt,
    memory=memory,
    verbose=True
)

# Test the memory chain
response1 = memory_chain.run(input="Hi, I'm learning about LangChain.")
print(f"Assistant: {response1}")

response2 = memory_chain.run(input("Can you explain what chains are?"))
print(f"Assistant: {response2}")
```

### 2. Error Handling in Chains

```python
from langchain_core.chains import LLMChain
from langchain_core.prompts import PromptTemplate
import time

class RobustChain:
    def __init__(self, llm, prompt, max_retries=3, retry_delay=1):
        self.chain = LLMChain(llm=llm, prompt=prompt)
        self.max_retries = max_retries
        self.retry_delay = retry_delay
    
    def run(self, **kwargs):
        """Run chain with error handling and retries"""
        for attempt in range(self.max_retries):
            try:
                return self.chain.run(**kwargs)
            except Exception as e:
                if attempt == self.max_retries - 1:
                    return f"Error after {self.max_retries} attempts: {str(e)}"
                print(f"Attempt {attempt + 1} failed. Retrying...")
                time.sleep(self.retry_delay)

# Create a robust chain
robust_prompt = PromptTemplate(
    template="Process this input: {input}",
    input_variables=["input"]
)

robust_chain = RobustChain(llm=llm, prompt=robust_prompt, max_retries=3)

# Test error handling
result = robust_chain_chain.run(input="Test input")
print(result)
```

## Practical Exercise: Multi-Step Content Generator

Create a chain that:
1. Generates a blog post title
2. Creates an outline
3. Writes the introduction
4. Generates key points
5. Creates a conclusion

```python
# TODO: Implement a multi-step content generator
# 1. Create prompts for each step
# 2. Create chains for each step
# 3. Combine them into a sequential chain
# 4. Test with different topics

# Your implementation here:

# Step 1: Title generation
title_prompt = PromptTemplate(
    template="Generate a catchy blog post title about {topic}.",
    input_variables=["topic"]
)
title_chain = LLMChain(llm=llm, prompt=title_prompt, output_key="title")

# Step 2: Outline creation
outline_prompt = PromptTemplate(
    template="Create a 3-point outline for a blog post titled '{title}'.",
    input_variables=["title"]
)
outline_chain = LLMChain(llm=llm, prompt=outline_prompt, output_key="outline")

# Step 3: Introduction
intro_prompt = PromptTemplate(
    template="Write an engaging introduction for a blog post titled '{title}' with this outline: {outline}",
    input_variables=["title", "outline"]
)
intro_chain = LLMChain(llm=llm, prompt=intro_prompt, output_key="introduction")

# Step 4: Key points
key_points_prompt = PromptTemplate(
    template="Expand on these key points from the outline: {outline}",
    input_variables=["outline"]
)
key_points_chain = LLMChain(llm=llm, prompt=key_points_prompt, output_key="key_points")

# Step 5: Conclusion
conclusion_prompt = PromptTemplate(
    template="Write a strong conclusion for a blog post with this introduction: {introduction}",
    input_variables=["introduction"]
)
conclusion_chain = LLMChain(llm=llm, prompt=conclusion_prompt, output_key="conclusion")

# Combine all chains
content_generator = SequentialChain(
    chains=[title_chain, outline_chain, intro_chain, key_points_chain, conclusion_chain],
    input_variables=["topic"],
    output_variables=["title", "outline", "introduction", "key_points", "conclusion"],
    verbose=True
)

# Test the content generator
result = content_generator.run(topic="sustainable living")
print(f"Title: {result['title']}")
print(f"Outline: {result['outline']}")
print(f"Introduction: {result['introduction']}")
print(f"Key Points: {result['key_points']}")
print(f"Conclusion: {result['conclusion']}")
```

## Key Takeaways

1. **Prompt Templates**: Provide structure and consistency to LLM interactions
2. **Chain Composition**: Combine multiple operations into complex workflows
3. **Conditional Logic**: Create chains that adapt based on input
4. **Error Handling**: Implement robust error handling and retries
5. **Memory Integration**: Maintain context across chain executions
6. **Transform Chains**: Process and transform data before LLM operations

## Next Steps

In the next lesson, we'll explore basic LLM functionality, including different model types, parameters, and optimization techniques.