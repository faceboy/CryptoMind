from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Watchlist

router = APIRouter()

@router.get("/")
def list_watchlist(db: Session = Depends(get_db)):
    items = db.query(Watchlist).all()
    return [{"id": i.id, "symbol": i.symbol} for i in items]

@router.post("/{symbol}")
def add(symbol: str, db: Session = Depends(get_db)):
    if not db.query(Watchlist).filter(Watchlist.symbol==symbol.upper()).first():
        db.add(Watchlist(symbol=symbol.upper())); db.commit()
    return {"status": "ok"}

@router.delete("/{symbol}")
def remove(symbol: str, db: Session = Depends(get_db)):
    row = db.query(Watchlist).filter(Watchlist.symbol==symbol.upper()).first()
    if row:
        db.delete(row); db.commit()
    return {"status": "ok"}
