#!/usr/bin/env python3
"""
Scientific and Systems Foundations — Module 2 teaching script.

This script demonstrates:
- Python memory model: reference counting, cycles, gc
- Weak references
- Measuring memory with tracemalloc
- __slots__ for memory-efficient classes
- IO-bound concurrency with ThreadPoolExecutor
- CPU-bound parallelism with ProcessPoolExecutor
- Shared memory via multiprocessing.shared_memory + NumPy
- Profiling with timeit and cProfile
- Optimization strategies and caching

Run:
  python modules/02-scientific-and-systems-foundations/module_02_foundations.py
"""

from __future__ import annotations

import sys
import os
import gc
import time
import math
import tracemalloc
import logging
import weakref
from dataclasses import dataclass
from typing import Optional, Iterable, List, Tuple

# Optional NumPy import (some demos require it)
try:
    import numpy as np
except Exception as e:  # pragma: no cover
    np = None  # type: ignore

# Concurrency imports
import concurrent.futures as cf

log = logging.getLogger(__name__)


def setup_logging(level: int = logging.INFO) -> None:
    """Configure logging for the script."""
    logging.basicConfig(level=level, format="%(levelname)s %(message)s")
    log.info("Logging initialized")


def show_python_env() -> None:
    """Display interpreter and environment basics."""
    print("Python:", sys.version.split()[0], "executable:", sys.executable)
    print("Platform:", os.name, "venv:", sys.prefix != getattr(sys, "base_prefix", sys.prefix))


def memory_model_demo() -> None:
    """Demonstrate refcounts, cycles, and gc."""
    print("\n=== Memory model: refcounts and cycles ===")
    a: List[int] = []
    b = a
    # sys.getrefcount adds a temporary reference during the call
    print("refcount(a) (includes temp):", sys.getrefcount(a))

    # Create a cycle; gc handles cycles
    a.append(a)
    print("Created a cycle; gc enabled:", gc.isenabled())
    # Force a gc collection (normally not necessary)
    unreachable = gc.collect()
    print("gc.collect() reclaimed objects:", unreachable)


def weakref_demo() -> None:
    """Demonstrate weakref proxies to avoid strong refs."""
    print("\n=== Weak references ===")

    class Node:
        def __init__(self, name: str):
            self.name = name
            self.child: Optional[weakref.ProxyType["Node"]] = None

    n1 = Node("root")
    # weakref proxy does not increase strong reference count
    n1.child = weakref.proxy(n1)
    print("proxy child name:", n1.child.name)  # type: ignore[attr-defined]


def tracemalloc_demo() -> None:
    """Measure memory allocations and compare snapshots."""
    print("\n=== tracemalloc: top allocators ===")
    tracemalloc.start()
    data1 = [bytes(1024) for _ in range(500)]  # ~512 KB
    snap1 = tracemalloc.take_snapshot()
    top1 = snap1.statistics("lineno")[:3]
    for stat in top1:
        print(stat)

    data2 = [bytes(2048) for _ in range(500)]  # ~1 MB
    snap2 = tracemalloc.take_snapshot()
    print("\nCompare snap2 to snap1:")
    for stat in snap2.compare_to(snap1, "lineno")[:3]:
        print(stat)


def slots_demo() -> None:
    """Demonstrate __slots__ to reduce per-instance overhead."""
    print("\n=== __slots__ vs plain instances ===")

    class Plain:
        def __init__(self, x, y):
            self.x = x
            self.y = y

    class Slotted:
        __slots__ = ("x", "y")

        def __init__(self, x, y):
            self.x = x
            self.y = y

    p = Plain(1, 2)
    s = Slotted(1, 2)
    print("Plain has __dict__:", hasattr(p, "__dict__"))
    print("Slotted has __dict__:", hasattr(s, "__dict__"))

    # Approximate size difference (object + dict for Plain)
    print("Plain size approx:", sys.getsizeof(p) + sys.getsizeof(p.__dict__))
    print("Slotted size:", sys.getsizeof(s))


def io_bound_thread_demo() -> None:
    """Simulate IO-bound workload with threads."""
    print("\n=== ThreadPoolExecutor (IO-bound) ===")

    def fake_io_task(ms: int) -> Tuple[int, float]:
        # Simulate network/disk IO via sleep
        t0 = time.perf_counter()
        time.sleep(ms / 1000.0)
        return (ms, time.perf_counter() - t0)

    delays = [300, 300, 300, 300]
    t0 = time.perf_counter()
    with cf.ThreadPoolExecutor(max_workers=4) as tp:
        results = list(tp.map(fake_io_task, delays))
    t_total = time.perf_counter() - t0
    print("Per-task:", results)
    print("Wall time (parallel):", f"{t_total:.3f}s")


