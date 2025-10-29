# Machine Learning with Scikit-learn — Module 5

Goals
- Build reliable ML pipelines with preprocessing, model training, and evaluation
- Use cross-validation, hyperparameter tuning, and proper metrics
- Handle mixed numeric/categorical data via ColumnTransformer and Pipeline
- Address imbalanced data, calibration, and model persistence
- Apply best practices for reproducibility and performance

Prerequisites
- Completed NumPy and Pandas modules
- Python 3.10+ with scikit-learn installed

Folder for this module
- Work inside [modules/05-ml-with-scikit-learn](modules/05-ml-with-scikit-learn)

1) Install/verify
```bash
python -m pip install scikit-learn joblib pandas numpy matplotlib seaborn
python - << 'PY'
import sklearn, joblib, sklearn.linear_model
print("sklearn", sklearn.__version__)
PY
```

2) Quick start: classify Iris with a Pipeline
- Split data with stratification
- Standardize numeric features
- Train LogisticRegression
- Evaluate with accuracy and cross-validation

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

pipe = Pipeline(steps=[
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000, n_jobs=-1, random_state=42))
])

pipe.fit(Xtr, ytr)
pred = pipe.predict(Xte)
print("holdout acc:", accuracy_score(yte, pred))
print(classification_report(yte, pred))

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipe, X, y, cv=cv, scoring="accuracy", n_jobs=-1)
print("cv acc mean±std:", scores.mean(), scores.std())
```

3) Realistic tabular: ColumnTransformer with numeric/categorical
- Impute missing values
- Scale numeric features
- One-hot encode categoricals
- Fit a tree-based model (no scaling required, but pipeline keeps process consistent)

```python
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

# Synthetic dataset
rng = np.random.default_rng(0)
n = 600
df = pd.DataFrame({
    "age": rng.integers(18, 70, size=n).astype(float),
    "income": rng.normal(50_000, 15_000, size=n),
    "city": rng.choice(["NY","SF","LA"], size=n),
    "owns_house": rng.choice([True, False], size=n),
    "label": rng.choice([0,1], size=n, p=[0.6, 0.4])
})
# Introduce some missing
df.loc[rng.choice(df.index, size=40, replace=False), "income"] = np.nan

X = df.drop(columns=["label"])
y = df["label"]

numeric = ["age", "income"]
categorical = ["city", "owns_house"]

pre = ColumnTransformer([
    ("num", Pipeline([
        ("impute", SimpleImputer(strategy="median")),
        ("scale", StandardScaler())
    ]), numeric),
    ("cat", Pipeline([
        ("impute", SimpleImputer(strategy="most_frequent")),
        ("oh", OneHotEncoder(handle_unknown="ignore"))
    ]), categorical)
])

clf = RandomForestClassifier(
    n_estimators=300, max_depth=None, n_jobs=-1, random_state=42
)

pipe = Pipeline([
    ("pre", pre),
    ("clf", clf)
])

Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
pipe.fit(Xtr, ytr)
print("Holdout accuracy:", pipe.score(Xte, yte))
```

4) Metrics beyond accuracy
- For classification, use appropriate metrics based on class balance and business goals
- Macro/micro averaging for multi-class
- PR/ROC curves for thresholded models

```python
from sklearn.metrics import (
    confusion_matrix, classification_report,
    roc_auc_score, average_precision_score
)

proba = pipe.predict_proba(Xte)[:, 1]
pred = pipe.predict(Xte)
print("Confusion:\n", confusion_matrix(yte, pred))
print(classification_report(yte, pred, digits=3))
print("ROC AUC:", roc_auc_score(yte, proba))
print("PR AUC:", average_precision_score(yte, proba))
```

5) Cross-validation strategies
- KFold/StratifiedKFold for standard ML
- GroupKFold when leakage across groups must be avoided
- TimeSeriesSplit for temporal data

```python
from sklearn.model_selection import StratifiedKFold, cross_val_score

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc", n_jobs=-1)
print("CV ROC AUC mean±std:", scores.mean(), scores.std())
```

6) Hyperparameter tuning: GridSearchCV and RandomizedSearchCV
- Use pipelines so preprocessing is refit inside CV
- Define param grid via step__param syntax

```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from scipy.stats import randint

