#!/usr/bin/env python3
"""
Machine Learning with Scikit-learn — Module 5 teaching script.

This script demonstrates:
- Pipelines with preprocessing and models
- Proper train/validation splits and metrics
- Cross-validation and hyperparameter tuning
- Handling mixed numeric/categorical data
- Imbalanced data strategies and calibration
- Model persistence and basic interpretability

Run:
  python modules/05-ml-with-scikit-learn/module_05_sklearn.py
"""
from __future__ import annotations

import os
import json
from dataclasses import dataclass
from typing import Tuple, List, Optional

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score, average_precision_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.base import BaseEstimator, TransformerMixin
import joblib

def section(title: str) -> None:
    print("\n=== " + title + " ===")

def verify_versions() -> None:
    section("Verify versions")
    import sklearn
    print("numpy", np.__version__)
    print("pandas", pd.__version__)
    print("sklearn", sklearn.__version__)

def make_synthetic_tabular(n: int = 600, seed: int = 0) -> Tuple[pd.DataFrame, pd.Series]:
    """Create a small mixed-type dataset with some missing values."""
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "age": rng.integers(18, 70, size=n).astype(float),
        "income": rng.normal(50000, 15000, size=n),
        "city": rng.choice(["NY", "SF", "LA"], size=n),
        "owns_house": rng.choice([True, False], size=n),
        "label": rng.choice([0, 1], size=n, p=[0.6, 0.4]),
    })
    # Introduce some missing values
    df.loc[rng.choice(df.index, size=40, replace=False), "income"] = np.nan
    y = df["label"]
    X = df.drop(columns=["label"])
    return X, y

def iris_pipeline_demo() -> None:
    section("Quick start: Iris classification with Pipeline")
    from sklearn.datasets import load_iris
    X, y = load_iris(return_X_y=True)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
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

def tabular_pipeline_demo() -> Tuple[Pipeline, np.ndarray, np.ndarray]:
    section("Tabular Pipeline with ColumnTransformer")
    X, y = make_synthetic_tabular(800, seed=1)
    numeric = ["age", "income"]
    categorical = ["city", "owns_house"]
    pre = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), numeric),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder(handle_unknown="ignore"))]), categorical)
    ])
    clf = RandomForestClassifier(n_estimators=300, max_depth=None, n_jobs=-1, random_state=42)
    pipe = Pipeline([("pre", pre), ("clf", clf)])
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
    pipe.fit(Xtr, ytr)
    print("Holdout accuracy:", pipe.score(Xte, yte))
    return pipe, Xte.to_numpy(), yte.to_numpy()

def metrics_demo(pipe: Pipeline, Xte: np.ndarray, yte: np.ndarray) -> None:
    section("Metrics beyond accuracy")
    proba = pipe.predict_proba(Xte)[:, 1]
    pred = pipe.predict(Xte)
    print("Confusion:\n", confusion_matrix(yte, pred))
    print(classification_report(yte, pred, digits=3))
    try:
        print("ROC AUC:", roc_auc_score(yte, proba))
    except Exception as e:
        print("ROC AUC error:", e)
    try:
        print("PR AUC:", average_precision_score(yte, proba))
    except Exception as e:
        print("PR AUC error:", e)

def cross_validation_demo(pipe: Pipeline, X: pd.DataFrame, y: pd.Series) -> None:
    section("Cross-validation with StratifiedKFold")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc", n_jobs=-1)
    print("CV ROC AUC mean±std:", scores.mean(), scores.std())

def grid_search_demo(pipe: Pipeline, X: pd.DataFrame, y: pd.Series) -> GridSearchCV:
    section("GridSearchCV for hyperparameters")
    param_grid = {
        "clf__n_estimators": [200, 400],
        "clf__max_depth": [None, 8, 16],
        "clf__max_features": ["sqrt", "log2", None],
    }
    gcv = GridSearchCV(pipe, param_grid, cv=5, scoring="roc_auc", n_jobs=-1, verbose=0)
    gcv.fit(X, y)
    print("best params:", gcv.best_params_)
    print("best score:", gcv.best_score_)
    return gcv

def randomized_search_demo(pipe: Pipeline, X: pd.DataFrame, y: pd.Series) -> RandomizedSearchCV:
    section("RandomizedSearchCV for broader exploration")
    from scipy.stats import randint
    param_dist = {
        "clf__n_estimators": randint(100, 800),
        "clf__max_depth": [None] + list(range(4, 33, 4)),
    }
    rcv = RandomizedSearchCV(pipe, param_distributions=param_dist, n_iter=15, cv=5, scoring="roc_auc", n_jobs=-1, random_state=42, verbose=0)
    rcv.fit(X, y)
    print("rand best:", rcv.best_params_, rcv.best_score_)
    return rcv

