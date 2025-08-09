from fastapi import APIRouter, WebSocket
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Asset, PriceOHLCV
import asyncio

router = APIRouter()

@router.websocket("/ws/last_price")
async def last_price(ws: WebSocket, symbol: str, timeframe: str = "1h"):
    await ws.accept()
    db: Session = SessionLocal()
    try:
        while True:
            asset = db.query(Asset).filter(Asset.symbol==symbol.upper()).first()
            last = None
            if asset:
                last = db.query(PriceOHLCV).filter(PriceOHLCV.asset_id==asset.id, PriceOHLCV.timeframe==timeframe).order_by(PriceOHLCV.ts.desc()).first()
            price = last.close if last else 0.0
            await ws.send_json({"symbol": symbol.upper(), "timeframe": timeframe, "price": price})
            await asyncio.sleep(2.0)
    except Exception:
        pass
    finally:
        await ws.close()
        db.close()
