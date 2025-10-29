#!/usr/bin/env python3
"""
LLMs and Transformers — Module 7 teaching script.

This script teaches:
- Hugging Face Transformers basics (pipelines, tokenization, forward pass)
- Text generation with causal LMs
- Optional tiny fine-tuning flow with Trainer (safe, small example)
- Embeddings and simple vector similarity search (cosine)
- OpenAI SDK usage for chat and embeddings with robust error handling

Run:
  python modules/07-llms-and-transformers/module_07_llms_transformers.py

Notes:
- First run will download pretrained weights (cached under ~/.cache/huggingface or HF_HOME)
- GPU usage is automatic if torch with CUDA is installed and configured; otherwise CPU
- OpenAI examples require environment variable OPENAI_API_KEY set
"""

from __future__ import annotations

import os
import sys
import time
import math
from typing import List, Tuple, Optional

import numpy as np

# ---------- Utilities ----------

def section(title: str) -> None:
    print("\n=== " + title + " ===")


def have_torch_cuda() -> bool:
    try:
        import torch  # noqa: F401
        import torch.cuda as cuda
        return bool(cuda.is_available())
    except Exception:
        return False


# ---------- HF Pipelines ----------

def hf_pipelines_demo() -> None:
    section("Hugging Face pipelines: sentiment, text-generation, zero-shot")
    try:
        from transformers import pipeline
    except Exception as e:
        print("Transformers not installed. Install: pip install transformers accelerate torch --upgrade")
        print("Error:", e)
        return

    device = 0 if have_torch_cuda() else -1  # -1 = CPU
    print("Using device:", "CUDA:0" if device == 0 else "CPU")

    # Sentiment analysis (English)
    try:
        clf = pipeline("sentiment-analysis", device=device)
        print(clf("I love building ML applications with Python!"))
        print(clf("This is the worst deployment experience ever."))
    except Exception as e:
        print("Sentiment pipeline error:", e)

    # Text generation (small model; keep max_new_tokens low)
    try:
        gen = pipeline("text-generation", model="distilgpt2", device=device)
        out = gen("The future of AI in education is", max_new_tokens=40, do_sample=True, temperature=0.9)
        print(out[0]["generated_text"])
    except Exception as e:
        print("Generation pipeline error:", e)

    # Zero-shot classification
    try:
        zsc = pipeline("zero-shot-classification", device=device)
        res = zsc(
            "Build a UI to interact with ML models.",
            candidate_labels=["devops", "machine learning", "frontend", "security"],
        )
        print(res)
    except Exception as e:
        print("Zero-shot pipeline error:", e)


# ---------- Tokenization and forward pass ----------

def tokenizer_forward_demo() -> None:
    section("Tokenizer + model forward pass (sequence classification)")
    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        import torch
    except Exception as e:
        print("Transformers/torch not installed:", e)
        return

    model_id = "distilbert-base-uncased-finetuned-sst-2-english"
    tok = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForSequenceClassification.from_pretrained(model_id)

    text = "I really enjoy writing Python for AI!"
    enc = tok(text, return_tensors="pt")
    with torch.no_grad():
        logits = model(**enc).logits
        probs = torch.softmax(logits, dim=-1).numpy().squeeze()
    labels = ["NEG", "POS"]
    print("text:", text)
    print("probs:", {labels[i]: float(p) for i, p in enumerate(probs)})


# ---------- Causal LM generation ----------

def causal_lm_generation_demo() -> None:
    section("Causal LM generation (AutoModelForCausalLM)")
    try:
        from transformers import AutoTokenizer, AutoModelForCausalLM
        import torch
    except Exception as e:
        print("Transformers/torch not installed:", e)
        return

    model_id = "distilgpt2"  # small GPT-2 variant
    tok = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(model_id)

    prompt = "In 2030, AI developers will"
    inputs = tok(prompt, return_tensors="pt")
    with torch.no_grad():
        gen_ids = model.generate(
            **inputs,
            max_length=min(60, model.config.n_positions if hasattr(model.config, "n_positions") else 60),
            do_sample=True,
            temperature=0.9,
            top_p=0.95,
        )
    out = tok.decode(gen_ids[0], skip_special_tokens=True)
    print(out)


# ---------- Optional tiny fine-tuning with Trainer ----------

