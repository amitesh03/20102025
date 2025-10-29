#!/usr/bin/env python3
"""
Deep Learning Foundations — Module 6 teaching script.

This script demonstrates:
- Autograd with PyTorch and TensorFlow
- Synthetic dataset generation and splitting
- PyTorch: Dataset/DataLoader, model, training loop, AMP, TensorBoard, checkpoints
- TensorFlow/Keras: model building, callbacks (EarlyStopping, ModelCheckpoint, TensorBoard), mixed precision
- Decision boundary visualization
- Reproducibility setups and device handling
- Exporting models (TorchScript, Keras/SavedModel)

Run:
  python modules/06-deep-learning-foundations/module_06_deep_learning.py --framework torch
  python modules/06-deep-learning-foundations/module_06_deep_learning.py --framework tf
  python modules/06-deep-learning-foundations/module_06_deep_learning.py --framework both
"""

from __future__ import annotations

import argparse
import os
import sys
import math
import time
from dataclasses import dataclass
from typing import Tuple, Optional

import numpy as np


# ---------- Utilities ----------

def section(title: str) -> None:
    print("\n=== " + title + " ===")


def set_global_seeds(seed: int = 42) -> None:
    """Set Python/NumPy seeds. Framework-specific seeds handled inside each section."""
    import random
    random.seed(seed)
    np.random.seed(seed)