class AgeBucketizer(BaseEstimator, TransformerMixin):
    """Custom transformer for feature engineering."""
    def __init__(self, bins: Tuple[int, int, int, int, int] = (0, 25, 35, 50, 100)):
        self.bins = np.array(bins)
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        x = np.asarray(X).ravel()
        binned = np.digitize(x, self.bins, right=False)
        return binned.reshape(-1, 1)

def custom_transformer_demo() -> None:
    section("Custom transformer in ColumnTransformer")
    X, y = make_synthetic_tabular(600, seed=2)
    pre = ColumnTransformer([
        ("agebin", Pipeline([
            ("impute", SimpleImputer(strategy="median")),
            ("bucket", AgeBucketizer(bins=(0, 30, 40, 60, 120))),
            ("oh", OneHotEncoder(handle_unknown="ignore"))
        ]), ["age"]),
        ("rest", Pipeline([
            ("impute", SimpleImputer(strategy="most_frequent")),
            ("oh", OneHotEncoder(handle_unknown="ignore"))
        ]), ["city", "owns_house"])
    ])
    clf = GradientBoostingClassifier(random_state=42)
    pipe = Pipeline([("pre", pre), ("clf", clf)])
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
    pipe.fit(Xtr, ytr)
    print("Holdout accuracy:", pipe.score(Xte, yte))

def imbalance_demo() -> None:
    section("Imbalanced data strategies")
    try:
        from imblearn.over_sampling import SMOTE
        from imblearn.pipeline import Pipeline as ImbPipeline
    except Exception as e:
        print("imbalanced-learn not installed; showing class_weight example.")
        X, y = make_synthetic_tabular(800, seed=3)
        pre = ColumnTransformer([
            ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("sc", StandardScaler())]), ["age", "income"]),
            ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder(handle_unknown="ignore"))]), ["city", "owns_house"])
        ])
        clf = LogisticRegression(class_weight="balanced", max_iter=1000, n_jobs=-1, random_state=42)
        pipe = Pipeline([("pre", pre), ("lr", clf)])
        Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
        pipe.fit(Xtr, ytr)
        print("Holdout acc:", pipe.score(Xte, yte))
        return
    # SMOTE example when imbalanced-learn is available
    X, y = make_synthetic_tabular(800, seed=3)
    pre = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("sc", StandardScaler())]), ["age", "income"]),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder(handle_unknown="ignore"))]), ["city", "owns_house"])
    ])
    from sklearn.tree import DecisionTreeClassifier
    imb_pipe = ImbPipeline(steps=[("pre", pre), ("smote", SMOTE(random_state=42)), ("tree", DecisionTreeClassifier(random_state=42))])
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
    imb_pipe.fit(Xtr, ytr)
    print("Holdout acc (SMOTE):", imb_pipe.score(Xte, yte))

def calibration_demo() -> None:
    section("Probability calibration")
    X, y = make_synthetic_tabular(800, seed=4)
    pre = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("sc", StandardScaler())]), ["age", "income"]),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder(handle_unknown="ignore"))]), ["city", "owns_house"])
    ])
    from sklearn.calibration import CalibratedClassifierCV
    base = RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42)
    cal = Pipeline([("pre", pre), ("cal", CalibratedClassifierCV(base, method="isotonic", cv=3, n_jobs=-1))])
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
    cal.fit(Xtr, ytr)
    proba = cal.predict_proba(Xte)[:, 1]
    print("Calibrated proba sample:", proba[:5])