def is_prime(n: int) -> bool:
    """Primality test for CPU-bound demo."""
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    r = int(math.sqrt(n))
    f = 3
    while f <= r:
        if n % f == 0:
            return False
        f += 2
    return True


def cpu_bound_process_demo() -> None:
    """Accelerate CPU-bound tasks with processes."""
    print("\n=== ProcessPoolExecutor (CPU-bound) ===")
    nums = list(range(10_000, 10_200))
    t0 = time.perf_counter()
    with cf.ProcessPoolExecutor() as pp:
        res = list(pp.map(is_prime, nums))
    dt = time.perf_counter() - t0
    print("Primes found:", sum(res), "time:", f"{dt:.3f}s")


def shared_memory_demo() -> None:
    """Share large array buffers across processes."""
    print("\n=== Shared memory with NumPy ===")
    if np is None:
        print("NumPy not available; skipping shared memory demo.")
        return
    from multiprocessing import shared_memory

    a = np.arange(10, dtype=np.int64)
    shm = shared_memory.SharedMemory(create=True, size=a.nbytes)
    try:
        b = np.ndarray(a.shape, dtype=a.dtype, buffer=shm.buf)
        b[:] = a[:]
        print("b sum:", b.sum())
    finally:
        shm.close()
        shm.unlink()


def timeit_numpy_demo() -> None:
    """Compare Python loops vs NumPy vectorization."""
    print("\n=== timeit: Python vs NumPy ===")
    n = 100_000
    py = timeit_python(n)
    npv = timeit_numpy(n) if np is not None else None
    print("Python loops:", f"{py:.4f}s")
    if npv is not None:
        print("NumPy vectorized:", f"{npv:.4f}s")
    else:
        print("NumPy not available.")


def timeit_python(n: int) -> float:
    """Time sum of squares using Python loops."""
    t0 = time.perf_counter()
    _ = sum(i * i for i in range(n))
    return time.perf_counter() - t0


def timeit_numpy(n: int) -> float:
    """Time sum of squares using NumPy vectorization."""
    t0 = time.perf_counter()
    arr = np.arange(n)  # type: ignore[name-defined]
    _ = np.sum(arr * arr)  # type: ignore[name-defined]
    return time.perf_counter() - t0


def cprofile_demo() -> None:
    """Profile a heavy function with cProfile."""
    print("\n=== cProfile demo ===")

    def heavy_compute(n: int = 300_000) -> int:
        s = 0
        for i in range(n):
            s += (i * i) % 1009
        return s

    import cProfile
    import pstats

    pr = cProfile.Profile()
    pr.enable()
    heavy_compute(200_000)
    pr.disable()
    ps = pstats.Stats(pr)
    ps.sort_stats("cumtime").print_stats(7)


def optimization_strategies() -> None:
    """Print practical optimization tips."""
    print("\n=== Optimization strategies ===")
    tips = [
        "Prefer algorithmic improvements over micro-optimizations.",
        "Use vectorized operations (NumPy/Pandas) instead of Python loops.",
        "Cache pure functions with functools.lru_cache.",
        "Minimize object churn; reuse buffers; avoid unnecessary conversions.",
        "Choose proper dtypes (float32 vs float64) to reduce memory when acceptable.",
        "For IO-bound tasks: use async/threading; for CPU-bound: use multiprocessing/native extensions.",
    ]
    for t in tips:
        print("-", t)


def lru_cache_demo() -> None:
    """Demonstrate caching for expensive pure functions."""
    print("\n=== lru_cache demo ===")
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def fib(n: int) -> int:
        return n if n < 2 else fib(n - 1) + fib(n - 2)

    print([fib(i) for i in range(20)])


def main() -> int:
    setup_logging()
    show_python_env()
    memory_model_demo()
    weakref_demo()
    tracemalloc_demo()
    slots_demo()
    io_bound_thread_demo()
    cpu_bound_process_demo()
    shared_memory_demo()
    timeit_numpy_demo()
    cprofile_demo()
    optimization_strategies()
    lru_cache_demo()
    print("\nModule 2 complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())