param_grid = {
    "clf__n_estimators": [200, 400, 600],
    "clf__max_depth": [None, 8, 16, 32],
    "clf__max_features": ["sqrt", "log2", None],
}
gcv = GridSearchCV(
    pipe, param_grid, cv=5, scoring="roc_auc", n_jobs=-1, verbose=1
)
gcv.fit(X, y)
print("best params:", gcv.best_params_)
print("best score:", gcv.best_score_)

# Randomized search (useful for large spaces)
param_dist = {
    "clf__n_estimators": randint(100, 800),
    "clf__max_depth": [None] + list(range(4, 33, 4)),
}
rcv = RandomizedSearchCV(
    pipe, param_distributions=param_dist, n_iter=20,
    cv=5, scoring="roc_auc", n_jobs=-1, random_state=42, verbose=1
)
rcv.fit(X, y)
print("rand best:", rcv.best_params_, rcv.best_score_)
```

7) Custom transformers for feature engineering
- Create reusable, testable feature logic
- Follow the fit/transform API and inherit from BaseEstimator, TransformerMixin

```python
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin

class AgeBucketizer(BaseEstimator, TransformerMixin):
    def __init__(self, bins=(0, 25, 35, 50, 100)):
        self.bins = np.array(bins)
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        # X is 2D array for a single numeric column or DataFrame
        x = np.asarray(X).ravel()
        binned = np.digitize(x, self.bins, right=False)
        return binned.reshape(-1, 1)

# Integrate into ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

pre2 = ColumnTransformer([
    ("agebin", Pipeline([
        ("impute", SimpleImputer(strategy="median")),
        ("bucket", AgeBucketizer(bins=(0, 30, 40, 60, 120))),
        ("oh", OneHotEncoder(handle_unknown="ignore"))
    ]), ["age"]),
    # add other columns as before...
])
```

8) Imbalanced data
- Try class_weight="balanced" if the model supports it
- Consider threshold tuning on predicted probabilities
- Optionally use resampling techniques (SMOTE) with imbalanced-learn

```python
from sklearn.linear_model import LogisticRegression
imb_clf = Pipeline([
    ("pre", pre),
    ("lr", LogisticRegression(class_weight="balanced", max_iter=1000, n_jobs=-1, random_state=42))
])
imb_clf.fit(Xtr, ytr)
```

Optional: SMOTE in a pipeline (requires imbalanced-learn)
```bash
python -m pip install imbalanced-learn
```

```python
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.tree import DecisionTreeClassifier

imb_pipe = ImbPipeline(steps=[
    ("pre", pre),
    ("smote", SMOTE(random_state=42)),
    ("tree", DecisionTreeClassifier(random_state=42))
])
imb_pipe.fit(Xtr, ytr)
```

9) Calibration: reliable probabilities
- Many models are not well-calibrated out of the box
- Use CalibratedClassifierCV with cv and method set to "sigmoid" or "isotonic"

```python
from sklearn.calibration import CalibratedClassifierCV
base = RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42)
cal = Pipeline([
    ("pre", pre),
    ("cal", CalibratedClassifierCV(base, method="isotonic", cv=3, n_jobs=-1))
])
cal.fit(Xtr, ytr)
proba = cal.predict_proba(Xte)[:, 1]
```

10) Regression example
- Pipeline with numeric scaler and categorical encoder
- Lasso regression with cross-validated alpha

```python
import pandas as pd, numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LassoCV
from sklearn.metrics import r2_score, mean_absolute_error

