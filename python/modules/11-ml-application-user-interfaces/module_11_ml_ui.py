#!/usr/bin/env python3
"""
ML Application User Interfaces — Module 11 teaching script.

This module demonstrates two popular Python UI frameworks for ML apps:
- Streamlit: rapid, script-first dashboards and apps
- Gradio: component-based interfaces that are easy to share

Usage:
  # Gradio (run directly)
  python modules/11-ml-application-user-interfaces/module_11_ml_ui.py --ui gradio

  # Streamlit (must be run via streamlit runner)
  streamlit run modules/11-ml-application-user-interfaces/module_11_ml_ui.py

Dependencies (install as needed):
  pip install streamlit gradio pandas numpy matplotlib

Notes:
- The Streamlit app auto-detects when launched via 'streamlit run' using
  the environment variable STREAMLIT_SERVER_RUNNING.
- The Gradio app runs when you pass --ui gradio to this script directly.
"""

from __future__ import annotations

import argparse
import os
import sys
import time
from dataclasses import dataclass
from typing import List, Tuple, Optional

# Optional imports with graceful fallbacks
try:
    import streamlit as st
except Exception:  # pragma: no cover
    st = None  # type: ignore

try:
    import gradio as gr
except Exception:  # pragma: no cover
    gr = None  # type: ignore

try:
    import pandas as pd
    import numpy as np
except Exception:  # pragma: no cover
    pd = None  # type: ignore
    np = None  # type: ignore


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def info(msg: str) -> None:
    print(msg)


def ensure_deps(*names: str) -> bool:
    ok = True
    for n in names:
        if n == "streamlit" and st is None:
            print("Missing dependency: streamlit (pip install streamlit)")
            ok = False
        if n == "gradio" and gr is None:
            print("Missing dependency: gradio (pip install gradio)")
            ok = False
        if n == "pandas" and pd is None:
            print("Missing dependency: pandas (pip install pandas)")
            ok = False
        if n == "numpy" and np is None:
            print("Missing dependency: numpy (pip install numpy)")
            ok = False
    return ok


# ---------------------------------------------------------------------------
# Streamlit App (runs when executed via: streamlit run this_file.py)
# ---------------------------------------------------------------------------

def _streamlit_cached_compute_stats(df: "pd.DataFrame") -> "pd.DataFrame":
    """
    Compute basic descriptive stats. Decorator injected at runtime to avoid
    import issues when streamlit isn't installed.
    """
    # When not running in Streamlit, just return describe-like output if possible
    return df.describe(include="all").T.fillna("")


def build_streamlit_app() -> None:
    """
    Build a Streamlit UI demonstrating:
      - Sidebar controls, session state
      - File upload and DataFrame display
      - Cached computations (st.cache_data)
      - Simple chart and toy "inference" function
      - Basic auth placeholder
    """
    if st is None:
        info("Streamlit not installed. Install it and run via 'streamlit run ...'")
        return
    if pd is None or np is None:
        st.warning("pandas/numpy not installed; some features will be disabled.")

    # Page config
    st.set_page_config(page_title="Module 11 — ML UI", layout="wide")

    # Sidebar "auth" (very simple placeholder)
    st.sidebar.header("Auth")
    user = st.sidebar.text_input("Username", value="")
    pwd = st.sidebar.text_input("Password", value="", type="password")
    logged_in = bool(user and pwd)

    st.sidebar.header("Settings")
    theme = st.sidebar.selectbox("Theme", ["Light", "Dark"], index=0)
    st.sidebar.checkbox("Enable advanced mode", value=False, key="advanced")

    # Persist session state
    if "visits" not in st.session_state:
        st.session_state.visits = 0
    st.session_state.visits += 1

    st.title("Module 11: Streamlit UI for ML")
    st.write(f"Welcome{(' ' + user) if logged_in else ''}! Visits this session: {st.session_state.visits}")

    # File upload and preview
    st.header("1) Upload CSV and preview")
    uploaded = st.file_uploader("Upload a CSV file", type=["csv"])
    df = None
    if uploaded is not None and pd is not None:
        try:
            df = pd.read_csv(uploaded)
            st.write("Shape:", df.shape)
            st.dataframe(df.head(20), use_container_width=True)
        except Exception as e:
            st.error(f"Failed to read CSV: {e}")

    # Cached computations (activated only when streamlit available)
    if st is not None and pd is not None:
        # Attach cache decorator at runtime (avoids import issues)
        compute_stats = st.cache_data(show_spinner=False)(_streamlit_cached_compute_stats)
    else:
        compute_stats = _streamlit_cached_compute_stats

    st.header("2) Basic statistics")
    if df is not None:
        stats = compute_stats(df)
        st.dataframe(stats, use_container_width=True)
    else:
        st.info("Upload a CSV to view statistics")

    # Simple "inference" toy function
    st.header("3) Toy 'inference' demo")
    st.write("Type a sentence; we'll return a naive sentiment score (toy heuristic).")

    def toy_predict(text: str) -> float:
        text = (text or "").lower()
        pos_words = {"good", "great", "love", "excellent", "awesome", "happy"}
        neg_words = {"bad", "terrible", "hate", "awful", "sad", "angry"}
        score = 0
        for w in text.split():
            if w in pos_words:
                score += 1
            if w in neg_words:
                score -= 1
        # Normalize to [0, 1]
        return max(0.0, min(1.0, 0.5 + 0.25 * score))

    txt = st.text_input("Enter text", "")
    if st.button("Predict sentiment"):
        prob_pos = toy_predict(txt)
        st.success(f"Positive probability: {prob_pos:.2f}")

    # Simple chart
    st.header("4) Chart demo")
    if np is not None:
        steps = int(st.number_input("Steps", min_value=10, max_value=500, value=100, step=10))
        x = np.arange(steps)
        y = np.cumsum(np.random.default_rng(42).normal(size=steps))
        st.line_chart({"y": y})
    else:
        st.info("Install numpy to enable chart demo")

    st.caption("Tip: Use st.session_state and st.cache_data to manage state and performance.")


