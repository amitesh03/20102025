# Deep Learning Foundations — Module 6

Goals
- Understand tensors, automatic differentiation, and training loops
- Build, train, evaluate, and save models in PyTorch and TensorFlow/Keras
- Use GPUs when available and apply mixed precision for performance
- Structure datasets/dataloaders and implement common regularization
- Log metrics with TensorBoard and manage checkpoints

Prerequisites
- Completed Modules 0–5
- Python 3.10+
- Basic NumPy and Pandas familiarity

Folder for this module
- Work inside [modules/06-deep-learning-foundations](modules/06-deep-learning-foundations)

1) Install/verify
Option A: PyTorch (CPU) quick install
```bash
python -m pip install --upgrade pip
python -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
python - << 'PY'
import torch, torchvision
print("torch", torch.__version__, "cuda?", torch.cuda.is_available())
print("torchvision", torchvision.__version__)
PY
```

Option B: PyTorch (CUDA)
- Ensure NVIDIA driver + CUDA toolkit compatible with your torch version
- Use the selector at https://pytorch.org/get-started/locally/ for exact command

TensorFlow (CPU; GPU if drivers present)
```bash
python -m pip install tensorflow
python - << 'PY'
import tensorflow as tf
print("tensorflow", tf.__version__)
print("gpu devices:", tf.config.list_physical_devices('GPU'))
PY
```

2) Autograd basics: PyTorch tensors and gradients
```python
import torch

# A tensor with gradient tracking
x = torch.tensor([3.0], requires_grad=True)
y = x**2 + 2*x + 1
y.backward()          # dy/dx = 2x + 2 at x=3 -> 8
print("x.grad:", x.grad)  # tensor([8.])
```

Stop gradient and reuse tensors
```python
with torch.no_grad():
    z = x * 10
print(z, z.requires_grad)
```

Zeroing gradients (important in training loops)
```python
w = torch.tensor([1.0], requires_grad=True)
for step in range(3):
    loss = (w - 5)**2
    loss.backward()
    print("grad step", step, ":", w.grad.item())
    w.data -= 0.1 * w.grad
    w.grad.zero_()
print("w:", w.item())
```

3) TensorFlow/Keras autograd (eager + GradientTape)
```python
import tensorflow as tf

x = tf.Variable(3.0)
with tf.GradientTape() as tape:
    y = x**2 + 2*x + 1
dy_dx = tape.gradient(y, x)  # 8.0
print("dy/dx:", dy_dx.numpy())
```

4) Minimal classification task (synthetic)
We will create a synthetic 2D dataset for both frameworks to avoid external downloads.

```python
# Synthetic moons-like data without sklearn dependency
import numpy as np

def make_synth(n=1000, seed=0):
    rng = np.random.default_rng(seed)
    x1 = rng.normal(loc=0.0, scale=0.8, size=(n//2, 2)) + np.array([0.0, 0.0])
    x2 = rng.normal(loc=0.0, scale=0.8, size=(n//2, 2)) + np.array([2.5, 2.5])
    X = np.vstack([x1, x2]).astype(np.float32)
    y = np.array([0]*(n//2) + [1]*(n//2), dtype=np.int64)
    # shuffle
    idx = rng.permutation(n)
    return X[idx], y[idx]

X, y = make_synth(1200, seed=42)
print(X.shape, y.shape)
```

