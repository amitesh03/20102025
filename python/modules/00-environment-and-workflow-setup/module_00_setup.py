#!/usr/bin/env python3
"""
Environment and Workflow Setup — Module 0 teaching script.

Run this file to explore core setup concepts with code and comments.
Sections demonstrate logging, packaging, profiling, pip usage,
arg parsing, pathlib, and type hints.

Usage:
  python modules/00-environment-and-workflow-setup/module_00_setup.py
"""

from __future__ import annotations

import sys
import os
import platform
import subprocess
import time
import timeit
from dataclasses import dataclass
from pathlib import Path
import logging
from typing import Optional, Iterable, List

log = logging.getLogger(__name__)

def setup_logging(level: int = logging.INFO) -> None:
    """Configure root logger for demo scripts."""
    logging.basicConfig(level=level, format='%(levelname)s %(message)s')
    log.info("Logging initialized")

def show_python_info() -> None:
    """Print interpreter and environment basics."""
    print('Python executable:', sys.executable)
    print('Python version   :', platform.python_version())
    print('Platform         :', platform.platform())
    print('Is venv?         :', (hasattr(sys, 'real_prefix') or (sys.prefix != sys.base_prefix)))
    print("sys.prefix       :", sys.prefix)
    print("cwd              :", Path.cwd())

def pip_upgrade() -> None:
    """Demonstrate upgrading packaging tools via pip (dry-run example)."""
    cmd = [sys.executable, "-m", "pip", "install", "--upgrade", "pip", "setuptools", "wheel"]
    print("Would run:", " ".join(cmd))
    # Uncomment to actually run upgrade (ensure venv activated):
    # subprocess.check_call(cmd)

def install_dev_tools() -> None:
    """Show installing developer tools like black/isort/flake8/mypy/pytest."""
    pkgs = ["black", "isort", "flake8", "mypy", "pytest"]
    cmd = [sys.executable, "-m", "pip", "install"] + pkgs
    print("Would run:", " ".join(cmd))
    # Uncomment to install in active environment:
    # subprocess.check_call(cmd)

def write_gitignore() -> None:
    """Create a basic .gitignore if missing."""
    content = """__pycache__/
*.pyc
.pytest_cache/
.mypy_cache/
.venv/
.idea/
.vscode/
dist/
build/
*.egg-info/
.DS_Store
"""
    p = Path(".gitignore")
    if not p.exists():
        p.write_text(content, encoding="utf-8")
        print("Wrote .gitignore")
    else:
        print(".gitignore already exists")

def demo_pathlib() -> None:
    """Pathlib basics for portable filesystem code."""
    root = Path(".").resolve()
    tmp = root / "tmp_demo"
    tmp.mkdir(exist_ok=True)
    f = tmp / "hello.txt"
    f.write_text("hello\n", encoding="utf-8")
    print("Created:", f, "size:", f.stat().st_size)
    print("Children of tmp_demo:", [p.name for p in tmp.iterdir()])

def demo_logging() -> None:
    """Demonstrate structured logging."""
    log.info("Starting job...")
    try:
        for i in range(3):
            log.debug("Step %d", i)
            time.sleep(0.05)
        log.info("Work OK")
    except Exception as e:
        log.exception("Failure: %s", e)

def demo_timeit() -> None:
    """Measure small snippets with timeit."""
    t = timeit.timeit('sum(range(10000))', number=1000)
    print("timeit result:", t)

def heavy_compute(n: int = 300000) -> int:
    """A CPU-heavy function for profiling demos."""
    s = 0
    for i in range(n):
        s += (i * i) % 1009
    return s

def demo_cprofile() -> None:
    """Show how to profile a function with cProfile programmatically."""
    import cProfile, pstats
    pr = cProfile.Profile()
    pr.enable()
    heavy_compute(200000)
    pr.disable()
    ps = pstats.Stats(pr)
    ps.sort_stats("cumtime").print_stats(5)

def safe_mean(xs: Iterable[float]) -> Optional[float]:
    """Return mean of iterable or None for empty input (mypy-friendly)."""
    lst = list(xs)
    return None if not lst else sum(lst) / len(lst)

@dataclass
class Rectangle:
    """Simple dataclass with methods."""
    w: float
    h: float
    def area(self) -> float:
        return self.w * self.h
    def perimeter(self) -> float:
        return 2 * (self.w + self.h)

def demo_argparse(argv: Optional[List[str]] = None) -> None:
    """Parse simple CLI args using argparse."""
    import argparse
    ap = argparse.ArgumentParser(description="Demo argparse usage")
    ap.add_argument("--name", type=str, default="world")
    ap.add_argument("--repeat", type=int, default=1)
    args = ap.parse_args(argv)
    for _ in range(args.repeat):
        print(f"Hello, {args.name}!")

def demo_assertions() -> None:
    """Basic invariants to mimic simple tests."""
    assert safe_mean([]) is None
    assert abs((safe_mean([1.0, 2.0, 3.0]) or 0) - 2.0) < 1e-9
    r = Rectangle(3, 4)
    assert r.area() == 12
    assert r.perimeter() == 14
    print("Assertions passed")

def demo_subprocess_echo() -> None:
    """Cross-platform subprocess usage demo (no external dependencies)."""
    try:
        if os.name == "nt":
            out = subprocess.check_output(["cmd", "/c", "echo", "hello"], text=True)
        else:
            out = subprocess.check_output(["/bin/echo", "hello"], text=True)
        print("subprocess output:", out.strip())
    except Exception as e:
        print("subprocess failed:", e)

def demo_imports() -> None:
    """Explain package layout and imports (comments only)."""
    msg = """
Project layout tip:
  .
  ├─ modules/
  │  ├─ 00-environment-and-workflow-setup/
  │  ├─ 01-core-python-fundamentals/
  │  └─ ...
  ├─ app/
  │  ├─ __init__.py
  │  └─ util.py

Use absolute imports from the top-level package (e.g., from app.util import foo).
Avoid relative imports across unrelated modules.
"""
    print(msg)

def main() -> int:
    setup_logging()
    show_python_info()
    pip_upgrade()
    install_dev_tools()
    write_gitignore()
    demo_pathlib()
    demo_logging()
    demo_timeit()
    demo_cprofile()
    demo_assertions()
    demo_subprocess_echo()
    demo_imports()
    # Demonstrate argparse (pass sample args instead of reading sys.argv)
    demo_argparse(["--name", "Python", "--repeat", "2"])
    print("Done. Explore code comments and adapt for your workflow.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())