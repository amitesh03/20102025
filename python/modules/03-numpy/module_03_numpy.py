#!/usr/bin/env python3
"""
NumPy — Module 3 teaching script.

This script demonstrates:
- ndarray creation, dtypes, shapes
- Reshape, ravel, views vs copies
- Indexing, slicing, boolean masks, fancy indexing
- Broadcasting rules
- Reductions (sum/mean/max) and axis semantics
- Random number generation and reproducibility
- Linear algebra: solve, SVD, eig
- Memory layout, strides, C vs Fortran order
- Saving/loading arrays, compressed npz
- Memory-mapped arrays for large data
- Pandas interop (optional)

Run:
  python modules/03-numpy/module_03_numpy.py
"""

from __future__ import annotations

import os
from typing import Tuple, Optional

import numpy as np


def section(title: str) -> None:
    print("\n=== " + title + " ===")


def array_summary(a: np.ndarray, name: str = "arr") -> None:
    print(
        f"{name}: shape={a.shape}, dtype={a.dtype}, ndim={a.ndim}, size={a.size}, "
        f"contiguous(C/F)={a.flags['C_CONTIGUOUS']}/{a.flags['F_CONTIGUOUS']}"
    )


def create_arrays() -> None:
    section("Array creation and dtypes")
    a = np.array([1, 2, 3])  # int64 on many systems
    b = np.array([1.0, 2.0, 3.0], dtype=np.float32)
    z = np.zeros((2, 3), dtype=np.float64)
    o = np.ones((3, 2))
    r = np.arange(0, 10, 2)  # 0,2,4,6,8
    l = np.linspace(0.0, 1.0, 5)  # 5 points inclusive
    i = np.eye(3)  # identity
    array_summary(a, "a")
    array_summary(b, "b")
    array_summary(z, "z")
    array_summary(o, "o")
    print("r:", r)
    print("l:", l)
    print("i:\n", i)


def shape_reshape_ravel() -> None:
    section("Shape, reshape, ravel")
    x = np.arange(12)  # [0..11]
    y = x.reshape(3, 4)  # view if possible
    z = y.ravel()  # 1D view when contiguous
    array_summary(x, "x")
    array_summary(y, "y")
    array_summary(z, "z")
    print("reshape with -1:", x.reshape(-1, 6).shape)


def indexing_slicing() -> None:
    section("Indexing and slicing")
    m = np.arange(12).reshape(3, 4)
    print("m:\n", m)
    print("m[0,0], m[2,3] =", m[0, 0], m[2, 3])
    print("row 1:", m[1])
    print("col 2:", m[:, 2])
    print("block 0:2, 1:3:\n", m[0:2, 1:3])


def boolean_mask_and_fancy() -> None:
    section("Boolean masks and fancy indexing")
    m = np.arange(12).reshape(3, 4)
    mask = m % 2 == 0
    print("mask:\n", mask)
    print("m[mask]:", m[mask])

    rows = np.array([0, 2])
    cols = np.array([1, 3])
    print("m[rows, cols]:", m[rows, cols])  # picks (0,1) and (2,3)


def broadcasting_demo() -> None:
    section("Broadcasting")
    a = np.ones((3, 1))
    b = np.arange(3)  # shape (3,)
    c = a + b  # result shape (3,3)
    print("c:\n", c)

    d = np.arange(6).reshape(2, 3)
    e = np.array([10, 20, 30])
    print("d + e:\n", d + e)


def reductions_axis() -> None:
    section("Reductions and axis semantics")
    x = np.arange(12).reshape(3, 4)
    print("sum(all):", x.sum())
    print("sum(axis=0):", x.sum(axis=0))
    print("mean(axis=1):", x.mean(axis=1))
    print("max(axis=1, keepdims=True):\n", np.max(x, axis=1, keepdims=True))
    print("argmax(all):", np.argmax(x))
    print("argmax per row:", np.argmax(x, axis=1))


def ufuncs_vs_loops_benchmark(n: int = 100_000) -> None:
    section("Vectorized ufuncs vs Python loops (benchmark)")
    import time

    t0 = time.perf_counter()
    _ = sum(i * i for i in range(n))
    py = time.perf_counter() - t0

    t0 = time.perf_counter()
    arr = np.arange(n)
    _ = np.sum(arr * arr)
    npv = time.perf_counter() - t0

    print(f"Python loops: {py:.6f}s")
    print(f"NumPy vectorized: {npv:.6f}s")