def persistence_demo(pipe: Pipeline, Xte: np.ndarray, yte: np.ndarray) -> None:
    section("Model persistence with joblib and metadata")
    os.makedirs("artifacts", exist_ok=True)
    joblib.dump(pipe, "artifacts/pipeline.joblib")
    meta = {
        "trained_by": "module_05_sklearn",
        "sklearn_version": __import__("sklearn").__version__,
    }
    with open("artifacts/metadata.json", "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    loaded = joblib.load("artifacts/pipeline.joblib")
    pred = loaded.predict(Xte)
    print("Loaded OK, sample preds:", pred[:5])

def interpretability_demo(pipe: Pipeline, X: pd.DataFrame, y: pd.Series) -> None:
    section("Permutation importance (basic)")
    try:
        from sklearn.inspection import permutation_importance
    except Exception as e:
        print("Permutation importance not available:", e)
        return
    r = permutation_importance(pipe, X, y, n_repeats=5, random_state=42, n_jobs=-1)
    print("importances mean:", r.importances_mean[:10])

def main() -> int:
    verify_versions()
    iris_pipeline_demo()
    pipe, Xte, yte = tabular_pipeline_demo()
    metrics_demo(pipe, Xte, yte)
    X, y = make_synthetic_tabular(800, seed=5)
    # Build a consistent pipe for CV/tuning
    numeric = ["age", "income"]; categorical = ["city", "owns_house"]
    pre = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), numeric),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder(handle_unknown="ignore"))]), categorical)
    ])
    base_pipe = Pipeline([("pre", pre), ("clf", RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42))])
    cross_validation_demo(base_pipe, X, y)
    gcv = grid_search_demo(base_pipe, X, y)
    rcv = randomized_search_demo(base_pipe, X, y)
    custom_transformer_demo()
    imbalance_demo()
    calibration_demo()
    persistence_demo(pipe, Xte, yte)
    interpretability_demo(base_pipe, X, y)
    print("\nModule 5 complete.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

# ------------------------------
# Additional commented examples
# ------------------------------

def data_leakage_gotcha_example() -> None:
    """
    Demonstrate data leakage when preprocessing is fit on the full dataset
    before a train/test split, versus using Pipelines that fit inside CV/split.
    """
    section("Data leakage gotcha: fit transformer before split vs inside Pipeline")

    import numpy as np, pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import Pipeline

    rng = np.random.default_rng(0)
    n = 500
    X = pd.DataFrame({
        "x1": rng.normal(size=n),
        "x2": rng.normal(size=n),
        "x3": rng.normal(size=n),
    })
    y = (X["x1"]*0.7 + X["x2"]*0.2 + rng.normal(scale=0.5, size=n) > 0).astype(int)

    # BAD: fit on full data (leak info into test distribution)
    scaler = StandardScaler()
    X_scaled_bad = scaler.fit_transform(X)  # leakage
    Xtr_b, Xte_b, ytr_b, yte_b = train_test_split(X_scaled_bad, y, test_size=0.3, random_state=42, stratify=y)
    bad = LogisticRegression(max_iter=1000, n_jobs=-1).fit(Xtr_b, ytr_b)
    bad_acc = bad.score(Xte_b, yte_b)

    # GOOD: use Pipeline so scaler fits only on training folds
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    pipe = Pipeline([("sc", StandardScaler()), ("lr", LogisticRegression(max_iter=1000, n_jobs=-1))]).fit(Xtr, ytr)
    good_acc = pipe.score(Xte, yte)

    print({"bad_leakage_acc": float(bad_acc), "good_pipeline_acc": float(good_acc)})


def metrics_plots_examples(pipe: "Pipeline", Xte: "np.ndarray", yte: "np.ndarray") -> None:
    """
    Plot ROC and PR curves for the provided classifier pipeline on its test set.
    Keeps imports inside to avoid global dependencies if matplotlib isn't installed.
    """
    section("Metrics plots: ROC and Precision-Recall curves")
    try:
        import matplotlib.pyplot as plt
        from sklearn.metrics import roc_curve, precision_recall_curve, auc, average_precision_score
    except Exception as e:
        print("matplotlib/sklearn metrics plotting unavailable:", e)
        return

    if not hasattr(pipe, "predict_proba"):
        print("Model lacks predict_proba; skipping probability-based curves.")
        return

    proba = pipe.predict_proba(Xte)[:, 1]
    fpr, tpr, thr = roc_curve(yte, proba)
    prec, rec, thr_pr = precision_recall_curve(yte, proba)
    roc_auc = auc(fpr, tpr)
    pr_auc = average_precision_score(yte, proba)

    print({"roc_auc": float(roc_auc), "pr_auc": float(pr_auc)})

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8, 4))
    ax1.plot(fpr, tpr, label=f"ROC AUC={roc_auc:.3f}")
    ax1.plot([0, 1], [0, 1], "--", color="gray")
    ax1.set_title("ROC")
    ax1.set_xlabel("FPR"); ax1.set_ylabel("TPR")
    ax1.legend(loc="lower right")

    ax2.plot(rec, prec, label=f"PR AUC={pr_auc:.3f}")
    ax2.set_title("Precision-Recall")
    ax2.set_xlabel("Recall"); ax2.set_ylabel("Precision")
    ax2.legend(loc="lower left")

    plt.tight_layout()
    plt.show()


