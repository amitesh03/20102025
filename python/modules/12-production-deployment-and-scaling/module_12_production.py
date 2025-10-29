#!/usr/bin/env python3
"""
Production Deployment and Scaling — Module 12 teaching script.

This module demonstrates:
- FastAPI service patterns for production: health/readiness/version endpoints
- Structured logging, request IDs, error handling, and dependency-injected settings
- Prediction endpoint with Pydantic v2 validation and optional caching
- Simple per-client rate limiting (token bucket) and timeouts
- Prometheus metrics: counters and latency histograms exposed at /metrics
- Graceful shutdown hooks
- Model loading with joblib (pipeline compatibility) and fallback dummy model
- Notes on deployment (uvicorn/gunicorn), environment variables, and horizontal scaling

Run:
  python modules/12-production-deployment-and-scaling/module_12_production.py

Requirements:
  pip install fastapi uvicorn pydantic joblib prometheus-client

Optional:
  pip install pydantic-settings  # for env-driven settings
"""

from __future__ import annotations

import os
import time
import uuid
import logging
from typing import Optional, Dict, Any, Tuple
from dataclasses import dataclass

import joblib
from fastapi import FastAPI, Request, Body, Depends, HTTPException, status
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel, Field, ConfigDict, computed_field, TypeAdapter

# Optional environment-driven settings
try:
    from pydantic_settings import BaseSettings, SettingsConfigDict  # type: ignore
    HAVE_SETTINGS = True
except Exception:
    HAVE_SETTINGS = False

# Prometheus metrics
try:
    from prometheus_client import Counter, Histogram, CollectorRegistry, generate_latest, CONTENT_TYPE_LATEST
except Exception as e:
    Counter = Histogram = CollectorRegistry = generate_latest = CONTENT_TYPE_LATEST = None  # type: ignore


# ------------------------------------------------------------------------------
# Logging configuration
# ------------------------------------------------------------------------------

def configure_logging(level: int = logging.INFO) -> None:
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.info("Logging configured")


log = logging.getLogger("svc")


# ------------------------------------------------------------------------------
# Settings
# ------------------------------------------------------------------------------

if HAVE_SETTINGS:
    class AppSettings(BaseSettings):
        model_config = SettingsConfigDict(env_prefix="APP_", extra="ignore")
        host: str = "127.0.0.1"
        port: int = 8000
        debug: bool = False
        api_key: Optional[str] = None
        cache_ttl_seconds: int = 30
        rate_capacity: int = 10       # tokens
        rate_refill_per_sec: float = 2.0
else:
    class AppSettings(BaseModel):
        model_config = ConfigDict(extra="ignore")
        host: str = "127.0.0.1"
        port: int = 8000
        debug: bool = False
        api_key: Optional[str] = None
        cache_ttl_seconds: int = 30
        rate_capacity: int = 10
        rate_refill_per_sec: float = 2.0


def get_settings() -> AppSettings:
    return AppSettings()


# ------------------------------------------------------------------------------
# Request ID middleware
# ------------------------------------------------------------------------------

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception as e:
            log.exception("Unhandled error req_id=%s: %s", req_id, e)
            # Convert to JSON error
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"error": "internal_server_error", "request_id": req_id},
            )
        dur_ms = (time.perf_counter() - start) * 1000.0
        response.headers["X-Request-ID"] = req_id
        response.headers["Server-Timing"] = f"app;dur={dur_ms:.2f}"
        return response


# ------------------------------------------------------------------------------
# Model loading and fallback
# ------------------------------------------------------------------------------

@dataclass
class DummyModel:
    """Fallback model producing a simple linear combination."""
    version: str = "dummy-1.0"

    def predict(self, rows):
        # rows is 2D array-like of numeric features
        out = []
        for r in rows:
            # toy scoring
            score = 0.5 * float(r[0]) + 0.3 * float(r[1]) + 0.2
            out.append(score)
        return out


