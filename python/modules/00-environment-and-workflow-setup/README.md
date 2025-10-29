# Environment and Workflow Setup — Module 0

Goals
- Set up Python, virtual environments, editor, and notebooks
- Establish repeatable workflow: dependencies, linting, testing, profiling, logging
- Be ready to run code in this repo and future modules

Prerequisites
- Windows 11 or macOS/Linux
- Python 3.10+ installed

Folder for this module
- Work inside [modules/00-environment-and-workflow-setup](modules/00-environment-and-workflow-setup)

1) Verify Python and create a virtual environment

Windows (cmd)
```bat
py --version
py -3.11 -m venv .venv
.venv\Scripts\activate
where python
python --version
```

Windows (PowerShell)
```powershell
py --version
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
Get-Command python
python --version
```

macOS/Linux
```bash
python3 --version
python3 -m venv .venv
source .venv/bin/activate
which python
python --version
```

Upgrade packaging tools
```bash
python -m pip install --upgrade pip setuptools wheel
```

2) Install essential developer tools
```bash
python -m pip install black isort flake8 mypy pytest
```

Optional modern installers
```bash
python -m pip install uv pip-tools
# Compile locked deps when you start pinning:
# pip-compile requirements.in
```

3) Create a simple script and run it
Save as [hello.py](modules/00-environment-and-workflow-setup/hello.py)
```python
import sys
def main() -> int:
    print('Hello, Python!')
    print('Version:', sys.version.split()[0])
    return 0
if __name__ == '__main__':
    raise SystemExit(main())
```

Run it
```bash
python hello.py
```

4) Jupyter and kernel setup
```bash
python -m pip install jupyterlab notebook ipykernel matplotlib pandas numpy
python -m ipykernel install --user --name=ai-env --display-name='AI Env'
```

Create [quickcheck.ipynb](modules/00-environment-and-workflow-setup/quickcheck.ipynb) and run this cell:
```python
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
x = np.linspace(0, 2*np.pi, 200)
y = np.sin(x)
pd.DataFrame({'x': x, 'y': y}).head()
plt.plot(x, y); plt.title('Sine'); plt.show()
```

5) VS Code configuration (recommended)
- Install the Python extension by Microsoft
- Select interpreter: Command Palette → Python: Select Interpreter → choose .venv
- Enable format on save and organize imports

Optional workspace settings
Save as [.vscode/settings.json](.vscode/settings.json)
```json
{
  "python.defaultInterpreterPath": ".venv/bin/python",
  "python.testing.pytestEnabled": true,
  "editor.formatOnSave": true,
  "python.formatting.provider": "black",
  "isort.args": ["--profile", "black"]
}
```

6) Linting, type checking, and tests

Example test: save as [test_basic.py](modules/00-environment-and-workflow-setup/test_basic.py)
```python
def add(a: int, b: int) -> int:
    return a + b

def test_add():
    assert add(2, 3) == 5
```

Run pytest and tools
```bash
pytest -q
flake8 .
black --check .
isort --check-only .
mypy .
```

7) .gitignore for Python projects
Save as [.gitignore](.gitignore)
```gitignore
__pycache__/
*.pyc
.pytest_cache/
.mypy_cache/
.venv/
.idea/
.vscode/
dist/
build/
*.egg-info/
.DS_Store
```

8) Basic logging for scripts
```python
import logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s %(message)s')
log = logging.getLogger(__name__)
log.info('Starting job...')
try:
    # work
    log.info('Work OK')
except Exception as e:
    log.exception('Failure: %s', e)
```

9) Quick profiling choices

timeit for small snippets
```python
import timeit
print(timeit.timeit('sum(range(10000))', number=1000))
```

cProfile for scripts
```bash
python -m cProfile -o profile.out hello.py
python - << 'PY'
import pstats
p = pstats.Stats('profile.out'); p.sort_stats('cumtime').print_stats(10)
PY
```

10) Reproducible dependencies (pin later)
- Keep an unpinned requirements.in during exploration
- When stabilizing, pin to requirements.txt using pip-compile or uv

11) Next module
- Proceed to [modules/01-core-python-fundamentals/README.md](modules/01-core-python-fundamentals/README.md)