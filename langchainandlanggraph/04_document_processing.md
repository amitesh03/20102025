# Document Loading and Processing

## Learning Objectives
By the end of this lesson, you will be able to:
- Load documents from various sources (files, web, databases)
- Process and transform document content
- Implement text splitting strategies
- Extract metadata from documents
- Handle different document formats
- Build document processing pipelines

## Document Loaders

### 1. Text File Loaders

```python
from langchain_community.document_loaders import TextLoader, DirectoryLoader
import os

# Load a single text file
text_loader = TextLoader('./sample.txt')
documents = text_loader.load()
print(f"Loaded {len(documents)} documents")
print(f"Content preview: {documents[0].page_content[:100]}...")

# Load all text files from a directory
directory_loader = DirectoryLoader(
    './documents/',
    glob="**/*.txt",
    loader_cls=TextLoader,
    show_progress=True,
    use_multithreading=True
)

documents = directory_loader.load()
print(f"Loaded {len(documents)} documents from directory")
```

### 2. PDF Document Loader

```python
from langchain_community.document_loaders import PyPDFLoader, OnlinePDFLoader

# Load PDF from local file
pdf_loader = PyPDFLoader("./document.pdf")
pdf_documents = pdf_loader.load()
print(f"Loaded {len(pdf_documents)} pages from PDF")

# Load PDF from URL
online_pdf_loader = OnlinePDFLoader("https://example.com/document.pdf")
online_documents = online_pdf_loader.load()
print(f"Loaded {len(online_documents)} pages from online PDF")

# Extract metadata
for doc in pdf_documents:
    print(f"Page {doc.metadata.get('page', 'Unknown')}: {len(doc.page_content)} characters")
```

### 3. Web Content Loaders

```python
from langchain_community.document_loaders import WebBaseLoader, SeleniumURLLoader
import requests

# Load web pages using WebBaseLoader
web_loader = WebBaseLoader([
    "https://python.langchain.com/docs/get_started/introduction",
    "https://python.langchain.com/docs/modules/data_connection/document_loaders"
])

web_documents = web_loader.load()
print(f"Loaded {len(web_documents)} web pages")

# Load pages requiring JavaScript (using Selenium)
selenium_loader = SeleniumURLLoader(
    urls=["https://example.com/dynamic-content"],
    browser="chrome"
)

selenium_documents = selenium_loader.load()
print(f"Loaded {len(selenium_documents)} dynamic pages")
```

### 4. Specialized Loaders

```python
from langchain_community.document_loaders import (
    CSVLoader,
    JSONLoader,
    UnstructuredMarkdownLoader,
    UnstructuredWordDocumentLoader,
    WikipediaLoader
)

# Load CSV files
csv_loader = CSVLoader(
    file_path="./data.csv",
    csv_args={
        'delimiter': ',',
        'quotechar': '"',
        'fieldnames': ['column1', 'column2', 'column3']
    }
)
csv_documents = csv_loader.load()

# Load JSON files
json_loader = JSONLoader(
    file_path="./data.json",
    jq_schema='.[]',
    text_content=False
)
json_documents = json_loader.load()

# Load Markdown files
md_loader = UnstructuredMarkdownLoader("./document.md")
md_documents = md_loader.load()

# Load Word documents
word_loader = UnstructuredWordDocumentLoader("./document.docx")
word_documents = word_loader.load()

# Load Wikipedia articles
wiki_loader = WikipediaLoader(
    query="Artificial Intelligence",
    load_max_docs=2,
    lang="en"
)
wiki_documents = wiki_loader.load()
```

## Text Splitters

### 1. Character Text Splitter

```python
from langchain_text_splitters import CharacterTextSplitter

# Basic character-based splitting
character_splitter = CharacterTextSplitter(
    separator="\n\n",
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    is_separator_regex=False
)

# Sample text
sample_text = """
LangChain is a framework for developing applications powered by language models.
It enables applications that are context-aware and reason through problems.
With LangChain, you can connect language models to various data sources.

The main components of LangChain include:
1. Models - Interface to various LLMs
2. Prompts - Template management and optimization
3. Chains - Sequences of calls to components
4. Agents - Systems that use LLMs to decide actions
5. Memory - Persistence of state between calls

Each component can be used independently or combined to create complex applications.
"""

chunks = character_splitter.split_text(sample_text)
print(f"Split into {len(chunks)} chunks")
for i, chunk in enumerate(chunks):
    print(f"Chunk {i+1}: {len(chunk)} characters")
```