5) PyTorch: Dataset, DataLoader, model, training loop
Save as [modules/06-deep-learning-foundations/train_torch.py](modules/06-deep-learning-foundations/train_torch.py)
```python
import math, time
import numpy as np
import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader, TensorDataset

def make_synth(n=2000, seed=0):
    rng = np.random.default_rng(seed)
    x1 = rng.normal(loc=0.0, scale=0.8, size=(n//2, 2)) + np.array([0.0, 0.0])
    x2 = rng.normal(loc=0.0, scale=0.8, size=(n//2, 2)) + np.array([2.5, 2.5])
    X = np.vstack([x1, x2]).astype(np.float32)
    y = np.array([0]*(n//2) + [1]*(n//2), dtype=np.int64)
    idx = rng.permutation(n)
    return X[idx], y[idx]

class MLP(nn.Module):
    def __init__(self, in_dim=2, hidden=32, out_dim=2, p=0.2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden),
            nn.ReLU(),
            nn.Dropout(p),
            nn.Linear(hidden, hidden),
            nn.ReLU(),
            nn.Linear(hidden, out_dim),
        )
    def forward(self, x):
        return self.net(x)

def accuracy(logits, y):
    return (logits.argmax(dim=1) == y).float().mean().item()

def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("device:", device)

    X, y = make_synth(4000, seed=1)
    n = len(X)
    n_tr = int(n * 0.8)
    Xtr, ytr = X[:n_tr], y[:n_tr]
    Xte, yte = X[n_tr:], y[n_tr:]

    tr_ds = TensorDataset(torch.from_numpy(Xtr), torch.from_numpy(ytr))
    te_ds = TensorDataset(torch.from_numpy(Xte), torch.from_numpy(yte))
    tr_dl = DataLoader(tr_ds, batch_size=64, shuffle=True, num_workers=0)
    te_dl = DataLoader(te_ds, batch_size=256, shuffle=False)

    model = MLP().to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
    criterion = nn.CrossEntropyLoss()

    epochs = 20
    best_acc = 0.0
    for ep in range(1, epochs+1):
        model.train()
        total_loss = 0.0
        for xb, yb in tr_dl:
            xb = xb.to(device)
            yb = yb.to(device)
            opt.zero_grad(set_to_none=True)
            logits = model(xb)
            loss = criterion(logits, yb)
            loss.backward()
            opt.step()
            total_loss += loss.item() * xb.size(0)
        train_loss = total_loss / n_tr

        model.eval()
        with torch.no_grad():
            tot_acc = 0.0; tot_n = 0
            for xb, yb in te_dl:
                xb = xb.to(device); yb = yb.to(device)
                logits = model(xb)
                tot_acc += (logits.argmax(dim=1) == yb).float().sum().item()
                tot_n += xb.size(0)
            val_acc = tot_acc / tot_n

        print(f"epoch {ep:02d} | train_loss {train_loss:.4f} | val_acc {val_acc:.4f}")
        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), "best_mlp.pt")
    print("best val_acc:", best_acc)

    # Load checkpoint demonstration
    ckpt = MLP().to(device)
    ckpt.load_state_dict(torch.load("best_mlp.pt", map_location=device))
    ckpt.eval()
    print("checkpoint loaded")

if __name__ == "__main__":
    main()
```

Run
```bash
python modules/06-deep-learning-foundations/train_torch.py
```

6) PyTorch with mixed precision (AMP) for speed on GPU
```python
scaler = torch.cuda.amp.GradScaler(enabled=torch.cuda.is_available())
for xb, yb in tr_dl:
    xb = xb.to(device); yb = yb.to(device)
    opt.zero_grad(set_to_none=True)
    with torch.cuda.amp.autocast(enabled=torch.cuda.is_available()):
        logits = model(xb)
        loss = criterion(logits, yb)
    scaler.scale(loss).backward()
    scaler.step(opt)
    scaler.update()
```

7) TensorBoard logging (PyTorch)
```python
from torch.utils.tensorboard import SummaryWriter
writer = SummaryWriter(log_dir="runs/exp1")
# Inside training loop
# writer.add_scalar("loss/train", train_loss, global_step=ep)
# writer.add_scalar("acc/val", val_acc, global_step=ep)
# Then run: tensorboard --logdir runs
```