def load_model(path: str = "artifacts/model.joblib") -> Tuple[Any, str]:
    try:
        model = joblib.load(path)
        version = f"joblib:{os.path.basename(path)}"
        log.info("Loaded model from %s", path)
        return model, version
    except Exception as e:
        log.warning("Model load failed (%s). Using DummyModel.", e)
        dm = DummyModel()
        return dm, dm.version


# ------------------------------------------------------------------------------
# Pydantic schemas
# ------------------------------------------------------------------------------

class PredictIn(BaseModel):
    """Example tabular input with two numeric features."""
    f1: float = Field(description="Feature 1")
    f2: float = Field(description="Feature 2")


class PredictOut(BaseModel):
    score: float
    model_version: str
    request_id: str

    model_config = ConfigDict(json_schema_extra={"example": {"score": 0.73, "model_version": "dummy-1.0", "request_id": "..."}})


# Standalone adapter example (validate a list of floats)
FloatListAdapter = TypeAdapter(list[float])


# ------------------------------------------------------------------------------
# Rate limiting (token bucket per client IP)
# ------------------------------------------------------------------------------

class TokenBucket:
    def __init__(self, capacity: int, refill_per_sec: float):
        self.capacity = capacity
        self.refill_per_sec = refill_per_sec
        self.tokens = capacity
        self.last = time.monotonic()

    def allow(self) -> bool:
        now = time.monotonic()
        elapsed = now - self.last
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_per_sec)
        self.last = now
        if self.tokens >= 1.0:
            self.tokens -= 1.0
            return True
        return False


# ------------------------------------------------------------------------------
# Cache (TTL)
# ------------------------------------------------------------------------------

class TTLCache:
    def __init__(self, ttl_seconds: int = 30):
        self.ttl = ttl_seconds
        self.store: Dict[str, Tuple[float, Any]] = {}

    def _now(self) -> float:
        return time.monotonic()

    def get(self, key: str) -> Optional[Any]:
        entry = self.store.get(key)
        if not entry:
            return None
        ts, val = entry
        if self._now() - ts > self.ttl:
            self.store.pop(key, None)
            return None
        return val

    def set(self, key: str, value: Any) -> None:
        self.store[key] = (self._now(), value)


# ------------------------------------------------------------------------------
# Metrics
# ------------------------------------------------------------------------------

if CollectorRegistry is not None:
    REGISTRY = CollectorRegistry()
    REQ_COUNT = Counter("svc_requests_total", "Total requests", ["route"], registry=REGISTRY)
    REQ_ERRORS = Counter("svc_request_errors_total", "Request errors", ["route"], registry=REGISTRY)
    REQ_LATENCY = Histogram("svc_request_latency_seconds", "Request latency", ["route"], registry=REGISTRY)
else:
    REGISTRY = REQ_COUNT = REQ_ERRORS = REQ_LATENCY = None  # type: ignore


# ------------------------------------------------------------------------------
# FastAPI app
# ------------------------------------------------------------------------------

configure_logging()
app = FastAPI(title="AI Service — Production Patterns", version="1.0.0")