def threshold_tuning_example(pipe: "Pipeline", Xte: "np.ndarray", yte: "np.ndarray") -> None:
    """
    Tune classification threshold to maximize F1 on the validation/test set.
    """
    section("Threshold tuning for F1")
    from sklearn.metrics import precision_recall_curve, f1_score
    import numpy as np

    if not hasattr(pipe, "predict_proba"):
        print("Model lacks predict_proba; skipping threshold tuning.")
        return

    proba = pipe.predict_proba(Xte)[:, 1]
    prec, rec, thr = precision_recall_curve(yte, proba)
    f1 = 2 * prec * rec / (prec + rec + 1e-12)
    best_idx = int(np.nanargmax(f1))
    best_thr = thr[best_idx - 1] if best_idx > 0 else 0.5
    pred_thr = (proba >= best_thr).astype(int)
    print({"best_threshold": float(best_thr), "best_f1": float(f1[best_idx]), "holdout_f1": float(f1_score(yte, pred_thr))})


def calibration_curve_example(pipe: "Pipeline", Xte: "np.ndarray", yte: "np.ndarray") -> None:
    """
    Plot a reliability diagram (calibration curve) for classifier probabilities.
    """
    section("Calibration curve (reliability diagram)")
    try:
        import matplotlib.pyplot as plt
        from sklearn.calibration import calibration_curve
    except Exception as e:
        print("matplotlib/sklearn calibration unavailable:", e)
        return

    if not hasattr(pipe, "predict_proba"):
        print("Model lacks predict_proba; skipping calibration curve.")
        return

    proba = pipe.predict_proba(Xte)[:, 1]
    frac_pos, mean_pred = calibration_curve(yte, proba, n_bins=10)
    plt.figure(figsize=(4, 4))
    plt.plot(mean_pred, frac_pos, "o-", label="model")
    plt.plot([0, 1], [0, 1], "--", color="gray", label="perfect")
    plt.xlabel("Mean predicted probability")
    plt.ylabel("Fraction of positives")
    plt.title("Reliability diagram")
    plt.legend()
    plt.tight_layout()
    plt.show()


def regression_residuals_examples() -> None:
    """
    Regression diagnostics: residual scatter and simple error stats.
    """
    section("Regression diagnostics: residuals")
    try:
        import numpy as np, pandas as pd
        from sklearn.model_selection import train_test_split
        from sklearn.compose import ColumnTransformer
        from sklearn.pipeline import Pipeline
        from sklearn.impute import SimpleImputer
        from sklearn.preprocessing import OneHotEncoder, StandardScaler
        from sklearn.linear_model import ElasticNetCV
    except Exception as e:
        print("sklearn/pandas imports unavailable:", e)
        return

    rng = np.random.default_rng(123)
    n = 600
    df = pd.DataFrame({
        "rooms": rng.normal(3.0, 1.0, size=n).round().clip(1, 6),
        "area": rng.normal(90.0, 25.0, size=n),
        "city": rng.choice(["NY","SF","LA"], size=n),
        "price": 1000 * (rng.normal(3.0, 1.0, size=n) + 0.02*np.arange(n))
    })
    X = df.drop(columns=["price"]); y = df["price"]
    num = ["rooms", "area"]; cat = ["city"]
    pre = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer()), ("scale", StandardScaler())]), num),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder())]), cat),
    ])
    reg = Pipeline([("pre", pre), ("model", ElasticNetCV(cv=5, random_state=42))])

    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=42)
    reg.fit(Xtr, ytr)
    pred = reg.predict(Xte)
    resid = pred - yte.to_numpy()

    print({"resid_mean": float(resid.mean()), "resid_std": float(resid.std())})
    try:
        import matplotlib.pyplot as plt
        plt.figure(figsize=(5,4))
        plt.scatter(pred, resid, s=10, alpha=0.6)
        plt.axhline(0, color="gray", linestyle="--")
        plt.xlabel("Predicted price"); plt.ylabel("Residual (pred - true)")
        plt.title("Residual scatter")
        plt.tight_layout(); plt.show()
    except Exception as e:
        print("matplotlib not installed; skipping residual plot:", e)


