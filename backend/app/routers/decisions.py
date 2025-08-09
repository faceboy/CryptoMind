from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import DecisionRequest
from app.services.decision_engine import decide

router = APIRouter()

@router.post("/{symbol}")
def decision(req: DecisionRequest, db: Session = Depends(get_db)):
    try:
        weights = req.weights.model_dump() if req.weights else None
        res = decide(db, req.symbol.upper(), req.timeframe, [s.model_dump() for s in req.signals], weights=weights)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