app.add_middleware(RequestIDMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://127.0.0.1", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL, MODEL_VERSION = load_model()
CACHE = TTLCache(ttl_seconds=get_settings().cache_ttl_seconds)
BUCKETS: Dict[str, TokenBucket] = {}  # per-client ip buckets


# ------------------------------------------------------------------------------
# Utilities
# ------------------------------------------------------------------------------

def get_client_ip(req: Request) -> str:
    return req.client.host if req.client else "unknown"


def metrics_wrapper(route: str):
    def decorator(fn):
        async def wrapped(*args, **kwargs):
            start = time.perf_counter()
            try:
                res = await fn(*args, **kwargs)
                return res
            except Exception as e:
                if REQ_ERRORS:
                    REQ_ERRORS.labels(route=route).inc()
                raise
            finally:
                dur = time.perf_counter() - start
                if REQ_COUNT and REQ_LATENCY:
                    REQ_COUNT.labels(route=route).inc()
                    REQ_LATENCY.labels(route=route).observe(dur)
        return wrapped
    return decorator


# ------------------------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------------------------

@app.get("/health")
@metrics_wrapper("health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/ready")
@metrics_wrapper("ready")
async def ready() -> Dict[str, str]:
    # Could check model loaded, DB connectivity, etc.
    return {"ready": "true", "model": MODEL_VERSION}


@app.get("/version")
@metrics_wrapper("version")
async def version() -> Dict[str, str]:
    return {"version": MODEL_VERSION}


@app.get("/metrics")
async def metrics():
    if REGISTRY is None or generate_latest is None or CONTENT_TYPE_LATEST is None:
        return PlainTextResponse("metrics unavailable", status_code=503)
    data = generate_latest(REGISTRY)
    return PlainTextResponse(data, media_type=CONTENT_TYPE_LATEST)


@app.post("/predict", response_model=PredictOut)
@metrics_wrapper("predict")
async def predict(
    req: Request,
    payload: PredictIn = Body(...),
    settings: AppSettings = Depends(get_settings),
) -> PredictOut:
    # Rate limiting per client IP
    ip = get_client_ip(req)
    bucket = BUCKETS.get(ip)
    if bucket is None:
        bucket = BUCKETS[ip] = TokenBucket(capacity=settings.rate_capacity, refill_per_sec=settings.rate_refill_per_sec)
    if not bucket.allow():
        raise HTTPException(status_code=429, detail="rate_limit_exceeded")

    # Optional API key check
    api_key = req.headers.get("X-API-Key")
    if settings.api_key and api_key != settings.api_key:
        raise HTTPException(status_code=401, detail="invalid_api_key")

    # Cache lookup by key derived from inputs
    cache_key = f"{payload.f1:.6f}|{payload.f2:.6f}|{MODEL_VERSION}"
    cached = CACHE.get(cache_key)
    req_id = req.headers.get("X-Request-ID") or "n/a"
    if cached is not None:
        return PredictOut(score=float(cached), model_version=MODEL_VERSION, request_id=req_id)

    # Validate a list via TypeAdapter (example)
    _ = FloatListAdapter.validate_python([payload.f1, payload.f2])

    # Predict using model or pipeline
    rows = [[payload.f1, payload.f2]]
    try:
        # sklearn pipeline compatibility
        if hasattr(MODEL, "predict"):
            scores = MODEL.predict(rows)
            score = float(scores[0])
        elif hasattr(MODEL, "__call__"):
            score = float(MODEL(rows)[0])
        else:
            # fallback dummy
            score = float(DummyModel().predict(rows)[0])
    except Exception as e:
        log.exception("predict failed: %s", e)
        raise HTTPException(status_code=500, detail="prediction_error")

    CACHE.set(cache_key, score)
    return PredictOut(score=score, model_version=MODEL_VERSION, request_id=req_id)


# ------------------------------------------------------------------------------
# Error handler example
# ------------------------------------------------------------------------------

@app.exception_handler(HTTPException)
async def http_error_handler(request: Request, exc: HTTPException):
    # Convert to structured error with request id
    req_id = request.headers.get("X-Request-ID") or "n/a"
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "request_id": req_id},
    )


# ------------------------------------------------------------------------------
# Lifecycle hooks
# ------------------------------------------------------------------------------

@app.on_event("startup")
async def on_startup():
    log.info("Startup: model_version=%s", MODEL_VERSION)


@app.on_event("shutdown")
async def on_shutdown():
    log.info("Shutdown: cleaning up resources.")


# ------------------------------------------------------------------------------
# Entrypoint and deployment notes
# ------------------------------------------------------------------------------

if __name__ == "__main__":
    # Deployment notes:
    # - For local dev: uvicorn module_12_production:app --host 127.0.0.1 --port 8000 --reload
    # - For production: gunicorn -w 4 -k uvicorn.workers.UvicornWorker module_12_production:app
    # - Configure environment via APP_* (host/port/debug/api_key/rate limits)
    import uvicorn
    settings = get_settings()
    uvicorn.run(app, host=settings.host, port=settings.port, reload=settings.debug)