### 2. Recursive Character Text Splitter

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Recursive splitting with multiple separators
recursive_splitter = RecursiveCharacterTextSplitter(
    separators=["\n\n", "\n", " ", ""],
    chunk_size=500,
    chunk_overlap=50,
    length_function=len,
    is_separator_regex=False
)

recursive_chunks = recursive_splitter.split_text(sample_text)
print(f"Recursive split into {len(recursive_chunks)} chunks")
for i, chunk in enumerate(recursive_chunks):
    print(f"Chunk {i+1}: {len(chunk)} characters")
```

### 3. Token-based Splitter

```python
from langchain_text_splitters import TokenTextSplitter

# Token-based splitting (more accurate for LLMs)
token_splitter = TokenTextSplitter(
    chunk_size=100,
    chunk_overlap=20,
    encoding_name="cl100k_base"  # OpenAI's encoding
)

token_chunks = token_splitter.split_text(sample_text)
print(f"Token split into {len(token_chunks)} chunks")
for i, chunk in enumerate(token_chunks):
    print(f"Chunk {i+1}: {len(chunk)} characters")
```

### 4. Semantic Splitter

```python
from langchain_text_splitters import SemanticChunker
from langchain_openai import OpenAIEmbeddings

# Semantic splitting based on content similarity
embeddings = OpenAIEmbeddings()
semantic_splitter = SemanticChunker(
    embeddings=embeddings,
    breakpoint_threshold_type="percentile",
    breakpoint_threshold_amount=85
)

semantic_chunks = semantic_splitter.create_documents([sample_text])
print(f"Semantic split into {len(semantic_chunks)} chunks")
for i, chunk in enumerate(semantic_chunks):
    print(f"Chunk {i+1}: {len(chunk.page_content)} characters")
```

## Document Transformers

### 1. Text Cleaning and Preprocessing

```python
import re
from typing import List
from langchain_core.documents import Document

class DocumentCleaner:
    def __init__(self):
        self.patterns = {
            'extra_whitespace': r'\s+',
            'special_chars': r'[^\w\s\.\,\!\?\;\:\-\'\"]',
            'urls': r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+',
            'emails': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        }
    
    def clean_text(self, text: str) -> str:
        """Clean text by removing unwanted patterns"""
        # Remove URLs
        text = re.sub(self.patterns['urls'], '', text)
        
        # Remove emails
        text = re.sub(self.patterns['emails'], '', text)
        
        # Remove extra whitespace
        text = re.sub(self.patterns['extra_whitespace'], ' ', text)
        
        # Normalize whitespace
        text = ' '.join(text.split())
        
        return text.strip()
    
    def transform_documents(self, documents: List[Document]) -> List[Document]:
        """Transform a list of documents"""
        cleaned_docs = []
        for doc in documents:
            cleaned_content = self.clean_text(doc.page_content)
            cleaned_doc = Document(
                page_content=cleaned_content,
                metadata=doc.metadata
            )
            cleaned_docs.append(cleaned_doc)
        
        return cleaned_docs

# Use the document cleaner
cleaner = DocumentCleaner()
documents = [Document(page_content=sample_text, metadata={"source": "sample"})]
cleaned_documents = cleaner.transform_documents(documents)

print(f"Original: {len(documents[0].page_content)} characters")
print(f"Cleaned: {len(cleaned_documents[0].page_content)} characters")
```

### 2. Metadata Extraction

```python
import hashlib
from datetime import datetime
from typing import Dict, Any

