# NumPy — Module 3

Goals
- Gain fluency with ndarrays, dtypes, shapes, and broadcasting
- Replace Python loops with vectorized NumPy operations
- Master indexing, masking, reductions, and linear algebra
- Understand memory layout, views vs copies, and IO

Prerequisites
- Completed Module 2
- Python 3.10+ with NumPy installed

Folder for this module
- Work inside [modules/03-numpy](modules/03-numpy)

1) Install/verify
```bash
python -m pip install numpy
python - << 'PY'
import numpy as np
print(np.__version__)
PY
```

2) Creating arrays and dtypes
```python
import numpy as np

a = np.array([1, 2, 3])                 # int64 by default on many systems
b = np.array([1.0, 2.0, 3.0], dtype=np.float32)
z = np.zeros((2, 3), dtype=np.float64)
o = np.ones((3, 2))
r = np.arange(0, 10, 2)                 # 0,2,4,6,8
l = np.linspace(0.0, 1.0, 5)            # 5 points inclusive
i = np.eye(3)                           # identity

print(a.dtype, b.dtype)
print(z.shape, o.ndim, r.size)
```

3) Shape, reshape, and ravel
```python
x = np.arange(12)            # [0..11]
y = x.reshape(3, 4)          # 3 rows, 4 cols (view if possible)
z = y.ravel()                # 1D view when contiguous
print(y.shape, z.shape)

# -1 lets NumPy infer the dimension
print(x.reshape(-1, 6).shape)
```

4) Indexing and slicing
```python
m = np.arange(12).reshape(3, 4)
print(m)
print(m[0, 0], m[2, 3])      # element access
print(m[1])                  # row 1
print(m[:, 2])               # column 2
print(m[0:2, 1:3])           # 2x2 block

# Boolean masks
mask = m % 2 == 0
print(mask)
print(m[mask])               # 1D array of even elements

# Fancy indexing with integer arrays
rows = np.array([0, 2])
cols = np.array([1, 3])
print(m[rows, cols])         # picks (0,1) and (2,3)
```

5) Broadcasting rules
```python
# Shapes must be compatible from the right
a = np.ones((3, 1))
b = np.arange(3)             # shape (3,)
c = a + b                    # result shape (3,3)
print(c)

d = np.arange(6).reshape(2, 3)
e = np.array([10, 20, 30])   # shape (3,)
print(d + e)
```

6) Reductions and axis semantics
```python
x = np.arange(12).reshape(3, 4)
print(x.sum())               # all elements
print(x.sum(axis=0))         # per-column
print(x.mean(axis=1))        # per-row mean
print(np.max(x, axis=1, keepdims=True))

# Arg operations
print(np.argmax(x), np.argmax(x, axis=1))
```

7) Ufuncs and vectorization vs Python loops
```python
import timeit, numpy as np
n = 1_000_00  # 100k
py = timeit.timeit("sum(i*i for i in range(n))", number=10, globals={"n": n})
npv = timeit.timeit("import numpy as np; np.arange(n)**2; np.sum(np.arange(n)**2)", number=10, globals={"n": n})
print("Python:", py)
print("NumPy:", npv)
```

8) Random numbers and reproducibility
```python
rng = np.random.default_rng(seed=42)
a = rng.normal(loc=0.0, scale=1.0, size=(2, 3))
b = rng.integers(0, 10, size=5)
print(a)
print(b)
```

9) Linear algebra with numpy.linalg
```python
A = np.array([[3., 2.], [1., 4.]])
b = np.array([10., 8.])
x = np.linalg.solve(A, b)
print("x:", x)
print("A @ x:", A @ x)

# SVD
U, S, Vt = np.linalg.svd(A)
print("singular values:", S)

# Eigenvalues
w, V = np.linalg.eig(A)
print("eigvals:", w)
```