def make_synth(n: int = 2000, seed: int = 0) -> Tuple[np.ndarray, np.ndarray]:
    """Create a simple 2D synthetic classification dataset."""
    rng = np.random.default_rng(seed)
    x1 = rng.normal(loc=0.0, scale=0.8, size=(n // 2, 2)) + np.array([0.0, 0.0])
    x2 = rng.normal(loc=0.0, scale=0.8, size=(n // 2, 2)) + np.array([2.5, 2.5])
    X = np.vstack([x1, x2]).astype(np.float32)
    y = np.array([0] * (n // 2) + [1] * (n // 2), dtype=np.int64)
    idx = rng.permutation(n)
    return X[idx], y[idx]


def train_val_split(X: np.ndarray, y: np.ndarray, val_ratio: float = 0.2) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    n = len(X)
    n_tr = int(n * (1.0 - val_ratio))
    return X[:n_tr], y[:n_tr], X[n_tr:], y[n_tr:]


def plot_boundary(predict_proba, X: np.ndarray, y: np.ndarray, title: str = "Decision boundary") -> None:
    """Plot decision boundary using provided predict_proba(grid)->prob_1 function."""
    import matplotlib.pyplot as plt
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 200), np.linspace(y_min, y_max, 200))
    grid = np.c_[xx.ravel(), yy.ravel()].astype(np.float32)
    probs = predict_proba(grid).reshape(xx.shape)
    plt.figure(figsize=(6, 5))
    plt.contourf(xx, yy, probs, levels=20, cmap="RdBu", alpha=0.6)
    plt.scatter(X[:, 0], X[:, 1], c=y, cmap="RdBu", edgecolor="k", s=20)
    plt.title(title)
    plt.tight_layout()
    plt.show()


# ---------- Autograd demos ----------

def autograd_torch_demo() -> None:
    section("PyTorch autograd demo")
    try:
        import torch
    except Exception as e:
        print("PyTorch not installed; skip demo. Error:", e)
        return

    torch.manual_seed(42)
    x = torch.tensor([3.0], requires_grad=True)
    y = x**2 + 2 * x + 1
    y.backward()  # dy/dx = 2x + 2 at x=3 -> 8
    print("x.grad:", x.grad.item())

    with torch.no_grad():
        z = x * 10
    print("z.requires_grad:", z.requires_grad)

    w = torch.tensor([1.0], requires_grad=True)
    for step in range(3):
        loss = (w - 5) ** 2
        loss.backward()
        print("grad step", step, ":", w.grad.item())
        w.data -= 0.1 * w.grad
        w.grad.zero_()
    print("final w:", w.item())


def autograd_tf_demo() -> None:
    section("TensorFlow autograd demo")
    try:
        import tensorflow as tf
    except Exception as e:
        print("TensorFlow not installed; skip demo. Error:", e)
        return

    tf.random.set_seed(42)
    x = tf.Variable(3.0)
    with tf.GradientTape() as tape:
        y = x**2 + 2 * x + 1
    dy_dx = tape.gradient(y, x)
    print("dy/dx:", float(dy_dx.numpy()))


# ---------- PyTorch training ----------

def torch_train() -> None:
    section("PyTorch training (MLP on synthetic 2D data)")
    try:
        import torch
        from torch import nn
        from torch.utils.data import TensorDataset, DataLoader
    except Exception as e:
        print("PyTorch not installed; skip training. Error:", e)
        return

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("device:", device)
    torch.manual_seed(42)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(42)

    X, y = make_synth(4000, seed=1)
    Xtr, ytr, Xte, yte = train_val_split(X, y, val_ratio=0.2)

    tr_ds = TensorDataset(torch.from_numpy(Xtr), torch.from_numpy(ytr))
    te_ds = TensorDataset(torch.from_numpy(Xte), torch.from_numpy(yte))
    tr_dl = DataLoader(tr_ds, batch_size=64, shuffle=True, num_workers=0)
    te_dl = DataLoader(te_ds, batch_size=256, shuffle=False)

    class MLP(nn.Module):
        def __init__(self, in_dim: int = 2, hidden: int = 32, out_dim: int = 2, p: float = 0.2):
            super().__init__()
            self.net = nn.Sequential(
                nn.Linear(in_dim, hidden),
                nn.BatchNorm1d(hidden),
                nn.ReLU(),
                nn.Dropout(p),
                nn.Linear(hidden, hidden),
                nn.BatchNorm1d(hidden),
                nn.ReLU(),
                nn.Linear(hidden, out_dim),
            )

        def forward(self, x: torch.Tensor) -> torch.Tensor:
            return self.net(x)

    def evaluate(model: nn.Module) -> float:
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for xb, yb in te_dl:
                xb = xb.to(device)
                yb = yb.to(device)
                logits = model(xb)
                pred = logits.argmax(dim=1)
                correct += (pred == yb).sum().item()
                total += xb.size(0)
        return correct / total

    model = MLP().to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
    criterion = nn.CrossEntropyLoss()

    # TensorBoard (optional)
    writer = None
    try:
        from torch.utils.tensorboard import SummaryWriter
        writer = SummaryWriter(log_dir="runs/exp_torch")
    except Exception as e:
        print("TensorBoard writer unavailable:", e)

    # AMP scaler
    use_amp = torch.cuda.is_available()
    scaler = torch.cuda.amp.GradScaler(enabled=use_amp)

    best_acc = 0.0
    epochs = 20
    for ep in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        for xb, yb in tr_dl:
            xb = xb.to(device)
            yb = yb.to(device)
            opt.zero_grad(set_to_none=True)
            if use_amp:
                with torch.cuda.amp.autocast():
                    logits = model(xb)
                    loss = criterion(logits, yb)
                scaler.scale(loss).backward()
                scaler.step(opt)
                scaler.update()
            else:
                logits = model(xb)
                loss = criterion(logits, yb)
                loss.backward()
                opt.step()
            total_loss += loss.item() * xb.size(0)

        train_loss = total_loss / len(tr_ds)
        val_acc = evaluate(model)
        print(f"epoch {ep:02d} | train_loss {train_loss:.4f} | val_acc {val_acc:.4f}")
        if writer:
            writer.add_scalar("loss/train", train_loss, global_step=ep)
            writer.add_scalar("acc/val", val_acc, global_step=ep)

        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), "best_mlp.pt")

    print("best val_acc:", best_acc)
    if writer:
        writer.close()

    # TorchScript export (simple trace)
    model.eval()
    example = torch.rand(1, 2).to(device)
    ts = torch.jit.trace(model.cpu(), example.cpu())
    ts.save("model_ts.pt")
    print("Saved TorchScript to model_ts.pt")

    # Decision boundary plot adapter
    def torch_proba(grid: np.ndarray) -> np.ndarray:
        model.eval()
        with torch.no_grad():
            t = torch.from_numpy(grid).to(device)
            p = torch.softmax(model(t), dim=1)[:, 1].cpu().numpy()
        return p

    # Uncomment to plot decision boundary (requires matplotlib)
    # plot_boundary(torch_proba, Xte, yte, title="PyTorch decision boundary")


# ---------- TensorFlow/Keras training ----------

def tf_train() -> None:
    section("TensorFlow/Keras training (MLP on synthetic 2D data)")
    try:
        import tensorflow as tf
    except Exception as e:
        print("TensorFlow not installed; skip training. Error:", e)
        return

    tf.random.set_seed(42)

    X, y = make_synth(4000, seed=1)
    Xtr, ytr, Xte, yte = train_val_split(X, y, val_ratio=0.2)

    # Mixed precision (optional)
    try:
        from tensorflow.keras import mixed_precision
        mixed_precision.set_global_policy("mixed_float16")
        print("Using mixed precision policy: mixed_float16")
        use_mp = True
    except Exception as e:
        print("Mixed precision not enabled:", e)
        use_mp = False

    inputs = tf.keras.Input(shape=(2,), dtype=tf.float32)
    x = tf.keras.layers.Dense(32, activation="relu")(inputs)
    x = tf.keras.layers.Dropout(0.2)(x)
    x = tf.keras.layers.Dense(32, activation="relu")(x)
    # Keep output float32 if mixed precision is enabled
    outputs = tf.keras.layers.Dense(2, activation="softmax", dtype="float32" if use_mp else None)(x)
    model = tf.keras.Model(inputs, outputs)
    opt = tf.keras.optimizers.AdamW(learning_rate=1e-3, weight_decay=1e-2)
    model.compile(optimizer=opt, loss="sparse_categorical_crossentropy", metrics=["accuracy"])

    cbs = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=5, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint("best_tf.keras", monitor="val_accuracy", save_best_only=True),
        tf.keras.callbacks.TensorBoard(log_dir="runs_tf/exp_tf"),
    ]

    model.fit(Xtr, ytr, validation_data=(Xte, yte), epochs=50, batch_size=64, callbacks=cbs, verbose=2)
    loss, acc = model.evaluate(Xte, yte, verbose=0)
    print("val_acc:", acc)

    best = tf.keras.models.load_model("best_tf.keras")
    print("Reloaded acc:", best.evaluate(Xte, yte, verbose=0)[1])

    # SavedModel export then TFLite conversion (optional)
    saved_dir = "saved_model_dir"
    tf.saved_model.save(best, saved_dir)
    converter = tf.lite.TFLiteConverter.from_saved_model(saved_dir)
    tflite_model = converter.convert()
    with open("model.tflite", "wb") as f:
        f.write(tflite_model)
    print("Saved TFLite model to model.tflite")

    # Decision boundary plot adapter
    def keras_proba(grid: np.ndarray) -> np.ndarray:
        p = best.predict(grid, verbose=0)
        return p[:, 1]

    # Uncomment to plot decision boundary (requires matplotlib)
    # plot_boundary(keras_proba, Xte, yte, title="Keras decision boundary")


# ---------- Main ----------

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--framework", choices=["torch", "tf", "both"], default="both", help="Which framework demos to run")
    args = ap.parse_args()

    set_global_seeds(42)

    # Autograd demos
    autograd_torch_demo()
    autograd_tf_demo()

    # Training
    if args.framework in ("torch", "both"):
        torch_train()
    if args.framework in ("tf", "both"):
        tf_train()

    print("\nModule 6 complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

# ------------------------------
# Additional commented examples
# ------------------------------

def torch_init_and_clip_examples() -> None:
    """
    PyTorch: Demonstrate weight initialization strategies and gradient clipping.

    - Shows how to apply Xavier/He (Kaiming) initialization to Linear layers.
    - Demonstrates gradient clipping to stabilize training when gradients explode.
    """
    try:
        import torch
        from torch import nn
    except Exception as e:
        print("PyTorch not installed; skipping init/clip examples.", e)
        return

    class SmallNet(nn.Module):
        def __init__(self):
            super().__init__()
            self.fc1 = nn.Linear(2, 32)
            self.fc2 = nn.Linear(32, 2)
            # Xavier/Glorot initialization works well with tanh or linear activations
            nn.init.xavier_uniform_(self.fc1.weight)
            nn.init.zeros_(self.fc1.bias)
            # Kaiming/He initialization pairs well with ReLU-like activations
            nn.init.kaiming_uniform_(self.fc2.weight, nonlinearity="relu")
            nn.init.zeros_(self.fc2.bias)

        def forward(self, x):
            x = torch.tanh(self.fc1(x))
            x = self.fc2(x)
            return x

    # Create dummy batch to show gradient clipping
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = SmallNet().to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=1e-3)
    criterion = nn.CrossEntropyLoss()

    xb = torch.randn(64, 2, device=device)
    yb = torch.randint(0, 2, (64,), device=device)

    # Forward/backward without clipping
    opt.zero_grad(set_to_none=True)
    logits = model(xb)
    loss = criterion(logits, yb)
    loss.backward()

    # Inspect gradient norms (could be very large in some tasks)
    total_norm = torch.norm(torch.stack([p.grad.norm() for p in model.parameters() if p.grad is not None]))
    print("grad norm before clip:", float(total_norm))

    # Clip gradients to max norm 1.0
    max_norm = 1.0
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=max_norm)

    total_norm_after = torch.norm(torch.stack([p.grad.norm() for p in model.parameters() if p.grad is not None]))
    print("grad norm after clip:", float(total_norm_after))
    opt.step()