class MetadataExtractor:
    def __init__(self):
        pass
    
    def extract_basic_metadata(self, document: Document) -> Dict[str, Any]:
        """Extract basic metadata from document"""
        content = document.page_content
        
        return {
            'character_count': len(content),
            'word_count': len(content.split()),
            'sentence_count': len(re.split(r'[.!?]+', content)),
            'paragraph_count': len(content.split('\n\n')),
            'content_hash': hashlib.md5(content.encode()).hexdigest(),
            'extraction_timestamp': datetime.now().isoformat()
        }
    
    def extract_keywords(self, document: Document, top_k: int = 10) -> List[str]:
        """Extract keywords from document (simple frequency-based)"""
        content = document.page_content.lower()
        words = re.findall(r'\b[a-zA-Z]{3,}\b', content)
        
        # Filter out common stop words
        stop_words = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'its', 'did', 'yes', 'she', 'may', 'say'}
        
        filtered_words = [word for word in words if word not in stop_words]
        
        # Count word frequencies
        word_freq = {}
        for word in filtered_words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        # Get top keywords
        top_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:top_k]
        
        return [keyword for keyword, count in top_keywords]
    
    def enhance_document(self, document: Document) -> Document:
        """Enhance document with extracted metadata"""
        basic_metadata = self.extract_basic_metadata(document)
        keywords = self.extract_keywords(document)
        
        # Merge existing metadata with new metadata
        enhanced_metadata = {
            **document.metadata,
            **basic_metadata,
            'keywords': keywords
        }
        
        return Document(
            page_content=document.page_content,
            metadata=enhanced_metadata
        )

# Use metadata extractor
extractor = MetadataExtractor()
enhanced_document = extractor.enhance_document(documents[0])

print("Enhanced Metadata:")
for key, value in enhanced_document.metadata.items():
    print(f"{key}: {value}")
```

## Document Processing Pipeline

### 1. Building a Complete Pipeline

```python
from langchain_core.documents import Document
from typing import List, Callable

class DocumentProcessingPipeline:
    def __init__(self):
        self.steps = []
    
    def add_step(self, step: Callable, step_name: str = None):
        """Add a processing step to the pipeline"""
        self.steps.append({
            'name': step_name or step.__name__,
            'function': step
        })
    
    def process(self, documents: List[Document]) -> List[Document]:
        """Process documents through all pipeline steps"""
        processed_docs = documents
        
        for step in self.steps:
            print(f"Applying step: {step['name']}")
            processed_docs = step['function'](processed_docs)
            print(f"  Output: {len(processed_docs)} documents")
        
        return processed_docs

# Create processing functions
def load_documents(file_paths: List[str]) -> List[Document]:
    """Load documents from file paths"""
    documents = []
    for file_path in file_paths:
        loader = TextLoader(file_path)
        documents.extend(loader.load())
    return documents

def clean_documents(documents: List[Document]) -> List[Document]:
    """Clean document content"""
    cleaner = DocumentCleaner()
    return cleaner.transform_documents(documents)

def split_documents(documents: List[Document]) -> List[Document]:
    """Split documents into chunks"""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    return splitter.split_documents(documents)

def enhance_metadata(documents: List[Document]) -> List[Document]:
    """Enhance document metadata"""
    extractor = MetadataExtractor()
    return [extractor.enhance_document(doc) for doc in documents]

# Build and run the pipeline
pipeline = DocumentProcessingPipeline()
pipeline.add_step(lambda docs: docs, "Initial documents")
pipeline.add_step(clean_documents, "Clean documents")
pipeline.add_step(split_documents, "Split documents")
pipeline.add_step(enhance_metadata, "Enhance metadata")

# Create sample documents for testing
sample_docs = [
    Document(page_content=sample_text, metadata={"source": "sample1.txt"}),
    Document(page_content="This is another sample document for testing the pipeline.", metadata={"source": "sample2.txt"})
]

processed_docs = pipeline.process(sample_docs)
print(f"\nFinal output: {len(processed_docs)} processed documents")
```

### 2. Custom Document Loaders

```python
from langchain_core.document_loaders import BaseLoader
from typing import Iterator, List, Optional