rng = np.random.default_rng(1)
n = 500
df = pd.DataFrame({
    "rooms": rng.normal(3.0, 1.0, size=n).round().clip(1, 6),
    "area": rng.normal(90.0, 25.0, size=n),
    "city": rng.choice(["NY","SF","LA"], size=n),
    "price": 1000 * (rng.normal(3.0, 1.0, size=n) + 0.02*np.arange(n))
})
X = df.drop(columns=["price"])
y = df["price"]

num = ["rooms", "area"]
cat = ["city"]
pre = ColumnTransformer([
    ("num", Pipeline([("impute", SimpleImputer()), ("scale", StandardScaler())]), num),
    ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder())]), cat)
])
reg = Pipeline([("pre", pre), ("model", LassoCV(cv=5, random_state=42, n_jobs=-1))])

Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=42)
reg.fit(Xtr, ytr)
pred = reg.predict(Xte)
print("R2:", r2_score(yte, pred))
print("MAE:", mean_absolute_error(yte, pred))
```

11) Model persistence with joblib
- Save the entire pipeline (preprocessing + model)
- Keep versions and training metadata for reproducibility

```python
import joblib, time, os, json
from datetime import datetime

meta = {
    "trained_at": datetime.utcnow().isoformat() + "Z",
    "sklearn_version": __import__("sklearn").__version__,
    "algorithm": type(pipe.named_steps["clf"]).__name__,
    "random_state": 42
}
os.makedirs("artifacts", exist_ok=True)
joblib.dump(pipe, "artifacts/churn_pipeline.joblib")
with open("artifacts/metadata.json", "w", encoding="utf-8") as f:
    json.dump(meta, f, indent=2)

# Load later
loaded = joblib.load("artifacts/churn_pipeline.joblib")
print("Loaded OK:", loaded.predict(Xte)[:5])
```

12) Reproducibility checklist
- Fix random_state everywhere (splits, models, samplers)
- Log dataset versions, feature lists, and preprocessing params
- Use Pip/UV lockfiles to freeze library versions
- Store training and evaluation scripts; serialize the exact pipeline
- Use cross-validation with a fixed CV splitter (with RNG seed if shuffling)

13) Interpretability and diagnostics
- Permutation importance
- Partial dependence plots (PDP)
- Learning curves

```python
import numpy as np
from sklearn.inspection import permutation_importance, PartialDependenceDisplay
import matplotlib.pyplot as plt

# Permutation importance (works on the final estimator; for pipelines use rcv.best_estimator_)
r = permutation_importance(pipe, Xte, yte, n_repeats=10, random_state=42, n_jobs=-1)
print("perm importance:", r.importances_mean)

# PDP on numeric input columns only (needs feature names post-transform if pipeline)
# For demo, run on a simple model without ColumnTransformer
X_simple, y_simple = load_iris(return_X_y=True)
simple = Pipeline([("sc", StandardScaler()), ("lr", LogisticRegression(max_iter=1000))]).fit(X_simple, y_simple)
fig = PartialDependenceDisplay.from_estimator(simple, X_simple, features=[0, 1])
plt.tight_layout(); plt.show()
```

14) End-to-end training script (template)

Save as train.py (optional)
```python
import argparse, json, joblib
from datetime import datetime
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier

def build_pipeline(numeric, categorical):
    pre = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("sc", StandardScaler())]), numeric),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder(handle_unknown='ignore'))]), categorical),
    ])
    clf = RandomForestClassifier(n_estimators=400, random_state=42, n_jobs=-1)
    return Pipeline([("pre", pre), ("clf", clf)])