# ---------------------------------------------------------------------------
# Gradio App (runs when invoked via: python this_file.py --ui gradio)
# ---------------------------------------------------------------------------

def build_gradio_app() -> "gr.Blocks":
    """
    Build a Gradio app with:
      - Text sentiment toy model
      - Batch processing
      - File-based scoring (CSV)
    """
    if gr is None:
        raise RuntimeError("gradio not installed. Install with: pip install gradio")
    if pd is None:
        raise RuntimeError("pandas not installed. Install with: pip install pandas")

    def toy_predict_single(text: str) -> dict:
        text = (text or "").lower()
        pos_words = {"good", "great", "love", "excellent", "awesome", "happy"}
        neg_words = {"bad", "terrible", "hate", "awful", "sad", "angry"}
        score = 0
        for w in text.split():
            if w in pos_words:
                score += 1
            if w in neg_words:
                score -= 1
        prob_pos = max(0.0, min(1.0, 0.5 + 0.25 * score))
        label = "positive" if prob_pos >= 0.5 else "negative"
        return {"label": label, "positive_prob": float(prob_pos)}

    def toy_predict_batch(texts: List[str]) -> List[dict]:
        return [toy_predict_single(t) for t in texts]

    def score_csv(file: "gr.File") -> "pd.DataFrame":
        df = pd.read_csv(file.name)
        if "text" not in df.columns:
            raise ValueError("CSV must contain a 'text' column")
        out = [toy_predict_single(t) for t in df["text"].astype(str).tolist()]
        out_df = pd.DataFrame(out)
        return pd.concat([df.reset_index(drop=True), out_df], axis=1)

    with gr.Blocks(title="Module 11 — Gradio ML UI") as demo:
        gr.Markdown("# Module 11: Gradio ML UI")
        with gr.Tab("Single text"):
            inp = gr.Textbox(label="Input text", placeholder="Type your sentence here...")
            out = gr.JSON(label="Prediction")
            btn = gr.Button("Predict")
            btn.click(fn=toy_predict_single, inputs=inp, outputs=out)

        with gr.Tab("Batch mode"):
            in_multi = gr.Textbox(label="One per line", lines=6, placeholder="Line 1\nLine 2")
            out_multi = gr.JSON(label="Predictions (list)")
            btn_multi = gr.Button("Predict batch")
            btn_multi.click(
                fn=lambda s: toy_predict_batch([t for t in (s or "").splitlines() if t.strip()]),
                inputs=in_multi,
                outputs=out_multi,
            )

        with gr.Tab("CSV scoring"):
            f = gr.File(label="Upload CSV with a 'text' column", file_types=[".csv"])
            out_df = gr.Dataframe(label="Scored results")
            btn_csv = gr.Button("Score CSV")
            btn_csv.click(fn=score_csv, inputs=f, outputs=out_df)

        gr.Markdown(
            "Tips: share=True on .launch() to get a public link. "
            "You can save/load interface configs and integrate with FastAPI for deployment."
        )
    return demo


# ---------------------------------------------------------------------------
# Entrypoints
# ---------------------------------------------------------------------------

def run_streamlit_flow() -> None:
    """
    Entry that either:
      - runs the Streamlit app if STREAMLIT_SERVER_RUNNING is set (via 'streamlit run')
      - prints instructions if not launched via streamlit
    """
    if st is None:
        info("Streamlit not installed. Install with: pip install streamlit")
        return
    if os.environ.get("STREAMLIT_SERVER_RUNNING"):
        build_streamlit_app()
    else:
        info(
            "This script includes a Streamlit app. To run it:\n"
            "  streamlit run modules/11-ml-application-user-interfaces/module_11_ml_ui.py"
        )


def run_gradio_flow() -> None:
    if not ensure_deps("gradio", "pandas"):
        return
    demo = build_gradio_app()
    # Use server_name=0.0.0.0 to access from LAN, and set server_port if needed
    demo.launch(server_name="127.0.0.1", server_port=7860, share=False)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--ui",
        choices=["streamlit", "gradio"],
        default="gradio",
        help="Which UI to run (streamlit must be launched via 'streamlit run').",
    )
    args = ap.parse_args()

    if args.ui == "gradio":
        run_gradio_flow()
    else:
        run_streamlit_flow()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())