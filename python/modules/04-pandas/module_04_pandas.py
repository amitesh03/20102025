#!/usr/bin/env python3
"""
Pandas — Module 4 teaching script.

This script demonstrates:
- Series and DataFrame creation
- Dtypes and conversions
- Indexing/selection with loc/iloc/at/iat
- Filtering and assignment best practices
- Missing data handling
- GroupBy and aggregation/transform
- Merge/join
- Reshape: pivot/melt/stack/unstack
- Time series basics and rolling/resample
- Categoricals and memory
- Efficient IO (CSV/Parquet/Feather)
- Performance tips and chunked processing

Run:
  python modules/04-pandas/module_04_pandas.py
"""
from __future__ import annotations

import os
from typing import Optional, Tuple

import numpy as np
import pandas as pd


def section(title: str) -> None:
    print("\n=== " + title + " ===")


def create_series_dataframe() -> None:
    section("Series and DataFrame creation")
    s = pd.Series([10, 20, 30], name="score")
    df = pd.DataFrame(
        {"name": ["alice", "bob", "chad"], "score": [85, 91, 78], "passed": [True, True, False]}
    )
    print(s)
    print(df)

    arr = np.arange(6).reshape(3, 2)
    df2 = pd.DataFrame(arr, columns=["x", "y"], index=["a", "b", "c"])
    print(df2)


def dtypes_and_conversions() -> None:
    section("Dtypes and conversions")
    df = pd.DataFrame({"id": [1, 2, 3], "amount": [10.5, 20.0, 7.25], "name": ["a", "b", "c"]})
    print(df.dtypes)
    df["id"] = df["id"].astype("Int64")
    df["name"] = df["name"].astype("string")
    print(df.dtypes)

    raw = pd.Series(["1", "2", "x", None])
    conv = pd.to_numeric(raw, errors="coerce")
    print(conv)
    dates = pd.to_datetime(pd.Series(["2024-01-01", "2024-01-05"]))
    print("weekday:", dates.dt.dayofweek.tolist())


def indexing_and_selection() -> None:
    section("Indexing: loc, iloc, at, iat")
    df = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30]}, index=["r1", "r2", "r3"])
    print(df.loc["r2", "b"])
    print(df.loc["r1":"r3", ["a"]])
    print(df.iloc[1, 1])
    print(df.iloc[:, 0])
    print(df.at["r3", "a"], df.iat[0, 1])


def filtering_and_assignment() -> None:
    section("Filtering and assignment")
    people = pd.DataFrame(
        {"name": ["ann", "bob", "cara", "dan"], "age": [23, 35, 29, 41], "city": ["NY", "LA", "NY", "SF"]}
    )
    mask = (people["age"] >= 30) & (people["city"].isin(["LA", "SF"]))
    print(people[mask])
    people.loc[people["city"] == "NY", "age_group"] = "young-ish"
    people.loc[people["age"] >= 30, "age_group"] = "mature"
    print(people)


def missing_data() -> None:
    section("Missing data handling")
    data = pd.DataFrame({"x": [1, np.nan, 3, np.nan], "y": [10, 20, np.nan, 40]})
    print(data.isna().sum())
    filled = data.fillna({"x": data["x"].mean(), "y": 0})
    print(filled)
    print(data.ffill())
    print(data.bfill())
    print(data.dropna())


def compute_columns_and_apply() -> None:
    section("Compute columns: vectorized and apply")
    tx = pd.DataFrame({"price": [10.0, 20.0, 15.0], "qty": [2, 1, 3], "category": ["a", "b", "a"]})
    tx["total"] = tx["price"] * tx["qty"]

    def label_row(r: pd.Series) -> str:
        return f"{r['category']}-{int(r['total'])}"

    tx["label"] = tx.apply(label_row, axis=1)
    tx["cat_upper"] = tx["category"].str.upper()
    print(tx)


def groupby_agg_transform() -> None:
    section("GroupBy: aggregation and transform")
    sales = pd.DataFrame(
        {
            "city": ["NY", "NY", "SF", "LA", "SF", "LA"],
            "product": ["A", "B", "A", "B", "B", "A"],
            "revenue": [100, 80, 120, 60, 140, 90],
            "units": [5, 4, 6, 3, 7, 4],
        }
    )
    g = sales.groupby(["city", "product"], as_index=False).agg(
        revenue_sum=("revenue", "sum"),
        units_sum=("units", "sum"),
        avg_price=("revenue", lambda s: (s.sum() / sales.loc[s.index, "units"].sum())),
    )
    print(g)
    sales["rev_norm_city"] = sales["revenue"] / sales.groupby("city")["revenue"].transform("sum")
    print(sales)