def groupkfold_example() -> None:
    """
    Cross-validation that avoids leakage across groups (e.g., multiple rows per user).
    """
    section("GroupKFold example: avoid leakage across groups")
    try:
        import numpy as np, pandas as pd
        from sklearn.model_selection import GroupKFold
        from sklearn.pipeline import Pipeline
        from sklearn.preprocessing import StandardScaler
        from sklearn.linear_model import LogisticRegression
        from sklearn.metrics import roc_auc_score
    except Exception as e:
        print("sklearn imports unavailable:", e)
        return

    rng = np.random.default_rng(0)
    n_users = 30
    rows_per_user = 20
    users = np.repeat(np.arange(n_users), rows_per_user)
    n = len(users)
    X = pd.DataFrame({
        "feat": rng.normal(size=n),
        "user": users
    })
    y = (X["feat"] + rng.normal(scale=0.5, size=n) > 0).astype(int)
    pipe = Pipeline([("sc", StandardScaler()), ("lr", LogisticRegression(max_iter=1000, n_jobs=-1))])

    cv = GroupKFold(n_splits=5)
    aucs = []
    for tr_idx, te_idx in cv.split(X[["feat"]].to_numpy(), y.to_numpy(), groups=X["user"].to_numpy()):
        pipe.fit(X[["feat"]].to_numpy()[tr_idx], y.to_numpy()[tr_idx])
        proba = pipe.predict_proba(X[["feat"]].to_numpy()[te_idx])[:, 1]
        aucs.append(roc_auc_score(y.to_numpy()[te_idx], proba))
    print({"groupkfold_auc_mean": float(np.mean(aucs)), "groupkfold_auc_std": float(np.std(aucs))})


def feature_importance_examples(pipe: "Pipeline", Xte: "np.ndarray", yte: "np.ndarray") -> None:
    """
    Permutation importance on a trained pipeline to assess feature influence.
    """
    section("Permutation importance (feature influence)")
    try:
        from sklearn.inspection import permutation_importance
        import numpy as np
    except Exception as e:
        print("sklearn inspection unavailable:", e)
        return

    r = permutation_importance(pipe, Xte, yte, n_repeats=5, random_state=42, n_jobs=-1)
    print("importances mean (first 10):", r.importances_mean[:10])


def best_practices_notes() -> None:
    """
    Additional best practices commentary for ML pipelines and evaluation.
    """
    section("Best practices (comments)")
    notes = """
- Fit preprocessing inside Pipelines; never fit on full data before split/CV.
- Use appropriate CV strategies: StratifiedKFold for classification, GroupKFold for grouped data, TimeSeriesSplit for temporal.
- Pick metrics aligned with business goals: ROC AUC for ranking, PR AUC for rare positives, calibration for probability quality.
- Tune thresholds on validation data, not test, and report calibrated probabilities when downstream needs well-formed scores.
- Persist entire pipelines with joblib and store metadata (feature lists, versions, seeds).
- Validate merge cardinality and perform data quality checks before training to prevent silent leakage.
"""
    print(notes)


# Wire extended examples into main
def main_extended_for_module_05(pipe: "Pipeline", Xte: "np.ndarray", yte: "np.ndarray") -> None:
    data_leakage_gotcha_example()
    metrics_plots_examples(pipe, Xte, yte)
    threshold_tuning_example(pipe, Xte, yte)
    calibration_curve_example(pipe, Xte, yte)
    regression_residuals_examples()
    groupkfold_example()
    feature_importance_examples(pipe, Xte, yte)
    best_practices_notes()


# Patch the original main to also run extended examples
_old_main = main
def main() -> int:
    rc = _old_main()
    # Rebuild a tabular pipeline for the extended demos, matching earlier constructs
    from sklearn.compose import ColumnTransformer
    from sklearn.preprocessing import StandardScaler, OneHotEncoder
    from sklearn.pipeline import Pipeline
    from sklearn.impute import SimpleImputer
    from sklearn.ensemble import RandomForestClassifier
    import numpy as np, pandas as pd

    # Use the synthetic data builder from earlier make_synthetic_tabular
    X, y = make_synthetic_tabular(800, seed=11)
    numeric = ["age", "income"]; categorical = ["city", "owns_house"]
    pre = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), numeric),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder(handle_unknown="ignore"))]), categorical),
    ])
    pipe = Pipeline([("pre", pre), ("clf", RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42))])

    # Simple holdout split for plotting/tuning demos
    from sklearn.model_selection import train_test_split
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
    pipe.fit(Xtr, ytr)
    main_extended_for_module_05(pipe, Xte.to_numpy(), yte.to_numpy())
    return rc