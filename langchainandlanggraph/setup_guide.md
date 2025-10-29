# LangChain and LangGraph Development Environment Setup

## Prerequisites
- Python 3.9 or higher
- pip or conda package manager
- Git for version control
- OpenAI API key (for some examples)

## Installation Steps

### 1. Create a Virtual Environment
```bash
# Using venv
python -m venv langchain_env
source langchain_env/bin/activate  # On Windows: langchain_env\Scripts\activate

# Or using conda
conda create -n langchain_env python=3.9
conda activate langchain_env
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Up Environment Variables
Create a `.env` file in your project root with the following:

```
# OpenAI API Key (required for OpenAI models)
OPENAI_API_KEY=your_openai_api_key_here

# Hugging Face Token (required for some models)
HUGGINGFACEHUB_API_TOKEN=your_huggingface_token_here

# Optional: Other API keys as needed
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 4. Verify Installation
Run the following Python code to verify your installation:

```python
import langchain
import langchain_core
import langchain_openai
import langchain_huggingface
import langchain_community
import langgraph

print("All packages installed successfully!")
print(f"LangChain version: {langchain.__version__}")
print(f"LangGraph version: {langgraph.__version__}")
```

## IDE Setup

### VS Code Extensions
- Python
- Jupyter
- Pylance
- Python Docstring Generator

### Jupyter Notebook Setup
```bash
# Install Jupyter extensions
jupyter nbextension enable --py widgetsnbextension
```

## Common Issues and Solutions

1. **Import Error**: Ensure you've activated your virtual environment
2. **API Key Errors**: Double-check your `.env` file and API key validity
3. **Memory Issues**: Some models require significant RAM - consider using smaller models for testing

## Next Steps
Once your environment is set up, you can proceed with the first module: LangChain fundamentals.