def tiny_trainer_demo(do_train: bool = False) -> None:
    section("Tiny fine-tuning with Trainer (optional)")
    if not do_train:
        print("Skipping training by default to save time/resources. Pass do_train=True to enable.")
        return

    try:
        from transformers import (
            AutoTokenizer,
            AutoModelForSequenceClassification,
            TrainingArguments,
            Trainer,
        )
        from datasets import Dataset
        import torch
    except Exception as e:
        print("Install required packages first: pip install transformers datasets accelerate torch --upgrade")
        print("Error:", e)
        return

    # Tiny synthetic dataset (binary sentiment-ish)
    texts = [
        "I love this product",
        "Terrible experience",
        "Absolutely fantastic outcome",
        "I hate waiting for responses",
        "The UI is great",
        "This is bad",
        "Wonderful!",
        "Not good at all",
    ]
    labels = [1, 0, 1, 0, 1, 0, 1, 0]
    ds = Dataset.from_dict({"text": texts, "label": labels}).train_test_split(test_size=0.25, seed=42)

    model_id = "distilbert-base-uncased"
    tok = AutoTokenizer.from_pretrained(model_id)
    def tokenize(batch):
        return tok(batch["text"], truncation=True, padding="max_length", max_length=64)
    ds_tok = ds.map(tokenize, batched=True)
    ds_tok = ds_tok.remove_columns(["text"])
    ds_tok = ds_tok.rename_column("label", "labels")
    ds_tok.set_format(type="torch")

    model = AutoModelForSequenceClassification.from_pretrained(model_id, num_labels=2)
    args = TrainingArguments(
        output_dir="hf_tiny_out",
        evaluation_strategy="epoch",
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        num_train_epochs=1,
        weight_decay=0.01,
        logging_steps=5,
        save_strategy="no",
        report_to="none",
    )

    trainer = Trainer(model=model, args=args, train_dataset=ds_tok["train"], eval_dataset=ds_tok["test"])
    trainer.train()
    metrics = trainer.evaluate()
    print("eval metrics:", metrics)


# ---------- Embeddings with mean-pooled Transformer ----------

def mean_pooling_embeddings_demo() -> None:
    section("Embeddings with mean pooling (HF AutoModel)")
    try:
        from transformers import AutoTokenizer, AutoModel
        import torch
    except Exception as e:
        print("Transformers/torch not installed:", e)
        return

    # Small encoder; alternatives: 'intfloat/e5-small-v2', 'sentence-transformers/all-MiniLM-L6-v2'
    model_id = "sentence-transformers/all-MiniLM-L6-v2"
    tok = AutoTokenizer.from_pretrained(model_id)
    model = AutoModel.from_pretrained(model_id)

    def embed(texts: List[str]) -> np.ndarray:
        enc = tok(texts, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            out = model(**enc)
            last = out.last_hidden_state  # [B, T, H]
            mask = enc["attention_mask"].unsqueeze(-1).expand(last.size()).float()  # [B, T, H]
            summed = (last * mask).sum(dim=1)  # [B, H]
            counts = mask.sum(dim=1).clamp(min=1e-9)  # [B, H] reduced to [B, 1] due to broadcast
            emb = summed / counts  # mean pooling
        return emb.cpu().numpy()

    docs = [
        "Build a Gradio UI for an image classifier",
        "Implement a FastAPI backend for model serving",
        "Train a scikit-learn pipeline for tabular data",
        "Optimize PyTorch training loops with AMP",
    ]
    vecs = embed(docs)

    q = "Serve ML models via HTTP"
    qv = embed([q])[0]

    # Cosine similarity
    def cos(a: np.ndarray, b: np.ndarray) -> float:
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-12))

    sims = [cos(qv, v) for v in vecs]
    top_idx = int(np.argmax(sims))
    print("query:", q)
    print("top match:", docs[top_idx], "score:", sims[top_idx])


# ---------- OpenAI SDK: chat + embeddings (with backoff) ----------

def _sleep_backoff(retry: int) -> None:
    delay = min(2 ** retry, 30)
    time.sleep(delay)


def openai_sdk_demo() -> None:
    section("OpenAI SDK: chat + embeddings with backoff")
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not set; skipping OpenAI demo.")
        return

    try:
        # Modern OpenAI SDK (>=1.0)
        from openai import OpenAI
    except Exception as e:
        print("OpenAI SDK not installed (pip install openai). Error:", e)
        return

    client = OpenAI(api_key=api_key)

    # Chat completion (fallback-safe across minor API changes)
    def chat_once(prompt: str) -> Optional[str]:
        for attempt in range(5):
            try:
                # Prefer lightweight, cost-effective model name; change as needed
                resp = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a helpful Python tutor."},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.3,
                )
                return resp.choices[0].message.content  # type: ignore[attr-defined]
            except Exception as e:
                print(f"chat error attempt {attempt+1}:", e)
                _sleep_backoff(attempt)
        return None

    msg = chat_once("Explain Python decorators in one short paragraph.")
    print("chat:", (msg or "no response"))

    # Embeddings
    def embed_texts(texts: List[str]) -> Optional[np.ndarray]:
        for attempt in range(5):
            try:
                r = client.embeddings.create(model="text-embedding-3-small", input=texts)
                # r.data is a list with .embedding vectors
                vecs = np.array([np.array(d.embedding, dtype=np.float32) for d in r.data])
                return vecs
            except Exception as e:
                print(f"embedding error attempt {attempt+1}:", e)
                _sleep_backoff(attempt)
        return None

    vecs = embed_texts(["FastAPI for serving models", "Streamlit for ML UI", "scikit-learn pipelines"])
    if vecs is not None:
        print("embeddings shape:", vecs.shape)


# ---------- Main ----------

def main() -> int:
    hf_pipelines_demo()
    tokenizer_forward_demo()
    causal_lm_generation_demo()
    tiny_trainer_demo(do_train=False)  # set True to run tiny training
    mean_pooling_embeddings_demo()
    openai_sdk_demo()
    print("\nModule 7 complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())