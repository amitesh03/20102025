# Pandas — Module 4

Goals
- Master Series and DataFrame creation, indexing, selection, and assignment
- Handle missing data, categorical types, and time series
- Perform common transforms: groupby, merge/join, reshape (pivot/melt)
- Read/write data efficiently (CSV/Parquet), and optimize performance

Prerequisites
- Completed NumPy module
- Python 3.10+ with pandas installed

Folder for this module
- Work inside modules/04-pandas

1) Install/verify
```bash
python -m pip install pandas pyarrow
python - << 'PY'
import pandas as pd, numpy as np
print("pandas", pd.__version__)
print("numpy", np.__version__)
PY
```

2) Series and DataFrame creation
```python
import pandas as pd
import numpy as np

# From Python lists/dicts
s = pd.Series([10, 20, 30], name="score")
df = pd.DataFrame({
    "name": ["alice", "bob", "chad"],
    "score": [85, 91, 78],
    "passed": [True, True, False],
})
print(s)
print(df)

# From NumPy arrays and with explicit index
arr = np.arange(6).reshape(3, 2)
df2 = pd.DataFrame(arr, columns=["x", "y"], index=["a", "b", "c"])
print(df2)
```

3) Dtypes and conversions
```python
print(df.dtypes)
df["score"] = df["score"].astype("Int64")   # nullable integer
df["name"] = df["name"].astype("string")    # pandas string dtype
print(df.dtypes)

# to_numeric, to_datetime, to_timedelta helpers
raw = pd.Series(["1", "2", "x", None])
conv = pd.to_numeric(raw, errors="coerce")
print(conv)
dates = pd.to_datetime(pd.Series(["2024-01-01", "2024-01-05"]))
print(dates.dt.dayofweek)
```

4) Indexing: loc, iloc, at, iat
```python
df = pd.DataFrame({"a": [1,2,3], "b": [10,20,30]}, index=["r1","r2","r3"])

# Label-based
print(df.loc["r2", "b"])
print(df.loc["r1":"r3", ["a"]])

# Position-based
print(df.iloc[1, 1])
print(df.iloc[:, 0])

# Fast scalar access
print(df.at["r3", "a"], df.iat[0, 1])
```

5) Selection, filtering, assignment (view vs copy)
```python
people = pd.DataFrame({
    "name": ["ann", "bob", "cara", "dan"],
    "age": [23, 35, 29, 41],
    "city": ["NY", "LA", "NY", "SF"]
})

# Filtering (boolean mask)
mask = (people["age"] >= 30) & (people["city"].isin(["LA","SF"]))
print(people[mask])

# Assignment with loc (preferred)
people.loc[people["city"] == "NY", "age_group"] = "young-ish"
people.loc[people["age"] >= 30, "age_group"] = "mature"
print(people)

# Avoid chained assignment: people[mask]["col"] = ...  # may warn and not set
```

6) Missing data: NaN/NA and fill strategies
```python
data = pd.DataFrame({
    "x": [1, np.nan, 3, np.nan],
    "y": [10, 20, np.nan, 40]
})

print(data.isna().sum())

# Fill with scalar or per-column dict
filled = data.fillna({"x": data["x"].mean(), "y": 0})
print(filled)

# Forward/backward fill (time series friendly)
print(data.ffill())
print(data.bfill())

# Drop rows with any/all missing
print(data.dropna())            # any missing dropped
print(data.dropna(how="all"))   # only rows where all are missing
```

7) Compute columns: vectorized ops and apply
```python
tx = pd.DataFrame({
    "price": [10.0, 20.0, 15.0],
    "qty": [2, 1, 3],
    "category": ["a", "b", "a"]
})
tx["total"] = tx["price"] * tx["qty"]

# row-wise apply (slower; use sparingly)
def label_row(r):
    return f"{r['category']}-{int(r['total'])}"
tx["label"] = tx.apply(label_row, axis=1)
print(tx)

# vectorized string ops
tx["cat_upper"] = tx["category"].str.upper()
print(tx)
```

