from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session
from io import StringIO
import csv
from app.db import get_db
from app.models import Asset, PriceOHLCV

router = APIRouter()

@router.get("/ohlcv.csv")
def ohlcv_csv(symbol: str, timeframe: str = "1h", limit: int = 1000, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.symbol==symbol.upper()).first()
    if not asset: raise HTTPException(404, f"Unknown asset: {symbol}")
    rows = (db.query(PriceOHLCV)
        .filter(PriceOHLCV.asset_id==asset.id, PriceOHLCV.timeframe==timeframe)
        .order_by(PriceOHLCV.ts.desc()).limit(limit).all())
    rows = list(reversed(rows))
    sio = StringIO()
    w = csv.writer(sio)
    w.writerow(["ts","open","high","low","close","volume","source"])
    for r in rows:
        w.writerow([r.ts.isoformat(), r.open, r.high, r.low, r.close, r.volume, r.source])
    return Response(content=sio.getvalue(), media_type="text/csv")
