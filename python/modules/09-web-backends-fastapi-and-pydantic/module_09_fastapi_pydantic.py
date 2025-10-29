#!/usr/bin/env python3
"""
Web Backends with FastAPI and Pydantic v2 — Module 9 teaching script.

This script demonstrates:
- FastAPI route handlers, path/query/body params, dependencies, responses
- Pydantic v2 BaseModel usage (validation, serialization, json schema)
- Pydantic v2 features: field_validator, model_validator, computed_field
- TypeAdapter for standalone validation
- Typed fields: EmailStr, HttpUrl, UUID, SecretStr, Literal, Annotated
- Discriminated unions for request payloads
- Settings via pydantic-settings (optional)
- WebSocket echo endpoint
- How to run this app with uvicorn programmatically

Run:
  python modules/09-web-backends-fastapi-and-pydantic/module_09_fastapi_pydantic.py

Requirements:
  pip install "fastapi[all]" "uvicorn[standard]" pydantic pydantic-settings

(If EmailStr validation errors occur, also install:
  pip install "pydantic[email]")

Try:
  curl http://127.0.0.1:8000/health
  curl "http://127.0.0.1:8000/items/42?limit=3&tags=nlp&tags=cv"
  curl -X POST http://127.0.0.1:8000/users -H "content-type: application/json" ^
       -d "{\\"email\\":\\"alice@example.com\\",\\"name\\":\\"Alice Smith\\",\\"website\\":\\"https://example.com\\",\\"password\\":\\"secret123\\"}"
  curl -X POST http://127.0.0.1:8000/orders -H "content-type: application/json" ^
       -d "{\\"kind\\":\\"physical\\",\\"sku\\":\\"B-100\\",\\"weight_grams\\":500}"
  curl -X POST http://127.0.0.1:8000/orders -H "content-type: application/json" ^
       -d "{\\"kind\\":\\"digital\\",\\"sku\\":\\"D-9\\",\\"download_url\\":\\"https://example.com/file.zip\\"}"
"""

from __future__ import annotations

import os
from typing import Annotated, List, Optional, Union, Dict
from uuid import UUID, uuid4

from fastapi import FastAPI, Query, Path, Body, Depends, BackgroundTasks, HTTPException, status, WebSocket
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from pydantic import (
    BaseModel,
    Field,
    EmailStr,
    HttpUrl,
    SecretStr,
    ConfigDict,
    field_validator,
    model_validator,
    computed_field,
    TypeAdapter,
)

# Settings (optional, uses pydantic-settings if available)
try:
    from pydantic_settings import BaseSettings, SettingsConfigDict  # type: ignore
    HAVE_SETTINGS = True
except Exception:
    HAVE_SETTINGS = False


# ------------------------------------------------------------------------------
# Pydantic Models and Validation Features
# ------------------------------------------------------------------------------

class UserIn(BaseModel):
    """
    Incoming user payload. Demonstrates:
    - Typed fields (EmailStr, HttpUrl, SecretStr)
    - Constrained values with Field (min_length, max_length)
    - field_validator for normalization/validation
    - model_validator for cross-field checks
    - computed_field for derived values
    """
    model_config = ConfigDict(strict=True)  # enable strict mode for this model

    email: EmailStr
    name: Annotated[str, Field(min_length=1, max_length=50)]
    website: Optional[HttpUrl] = None
    password: SecretStr

    @field_validator("name")
    @classmethod
    def normalize_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("name must not be empty")
        # Title-case normalization
        return " ".join(p.capitalize() for p in v.split())

    @model_validator(mode="after")
    def website_policy(self) -> "UserIn":
        # Example policy: if website is provided, enforce https scheme
        if self.website and self.website.scheme != "https":
            raise ValueError("website must use https")
        return self

    @computed_field  # type: ignore[misc]
    @property
    def name_len(self) -> int:
        return len(self.name)


class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    name: str

    # control serialization options in v2
    model_config = ConfigDict(
        str_strip_whitespace=True,
        populate_by_name=True,
        json_schema_extra={"example": {"id": str(uuid4()), "email": "alice@example.com", "name": "Alice Smith"}},
    )


class ItemOut(BaseModel):
    item_id: int
    tags: List[str]
    limit: int


# Discriminated Union for order payloads
class PhysicalItem(BaseModel):
    kind: Annotated[str, Field(pattern="^physical$")] = "physical"
    sku: Annotated[str, Field(min_length=2)]
    weight_grams: Annotated[int, Field(gt=0)]


class DigitalItem(BaseModel):
    kind: Annotated[str, Field(pattern="^digital$")] = "digital"
    sku: Annotated[str, Field(min_length=2)]
    download_url: HttpUrl


OrderItem = Annotated[Union[PhysicalItem, DigitalItem], Field(discriminator="kind")]


# Standalone validation using TypeAdapter
IntListAdapter = TypeAdapter(List[int])  # validate Python values into List[int]


# ------------------------------------------------------------------------------
# Settings via pydantic-settings (optional)
# ------------------------------------------------------------------------------

