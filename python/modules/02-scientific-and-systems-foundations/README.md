# Scientific and Systems Foundations — Module 2

Goals
- Understand Python memory model, reference counting, and garbage collection
- Measure and reduce memory usage
- Choose and use parallel/concurrent techniques appropriately
- Profile and optimize Python code for AI workloads

Prerequisites
- Completed Module 1 fundamentals
- Python 3.10+ in a virtual environment

Folder for this module
- Work inside [modules/02-scientific-and-systems-foundations](modules/02-scientific-and-systems-foundations)

1) How Python manages memory: reference counting and GC
- CPython uses reference counting plus a cyclic garbage collector
- Objects are freed when their refcount hits zero; cycles require gc to collect

```python
import sys, gc, weakref

a = []
b = a
print("refcount(a):", sys.getrefcount(a))  # extra temp ref inside getrefcount

# Create a cycle
a.append(a)
print("has cycle:", gc.isenabled())

# Weak references avoid increasing refcount for certain types
class Node:
    def __init__(self, name): self.name = name; self.child = None

n1 = Node("root")
n1.child = weakref.proxy(n1)  # proxy does not own a strong ref
print("proxy child name:", n1.child.name)

# Forcing a GC collection (rarely needed)
gc.collect()
```

2) Inspect memory usage with tracemalloc
- Use tracemalloc to find top allocators and track diffs over time

```python
import tracemalloc

tracemalloc.start()
data = [bytes(1024) for _ in range(1000)]  # allocate ~1 MB
snapshot = tracemalloc.take_snapshot()
top = snapshot.statistics("lineno")[:5]
for stat in top:
    print(stat)

# Compare snapshots
data2 = [bytes(2048) for _ in range(1000)]
snap2 = tracemalloc.take_snapshot()
for stat in snap2.compare_to(snapshot, "lineno")[:5]:
    print(stat)
```

3) Efficient data structures and __slots__
- Prefer arrays/numpy for numeric data; smaller memory footprint and faster ops
- Use __slots__ to avoid per-instance dict when you have fixed attributes

```python
class Plain:
    def __init__(self, x, y): self.x = x; self.y = y

class Slotted:
    __slots__ = ("x", "y")
    def __init__(self, x, y): self.x = x; self.y = y

p = Plain(1, 2); s = Slotted(1, 2)
import sys
print("Plain size:", sys.getsizeof(p.__dict__) + sys.getsizeof(p))
print("Slotted size:", sys.getsizeof(s))
```

4) CPU vs IO workloads and the GIL
- GIL allows only one thread to execute Python bytecode at a time
- For IO-bound tasks, threading/async works well; for CPU-bound, use multiprocessing or native extensions

5) Threading for IO-bound tasks with ThreadPoolExecutor

```python
import concurrent.futures as cf
import urllib.request

URLS = [
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
]

def fetch(url: str) -> int:
    with urllib.request.urlopen(url, timeout=5) as resp:
        return resp.status

with cf.ThreadPoolExecutor(max_workers=4) as tp:
    for status in tp.map(fetch, URLS):
        print("status:", status)
```

6) Multiprocessing for CPU-bound tasks with ProcessPoolExecutor

```python
import concurrent.futures as cf
import math

def is_prime(n: int) -> bool:
    if n < 2: return False
    if n % 2 == 0: return n == 2
    r = int(math.sqrt(n))
    f = 3
    while f <= r:
        if n % f == 0: return False
        f += 2
    return True

nums = list(range(10_000, 10_200))
with cf.ProcessPoolExecutor() as pp:
    results = list(pp.map(is_prime, nums))
print(sum(results), "primes found")
```

7) Shared memory with numpy and multiprocessing.shared_memory

```python
import numpy as np
from multiprocessing import shared_memory

a = np.arange(10, dtype=np.int64)
shm = shared_memory.SharedMemory(create=True, size=a.nbytes)
b = np.ndarray(a.shape, dtype=a.dtype, buffer=shm.buf)
b[:] = a[:]  # copy into shared block

print("b sum:", b.sum())

# Attach from another process by name: shared_memory.SharedMemory(name=shm.name)
shm.close(); shm.unlink()
```

8) Profiling: timeit and cProfile

```python
import timeit
import numpy as np

py_time = timeit.timeit("sum(i*i for i in range(100000))", number=20)
np_time = timeit.timeit("import numpy as np; np.sum(np.arange(100000)**2)", number=20)
print("Python loops:", py_time)
print("NumPy vectorized:", np_time)
```

```bash
# Profile a script with cProfile
python -m cProfile -o prof.out script.py
python - << 'PY'
import pstats
p = pstats.Stats('prof.out'); p.sort_stats('cumtime').print_stats(15)
PY
```

9) Optimization strategies
- Prefer algorithmic improvements over micro-optimizations
- Use vectorized operations (NumPy/Pandas) instead of Python loops
- Cache pure functions: functools.lru_cache
- Minimize object churn; reuse buffers; avoid unnecessary conversions

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    return n if n < 2 else fib(n-1) + fib(n-2)

print([fib(i) for i in range(20)])
```

10) Exercises
- Measure memory allocations with tracemalloc for building a list vs numpy array
- Rewrite a CPU-bound loop with NumPy vectorization and compare timings
- Build a small downloader with ThreadPoolExecutor and measure throughput
- Use ProcessPoolExecutor to accelerate a CPU task; report speedup vs single process

Solutions (sketches)

```python
# 1) tracemalloc compare
import tracemalloc, numpy as np
tracemalloc.start()
lst = [i for i in range(100000)]
snap1 = tracemalloc.take_snapshot()
arr = np.arange(100000)
snap2 = tracemalloc.take_snapshot()
print(snap2.compare_to(snap1, "lineno")[:3])

# 2) vectorization
import timeit
py = timeit.timeit("sum(i*i for i in range(1000000))", number=5)
np = timeit.timeit("import numpy as np; np.sum(np.arange(1000000)**2)", number=5)
print(py, np)

# 3) downloader
import concurrent.futures as cf, urllib.request
URLS = ["https://httpbin.org/get?i="+str(i) for i in range(10)]
def fetch(url): 
    with urllib.request.urlopen(url) as r: return r.status
with cf.ThreadPoolExecutor(8) as tp:
    print(list(tp.map(fetch, URLS)))

# 4) Process pool speedup (prime count)
import math, concurrent.futures as cf
def is_prime(n):
    if n < 2: return False
    if n % 2 == 0: return n == 2
    r = int(math.sqrt(n)); f = 3
    while f <= r:
        if n % f == 0: return False
        f += 2
    return True
nums = list(range(2, 300000))
with cf.ProcessPoolExecutor() as pp:
    print(sum(pp.map(is_prime, nums)))
```

11) Tools to install
```bash
python -m pip install numpy matplotlib
# Optional: py-spy for sampling profiles (run outside the interpreter)
# Optional: line-profiler for per-line CPU (requires separate setup)
```

Next module
- Proceed to [modules/03-numpy](modules/03-numpy) for in-depth numerical computing