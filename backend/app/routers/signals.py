from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import SignalRequest
from app.services.signal_engine import run_signals

router = APIRouter()

@router.post("/{symbol}")
def run(req: SignalRequest, db: Session = Depends(get_db)):
    try:
        res = run_signals(db, req.symbol.upper(), req.timeframe, [s.model_dump() for s in req.signals])
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