def random_rng_demo() -> None:
    section("Random numbers and reproducibility")
    rng = np.random.default_rng(seed=42)
    a = rng.normal(loc=0.0, scale=1.0, size=(2, 3))
    b = rng.integers(0, 10, size=5)
    print("normal(2x3):\n", a)
    print("integers(5):", b)


def linalg_demo() -> None:
    section("Linear algebra")
    A = np.array([[3.0, 2.0], [1.0, 4.0]])
    b = np.array([10.0, 8.0])
    x = np.linalg.solve(A, b)
    print("x:", x)
    print("A @ x:", A @ x)

    U, S, Vt = np.linalg.svd(A)
    print("SVD singular values:", S)

    w, V = np.linalg.eig(A)
    print("Eigenvalues:", w)


def views_vs_copies() -> None:
    section("Views vs copies")
    x = np.arange(10)
    y = x[2:7]  # view (shares memory)
    y[:] = -1
    print("x after y write:", x)  # y changed positions in x

    z = x.copy()  # independent copy
    z[0] = 999
    print("x[0], z[0]:", x[0], z[0])

    print("shares memory (x,y):", np.shares_memory(x, y))
    print("shares memory (x,z):", np.shares_memory(x, z))


def strides_memory_layout() -> None:
    section("Strides and memory layout")
    a = np.arange(12).reshape(3, 4)
    print("C-order strides:", a.strides)
    f = np.asfortranarray(a)
    print("F-order strides:", f.strides)
    print("a.T.strides:", a.T.strides)
    print("a.ravel(order='F')[:8]:", a.ravel(order="F")[:8])


def save_load_demo() -> None:
    section("Saving and loading arrays")
    x = np.arange(6).reshape(2, 3)
    np.save("X.npy", x)
    y = np.load("X.npy")
    print("equal X vs load:", np.array_equal(x, y))

    np.savez("arrays.npz", first=x, second=y)
    data = np.load("arrays.npz")
    print("npz files keys:", list(data.files))


def memmap_demo() -> None:
    section("Memory-mapped arrays")
    path = "big_memmap.dat"
    n = 1_000_000
    # Create a file with zeros if not exists
    if not os.path.exists(path):
        mm = np.memmap(path, mode="w+", dtype=np.float32, shape=(n,))
        mm.flush()
        del mm
    mm = np.memmap(path, mode="r+", dtype=np.float32, shape=(n,))
    mm[:10] = np.arange(10, dtype=np.float32)
    print("memmap head:", mm[:12])
    del mm


def pandas_interop_demo() -> None:
    section("Pandas interop")
    try:
        import pandas as pd
    except Exception as e:
        print("pandas not available; skipping interop.")
        return
    arr = np.arange(6).reshape(3, 2)
    df = pd.DataFrame(arr, columns=["a", "b"])
    print(df)
    # Note: DataFrame .values may share or copy buffers depending on dtype/layout
    print("C_CONTIGUOUS:", df.values.flags["C_CONTIGUOUS"])


def best_practices_tips() -> None:
    section("Best practices and tips")
    tips = [
        "Prefer vectorized operations over Python loops.",
        "Use appropriate dtypes (float32 vs float64) to save memory when acceptable.",
        "Specify dtype to avoid silent upcasting.",
        "Use keepdims to preserve rank during reductions when broadcasting later.",
        "Profile with time/perf counters and verify correctness with tests.",
    ]
    for t in tips:
        print("-", t)