if HAVE_SETTINGS:
    class AppSettings(BaseSettings):
        """
        Application settings loaded from environment variables.

        Defaults:
          APP_HOST=127.0.0.1
          APP_PORT=8000
          APP_DEBUG=true
        """
        model_config = SettingsConfigDict(env_prefix="APP_", extra="ignore")
        host: str = "127.0.0.1"
        port: int = 8000
        debug: bool = True
        api_key: Optional[SecretStr] = None
else:
    class AppSettings(BaseModel):  # fallback if pydantic-settings not installed
        model_config = ConfigDict(extra="ignore")
        host: str = "127.0.0.1"
        port: int = 8000
        debug: bool = True
        api_key: Optional[SecretStr] = None


def get_settings() -> AppSettings:
    return AppSettings()


# ------------------------------------------------------------------------------
# FastAPI app setup
# ------------------------------------------------------------------------------

app = FastAPI(title="AI Backend — FastAPI + Pydantic v2", version="1.0.0")

# CORS middleware example (allow local dev UIs)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://127.0.0.1", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------------------

@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/items/{item_id}", response_model=ItemOut)
def get_item(
    item_id: Annotated[int, Path(ge=1, description="Item ID must be >= 1")],
    limit: Annotated[int, Query(ge=1, le=100, description="Max results to return")] = 10,
    tags: Annotated[List[str], Query(description="One or more tags")] = Query(default_factory=list),
) -> ItemOut:
    return ItemOut(item_id=item_id, tags=tags, limit=limit)


@app.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: Annotated[UserIn, Body(description="User payload with validated fields")],
    settings: Annotated[AppSettings, Depends(get_settings)],
) -> UserOut:
    # Simulate an API key check if provided
    if settings.api_key and settings.api_key.get_secret_value() == "":
        raise HTTPException(status_code=400, detail="Invalid API key in settings")
    # Pretend to hash password (never log or return it)
    _hashed = f"hashed:{'*' * len(payload.password.get_secret_value())}"
    # Return response model (Pydantic ensures serialization)
    return UserOut(id=uuid4(), email=payload.email, name=payload.name)


@app.post("/orders")
def create_order(order: OrderItem) -> Dict[str, str]:
    # Discriminated union picks the right model based on "kind"
    if isinstance(order, PhysicalItem):
        return {"ok": f"physical order for {order.sku} with {order.weight_grams}g"}
    if isinstance(order, DigitalItem):
        return {"ok": f"digital order for {order.sku} at {order.download_url}"}
    raise HTTPException(status_code=422, detail="Unsupported order kind")


@app.get("/validate-int-list")
def validate_int_list(values: Annotated[List[str], Query(description="List of ints as strings")]) -> Dict[str, List[int]]:
    """
    Demonstrate TypeAdapter to validate/parse lists into concrete types.
    Example: /validate-int-list?values=1&values=2&values=3
    """
    try:
        parsed = IntListAdapter.validate_python(values)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid values: {e}")
    return {"values": parsed}


@app.get("/settings")
def show_settings(settings: Annotated[AppSettings, Depends(get_settings)]) -> Dict[str, object]:
    # Pydantic v2 serialization helpers
    dumped = settings.model_dump()
    dumped_json = settings.model_dump_json(indent=2)
    return {"settings": dumped, "json": dumped_json}


# Background tasks example
def write_audit_log(user_id: UUID) -> None:
    # In real systems, write to an audit store
    with open("audit.log", "a", encoding="utf-8") as f:
        f.write(f"user_created:{user_id}\n")


@app.post("/users-with-audit", response_model=UserOut)
def create_user_with_audit(payload: UserIn, tasks: BackgroundTasks) -> UserOut:
    out = UserOut(id=uuid4(), email=payload.email, name=payload.name)
    tasks.add_task(write_audit_log, out.id)
    return out


# Error handling example
@app.get("/secure")
def secure_endpoint(settings: Annotated[AppSettings, Depends(get_settings)]):
    if not settings.api_key:
        raise HTTPException(status_code=401, detail="API key required")
    return {"ok": True}


# WebSocket echo
@app.websocket("/ws/echo")
async def websocket_echo(ws: WebSocket):
    await ws.accept()
    await ws.send_text("Connected. Send 'bye' to close.")
    try:
        while True:
            msg = await ws.receive_text()
            if msg.lower() == "bye":
                await ws.send_text("Goodbye!")
                break
            await ws.send_text(f"echo: {msg}")
    finally:
        await ws.close()


# ------------------------------------------------------------------------------
# JSON Schema Introspection
# ------------------------------------------------------------------------------

def print_json_schema_examples() -> None:
    print("UserIn JSON schema keys:", list(UserIn.model_json_schema().keys()))
    print("OrderItem schema discriminator:", OrderItem.__metadata__[0].discriminator)  # type: ignore[attr-defined]


# ------------------------------------------------------------------------------
# Entrypoint (programmatic uvicorn)
# ------------------------------------------------------------------------------

if __name__ == "__main__":
    # Print some schema details on startup for teaching purposes
    print_json_schema_examples()

    # Start uvicorn programmatically so we don't need import strings (hyphens in path).
    import uvicorn

    settings = get_settings()
    # INFO: change host/port via env vars: APP_HOST, APP_PORT, APP_DEBUG, APP_API_KEY
    uvicorn.run(app, host=settings.host, port=settings.port, reload=settings.debug)