def main(args):
    df = pd.read_csv(args.csv)
    y = df[args.target]
    X = df.drop(columns=[args.target])
    # Infer basic column types if not provided explicitly
    numeric = X.select_dtypes(include=["number", "float", "int", "float64", "int64"]).columns.tolist()
    categorical = [c for c in X.columns if c not in numeric]
    pipe = build_pipeline(numeric, categorical)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(pipe, X, y, cv=cv, scoring=args.scoring, n_jobs=-1)
    print({"cv_mean": float(scores.mean()), "cv_std": float(scores.std())})
    pipe.fit(Xtr, ytr)
    print("holdout score:", pipe.score(Xte, yte))
    joblib.dump(pipe, args.model_out)
    meta = {
        "trained_at": datetime.utcnow().isoformat()+"Z",
        "target": args.target,
        "scoring": args.scoring,
        "numeric": numeric,
        "categorical": categorical
    }
    with open(args.meta_out, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True)
    ap.add_argument("--target", required=True)
    ap.add_argument("--model-out", default="model.joblib")
    ap.add_argument("--meta-out", default="meta.json")
    ap.add_argument("--scoring", default="roc_auc")
    args = ap.parse_args()
    main(args)
```

Run
```bash
python train.py --csv data.csv --target label --scoring roc_auc --model-out artifacts/model.joblib --meta-out artifacts/meta.json
```

15) Common pitfalls and how to avoid them
- Data leakage: fit preprocessing inside cross-validation via Pipelines; never fit on full data before split
- Incorrect metrics: optimize for your real target (e.g., ROC AUC for ranking, PR AUC for rare positive)
- Imbalanced data: avoid raw accuracy; use stratified splits, class_weight, and threshold tuning
- Feature scaling: scale only numeric features; tree models don’t need scaling but pipelines still helpful
- Reproducibility: set seeds everywhere; serialize pipeline; lock dependencies

16) Exercises
- Classification
  - Build a Pipeline with ColumnTransformer for a mixed dataset (create synthetic if needed); compare LogisticRegression, RandomForest, and XGBoost or GradientBoostingClassifier via cross-validation on ROC AUC.
  - Perform RandomizedSearchCV on the top model; report best params and score; evaluate on holdout with ROC and PR curves.
- Regression
  - Build a regression Pipeline with StandardScaler + ElasticNetCV; report R2 and MAE; perform residual analysis scatter plots.
- Imbalance
  - Given an imbalanced dataset (5% positives), train a calibrated model; pick a threshold to maximize F1 on validation; report confusion matrix on holdout.
- Persistence
  - Save the trained pipeline; write a small predict.py that loads the model and predicts for a JSON row.
- Feature engineering
  - Implement a custom transformer that extracts text length and word count from a text column; compare a model with and without these features.

17) Solutions (sketches)
```python
# 1) Compare models
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
models = [
    ("lr", LogisticRegression(max_iter=1000, n_jobs=-1, random_state=42)),
    ("rf", RandomForestClassifier(n_estimators=400, n_jobs=-1, random_state=42)),
    ("gb", GradientBoostingClassifier(random_state=42))
]
res = {}
for name, est in models:
    pipe = Pipeline([("pre", pre), ("est", est)])
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc", n_jobs=-1)
    res[name] = (scores.mean(), scores.std())
print(res)

# 2) Threshold tuning for F1
from sklearn.metrics import f1_score, precision_recall_curve
proba = cal.predict_proba(Xte)[:, 1]
prec, rec, thr = precision_recall_curve(yte, proba)
import numpy as np
f1 = 2*prec*rec/(prec+rec+1e-12)
best_idx = np.nanargmax(f1)
best_thr = thr[best_idx-1] if best_idx > 0 else 0.5
print("best threshold:", best_thr, "F1:", f1[best_idx])
pred_thr = (proba >= best_thr).astype(int)
```

18) When to consider other tools
- Large-scale tabular with feature stores and experiments: use MLflow/Weights&Biases and feature storage
- Distributed or out-of-memory: Dask-ML, Spark MLlib
- AutoML for quick baselines: sklearn’s HalvingGridSearch or external AutoML libraries

Next module
- Proceed to [modules/06-deep-learning-foundations](modules/06-deep-learning-foundations) for PyTorch/TensorFlow basics