def exercises_solutions() -> None:
    section("Exercises — sketches")

    # 1) Row-wise z-score for a 5x5 matrix
    X = np.random.default_rng(0).normal(size=(5, 5))
    mu = X.mean(axis=1, keepdims=True)
    sigma = X.std(axis=1, keepdims=True)
    Z = (X - mu) / sigma
    print("row-wise zscore shape:", Z.shape)

    # 2) Cosine similarity between A(nxd) and B(mxd)
    A = np.random.random((4, 3))
    B = np.random.random((3, 3))
    A_norm = np.linalg.norm(A, axis=1, keepdims=True)
    B_norm = np.linalg.norm(B, axis=1, keepdims=True)
    sim = (A @ B.T) / (A_norm @ B_norm.T)
    print("cosine sim shape:", sim.shape)

    # 3) Masked replace with row-wise mean
    X = np.arange(12, dtype=float).reshape(3, 4)
    mask = np.array(
        [[True, False, False, True], [False, True, False, False], [False, False, True, False]]
    )
    row_means = X.mean(axis=1, keepdims=True)
    X[mask] = np.broadcast_to(row_means, X.shape)[mask]
    print("masked replace:\n", X)

    # 4) Memmap windowed processing
    path = "big2.dat"
    n = 200_000
    mm = np.memmap(path, mode="w+", dtype=np.float32, shape=(n,))
    mm[:] = np.arange(n, dtype=np.float32)
    del mm
    mm = np.memmap(path, mode="r", dtype=np.float32, shape=(n,))
    win = 50_000
    totals = []
    for start in range(0, n, win):
        end = min(start + win, n)
        totals.append(mm[start:end].sum())
    total = sum(totals)
    print("memmap totals sum:", int(total))
    del mm