def torch_lr_scheduler_example() -> None:
    """
    PyTorch: Show how to use LR schedulers (StepLR and CosineAnnealingLR).
    Prints the learning rate per epoch for demonstration.
    """
    try:
        import torch
        from torch import nn
    except Exception as e:
        print("PyTorch not installed; skipping LR scheduler example.", e)
        return

    model = nn.Linear(4, 2)
    opt = torch.optim.SGD(model.parameters(), lr=0.1, momentum=0.9)

    # Option A: StepLR decays LR every step_size epochs by gamma
    step_sched = torch.optim.lr_scheduler.StepLR(opt, step_size=3, gamma=0.1)
    print("StepLR schedule (epochs 0..5):")
    for ep in range(6):
        lr = opt.param_groups[0]["lr"]
        print(f" epoch {ep} lr={lr:.5f}")
        # ... training loop here ...
        step_sched.step()

    # Option B: Cosine annealing (commonly used for smoother decay)
    opt = torch.optim.SGD(model.parameters(), lr=0.1, momentum=0.9)
    cos_sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=5)
    print("CosineAnnealingLR (epochs 0..5):")
    for ep in range(6):
        lr = opt.param_groups[0]["lr"]
        print(f" epoch {ep} lr={lr:.5f}")
        # ... training loop here ...
        cos_sched.step()