8) GroupBy: split-apply-combine
```python
sales = pd.DataFrame({
    "city": ["NY","NY","SF","LA","SF","LA"],
    "product": ["A","B","A","B","B","A"],
    "revenue": [100, 80, 120, 60, 140, 90],
    "units": [5, 4, 6, 3, 7, 4],
})

g = sales.groupby(["city", "product"], as_index=False).agg(
    revenue_sum=("revenue", "sum"),
    units_sum=("units", "sum"),
    avg_price=("revenue", lambda s: (s.sum() / sales.loc[s.index, "units"].sum()))
)
print(g)

# Groupwise transforms (broadcast shape back to original)
sales["rev_norm_city"] = sales["revenue"] / sales.groupby("city")["revenue"].transform("sum")
print(sales)
```

9) Merge/join: one-to-one, one-to-many, many-to-many
```python
users = pd.DataFrame({
    "uid": [1, 2, 3],
    "name": ["ann", "bob", "cara"]
})
orders = pd.DataFrame({
    "oid": [100, 101, 102, 103],
    "uid": [1, 2, 1, 99],
    "amount": [20, 35, 15, 50]
})

# inner join on uid
j = users.merge(orders, on="uid", how="inner")
print(j)

# left join keeps all users, marks unmatched with NaN
jl = users.merge(orders, on="uid", how="left")
print(jl)

# joining on different key names
left = pd.DataFrame({"user_id":[1,2], "city":["NY","LA"]})
print(users.merge(left, left_on="uid", right_on="user_id", how="left"))
```

10) Reshaping: pivot, melt, stack/unstack
```python
long = pd.DataFrame({
    "id":[1,1,2,2],
    "metric":["m1","m2","m1","m2"],
    "value":[10,20,30,40]
})
wide = long.pivot(index="id", columns="metric", values="value").reset_index()
print(wide)

# Melt to long form
back = wide.melt(id_vars=["id"], var_name="metric", value_name="value")
print(back)

# MultiIndex with stack/unstack
multi = long.set_index(["id","metric"]).unstack("metric")
print(multi)
print(multi.stack())
```

11) Time series basics: DateTimeIndex, resample, rolling
```python
rng = pd.date_range("2024-01-01", periods=10, freq="D")
ts = pd.DataFrame({"y": np.arange(10)}, index=rng)
print(ts.index)

# Resample by 3-day sum
print(ts.resample("3D").sum())

# Rolling window statistics
print(ts["y"].rolling(window=3, min_periods=1).mean())
```

12) Categorical data for memory and speed
```python
df = pd.DataFrame({
    "color": ["red","green","red","blue","green","green"]
})
df["color"] = df["color"].astype("category")
print(df["color"].cat.categories)
print(df.dtypes)
```

13) String, datetime, and regex helpers
```python
s = pd.Series(["alice.smith@example.com","bob@example.org", None], dtype="string")
print(s.str.split("@", expand=True))
print(s.str.contains(r"@example\.", na=False))

d = pd.to_datetime(pd.Series(["2024/01/02","03-01-2024"]))
print(d.dt.year, d.dt.dayofyear)
```

14) Efficient IO: CSV, Parquet, feather
```python
import os
df = pd.DataFrame({"a": np.arange(5), "b": np.linspace(0,1,5)})
df.to_csv("sample.csv", index=False)
r1 = pd.read_csv("sample.csv")
print(r1)

# Parquet (columnar; uses pyarrow)
df.to_parquet("sample.parquet", index=False)
r2 = pd.read_parquet("sample.parquet")
print(r2)

# Feather (fast columnar; also arrow)
df.to_feather("sample.feather")
r3 = pd.read_feather("sample.feather")
print(r3)

print("sizes:", os.path.getsize("sample.csv"), os.path.getsize("sample.parquet"), os.path.getsize("sample.feather"))
```

15) Performance tips
- Prefer vectorized operations; minimize row-wise apply
- Use categoricals for repeated strings
- Use appropriate dtypes (Int64, float32) to reduce memory
- Use .loc for assignment; avoid chained indexing
- For large CSVs: use chunksize to stream, or switch to Parquet
- For groupby on large data: pre-sort by group keys, consider observed=True on categoricals
- Use eval/query for some expression speedups (experiment and verify correctness)

```python
# Chunked CSV processing
total = 0
for chunk in pd.read_csv("sample.csv", chunksize=2):
    total += chunk["a"].sum()
print("total a:", total)
```

