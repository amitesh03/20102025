#!/usr/bin/env python3
"""
Asynchronous IO and Concurrency — Module 10 teaching script.

This script demonstrates:
- Asyncio fundamentals: coroutines, tasks, await, event loop
- Concurrent task execution with create_task and gather
- Timeouts and cancellation semantics
- Limiting concurrency via Semaphore
- Producer/Consumer with asyncio.Queue (backpressure)
- Offloading blocking work with asyncio.to_thread
- Periodic scheduling with asyncio.Task and graceful shutdown
- Optional HTTP concurrency with aiohttp (if installed)

Run:
  python modules/10-asynchronous-io-and-concurrency/module_10_async.py
"""

from __future__ import annotations

import asyncio
import random
import time
from dataclasses import dataclass
from typing import List, Optional, Tuple


# ------------------------
# Utility
# ------------------------

def section(title: str) -> None:
    print("\n=== " + title + " ===")


# ------------------------
# Basics: coroutines and await
# ------------------------

async def async_sleep_ms(ms: int) -> float:
    """
    Sleep for given milliseconds using asyncio.sleep.
    Returns elapsed seconds (measured).
    """
    t0 = time.perf_counter()
    await asyncio.sleep(ms / 1000.0)
    return time.perf_counter() - t0


async def basics_demo() -> None:
    section("Async basics: coroutines and await")
    dt = await async_sleep_ms(200)
    print(f"Slept ~{dt:.3f}s")


# ------------------------
# Concurrent execution
# ------------------------

async def work_task(name: str, ms: int) -> Tuple[str, float]:
    """
    Simulate a small async task (e.g., IO-bound).
    """
    t0 = time.perf_counter()
    await asyncio.sleep(ms / 1000.0)
    dt = time.perf_counter() - t0
    return name, dt


async def tasks_and_gather_demo() -> None:
    section("Concurrent tasks with create_task and gather")
    # Schedule tasks concurrently
    tasks = [
        asyncio.create_task(work_task("A", 300)),
        asyncio.create_task(work_task("B", 300)),
        asyncio.create_task(work_task("C", 300)),
    ]
    t0 = time.perf_counter()
    res = await asyncio.gather(*tasks)
    dt = time.perf_counter() - t0
    print("Results:", res)
    print(f"Wall time: {dt:.3f}s (should be ~0.3s not ~0.9s)")


# ------------------------
# Timeout and cancellation
# ------------------------

async def cancellable_task(ms: int) -> str:
    try:
        await asyncio.sleep(ms / 1000.0)
        return "done"
    except asyncio.CancelledError:
        print("Task cancelled!")
        raise


async def timeout_and_cancel_demo() -> None:
    section("Timeouts and cancellation")
    # Timeout using wait_for
    try:
        out = await asyncio.wait_for(cancellable_task(800), timeout=0.3)
        print("completed:", out)
    except asyncio.TimeoutError:
        print("Timeout reached, cancelling...")
    # Manual cancellation
    t = asyncio.create_task(cancellable_task(800))
    await asyncio.sleep(0.2)
    t.cancel()
    try:
        await t
    except asyncio.CancelledError:
        print("Caught cancellation in caller")


# ------------------------
# Limiting concurrency
# ------------------------

async def limited_task(sem: asyncio.Semaphore, idx: int) -> float:
    """
    Limit concurrent execution with a semaphore.
    """
    async with sem:
        # Inside the limited section
        dt = await async_sleep_ms(200)
        return dt


async def semaphore_demo() -> None:
    section("Limit concurrency with Semaphore")
    sem = asyncio.Semaphore(3)  # allow at most 3 concurrent tasks
    tasks = [asyncio.create_task(limited_task(sem, i)) for i in range(10)]
    t0 = time.perf_counter()
    await asyncio.gather(*tasks)
    dt = time.perf_counter() - t0
    print(f"Completed 10 tasks with max=3 concurrency in ~{dt:.3f}s")


# ------------------------
# Producer/Consumer with Queue
# ------------------------

@dataclass
class Job:
    id: int
    payload: int  # milliseconds to "process"


async def producer(q: asyncio.Queue[Job], count: int) -> None:
    for i in range(count):
        ms = random.randint(100, 400)
        job = Job(id=i, payload=ms)
        await q.put(job)  # backpressure-aware
        print(f"produced job {job.id} ({ms} ms)")
        await asyncio.sleep(0.05)  # simulate staggered production
    # Signal consumers to stop
    for _ in range(2):  # two consumers
        await q.put(Job(id=-1, payload=0))


