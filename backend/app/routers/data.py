from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import BackfillRequest
from app.services.data_loader import backfill_prices, ensure_assets
from app.models import Asset, PriceOHLCV

router = APIRouter()

@router.post("/backfill")
async def backfill(req: BackfillRequest, db: Session = Depends(get_db)):
    ensure_assets(db)
    try:
        res = await backfill_prices(db, req.symbol.upper(), req.timeframe, req.days)
        return {"status": "ok", **res}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/ohlcv")
def get_ohlcv(
    symbol: str = Query(..., description="Asset symbol, e.g., BTC"),
    timeframe: str = Query("1h"),
    limit: int = Query(500, ge=1, le=5000),
    db: Session = Depends(get_db)
):
    asset = db.query(Asset).filter(Asset.symbol==symbol.upper()).first()
    if not asset:
        raise HTTPException(status_code=404, detail=f"Unknown asset: {symbol}")
    q = db.query(PriceOHLCV).filter(PriceOHLCV.asset_id==asset.id, PriceOHLCV.timeframe==timeframe)        .order_by(PriceOHLCV.ts.desc()).limit(limit)
    rows = list(reversed(q.all()))
    return [{
        "ts": r.ts.isoformat(),
        "open": r.open, "high": r.high, "low": r.low, "close": r.close,
        "volume": r.volume, "source": r.source
    } for r in rows]

@router.get("/timeframes")
def list_timeframes():
    return ["1m","5m","15m","1h","4h","1d","1w"]