def torch_dataloader_reproducibility_example() -> None:
    """
    PyTorch: Make DataLoader iteration reproducible across runs by seeding workers.
    """
    try:
        import torch
        from torch.utils.data import DataLoader, TensorDataset
    except Exception as e:
        print("PyTorch not installed; skipping DataLoader seed example.", e)
        return

    def seed_worker(worker_id: int) -> None:
        # Ensure each worker gets a deterministic seed based on the initial seed
        import random, numpy as np  # type: ignore
        worker_seed = torch.initial_seed() % 2**32
        np.random.seed(worker_seed)
        random.seed(worker_seed)

    g = torch.Generator()
    g.manual_seed(42)

    X = torch.arange(20).float().reshape(10, 2)
    y = torch.arange(10)
    ds = TensorDataset(X, y)

    # Shuffle order will be deterministic across runs thanks to generator+seed_worker
    dl = DataLoader(ds, batch_size=3, shuffle=True, num_workers=0, worker_init_fn=seed_worker, generator=g)

    order = []
    for xb, yb in dl:
        order.extend(yb.tolist())
    print("Deterministic order:", order)


def tf_lr_schedule_example() -> None:
    """
    TensorFlow/Keras: LearningRateScheduler and ReduceLROnPlateau examples.
    """
    try:
        import tensorflow as tf
    except Exception as e:
        print("TensorFlow not installed; skipping TF LR schedule example.", e)
        return

    def schedule(epoch: int, lr: float) -> float:
        # Warmup for first 3 epochs, then decay
        if epoch < 3:
            return lr * 1.5
        # simple exponential decay
        return float(0.001 * (0.9 ** (epoch - 3)))

    model = tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(4,)),
            tf.keras.layers.Dense(16, activation="relu"),
            tf.keras.layers.Dense(2, activation="softmax"),
        ]
    )
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-3), loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    X = tf.random.normal((200, 4))
    y = tf.cast(tf.random.uniform((200,), maxval=2, dtype=tf.int32), tf.int32)

    cbs = [
        tf.keras.callbacks.LearningRateScheduler(schedule, verbose=1),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="loss", factor=0.5, patience=2, verbose=1),
    ]
    model.fit(X, y, epochs=6, batch_size=32, callbacks=cbs, verbose=0)
    print("Final LR:", float(model.optimizer.learning_rate.numpy()) if hasattr(model.optimizer, "learning_rate") else "n/a")


def torch_early_stopping_sketch() -> None:
    """
    PyTorch: Early stopping sketch with patience and checkpointing best weights.
    This is a teaching-only snippet (no full training loop).
    """
    try:
        import torch
        from torch import nn
    except Exception as e:
        print("PyTorch not installed; skipping early stopping sketch.", e)
        return

    model = nn.Linear(2, 2)
    best, wait, patience = float("inf"), 0, 3
    val_losses = [0.9, 0.8, 0.82, 0.79, 0.78, 0.81]  # pretend results

    for ep, val in enumerate(val_losses, 1):
        improved = val < best - 1e-4
        if improved:
            best, wait = val, 0
            torch.save(model.state_dict(), "early_stop_best.pt")
            print(f"epoch {ep}: improved val_loss={val:.4f} (checkpoint saved)")
        else:
            wait += 1
            print(f"epoch {ep}: no improv val_loss={val:.4f} wait={wait}/{patience}")
            if wait >= patience:
                print("early stopping triggered")
                break


# Wrap and extend the existing main() to also run these examples after the core demos.
_old_main = main
def main() -> int:
    rc = _old_main()
    # Run additional, quick, commented examples (CPU-safe and small)
    torch_init_and_clip_examples()
    torch_lr_scheduler_example()
    torch_dataloader_reproducibility_example()
    tf_lr_schedule_example()
    torch_early_stopping_sketch()
    return rc