# Basic LLM Integration

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand different types of LLM models
- Configure model parameters for optimal performance
- Work with both completion and chat models
- Implement streaming responses
- Handle model limitations and errors
- Optimize model usage for cost and performance

## Types of LLM Models

### 1. Text Completion Models

Text completion models generate text based on a prompt and are best for:
- Text generation and completion
- Code generation
- Summarization
- Translation

```python
from langchain_openai import OpenAI
from langchain_huggingface import HuggingFaceHub

# OpenAI completion model
openai_completion = OpenAI(
    model_name="gpt-3.5-turbo-instruct",
    temperature=0.7,
    max_tokens=1000,
    top_p=0.9,
    frequency_penalty=0.5,
    presence_penalty=0.5
)

# Hugging Face model
hf_model = HuggingFaceHub(
    repo_id="google/flan-t5-large",
    model_kwargs={"temperature": 0.5, "max_length": 512}
)

# Use the completion model
response = openai_completion("Write a poem about artificial intelligence:")
print(response)
```

### 2. Chat Models

Chat models are optimized for conversational interactions and work with structured message formats:

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

# Initialize chat model
chat_model = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0.7,
    max_tokens=1000
)

# Create messages
messages = [
    SystemMessage(content="You are a helpful assistant that explains complex topics simply."),
    HumanMessage(content="Explain quantum computing in simple terms.")
]

# Get response
response = chat_model(messages)
print(response.content)

# Alternative: Use invoke method
response = chat_model.invoke(messages)
print(response.content)
```

## Model Parameters and Configuration

### 1. Temperature

Temperature controls the randomness of the output:
- Low temperature (0.0-0.3): More focused, deterministic outputs
- Medium temperature (0.4-0.7): Balanced creativity and coherence
- High temperature (0.8-1.0): More creative, random outputs

```python
# Compare different temperatures
low_temp_model = OpenAI(temperature=0.1)
high_temp_model = OpenAI(temperature=0.9)

prompt = "The future of artificial intelligence is"

print("Low temperature (0.1):")
print(low_temp_model(prompt))

print("\nHigh temperature (0.9):")
print(high_temp_model(prompt))
```

### 2. Max Tokens and Stop Sequences

```python
# Control output length and stopping points
controlled_model = OpenAI(
    temperature=0.7,
    max_tokens=50,  # Limit response length
    stop=["\n\n", "###"]  # Stop at these sequences
)

response = controlled_model("List three benefits of renewable energy:")
print(response)
```

### 3. Top P and Frequency Penalty

```python
# Advanced parameters
advanced_model = OpenAI(
    temperature=0.7,
    top_p=0.9,  # Nucleus sampling
    frequency_penalty=0.5,  # Reduce repetition
    presence_penalty=0.3  # Encourage new topics
)

response = advanced_model("Write about innovative technologies:")
print(response)
```

## Working with Different Model Providers

### 1. OpenAI Models

```python
from langchain_openai import OpenAI, ChatOpenAI

# Available OpenAI models
models = {
    "gpt-3.5-turbo": ChatOpenAI(model="gpt-3.5-turbo"),
    "gpt-4": ChatOpenAI(model="gpt-4"),
    "gpt-4-turbo": ChatOpenAI(model="gpt-4-turbo-preview"),
    "gpt-3.5-turbo-instruct": OpenAI(model="gpt-3.5-turbo-instruct")
}

# Test different models
for name, model in models.items():
    try:
        response = model.invoke("Explain machine learning in one sentence.")
        print(f"{name}: {response.content}")
    except Exception as e:
        print(f"{name}: Error - {e}")
```

### 2. Hugging Face Models

```python
from langchain_huggingface import HuggingFaceHub, HuggingFaceEndpoint

