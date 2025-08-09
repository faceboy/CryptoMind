from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from typing import List, Dict
import uuid

router = APIRouter()

ALERTS: Dict[str, Dict] = {}

class AlertCreate(BaseModel):
    symbol: str
    timeframe: str = "1h"
    rule: str  # e.g., "rsi<30 and ema_cross_up"
    webhook: str  # URL to POST when triggered

@router.post("/")
def create_alert(a: AlertCreate, db: Session = Depends(get_db)):
    aid = str(uuid.uuid4())
    ALERTS[aid] = a.model_dump()
    return {"id": aid, "status": "created"}

@router.get("/")
def list_alerts():
    return ALERTS

@router.delete("/{aid}")
def delete_alert(aid: str):
    ALERTS.pop(aid, None)
    return {"status": "ok"}