def merge_and_join() -> None:
    section("Merge and join")
    users = pd.DataFrame({"uid": [1, 2, 3], "name": ["ann", "bob", "cara"]})
    orders = pd.DataFrame({"oid": [100, 101, 102, 103], "uid": [1, 2, 1, 99], "amount": [20, 35, 15, 50]})
    j = users.merge(orders, on="uid", how="inner")
    print(j)
    jl = users.merge(orders, on="uid", how="left")
    print(jl)
    left = pd.DataFrame({"user_id": [1, 2], "city": ["NY", "LA"]})
    print(users.merge(left, left_on="uid", right_on="user_id", how="left"))


def reshape_pivot_melt_stack() -> None:
    section("Reshape: pivot, melt, stack/unstack")
    long = pd.DataFrame({"id": [1, 1, 2, 2], "metric": ["m1", "m2", "m1", "m2"], "value": [10, 20, 30, 40]})
    wide = long.pivot(index="id", columns="metric", values="value").reset_index()
    print(wide)
    back = wide.melt(id_vars=["id"], var_name="metric", value_name="value")
    print(back)
    multi = long.set_index(["id", "metric"]).unstack("metric")
    print(multi)
    print(multi.stack())


def time_series_basics() -> None:
    section("Time series basics")
    rng = pd.date_range("2024-01-01", periods=10, freq="D")
    ts = pd.DataFrame({"y": np.arange(10)}, index=rng)
    print(ts.index)
    print(ts.resample("3D").sum())
    print(ts["y"].rolling(window=3, min_periods=1).mean())


def categoricals_memory() -> None:
    section("Categoricals and memory")
    df = pd.DataFrame({"color": ["red", "green", "red", "blue", "green", "green"]})
    df["color"] = df["color"].astype("category")
    print(df["color"].cat.categories)
    print(df.dtypes)


def efficient_io() -> None:
    section("Efficient IO: CSV, Parquet, Feather")
    df = pd.DataFrame({"a": np.arange(5), "b": np.linspace(0, 1, 5)})
    df.to_csv("sample.csv", index=False)
    r1 = pd.read_csv("sample.csv")
    print("csv:\n", r1)
    try:
        df.to_parquet("sample.parquet", index=False)
        r2 = pd.read_parquet("sample.parquet")
        print("parquet:\n", r2)
    except Exception as e:
        print("Parquet not available (pyarrow missing?)", e)
    try:
        df.to_feather("sample.feather")
        r3 = pd.read_feather("sample.feather")
        print("feather:\n", r3)
    except Exception as e:
        print("Feather not available (pyarrow missing?)", e)
    print("sizes (bytes):", os.path.getsize("sample.csv"), end="")
    if os.path.exists("sample.parquet"):
        print(",", os.path.getsize("sample.parquet"), end="")
    if os.path.exists("sample.feather"):
        print(",", os.path.getsize("sample.feather"), end="")
    print()


def performance_and_chunks() -> None:
    section("Performance tips and chunked CSV")
    # Chunked processing example
    total = 0
    for chunk in pd.read_csv("sample.csv", chunksize=2):
        total += chunk["a"].sum()
    print("total a:", total)
    # Vectorized expressions and query/eval examples
    df = pd.DataFrame({"x": np.arange(1_000_0), "y": np.arange(1_000_0)})
    df["z"] = df["x"] * df["y"]
    res = df.query("z > 1000").head()
    print(res.head())


def exercises_solutions() -> None:
    section("Exercises — sketches")
    # 1) Aggregations -> Parquet
    df = pd.DataFrame(
        {"cat": np.random.choice(list("ABCDE"), size=1000), "val": np.random.randn(1000) * 10 + 50}
    )
    agg = df.groupby("cat", observed=True)["val"].agg(["mean", "median", "std"]).reset_index()
    try:
        agg.to_parquet("agg.parquet", index=False)
        print("wrote agg.parquet")
    except Exception as e:
        print("Parquet not available:", e)

    # 2) Rolling per user
    tx = pd.DataFrame(
        {
            "user": np.random.choice(["u1", "u2", "u3"], size=100),
            "ts": pd.date_range("2024-01-01", periods=100, freq="H"),
            "amount": np.random.lognormal(mean=2.5, sigma=0.7, size=100),
        }
    )
    tx = tx.sort_values(["user", "ts"]).set_index("ts")
    roll = tx.groupby("user")["amount"].rolling("7D").sum().rename("sum7d").reset_index()
    merged = tx.reset_index().merge(roll, on=["user", "ts"], how="left")
    merged["delta"] = merged.groupby("user")["amount"].diff()
    print(merged.head())

    # 3) Data quality report
    def dq_report(frame: pd.DataFrame) -> pd.DataFrame:
        rows = []
        for col in frame.columns:
            s = frame[col]
            rows.append(
                {
                    "column": col,
                    "dtype": str(s.dtype),
                    "null_pct": float(s.isna().mean()),
                    "top_values": s.value_counts(dropna=False).head(3).to_dict(),
                }
            )
        return pd.DataFrame(rows)

    print(dq_report(pd.DataFrame({"a": [1, 1, 2, None, 3], "b": ["x", "x", "y", "z", "z"]})))