class CustomAPILoader(BaseLoader):
    """Custom loader for API data"""
    
    def __init__(self, api_url: str, params: dict = None):
        self.api_url = api_url
        self.params = params or {}
    
    def lazy_load(self) -> Iterator[Document]:
        """Lazy load documents from API"""
        try:
            response = requests.get(self.api_url, params=self.params)
            response.raise_for_status()
            
            data = response.json()
            
            # Assuming API returns a list of items with 'content' and 'id' fields
            for item in data:
                content = item.get('content', '')
                metadata = {
                    'source': self.api_url,
                    'id': item.get('id'),
                    'created_at': item.get('created_at'),
                    'author': item.get('author')
                }
                
                yield Document(page_content=content, metadata=metadata)
                
        except Exception as e:
            print(f"Error loading from API: {e}")
    
    def load(self) -> List[Document]:
        """Load all documents from API"""
        return list(self.lazy_load())

# Example usage (with a mock API)
# api_loader = CustomAPILoader("https://api.example.com/documents")
# api_documents = api_loader.load()
```

## Advanced Document Processing

### 1. Multi-format Document Processing

```python
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    UnstructuredWordDocumentLoader,
    UnstructuredMarkdownLoader
)
import os
from pathlib import Path

class MultiFormatProcessor:
    def __init__(self):
        self.loaders = {
            '.txt': TextLoader,
            '.pdf': PyPDFLoader,
            '.docx': UnstructuredWordDocumentLoader,
            '.md': UnstructuredMarkdownLoader
        }
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
    
    def process_directory(self, directory_path: str) -> List[Document]:
        """Process all supported documents in a directory"""
        documents = []
        
        for file_path in Path(directory_path).rglob('*'):
            if file_path.is_file():
                file_ext = file_path.suffix.lower()
                
                if file_ext in self.loaders:
                    try:
                        loader = self.loaders[file_ext](str(file_path))
                        file_docs = loader.load()
                        
                        # Add file metadata
                        for doc in file_docs:
                            doc.metadata.update({
                                'file_path': str(file_path),
                                'file_name': file_path.name,
                                'file_type': file_ext,
                                'file_size': file_path.stat().st_size
                            })
                        
                        documents.extend(file_docs)
                        print(f"Processed: {file_path}")
                        
                    except Exception as e:
                        print(f"Error processing {file_path}: {e}")
        
        # Split all documents
        if documents:
            documents = self.splitter.split_documents(documents)
        
        return documents

# Use the multi-format processor
# processor = MultiFormatProcessor()
# all_documents = processor.process_directory("./documents/")
# print(f"Processed {len(all_documents)} document chunks")
```

### 2. Document Similarity Analysis

```python
from langchain_openai import OpenAIEmbeddings
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class DocumentAnalyzer:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
    
    def compute_embeddings(self, documents: List[Document]) -> np.ndarray:
        """Compute embeddings for all documents"""
        texts = [doc.page_content for doc in documents]
        return self.embeddings.embed_documents(texts)
    
    def find_similar_documents(self, 
                             query: str, 
                             documents: List[Document], 
                             top_k: int = 5) -> List[tuple]:
        """Find documents similar to a query"""
        # Compute query embedding
        query_embedding = self.embeddings.embed_query(query)
        
        # Compute document embeddings
        doc_embeddings = self.compute_embeddings(documents)
        
        # Calculate similarities
        similarities = cosine_similarity([query_embedding], doc_embeddings)[0]
        
        # Get top similar documents
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            results.append((documents[idx], similarities[idx]))
        
        return results
    
    def cluster_documents(self, documents: List[Document], n_clusters: int = 5):
        """Cluster documents by similarity"""
        from sklearn.cluster import KMeans
        
        # Compute embeddings
        embeddings = self.compute_embeddings(documents)
        
        # Perform clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(embeddings)
        
        # Group documents by cluster
        clusters = {}
        for doc, label in zip(documents, cluster_labels):
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(doc)
        
        return clusters