# Hugging Face Hub models
hf_models = {
    "flan-t5": HuggingFaceHub(repo_id="google/flan-t5-large"),
    "llama-2": HuggingFaceHub(repo_id="meta-llama/Llama-2-7b-chat-hf"),
    "mistral": HuggingFaceHub(repo_id="mistralai/Mistral-7B-Instruct-v0.1")
}

# Using Hugging Face endpoint for better performance
hf_endpoint = HuggingFaceEndpoint(
    repo_id="google/flan-t5-large",
    task="text-generation",
    max_new_tokens=100
)

response = hf_endpoint("Translate to French: 'Hello, how are you?'")
print(response)
```

## Streaming Responses

### 1. Basic Streaming

```python
from langchain_openai import ChatOpenAI
import sys

# Create streaming model
streaming_model = ChatOpenAI(
    model="gpt-3.5-turbo",
    streaming=True,
    temperature=0.7
)

# Stream response
print("Streaming response:")
for chunk in streaming_model.stream("Tell me a story about a robot learning to paint:"):
    print(chunk.content, end="", flush=True)
print()
```

### 2. Streaming with Callbacks

```python
from langchain_core.callbacks import StreamingStdOutCallbackHandler

# Create model with streaming callback
callback_model = ChatOpenAI(
    model="gpt-3.5-turbo",
    streaming=True,
    callbacks=[StreamingStdOutCallbackHandler()],
    temperature=0.7
)

# Custom callback handler
class CustomStreamingHandler:
    def on_llm_new_token(self, token: str, **kwargs):
        # Custom processing of each token
        print(token, end="", flush=True)
    
    def on_llm_end(self, response, **kwargs):
        print("\n[Streaming completed]")

# Use custom handler
response = callback_model.invoke("Explain the concept of neural networks:")
```

## Model Optimization Techniques

### 1. Token Management

```python
import tiktoken