async def consumer(name: str, q: asyncio.Queue[Job]) -> None:
    while True:
        job = await q.get()
        if job.id == -1:
            q.task_done()
            print(f"{name}: received stop signal")
            break
        # "process" the job
        await asyncio.sleep(job.payload / 1000.0)
        print(f"{name}: processed job {job.id} in {job.payload} ms")
        q.task_done()


async def queue_demo() -> None:
    section("Producer/Consumer with asyncio.Queue")
    q: asyncio.Queue[Job] = asyncio.Queue(maxsize=5)
    prod = asyncio.create_task(producer(q, count=8))
    cons1 = asyncio.create_task(consumer("C1", q))
    cons2 = asyncio.create_task(consumer("C2", q))
    # Wait for producer to finish and consumers to drain
    await prod
    await q.join()  # ensure all tasks processed
    # Consumers exit after stop signal
    await asyncio.gather(cons1, cons2)


# ------------------------
# Offload blocking work
# ------------------------

def blocking_work(n: int = 300_000) -> int:
    """A CPU/blocking function; not async-friendly."""
    s = 0
    for i in range(n):
        s += (i * i) % 1009
    return s


async def to_thread_demo() -> None:
    section("Offload blocking work with asyncio.to_thread")
    t0 = time.perf_counter()
    # Offload to a worker thread (without blocking the event loop)
    result = await asyncio.to_thread(blocking_work, 400_000)
    dt = time.perf_counter() - t0
    print("blocking_work result:", result, f"elapsed {dt:.3f}s")


# ------------------------
# Periodic scheduling and graceful shutdown
# ------------------------

async def periodic_task(stop: asyncio.Event) -> None:
    """
    Periodically perform work until stop is set.
    """
    i = 0
    while not stop.is_set():
        print("periodic tick", i)
        i += 1
        await asyncio.sleep(0.5)


async def periodic_demo() -> None:
    section("Periodic scheduling and graceful shutdown")
    stop_evt = asyncio.Event()
    t = asyncio.create_task(periodic_task(stop_evt))
    await asyncio.sleep(2.0)  # let it run a few ticks
    stop_evt.set()
    await t
    print("periodic task stopped cleanly")


# ------------------------
# Optional HTTP concurrency with aiohttp
# ------------------------

async def http_fetch(session, url: str) -> Tuple[str, int]:
    t0 = time.perf_counter()
    async with session.get(url, timeout=5) as resp:
        await resp.text()
        ms = int((time.perf_counter() - t0) * 1000)
        return url, ms


async def aiohttp_demo() -> None:
    section("HTTP concurrency with aiohttp (optional)")
    try:
        import aiohttp
    except Exception as e:
        print("aiohttp not installed; skip HTTP demo.", e)
        return

    urls = [
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/1",
    ]
    # Limit concurrency with a semaphore
    sem = asyncio.Semaphore(2)

    async def guarded_fetch(url: str) -> Tuple[str, int]:
        async with sem:
            async with aiohttp.ClientSession() as sess:
                return await http_fetch(sess, url)

    t0 = time.perf_counter()
    res = await asyncio.gather(*(guarded_fetch(u) for u in urls))
    dt = time.perf_counter() - t0
    print("fetch times (ms):", res)
    print(f"Wall time with max=2 concurrency: {dt:.3f}s")


# ------------------------
# Error handling patterns
# ------------------------

async def backoff_operation(max_attempts: int = 5) -> str:
    """
    Retry with exponential backoff; simulate transient failure.
    """
    for i in range(max_attempts):
        try:
            # Simulate 50% failure rate
            if random.random() < 0.5:
                raise RuntimeError("transient error")
            return "ok"
        except Exception as e:
            delay = min(2 ** i, 5)
            print(f"attempt {i+1} failed: {e}; sleeping {delay}s")
            await asyncio.sleep(delay)
    return "giving up"


async def error_handling_demo() -> None:
    section("Error handling and backoff")
    print("Result:", await backoff_operation())


# ------------------------
# Orchestration of demos
# ------------------------

async def run_all_demos() -> None:
    await basics_demo()
    await tasks_and_gather_demo()
    await timeout_and_cancel_demo()
    await semaphore_demo()
    await queue_demo()
    await to_thread_demo()
    await periodic_demo()
    await aiohttp_demo()
    await error_handling_demo()
    print("\nModule 10 complete.")


def main() -> int:
    asyncio.run(run_all_demos())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())