16) Pipe pattern for readable multi-step transforms
```python
def add_total(df):
    return df.assign(total=df["price"] * df["qty"])

def filter_min_total(df, min_total=20):
    return df.query("total >= @min_total")

df = pd.DataFrame({"price":[10,5,12], "qty":[2,4,1]})
res = (df.pipe(add_total)
         .pipe(filter_min_total, min_total=15)
         .assign(flag=lambda d: d["total"] > 18))
print(res)
```

17) Validate expectations with checks
```python
orders = pd.DataFrame({"amount":[10,15,20, -1]})
assert (orders["amount"] >= 0).all(), "negative amount detected"
```

18) Quick plotting (optional)
```python
import matplotlib.pyplot as plt

df = pd.DataFrame({"x": np.arange(10), "y": np.cumsum(np.random.default_rng(0).normal(size=10))})
ax = df.plot(x="x", y="y", title="Trend")
ax.set_xlabel("step"); ax.set_ylabel("y")
plt.show()
```

19) Exercises
- Read a large CSV (or generate synthetic), compute per-category mean/median/std of a value, write result to Parquet
- Given transaction logs (user, ts, amount), compute rolling 7-day sum per user and last transaction delta
- Reshape a “long” dataset with many metrics into a wide format, do groupby aggregations, then melt back
- Build a data quality report: null percentages per column, top 5 frequent values, inferred dtype, and simple range checks
- Convert text columns with limited vocab to categoricals, measure memory savings

20) Solutions (sketches)
```python
# 1) Aggregations -> Parquet
import pandas as pd, numpy as np
df = pd.DataFrame({
    "cat": np.random.choice(list("ABCDE"), size=10_000),
    "val": np.random.randn(10_000)*10 + 50
})
agg = df.groupby("cat", observed=True)["val"].agg(["mean","median","std"]).reset_index()
agg.to_parquet("agg.parquet", index=False)

# 2) Rolling per user
tx = pd.DataFrame({
    "user": np.random.choice(["u1","u2","u3"], size=1000),
    "ts": pd.date_range("2024-01-01", periods=1000, freq="H"),
    "amount": np.random.lognormal(mean=2.5, sigma=0.7, size=1000)
})
tx = tx.sort_values(["user","ts"]).set_index("ts")
roll = tx.groupby("user")["amount"].rolling("7D").sum().rename("sum7d").reset_index()
merged = tx.reset_index().merge(roll, on=["user","ts"], how="left")
merged["delta"] = merged.groupby("user")["amount"].diff()
print(merged.head())

# 3) Wide -> group -> long
long = pd.DataFrame({
    "id":[1,1,1,2,2,2],
    "metric":["m1","m2","m3","m1","m2","m3"],
    "value":[10,20,30,11,19,35]
})
wide = long.pivot(index="id", columns="metric", values="value").reset_index()
g = wide.agg({"m1":"mean","m2":"mean","m3":"sum"})
back = wide.melt(id_vars="id", var_name="metric", value_name="value")
print(wide.head(), g, back.head())

# 4) Data quality report
def dq_report(df: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for col in df.columns:
        s = df[col]
        null_pct = s.isna().mean()
        top = s.value_counts(dropna=False).head(5).to_dict()
        rows.append({
            "column": col,
            "dtype": str(s.dtype),
            "null_pct": round(float(null_pct), 4),
            "top_values": top
        })
    return pd.DataFrame(rows)

print(dq_report(pd.DataFrame({
    "a":[1,1,2,None,3],
    "b":["x","x","y","z","z"],
    "c":pd.to_datetime(["2024-01-01",None,"2024-01-03","2024-01-04","2024-01-05"])
})))

# 5) Categoricals memory
N = 100_000
raw = pd.DataFrame({"city": np.random.choice(["NY","LA","SF"], size=N)})
cat = raw.copy()
cat["city"] = cat["city"].astype("category")
print(raw["city"].memory_usage(deep=True), cat["city"].memory_usage(deep=True))
```

21) When to switch to other tools
- Heavy numerical arrays and linear algebra: use NumPy and vectorized algorithms
- Very large datasets (10s of GBs): consider Polars, DuckDB, or database engines
- Distributed processing: Dask, Spark; or push compute to warehouses (e.g., BigQuery)

Next module
- Proceed to modules/05-ml-with-scikit-learn for traditional ML pipelines