# Token counting function
def count_tokens(text, model="gpt-3.5-turbo"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

# Optimize prompts for token usage
def optimize_prompt(prompt, max_tokens=1000):
    token_count = count_tokens(prompt)
    if token_count > max_tokens:
        # Truncate or summarize the prompt
        words = prompt.split()
        truncated = " ".join(words[:int(len(words) * max_tokens / token_count)])
        return truncated
    return prompt

# Test token optimization
long_prompt = "This is a very long prompt that contains a lot of text..." * 50
optimized = optimize_prompt(long_prompt, max_tokens=100)
print(f"Original tokens: {count_tokens(long_prompt)}")
print(f"Optimized tokens: {count_tokens(optimized)}")
```

### 2. Response Caching

```python
from functools import lru_cache
import hashlib
import json

class CachedLLM:
    def __init__(self, model):
        self.model = model
        self.cache = {}
    
    def _get_cache_key(self, prompt, **kwargs):
        # Create a unique key for the prompt and parameters
        key_data = {"prompt": prompt, **kwargs}
        return hashlib.md5(json.dumps(key_data, sort_keys=True).encode()).hexdigest()
    
    def invoke(self, prompt, **kwargs):
        cache_key = self._get_cache_key(prompt, **kwargs)
        
        if cache_key in self.cache:
            print("Using cached response")
            return self.cache[cache_key]
        
        print("Generating new response")
        response = self.model.invoke(prompt, **kwargs)
        self.cache[cache_key] = response
        return response

# Use cached LLM
cached_model = CachedLLM(ChatOpenAI(model="gpt-3.5-turbo"))

# First call (generates new response)
response1 = cached_model.invoke("What is machine learning?")

# Second call (uses cached response)
response2 = cached_model.invoke("What is machine learning?")
```

## Error Handling and Retry Logic

### 1. Basic Error Handling

```python
import time
from typing import Optional

class RobustLLM:
    def __init__(self, model, max_retries=3, retry_delay=1):
        self.model = model
        self.max_retries = max_retries
        self.retry_delay = retry_delay
    
    def invoke(self, prompt, **kwargs) -> Optional[str]:
        for attempt in range(self.max_retries):
            try:
                response = self.model.invoke(prompt, **kwargs)
                return response.content if hasattr(response, 'content') else str(response)
            except Exception as e:
                print(f"Attempt {attempt + 1} failed: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay * (2 ** attempt))  # Exponential backoff
                else:
                    print(f"Max retries exceeded for prompt: {prompt[:50]}...")
                    return None
        return None

# Use robust LLM
robust_model = RobustLLM(ChatOpenAI(model="gpt-3.5-turbo"))
response = robust_model.invoke("Explain the concept of blockchain:")
if response:
    print(response)
```

### 2. Fallback Models

```python
class FallbackLLM:
    def __init__(self, primary_model, fallback_models):
        self.primary_model = primary_model
        self.fallback_models = fallback_models
    
    def invoke(self, prompt, **kwargs):
        # Try primary model first
        try:
            response = self.primary_model.invoke(prompt, **kwargs)
            return response.content if hasattr(response, 'content') else str(response)
        except Exception as e:
            print(f"Primary model failed: {e}")
        
        # Try fallback models
        for i, model in enumerate(self.fallback_models):
            try:
                print(f"Trying fallback model {i + 1}")
                response = model.invoke(prompt, **kwargs)
                return response.content if hasattr(response, 'content') else str(response)
            except Exception as e:
                print(f"Fallback model {i + 1} failed: {e}")
                continue
        
        print("All models failed")
        return None

# Create fallback chain
primary = ChatOpenAI(model="gpt-4")
fallbacks = [
    ChatOpenAI(model="gpt-3.5-turbo"),
    OpenAI(model="gpt-3.5-turbo-instruct")
]

fallback_llm = FallbackLLM(primary, fallbacks)
response = fallback_llm.invoke("Explain quantum computing:")
print(response)
```

## Model Performance Monitoring

### 1. Response Time and Token Usage

```python
import time
import tiktoken
from typing import Dict, Any

class MonitoredLLM:
    def __init__(self, model):
        self.model = model
        self.stats = {
            "total_requests": 0,
            "total_tokens": 0,
            "total_time": 0,
            "errors": 0
        }
    
    def invoke(self, prompt, **kwargs) -> Dict[str, Any]:
        start_time = time.time()
        
        try:
            response = self.model.invoke(prompt, **kwargs)
            end_time = time.time()
            
            # Calculate metrics
            response_time = end_time - start_time
            input_tokens = count_tokens(prompt)
            output_content = response.content if hasattr(response, 'content') else str(response)
            output_tokens = count_tokens(output_content)
            
            # Update stats
            self.stats["total_requests"] += 1
            self.stats["total_tokens"] += input_tokens + output_tokens
            self.stats["total_time"] += response_time
            
            return {
                "content": output_content,
                "response_time": response_time,
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": input_tokens + output_tokens
            }
            
        except Exception as e:
            self.stats["errors"] += 1
            return {
                "error": str(e),
                "response_time": time.time() - start_time
            }
    
    def get_stats(self):
        avg_time = self.stats["total_time"] / max(1, self.stats["total_requests"])
        avg_tokens = self.stats["total_tokens"] / max(1, self.stats["total_requests"])
        
        return {
            **self.stats,
            "average_response_time": avg_time,
            "average_tokens_per_request": avg_tokens
        }

# Use monitored LLM
monitored_model = MonitoredLLM(ChatOpenAI(model="gpt-3.5-turbo"))

# Make several requests
for _ in range(3):
    result = monitored_model.invoke("Write a haiku about technology:")
    if "content" in result:
        print(f"Response: {result['content']}")
        print(f"Tokens: {result['total_tokens']}, Time: {result['response_time']:.2f}s\n")

# Print statistics
stats = monitored_model.get_stats()
print("Model Statistics:")
for key, value in stats.items():
    print(f"{key}: {value}")
```

## Exercise: Build a Smart LLM Wrapper

Create a wrapper that:
1. Automatically selects the best model based on task complexity
2. Implements caching for common queries
3. Provides fallback mechanisms
4. Monitors performance metrics

```python
# TODO: Implement a smart LLM wrapper
# 1. Create task complexity detection
# 2. Implement model selection logic
# 3. Add caching layer
# 4. Include fallback mechanisms
# 5. Add performance monitoring

# Your implementation here:

class SmartLLM:
    def __init__(self):
        # Initialize different models for different tasks
        self.simple_model = ChatOpenAI(model="gpt-3.5-turbo")
        self.complex_model = ChatOpenAI(model="gpt-4")
        
        # Initialize cache and monitoring
        self.cache = {}
        self.monitor = MonitoredLLM(self.simple_model)
        
        # Task complexity keywords
        self.complex_keywords = [
            "analyze", "compare", "synthesize", "evaluate", "create",
            "complex", "detailed", "comprehensive", "in-depth"
        ]
    
    def _detect_complexity(self, prompt: str) -> bool:
        """Determine if the task is complex based on keywords and length"""
        # Check for complexity keywords
        has_complex_keywords = any(keyword in prompt.lower() for keyword in self.complex_keywords)
        
        # Check prompt length (longer prompts tend to be more complex)
        is_long_prompt = len(prompt.split()) > 50
        
        return has_complex_keywords or is_long_prompt
    
    def _get_cache_key(self, prompt: str) -> str:
        """Generate cache key for prompt"""
        return hashlib.md5(prompt.encode()).hexdigest()
    
    def invoke(self, prompt: str, **kwargs) -> str:
        """Smart invocation with model selection, caching, and fallback"""
        cache_key = self._get_cache_key(prompt)
        
        # Check cache first
        if cache_key in self.cache:
            print("Using cached response")
            return self.cache[cache_key]
        
        # Select appropriate model
        is_complex = self._detect_complexity(prompt)
        selected_model = self.complex_model if is_complex else self.simple_model
        
        print(f"Using {'complex' if is_complex else 'simple'} model")
        
        try:
            # Get response
            response = selected_model.invoke(prompt, **kwargs)
            content = response.content if hasattr(response, 'content') else str(response)
            
            # Cache the response
            self.cache[cache_key] = content
            
            return content
            
        except Exception as e:
            print(f"Selected model failed: {e}")
            
            # Try fallback model
            try:
                fallback_model = self.simple_model if is_complex else self.complex_model
                print("Trying fallback model")
                
                response = fallback_model.invoke(prompt, **kwargs)
                content = response.content if hasattr(response, 'content') else str(response)
                
                self.cache[cache_key] = content
                return content
                
            except Exception as fallback_error:
                print(f"Fallback also failed: {fallback_error}")
                return "I'm unable to process your request at the moment."

# Test the smart LLM
smart_llm = SmartLLM()

# Test simple task
simple_response = smart_llm.invoke("What is the capital of France?")
print(f"Simple task response: {simple_response}\n")

# Test complex task
complex_response = smart_llm.invoke("Analyze the impact of artificial intelligence on global economics and society, considering both benefits and potential risks.")
print(f"Complex task response: {complex_response}\n")

# Test caching (should use cached response)
cached_response = smart_llm.invoke("What is the capital of France?")
print(f"Cached response: {cached_response}")
```

## Key Takeaways

1. **Model Selection**: Choose the right model type (completion vs chat) for your use case
2. **Parameter Tuning**: Adjust temperature, max tokens, and other parameters for optimal results
3. **Streaming**: Implement streaming for better user experience with long responses
4. **Error Handling**: Build robust error handling and retry mechanisms
5. **Performance Optimization**: Use caching, token management, and monitoring to optimize performance
6. **Fallback Strategies**: Implement fallback models for reliability

## Next Steps

In the next lesson, we'll explore document loading and processing techniques to work with external data sources.