# Use document analyzer
# analyzer = DocumentAnalyzer()
# similar_docs = analyzer.find_similar_documents("machine learning", documents)
# for doc, similarity in similar_docs:
#     print(f"Similarity: {similarity:.3f}, Content: {doc.page_content[:50]}...")
```

## Exercise: Build a Document Q&A System

Create a system that:
1. Loads documents from multiple sources
2. Processes and chunks them appropriately
3. Builds a simple retrieval mechanism
4. Answers questions based on the document content

```python
# TODO: Implement a document Q&A system
# 1. Load documents from different sources
# 2. Process and chunk the documents
# 3. Implement a simple retrieval mechanism
# 4. Create a Q&A chain that uses retrieved documents

# Your implementation here:

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.chains import LLMChain
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class DocumentQASystem:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.llm = ChatOpenAI(model="gpt-3.5-turbo")
        self.documents = []
        self.document_embeddings = None
    
    def load_documents(self, file_paths: List[str]) -> None:
        """Load documents from file paths"""
        self.documents = []
        
        for file_path in file_paths:
            try:
                if file_path.endswith('.txt'):
                    loader = TextLoader(file_path)
                elif file_path.endswith('.pdf'):
                    loader = PyPDFLoader(file_path)
                else:
                    continue
                
                docs = loader.load()
                self.documents.extend(docs)
                print(f"Loaded: {file_path}")
                
            except Exception as e:
                print(f"Error loading {file_path}: {e}")
    
    def process_documents(self, chunk_size: int = 1000, chunk_overlap: int = 200) -> None:
        """Process and split documents"""
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        
        self.documents = splitter.split_documents(self.documents)
        
        # Compute embeddings
        texts = [doc.page_content for doc in self.documents]
        self.document_embeddings = self.embeddings.embed_documents(texts)
        
        print(f"Processed {len(self.documents)} document chunks")
    
    def retrieve_documents(self, query: str, top_k: int = 3) -> List[Document]:
        """Retrieve most relevant documents for a query"""
        if not self.documents:
            return []
        
        # Compute query embedding
        query_embedding = self.embeddings.embed_query(query)
        
        # Calculate similarities
        similarities = cosine_similarity([query_embedding], self.document_embeddings)[0]
        
        # Get top documents
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        return [self.documents[i] for i in top_indices]
    
    def answer_question(self, question: str) -> str:
        """Answer a question based on retrieved documents"""
        # Retrieve relevant documents
        relevant_docs = self.retrieve_documents(question)
        
        if not relevant_docs:
            return "I don't have relevant information to answer that question."
        
        # Create context from retrieved documents
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        
        # Create prompt
        prompt_template = PromptTemplate(
            template="""Based on the following context, answer the question.
            
            Context:
            {context}
            
            Question: {question}
            
            Answer:""",
            input_variables=["context", "question"]
        )
        
        # Create chain
        chain = LLMChain(llm=self.llm, prompt=prompt_template)
        
        # Generate answer
        answer = chain.run(context=context, question=question)
        
        return answer

# Test the document Q&A system
# qa_system = DocumentQASystem()

# Load sample documents (create sample files first)
# with open("sample1.txt", "w") as f:
#     f.write("LangChain is a framework for building applications with language models. It provides tools for chaining prompts, managing memory, and working with external data.")
# 
# with open("sample2.txt", "w") as f:
#     f.write("Document processing involves loading, cleaning, and transforming text data. Text splitting is important for handling long documents in LLM applications.")

# qa_system.load_documents(["sample1.txt", "sample2.txt"])
# qa_system.process_documents()

# Test questions
# questions = [
#     "What is LangChain?",
#     "Why is text splitting important?",
#     "How do you work with external data?"
# ]

# for question in questions:
#     answer = qa_system.answer_question(question)
#     print(f"Q: {question}")
#     print(f"A: {answer}\n")
```

## Key Takeaways

1. **Document Loaders**: LangChain provides loaders for various file formats and data sources
2. **Text Splitters**: Choose appropriate splitting strategies based on your content and use case
3. **Document Transformers**: Clean and enhance documents before processing
4. **Processing Pipelines**: Build reusable workflows for document processing
5. **Metadata Extraction**: Extract meaningful metadata to improve document organization
6. **Custom Loaders**: Create custom loaders for specialized data sources

## Next Steps

In the next lesson, we'll explore memory systems to maintain context and state across interactions.