8) TensorFlow/Keras: model, training, callbacks
Save as [modules/06-deep-learning-foundations/train_tf.py](modules/06-deep-learning-foundations/train_tf.py)
```python
import numpy as np, os
import tensorflow as tf

def make_synth(n=2000, seed=0):
    rng = np.random.default_rng(seed)
    x1 = rng.normal(loc=0.0, scale=0.8, size=(n//2, 2)) + np.array([0.0, 0.0])
    x2 = rng.normal(loc=0.0, scale=0.8, size=(n//2, 2)) + np.array([2.5, 2.5])
    X = np.vstack([x1, x2]).astype(np.float32)
    y = np.array([0]*(n//2) + [1]*(n//2), dtype=np.int64)
    idx = rng.permutation(n)
    return X[idx], y[idx]

def build_model():
    inputs = tf.keras.Input(shape=(2,), dtype=tf.float32)
    x = tf.keras.layers.Dense(32, activation="relu")(inputs)
    x = tf.keras.layers.Dropout(0.2)(x)
    x = tf.keras.layers.Dense(32, activation="relu")(x)
    outputs = tf.keras.layers.Dense(2, activation="softmax")(x)
    model = tf.keras.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=1e-3, weight_decay=1e-2),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

def main():
    print("TF version:", tf.__version__)
    print("GPU devices:", tf.config.list_physical_devices("GPU"))

    X, y = make_synth(4000, seed=1)
    n = len(X); n_tr = int(0.8*n)
    Xtr, ytr, Xte, yte = X[:n_tr], y[:n_tr], X[n_tr:], y[n_tr:]

    model = build_model()

    cbs = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=5, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint("best_tf.keras", monitor="val_accuracy", save_best_only=True),
        tf.keras.callbacks.TensorBoard(log_dir="runs_tf/exp1")
    ]

    model.fit(Xtr, ytr, validation_data=(Xte, yte), epochs=50, batch_size=64, callbacks=cbs, verbose=2)
    loss, acc = model.evaluate(Xte, yte, verbose=0)
    print("val_acc:", acc)

    # Load and evaluate saved model
    best = tf.keras.models.load_model("best_tf.keras")
    print("reloaded acc:", best.evaluate(Xte, yte, verbose=0)[1])

if __name__ == "__main__":
    main()
```

Run
```bash
python modules/06-deep-learning-foundations/train_tf.py
# View logs:
# tensorboard --logdir runs_tf
```

9) Mixed precision (TensorFlow)
```python
import tensorflow as tf
from tensorflow.keras import mixed_precision
mixed_precision.set_global_policy("mixed_float16")  # before building the model
# Keep final Dense output dtype float32
# e.g., add: tf.keras.layers.Dense(2, dtype="float32", activation="softmax")
```

10) Device placement and reproducibility
PyTorch device snippets
```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.manual_seed(42)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(42)
```

TensorFlow device and seeds
```python
import tensorflow as tf, os, numpy as np, random
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
tf.random.set_seed(42)
np.random.seed(42)
random.seed(42)
# Optional: deterministic ops (may reduce performance)
# os.environ["TF_DETERMINISTIC_OPS"] = "1"
```

11) Custom datasets (PyTorch)
```python
from torch.utils.data import Dataset
import numpy as np, torch

class MyDataset(Dataset):
    def __init__(self, n=1000, seed=0):
        self.X, self.y = make_synth(n, seed)
    def __len__(self):
        return len(self.X)
    def __getitem__(self, idx):
        x = torch.from_numpy(self.X[idx])
        y = torch.tensor(self.y[idx], dtype=torch.long)
        return x, y

ds = MyDataset(2000)
dl = torch.utils.data.DataLoader(ds, batch_size=64, shuffle=True)
for xb, yb in dl:
    print(xb.shape, yb.shape)
    break
```

12) Regularization and overfitting control
- Weight decay (L2 regularization) in optimizers (AdamW)
- Dropout layers to prevent co-adaptation
- Early stopping based on validation metrics
- Data augmentation (for images/text use relevant libs)
- Gradient clipping to stabilize training

PyTorch gradient clipping
```python
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
```

Keras gradient clipping
```python
opt = tf.keras.optimizers.Adam(learning_rate=1e-3, clipnorm=1.0)
model.compile(optimizer=opt, loss="sparse_categorical_crossentropy", metrics=["accuracy"])
```

13) Saving and loading models
PyTorch
```python
# Save only weights
torch.save(model.state_dict(), "model.pt")
# Load into a new instance
m2 = MLP(); m2.load_state_dict(torch.load("model.pt", map_location="cpu")); m2.eval()
```

Keras
```python
# Keras native format (recommended)
model.save("model.keras")
reloaded = tf.keras.models.load_model("model.keras")
```

14) Exporting for deployment (brief)
- PyTorch: torch.jit.script or torch.jit.trace to create TorchScript
- TensorFlow: export SavedModel or convert to TensorFlow Lite

TorchScript (simple example)
```python
example = torch.rand(1, 2)
ts = torch.jit.trace(model.cpu().eval(), example)
ts.save("model_ts.pt")
```

