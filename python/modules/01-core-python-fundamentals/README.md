# Core Python Fundamentals — Module 1

This module teaches core Python needed for AI and backend work. Work through sections in order and run every code cell.

Prerequisites
- Python 3.10+ installed
- A virtual environment activated for this project
- An editor with Python extension (VS Code recommended)

How to run code
- Save snippets into a file and run: python script.py
- Or use Jupyter notebooks for experimentation

1. Hello, Python: syntax and printing

```python
# Comments start with '#'
print("Hello, Python!")

# Multiple statements and indentation
if True:
    print("Blocks are defined by indentation")
```

2. Variables, types, and immutability

```python
# Numbers, strings, booleans
x = 42              # int
y = 3.14            # float
s = "ai"            # str
flag = True         # bool

# Multiple assignment
a, b = 1, 2

# Dynamic typing: variables are names bound to objects
x = "now I'm a string"

# None is the absence of a value
n = None

# Immutability: ints/strs/tuples are immutable
t = (1, 2, 3)
# t[0] = 99  # TypeError
```

3. Basic operators and f-strings

```python
# Arithmetic and comparison
print(1 + 2, 5 // 2, 5 % 2, 2 ** 3)
print(3 > 2, 3 == 3, 3 != 4)

# f-strings
name = "Ada"
score = 98.456
print(f"Hi {name}, score={score:.2f}")
```

4. Control flow: if/elif/else, while, for, break/continue

```python
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
    print("i =", i)
    i += 1

# for loop over iterable
for ch in "AI":
    if ch == "I":
        continue
    print(ch)
```

5. Functions and default/keyword-only args

```python
def area(radius: float, *, pi: float = 3.14159) -> float:
    return pi * radius * radius

print(area(2.0))
print(area(2.0, pi=3.14))
```

6. Type hints and static checking

```python
from typing import Iterable, List, Optional

def first(xs: Iterable[int]) -> Optional[int]:
    for x in xs:
        return x
    return None

vals: List[int] = [1, 2, 3]
print(first(vals))
```

7. Collections: list, dict, set, tuple

```python
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
```

8. Slicing and comprehensions

```python
xs = list(range(10))
print(xs[2:7:2])  # start:stop:step

# Comprehensions
squares = [x * x for x in xs if x % 2 == 0]
mapping = {x: x * x for x in xs[:5]}
unique = {c.upper() for c in "aiai"}
print(squares, mapping, unique)
```

9. Iterators, generators, and lazy evaluation

```python
# Generator function
def countdown(n: int):
    while n > 0:
        yield n
        n -= 1

for v in countdown(3):
    print(v)

# Generator expressions are lazy
gen = (x * x for x in range(3))
print(next(gen), next(gen), next(gen))
```

10. Pattern matching (Python 3.10+)

```python
def describe(obj):
    match obj:
        case {"type": "point", "x": x, "y": y}:
            return f"Point({x},{y})"
        case [a, b, *rest]:
            return f"List with head=({a},{b})"
        case _:
            return "Unknown"

print(describe({"type":"point","x":1,"y":2}))
print(describe([1,2,3,4]))
```

11. Exceptions and error handling

```python
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
```

12. Context managers (with) and files

```python
# File I/O with context manager
with open("tmp.txt", "w", encoding="utf-8") as f:
    f.write("hello\n")

with open("tmp.txt", "r", encoding="utf-8") as f:
    data = f.read()
    print(data)

# Custom context manager
from contextlib import contextmanager

@contextmanager
def managed():
    print("enter")
    try:
        yield "resource"
    finally:
        print("exit")

with managed() as r:
    print("using", r)
```

13. Decorators

```python
import time
from functools import wraps

def timed(fn):
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
    return sum(range(n))

work(1000000)
```

14. Classes, dataclasses, and dunder methods

```python
from dataclasses import dataclass

class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    def __repr__(self) -> str:
        return f"Vector({self.x},{self.y})"
    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)

@dataclass
class Point:
    x: float
    y: float

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)
print(Point(5, 6))
```

15. Modules and packages

```python
# Suppose you have this project structure:
# .
# ├─ util/
# │  ├─ __init__.py
# │  └─ mathutil.py
# └─ app.py
#
# util/mathutil.py
def add(a: int, b: int) -> int:
    return a + b

# app.py
from util.mathutil import add
print(add(2, 3))
```

16. Common standard library tools

```python
from pathlib import Path
from itertools import islice
from collections import Counter
from functools import lru_cache

print(Path(".").resolve())
print(list(islice(range(100), 5)))
print(Counter("mississippi"))

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    return n if n < 2 else fib(n-1) + fib(n-2)

print([fib(i) for i in range(10)])
```

17. Practice exercises

- Write a function to compute the mean of a list of floats, returning None for an empty list.
- Implement a generator that yields even numbers up to N.
- Create a dataclass for a Rectangle with area and perimeter methods.
- Write a decorator that retries a function up to k times on exception.
- Build a small package util/ with string utilities and import them from a script.

Solutions

```python
from dataclasses import dataclass
from typing import Iterable, Optional, Callable, TypeVar
import time

def mean(xs: Iterable[float]) -> Optional[float]:
    xs = list(xs)
    return None if not xs else sum(xs) / len(xs)

def evens(n: int):
    for i in range(0, n+1, 2):
        yield i

@dataclass
class Rectangle:
    w: float
    h: float
    def area(self) -> float:
        return self.w * self.h
    def perimeter(self) -> float:
        return 2 * (self.w + self.h)

F = TypeVar("F", bound=Callable)
def retry(k: int, delay: float = 0.0):
    def deco(fn: F) -> F:
       from functools import wraps
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

# Example usage
@retry(3, delay=0.1)
def flaky():
    import random
    if random.random() < 0.7:
        raise RuntimeError("try again")
    return "ok"

print(mean([1.0, 2.0, 3.0]))
print(list(evens(10)))
print(Rectangle(3, 4).area(), Rectangle(3, 4).perimeter())
try:
    print(flaky())
except Exception as e:
    print("failed:", e)
```

Next steps
- Proceed to Module 2 (Scientific and Systems Foundations) for performance and concurrency fundamentals that complement these basics.