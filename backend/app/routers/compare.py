from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import math, statistics
from app.db import get_db
from app.models import Asset, PriceOHLCV

router = APIRouter()

def _series(db, asset_id, timeframe, limit):
    rows = (db.query(PriceOHLCV)
        .filter(PriceOHLCV.asset_id==asset_id, PriceOHLCV.timeframe==timeframe)
        .order_by(PriceOHLCV.ts.desc())
        .limit(limit).all())
    rows = list(reversed(rows))
    if not rows: return []
    return [r.close for r in rows]

@router.get("")
def compare(symbols: List[str] = Query(...), timeframe: str = "1h", limit: int = 500, db: Session = Depends(get_db)):
    out = []
    for s in symbols:
        asset = db.query(Asset).filter(Asset.symbol==s.upper()).first()
        if not asset: raise HTTPException(404, f"Unknown asset: {s}")
        prices = _series(db, asset.id, timeframe, limit)
        if len(prices) < 2: raise HTTPException(400, f"Not enough data for {s}")
        rets = [(prices[i]/prices[i-1]-1.0) for i in range(1,len(prices))]
        vol = statistics.pstdev(rets) if len(rets)>1 else 0.0
        perf = prices[-1]/prices[0]-1.0
        out.append({"symbol": s.upper(), "return": perf, "volatility": vol, "last": prices[-1]})
    return out