TensorFlow Lite (CPU, basic example)
```python
import tensorflow as tf
converter = tf.lite.TFLiteConverter.from_saved_model("best_tf.keras")
# For Keras .keras, export to SavedModel first: tf.saved_model.save(model, "saved_model_dir")
# Then:
# converter = tf.lite.TFLiteConverter.from_saved_model("saved_model_dir")
tflite_model = converter.convert()
open("model.tflite", "wb").write(tflite_model)
```

15) Common pitfalls
- Forgetting model.train() / model.eval() in PyTorch affects Dropout/BatchNorm
- Not zeroing gradients each step in PyTorch causes accumulation
- Using too high learning rates; start with 1e-3 for Adam-like optimizers
- Data leakage between train/val sets when generating synthetic or using time series
- Misinterpreting accuracy with imbalanced classes; pick proper metrics (AUC/F1)

16) Exercises
- PyTorch: Implement early stopping based on a moving average of val loss; save best checkpoint
- PyTorch: Add BatchNorm1d between linear layers; compare convergence with/without
- TensorFlow: Switch to mixed precision and measure training time on GPU
- TensorFlow: Add LearningRateScheduler to warm up for 5 epochs then cosine decay
- Both: Plot decision boundaries after training by evaluating a grid of points
- Both: Replace synthetic data with your own CSV (2–10 numeric features), adapt input shape

17) Solutions (sketches)
PyTorch early stopping
```python
patience, best, wait = 5, float("inf"), 0
for ep in range(1, epochs+1):
    # ... training ...
    val_loss = ...  # compute
    if val_loss < best - 1e-4:
        best, wait = val_loss, 0
        torch.save(model.state_dict(), "best.pt")
    else:
        wait += 1
        if wait >= patience:
            print("early stop at", ep)
            break
```

BatchNorm in MLP
```python
self.net = nn.Sequential(
    nn.Linear(in_dim, hidden),
    nn.BatchNorm1d(hidden),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(hidden, hidden),
    nn.BatchNorm1d(hidden),
    nn.ReLU(),
    nn.Linear(hidden, out_dim),
)
```

Keras LR schedule
```python
def schedule(epoch, lr):
    warm = 5
    if epoch < warm:
        return lr * 1.5
    # cosine decay
    import math
    return 1e-3 * 0.5 * (1 + math.cos(math.pi * (epoch-warm) / max(1, 50-warm)))

cb = tf.keras.callbacks.LearningRateScheduler(schedule, verbose=1)
model.fit(Xtr, ytr, validation_data=(Xte, yte), epochs=50, callbacks=[cb], verbose=2)
```

Decision boundary plot (either framework)
```python
import numpy as np, matplotlib.pyplot as plt

def plot_boundary(predict_proba, X, y):
    x_min, x_max = X[:,0].min()-1, X[:,0].max()+1
    y_min, y_max = X[:,1].min()-1, X[:,1].max()+1
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 200),
                         np.linspace(y_min, y_max, 200))
    grid = np.c_[xx.ravel(), yy.ravel()].astype(np.float32)
    probs = predict_proba(grid).reshape(xx.shape)
    plt.contourf(xx, yy, probs, levels=20, cmap="RdBu", alpha=0.6)
    plt.scatter(X[:,0], X[:,1], c=y, cmap="RdBu", edgecolor="k")
    plt.show()
```

PyTorch proba adapter
```python
def torch_proba(model, device):
    def fn(grid: np.ndarray) -> np.ndarray:
        import torch
        with torch.no_grad():
            t = torch.from_numpy(grid).to(device)
            p = torch.softmax(model(t), dim=1)[:,1].cpu().numpy()
        return p
    return fn
```

Keras proba adapter
```python
def keras_proba(model):
    def fn(grid: np.ndarray) -> np.ndarray:
        import numpy as np
        p = model.predict(grid, verbose=0)
        return p[:,1]
    return fn
```

18) Next modules
- Proceed to [modules/07-llms-and-transformers](modules/07-llms-and-transformers) for Hugging Face Transformers and OpenAI SDK
- Later: [modules/08-langchain-application-patterns](modules/08-langchain-application-patterns), [modules/09-web-backends-fastapi-and-pydantic](modules/09-web-backends-fastapi-and-pydantic)