def main() -> int:
    create_arrays()
    shape_reshape_ravel()
    indexing_slicing()
    boolean_mask_and_fancy()
    broadcasting_demo()
    reductions_axis()
    ufuncs_vs_loops_benchmark()
    random_rng_demo()
    linalg_demo()
    views_vs_copies()
    strides_memory_layout()
    save_load_demo()
    memmap_demo()
    pandas_interop_demo()
    best_practices_tips()
    exercises_solutions()
    print("\nModule 3 complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

# ------------------------------
# Additional commented examples
# ------------------------------

def broadcasting_pitfalls_examples() -> None:
    section("Broadcasting pitfalls and fixes with newaxis")
    # Mismatched shapes example:
    # a: (3, 1) and b: (3,) are compatible -> result (3, 3)
    a = np.arange(3).reshape(3, 1)
    b = np.arange(3)
    print("a shape:", a.shape, "b shape:", b.shape, "a + b shape:", (a + b).shape)

    # Pitfall: trying to add (3, 2) to (3, 3) will fail (trailing dims unequal)
    x = np.arange(6).reshape(3, 2)
    y = np.arange(9).reshape(3, 3)
    try:
        _ = x + y  # ValueError expected
    except Exception as e:
        print("broadcast error (as expected):", e)

    # Fix by aligning dims with np.newaxis to control expansion
    c = np.arange(3)        # (3,)
    d = np.arange(4)        # (4,)
    # We want (3,4) by outer addition: c[:, None] + d[None, :]
    outer = c[:, None] + d[None, :]
    print("outer shape (3,4):", outer.shape)

    # Example: subtract a column-wise mean using keepdims/newaxis
    M = np.arange(12, dtype=float).reshape(3, 4)
    col_mean = M.mean(axis=0, keepdims=True)  # (1,4)
    M_centered = M - col_mean                 # broadcast across rows
    print("centered by column mean:\n", M_centered)


def advanced_indexing_gotchas() -> None:
    section("Advanced indexing gotchas: copies vs views")
    M = np.arange(12).reshape(3, 4)
    # Boolean mask indexing returns a 1D copy (not a view)
    mask = M % 2 == 0
    even_vals = M[mask]
    even_vals[:] = -1
    # Original M remains unchanged in those positions because even_vals is a copy
    print("M after modifying even_vals copy:\n", M)

    # Slicing produces views (when contiguous)
    S = M[0:2, 1:3]
    S[:] = -9
    print("M after modifying slice view:\n", M)

    # Fancy indexing (with integer arrays) also returns a copy
    rows = np.array([0, 2])
    cols = np.array([1, 3])
    sel = M[rows, cols]
    sel[:] = 999
    print("M after modifying fancy-indexed copy (unchanged at those coords):\n", M)


def einsum_examples() -> None:
    section("np.einsum examples: dot, matmul, outer, batch ops")
    v = np.arange(3, dtype=float)
    w = np.arange(3, dtype=float)
    # Dot product
    dot = np.einsum("i,i->", v, w)
    print("dot(v,w):", dot)

    # Matrix multiply
    A = np.arange(6, dtype=float).reshape(2, 3)
    B = np.arange(9, dtype=float).reshape(3, 3)
    C = np.einsum("ik,kj->ij", A, B)
    print("A(2x3) @ B(3x3) shape:", C.shape)

    # Outer product
    O = np.einsum("i,j->ij", v, w)
    print("outer(v,w) shape:", O.shape)

    # Batch matmul: X (batch, n, k) with Y (batch, k, m)
    X = np.random.default_rng(0).normal(size=(4, 2, 3))
    Y = np.random.default_rng(1).normal(size=(4, 3, 5))
    Z = np.einsum("bij,bjk->bik", X, Y)
    print("batch matmul Z shape:", Z.shape)


def structured_arrays_examples() -> None:
    section("Structured arrays: dtype with named fields")
    dt = np.dtype([("name", "U10"), ("age", np.int32), ("score", np.float32)])
    arr = np.array([("ann", 23, 88.5), ("bob", 35, 91.0), ("cara", 29, 78.0)], dtype=dt)
    print("field names:", arr.dtype.names)
    print("ages:", arr["age"])
    # Sort by a field
    idx = np.argsort(arr["score"])
    print("sorted by score:\n", arr[idx])
    # Filter by condition on field
    mask = arr["age"] >= 30
    print("age >= 30:\n", arr[mask])


def random_reproducibility_examples() -> None:
    section("Random: reproducibility with default_rng and bit generators")
    # Recommended modern RNG
    rng = np.random.default_rng(seed=42)
    print("integers:", rng.integers(0, 10, size=5))
    print("normal:", rng.normal(size=3))

    # Different bit generator (PCG64DXSM) example
    from numpy.random import PCG64DXSM
    rng2 = np.random.Generator(PCG64DXSM(123))
    print("rng2 integers:", rng2.integers(0, 5, size=3))


def numeric_stability_examples() -> None:
    section("Numeric stability: softmax and log-sum-exp")
    logits = np.array([10.0, 12.0, 15.0, 1e2])  # includes a large value
    # Naive softmax can overflow; subtract max for stability
    m = logits.max()
    exp = np.exp(logits - m)
    softmax = exp / exp.sum()
    print("stable softmax:", softmax)

    # log-sum-exp using np.logaddexp.reduce
    # For two values: log(exp(a)+exp(b)) = logaddexp(a, b)
    a, b = 10.0, 12.0
    lse2 = np.logaddexp(a, b)
    # For many values, accumulate:
    lse = logits[0]
    for x in logits[1:]:
        lse = np.logaddexp(lse, x)
    print("log-sum-exp (accumulated):", lse)


def testing_comparisons_examples() -> None:
    section("Testing and comparisons: allclose vs equal, isclose, tolerances")
    x = np.array([0.1 + 0.2, 0.3])
    y = np.array([0.3, 0.3])
    print("equal:", np.array_equal(x, y))
    print("allclose:", np.allclose(x, y, rtol=1e-09, atol=1e-12))
    print("isclose:", np.isclose(x, y, rtol=1e-09, atol=1e-12))


def memory_alignment_examples() -> None:
    section("Memory alignment and dtype conversions")
    a = np.array([1, 2, 3], dtype=np.int64)
    b = a.astype(np.int32, copy=False)  # copy=False may still copy if needed
    print("a dtype:", a.dtype, "b dtype:", b.dtype)
    # Alignment affects itemsize/strides; inspect and be explicit when converting dtypes
    M = np.arange(12, dtype=np.float64).reshape(3, 4)
    print("M strides:", M.strides)
    Mf = np.asfortranarray(M)
    print("Mf strides (Fortran order):", Mf.strides)


def numpy_best_practices_notes() -> None:
    section("Best practices (comments)")
    notes = """
- Prefer vectorized operations and broadcasting to Python loops.
- Be explicit with shapes when broadcasting; use newaxis/reshape to align dims.
- Remember: fancy indexing returns a copy; slicing returns a view (when contiguous).
- Avoid silent upcasting by specifying dtype; choose float32 when acceptable to save memory.
- Use rng = np.random.default_rng(seed) for reproducible randomness.
- For linear algebra, favor explicit matrix shapes and check condition numbers for stability.
- Test with np.allclose/tolerances rather than exact equality for floats.
"""
    print(notes)


# Extend main() to run new examples
def main_extended() -> None:
    broadcasting_pitfalls_examples()
    advanced_indexing_gotchas()
    einsum_examples()
    structured_arrays_examples()
    random_reproducibility_examples()
    numeric_stability_examples()
    testing_comparisons_examples()
    memory_alignment_examples()
    numpy_best_practices_notes()


# Call the extended section from the original main()
_old_main = main
def main() -> int:
    rc = _old_main()
    main_extended()
    return rc