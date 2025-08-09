from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import BacktestRequest
from app.services.backtest import backtest

router = APIRouter()

@router.post("/{symbol}")
def run_backtest(req: BacktestRequest, db: Session = Depends(get_db)):
    try:
        res = backtest(db, req.symbol.upper(), req.timeframe, [s.model_dump() for s in req.signals], initial_cash=req.initial_cash, fee_bps=req.fee_bps)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