10) Views vs copies
```python
x = np.arange(10)
y = x[2:7]          # view (shares memory)
y[:] = -1
print(x)            # x changed where y wrote

z = x.copy()        # independent copy
z[0] = 999
print(x[0], z[0])

print("shares memory (x,y):", np.shares_memory(x, y))
print("shares memory (x,z):", np.shares_memory(x, z))
```

11) Strides and memory layout (C vs F order)
```python
a = np.arange(12).reshape(3,4)
print("C-order strides:", a.strides)
f = np.asfortranarray(a)
print("F-order strides:", f.strides)

# Transpose changes strides; ravel(order=...) controls flattening layout
print(a.T.strides)
print(a.ravel(order="F")[:8])
```

12) Saving and loading arrays
```python
x = np.arange(6).reshape(2,3)
np.save("X.npy", x)
y = np.load("X.npy")
print("equal:", np.array_equal(x, y))

# Multiple arrays
np.savez("arrays.npz", first=x, second=y)
data = np.load("arrays.npz")
print(list(data.files))
```

13) Memory-mapped arrays for large data
```python
import os, numpy as np
path = "big.dat"
n = 1_000_000
# Create a file with zeros if not exists
if not os.path.exists(path):
    mm = np.memmap(path, mode="w+", dtype=np.float32, shape=(n,))
    mm.flush(); del mm

mm = np.memmap(path, mode="r+", dtype=np.float32, shape=(n,))
mm[:10] = np.arange(10, dtype=np.float32)
print(mm[:12])
del mm
```

14) Interop with Pandas
```python
import pandas as pd
arr = np.arange(6).reshape(3,2)
df = pd.DataFrame(arr, columns=["a","b"])
print(df.values.flags["C_CONTIGUOUS"])  # shares buffer layout
print(df.to_numpy().base is arr)        # may or may not share
```

15) Best practices and tips
- Prefer vectorized operations over Python loops
- Use appropriate dtypes (float32 vs float64) to save memory when acceptable
- Beware of silent upcasting; specify dtype when needed
- Use keepdims to preserve rank during reductions when broadcasting later
- Profile with timeit; verify correctness with tests

16) Exercises
- Create a 1000x1000 matrix and compute per-row z-score ((x-mean)/std) without loops
- Implement cosine similarity between two matrices (nxd) using only matrix ops
- Given a boolean mask, set all masked positions in an array to the row-wise mean
- Build a memory-mapped array and process it in fixed-size windows without loading all into RAM

Solutions (sketches)
```python
import numpy as np

# 1) Row-wise z-score
X = np.random.default_rng(0).normal(size=(1000,1000))
mu = X.mean(axis=1, keepdims=True)
sigma = X.std(axis=1, keepdims=True)
Z = (X - mu) / sigma

# 2) Cosine similarity for matrices A (nxd) and B (mxd)
A = np.random.random((5,4)); B = np.random.random((3,4))
A_norm = np.linalg.norm(A, axis=1, keepdims=True)
B_norm = np.linalg.norm(B, axis=1, keepdims=True)
sim = (A @ B.T) / (A_norm @ B_norm.T)

# 3) Masked replace with row-wise mean
X = np.arange(12, dtype=float).reshape(3,4)
mask = np.array([[True, False, False, True],
                 [False, True, False, False],
                 [False, False, True, False]])
row_means = X.mean(axis=1, keepdims=True)
X[mask] = np.broadcast_to(row_means, X.shape)[mask]

# 4) Memmap windowed processing
path = "big2.dat"; n = 2_000_000
mm = np.memmap(path, mode="w+", dtype=np.float32, shape=(n,))
mm[:] = np.arange(n, dtype=np.float32)
del mm
mm = np.memmap(path, mode="r", dtype=np.float32, shape=(n,))
win = 100_000
totals = []
for start in range(0, n, win):
    end = min(start+win, n)
    totals.append(mm[start:end].sum())
total = sum(totals)
print(total)
del mm
```

Next module
- Proceed to [modules/04-pandas](modules/04-pandas)