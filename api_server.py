#!/usr/bin/env python3
"""api_server.py — FastAPI + SQLite backend for AI Church Media Director leads.

Runs on port 8000 inside the sandbox. Persists lead submissions in leads.db
(SQLite, located alongside this file). Provides a simple admin JSON endpoint
for inspecting submissions during the pilot.
"""
from __future__ import annotations

import os
import re
import sqlite3
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field, field_validator

HERE = Path(__file__).resolve().parent
DB_PATH = HERE / "leads.db"

db = sqlite3.connect(DB_PATH, check_same_thread=False)
db.execute("""
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    church TEXT NOT NULL,
    role TEXT NOT NULL,
    volume TEXT NOT NULL,
    bottleneck TEXT NOT NULL,
    notes TEXT,
    visitor_id TEXT
)
""")
db.commit()


@asynccontextmanager
async def lifespan(app):
    yield
    db.close()


app = FastAPI(title="AI Church Media Director — Leads API", lifespan=lifespan)

# Permissive CORS — the public site reaches the API through the JWT-authenticated
# proxy, but allowing all origins keeps local development simple.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class Lead(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: str = Field(min_length=3, max_length=320)
    church: str = Field(min_length=1, max_length=300)
    role: str = Field(min_length=1, max_length=120)
    volume: str = Field(min_length=1, max_length=120)
    bottleneck: str = Field(min_length=1, max_length=160)
    notes: Optional[str] = Field(default=None, max_length=8000)

    @field_validator("email")
    @classmethod
    def email_valid(cls, v: str) -> str:
        v = v.strip()
        if not EMAIL_RE.match(v):
            raise ValueError("Invalid email")
        return v

    @field_validator("name", "church", "role", "volume", "bottleneck")
    @classmethod
    def strip_required(cls, v: str) -> str:
        v = (v or "").strip()
        if not v:
            raise ValueError("Required")
        return v


@app.get("/api/health")
def health():
    return {"ok": True, "service": "ai-church-media-director-leads"}


@app.post("/api/leads", status_code=201)
def create_lead(lead: Lead, request: Request):
    visitor_id = request.headers.get("X-Visitor-Id") or request.headers.get("x-visitor-id")
    created_at = datetime.utcnow().isoformat(timespec="seconds") + "Z"
    cur = db.execute(
        "INSERT INTO leads (created_at, name, email, church, role, volume, bottleneck, notes, visitor_id) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            created_at,
            lead.name,
            lead.email,
            lead.church,
            lead.role,
            lead.volume,
            lead.bottleneck,
            (lead.notes or "").strip() or None,
            visitor_id,
        ),
    )
    db.commit()
    return {"id": cur.lastrowid, "received": True, "message": "Lead saved. We'll be in touch."}


@app.get("/api/leads")
def list_leads(token: str = ""):
    """Simple admin listing. Requires a token matching LEADS_ADMIN_TOKEN env var.
    Default token is 'sample' so the agent can verify persistence locally.
    """
    expected = os.environ.get("LEADS_ADMIN_TOKEN", "sample")
    if token != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")
    rows = db.execute(
        "SELECT id, created_at, name, email, church, role, volume, bottleneck, notes, visitor_id "
        "FROM leads ORDER BY id DESC"
    ).fetchall()
    keys = ["id", "created_at", "name", "email", "church", "role", "volume", "bottleneck", "notes", "visitor_id"]
    return {"count": len(rows), "leads": [dict(zip(keys, r)) for r in rows]}


@app.exception_handler(ValueError)
async def value_error_handler(_request, exc):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