def main() -> int:
    create_series_dataframe()
    dtypes_and_conversions()
    indexing_and_selection()
    filtering_and_assignment()
    missing_data()
    compute_columns_and_apply()
    groupby_agg_transform()
    merge_and_join()
    reshape_pivot_melt_stack()
    time_series_basics()
    categoricals_memory()
    efficient_io()
    performance_and_chunks()
    exercises_solutions()
    print("\nModule 4 complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

# ------------------------------
# Additional commented examples
# ------------------------------

def more_indexing_examples() -> None:
    section("More indexing examples: boolean masks, safe assignment, copy semantics")
    df = pd.DataFrame({
        "name": ["ann", "bob", "cara", "dan"],
        "age": [23, 35, 29, 41],
        "city": ["NY", "LA", "NY", "SF"]
    })
    # Boolean mask + .loc for safe assignment (avoids SettingWithCopy)
    mask_ny = df["city"] == "NY"
    df.loc[mask_ny, "tier"] = "east"
    df.loc[~mask_ny, "tier"] = "west"
    print(df)

    # Avoid chained assignment: df[df["city"]=="NY"]["age"] = ...  # may warn and not work
    # Instead:
    df.loc[df["city"] == "NY", "age"] = df.loc[df["city"] == "NY", "age"] + 1
    print("After birthday for NY rows:\n", df)

    # When you need an independent object to mutate, use .copy()
    subset = df.loc[df["age"] >= 30, ["name", "age"]].copy()
    subset["flag"] = True
    print("Independent subset with copy():\n", subset)


def more_groupby_examples() -> None:
    section("More groupby examples: multiple aggs, nunique/size, transform")
    data = pd.DataFrame({
        "dept": ["a", "a", "b", "b", "b"],
        "user": ["u1", "u1", "u2", "u3", "u3"],
        "value": [10, 20, 30, 10, 50]
    })
    # Multiple named aggregations
    agg = data.groupby("dept", as_index=False).agg(
        total=("value", "sum"),
        mean=("value", "mean"),
        users=("user", "nunique"),
        rows=("user", "size"),
    )
    print(agg)

    # Group-wise z-score using transform (broadcast to original shape)
    g = data.groupby("dept")["value"]
    data["z"] = (data["value"] - g.transform("mean")) / g.transform("std")
    print("with z-score:\n", data)


def more_merge_examples() -> None:
    section("More merge examples: indicator, validate patterns")
    left = pd.DataFrame({"k": [1, 1, 2, 3], "lval": ["a", "b", "c", "d"]})
    right = pd.DataFrame({"k": [1, 2, 2], "rval": [100, 200, 250]})

    # indicator=True shows where each row originated (left_only, right_only, both)
    m = left.merge(right, on="k", how="outer", indicator=True)
    print(m)

    # validate asserts the merge cardinality; raises if violated
    # For example, ensure left is one-to-many on key 'k'
    try:
        ok = left.merge(right, on="k", how="left", validate="one_to_many")
        print("validate one_to_many OK (left):\n", ok.head())
    except Exception as e:
        print("validate failed:", e)


def pivot_table_examples() -> None:
    section("Pivot table examples: aggregation, margins, fill_value")
    long = pd.DataFrame({
        "id": [1,1,1,2,2,2],
        "metric": ["m1","m2","m3","m1","m2","m3"],
        "value": [10,20,30,11,19,35]
    })
    # pivot_table supports aggregation and margins
    pt = pd.pivot_table(
        long,
        index="id",
        columns="metric",
        values="value",
        aggfunc="mean",
        margins=True,            # add Grand Total row/col
        fill_value=0
    )
    print(pt)


def time_series_more_examples() -> None:
    section("Time series: tz-aware, shift/diff, centered rolling windows")
    idx = pd.date_range("2024-01-01", periods=10, freq="D", tz="UTC")
    ts = pd.DataFrame({"y": np.arange(10)}, index=idx)
    print("tz-aware index:", ts.index.tz)

    # Shift and diff for simple features
    ts["y_prev"] = ts["y"].shift(1)
    ts["delta"] = ts["y"].diff()
    print(ts.head(5))

    # Centered rolling mean with window=3
    ts["roll3_center"] = ts["y"].rolling(window=3, min_periods=1, center=True).mean()
    print(ts[["y", "roll3_center"]].head(6))


def io_read_csv_options() -> None:
    section("read_csv options: dtype, parse_dates, usecols, converters")
    # Create a sample CSV
    sample = pd.DataFrame({
        "date": ["2024-01-01", "2024-01-02", "2024-01-03"],
        "amount": ["10.5", "7.2", "not_a_number"],
        "city": ["NY", "LA", "SF"],
        "misc": ["x", "y", "z"],
    })
    sample.to_csv("io_sample.csv", index=False)

    def to_float_or_nan(s: str) -> float:
        try:
            return float(s)
        except Exception:
            return np.nan

    df = pd.read_csv(
        "io_sample.csv",
        usecols=["date", "amount", "city"],    # select only needed columns
        dtype={"city": "category"},            # enforce dtypes
        converters={"amount": to_float_or_nan},# custom parsing for a column
        parse_dates=["date"],                  # parse to datetime64[ns]
        infer_datetime_format=True
    )
    print(df.dtypes)
    print(df)

    # Read a subset of rows efficiently
    head2 = pd.read_csv("io_sample.csv", nrows=2)
    print("first 2 rows:\n", head2)


def performance_vectorize_vs_apply() -> None:
    section("Performance: vectorize vs apply (avoid row-wise where possible)")
    n = 100_000
    df = pd.DataFrame({
        "price": np.random.default_rng(0).normal(20.0, 5.0, size=n),
        "qty": np.random.default_rng(1).integers(1, 5, size=n),
    })

    # Vectorized expression
    t0 = pd.Timestamp.now()
    df["total_vec"] = df["price"] * df["qty"]
    dt_vec = (pd.Timestamp.now() - t0).total_seconds()

    # Row-wise apply (slower)
    def row_total(r: pd.Series) -> float:
        return float(r["price"]) * float(r["qty"])

    t0 = pd.Timestamp.now()
    df["total_apply"] = df.apply(row_total, axis=1)
    dt_apply = (pd.Timestamp.now() - t0).total_seconds()

    print(f"vectorized: {dt_vec:.4f}s, apply: {dt_apply:.4f}s, equal? {np.allclose(df['total_vec'], df['total_apply'])}")


def categoricals_memory_more() -> None:
    section("Categoricals: memory usage comparison")
    N = 50_000
    raw = pd.DataFrame({"city": np.random.choice(["NY","LA","SF","SEA","CHI"], size=N)})
    cat = raw.copy()
    cat["city"] = cat["city"].astype("category")
    raw_mem = raw["city"].memory_usage(deep=True)
    cat_mem = cat["city"].memory_usage(deep=True)
    print(f"raw bytes={raw_mem}, categorical bytes={cat_mem} (savings ~{(1 - cat_mem/raw_mem)*100:.1f}%)")


def gotchas_and_best_practices() -> None:
    section("Gotchas and best practices (comments)")
    notes = """
- Always use .loc for assignment with a boolean mask to avoid SettingWithCopy.
- Prefer vectorized operations; reserve apply/iterrows for cases that cannot be vectorized.
- When joining large tables, pre-cast dtypes of keys and consider 'category' for repeated strings.
- For time series, sort by datetime index and be explicit with timezone handling.
- Use parse_dates and dtype mapping in read_csv to reduce postprocessing.
- For groupby on categoricals, consider observed=True to drop unused categories and possibly speed up.
- For wide reshapes with many columns, prefer pivot_table with aggfunc and fill_value.
- Validate merge cardinality with validate='one_to_one'/'one_to_many' to catch data issues early.
"""
    print(notes)


# Extend main() to run new examples
def main_extended() -> None:
    more_indexing_examples()
    more_groupby_examples()
    more_merge_examples()
    pivot_table_examples()
    time_series_more_examples()
    io_read_csv_options()
    performance_vectorize_vs_apply()
    categoricals_memory_more()
    gotchas_and_best_practices()


# Call the extended section from the original main()
_old_main = main
def main() -> int:
    rc = _old_main()
    main_extended()
    return rc