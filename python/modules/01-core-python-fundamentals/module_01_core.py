#!/usr/bin/env python3
"""
Core Python Fundamentals — Module 1 teaching script.

Run this file to learn core language features with outputs.
Each section demonstrates concepts with comments and prints.

Usage:
  python modules/01-core-python-fundamentals/module_01_core.py
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from typing import Iterable, Optional, Callable, TypeVar, Generator, Any
from contextlib import contextmanager
from pathlib import Path
import time
import math
import itertools
from functools import wraps, lru_cache


def hello():
    print("Hello, Python!")
    if True:
        print("Indentation defines blocks")


def variables_types():
    # Numbers, strings, booleans
    x = 42
    y = 3.14
    s = "ai"
    flag = True
    # Multiple assignment
    a, b = 1, 2
    # Dynamic typing: names bound to objects
    x = "now string"
    # None is absence of value
    n = None
    # Immutable tuple
    t = (1, 2, 3)
    print(x, y, s, flag, a, b, n, t)


def operators_fstrings():
    # Arithmetic and comparison
    print(1 + 2, 5 // 2, 5 % 2, 2 ** 3)
    print(3 > 2, 3 == 3, 3 != 4)
    # f-strings formatting
    name = "Ada"
    score = 98.456
    print(f"Hi {name}, score={score:.2f}")


def control_flow():
    x = 7
    if x > 10:
        print("big")
    elif 5 <= x <= 10:
        print("medium")
    else:
        print("small")

    # while loop
    i = 0
    while i < 3:
        print("i=", i)
        i += 1

    # for loop over iterable
    for ch in "AI":
        if ch == "I":
            continue
        print(ch)


def area(radius: float, *, pi: float = 3.14159) -> float:
    """Keyword-only pi arg; typed function."""
    return pi * radius * radius


def type_hints_example(xs: Iterable[int]) -> Optional[int]:
    """Return first element or None."""
    for x in xs:
        return x
    return None


def collections_examples():
    # List
    nums = [1, 2, 3]
    nums.append(4)
    nums[0] = 99

    # Dict
    conf = {"lr": 1e-3, "epochs": 10}
    conf["batch_size"] = 32

    # Set
    tags = {"nlp", "cv"}
    tags.add("rl")

    # Tuple (immutable)
    pair = ("pydantic", 2)
    print(nums, conf, tags, pair)


def slicing_comprehensions():
    xs = list(range(10))
    print(xs[2:7:2])  # start:stop:step

    # Comprehensions
    squares = [x * x for x in xs if x % 2 == 0]
    mapping = {x: x * x for x in xs[:5]}
    unique = {c.upper() for c in "aiai"}
    print(squares, mapping, unique)


def countdown(n: int) -> Generator[int, None, None]:
    """Generator yielding n..1."""
    while n > 0:
        yield n
        n -= 1


def generators_demo():
    for v in countdown(3):
        print(v)
    gen = (x * x for x in range(3))  # generator expression is lazy
    print(next(gen), next(gen), next(gen))


def describe(obj: Any) -> str:
    """Structural pattern matching (Python 3.10+)."""
    match obj:
        case {"type": "point", "x": x, "y": y}:
            return f"Point({x},{y})"
        case [a, b, *rest]:
            return f"List with head=({a},{b})"
        case _:
            return "Unknown"


def exceptions_demo():
    def div(a: float, b: float) -> float:
        if b == 0:
            raise ValueError("b must be non-zero")
        return a / b

    try:
        print(div(10, 2))
        print(div(1, 0))
    except ValueError as e:
        print("Handled:", e)
    finally:
        print("Always runs")


@contextmanager
def managed():
    print("enter")
    try:
        yield "resource"
    finally:
        print("exit")


def context_manager_demo():
    # File I/O using context manager is auto-closed
    tmp = Path("tmp.txt")
    tmp.write_text("hello\n", encoding="utf-8")
    print(tmp.read_text(encoding="utf-8"))

    # Custom context manager
    with managed() as r:
        print("using", r)


def timed(fn: Callable) -> Callable:
    """Decorator measuring runtime."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            dt = time.perf_counter() - t0
            print(f"{fn.__name__} took {dt*1000:.2f} ms")
    return wrapper


@timed
def work(n: int) -> int:
    """Demo workload for decorator."""
    return sum(range(n))


@dataclass
class Point:
    x: float
    y: float


class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self) -> str:
        return f"Vector({self.x},{self.y})"

    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)


def classes_demo():
    v1 = Vector(1, 2)
    v2 = Vector(3, 4)
    print(v1 + v2)
    print(Point(5, 6))


def modules_packages_demo():
    msg = """
Suppose project structure:
.
├─ util/
│  ├─ __init__.py
│  └─ mathutil.py
└─ app.py

In mathutil.py:
    def add(a: int, b: int) -> int: return a + b

In app.py:
    from util.mathutil import add
    print(add(2, 3))
"""
    print(msg)


def stdlib_tools_demo():
    print(Path(".").resolve())
    print(list(itertools.islice(range(100), 5)))
    print(lru_cache)


@lru_cache(maxsize=None)
def fib(n: int) -> int:
    """Memoized Fibonacci (demo)."""
    return n if n < 2 else fib(n - 1) + fib(n - 2)


def exercises_solutions():
    from typing import TypeVar
    T = TypeVar("T")

    def mean(xs: Iterable[float]) -> Optional[float]:
        xs = list(xs)
        return None if not xs else sum(xs) / len(xs)

    def evens(n: int) -> Generator[int, None, None]:
        for i in range(0, n + 1, 2):
            yield i

    @dataclass
    class Rectangle:
        w: float
        h: float
        def area(self) -> float: return self.w * self.h
        def perimeter(self) -> float: return 2 * (self.w + self.h)

    F = TypeVar("F", bound=Callable)

    def retry(k: int, delay: float = 0.0):
        def deco(fn: F) -> F:
            @wraps(fn)
            def wrapped(*args, **kwargs):
                last = None
                for _ in range(k):
                    try:
                        return fn(*args, **kwargs)
                    except Exception as e:
                        last = e
                        if delay:
                            time.sleep(delay)
                raise last
            return wrapped  # type: ignore
        return deco

    @retry(3, delay=0.1)
    def flaky():
        import random
        if random.random() < 0.7:
            raise RuntimeError("try again")
        return "ok"

    print(mean([1.0, 2.0, 3.0]))
    print(list(evens(10)))
    r = Rectangle(3, 4)
    print(r.area(), r.perimeter())
    try:
        print(flaky())
    except Exception as e:
        print("failed:", e)


def main() -> int:
    hello()
    variables_types()
    operators_fstrings()
    control_flow()
    print(area(2.0))
    print(area(2.0, pi=3.14))
    print(type_hints_example([1, 2, 3]))
    collections_examples()
    slicing_comprehensions()
    generators_demo()
    print(describe({"type": "point", "x": 1, "y": 2}))
    print(describe([1, 2, 3, 4]))
    exceptions_demo()
    context_manager_demo()
    work(500000)
    classes_demo()
    modules_packages_demo()
    stdlib_tools_demo()
    print([fib(i) for i in range(10)])
    exercises_solutions()
    print("Module 1 complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())