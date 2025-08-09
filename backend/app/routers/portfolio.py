from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import PortfolioHolding, Asset, PriceOHLCV

router = APIRouter()

@router.get("/")
def list_holdings(db: Session = Depends(get_db)):
    holdings = db.query(PortfolioHolding).all()
    resp = []
    total = 0.0
    for h in holdings:
        asset = db.query(Asset).filter(Asset.symbol==h.symbol).first()
        last = db.query(PriceOHLCV).filter(PriceOHLCV.asset_id==asset.id).order_by(PriceOHLCV.ts.desc()).first() if asset else None
        price = last.close if last else 0.0
        val = h.amount * price
        total += val
        resp.append({"id": h.id, "symbol": h.symbol, "amount": h.amount, "price": price, "value": val})
    return {"total_value": total, "holdings": resp}

@router.post("/{symbol}")
def upsert(symbol: str, amount: float, db: Session = Depends(get_db)):
    symbol = symbol.upper()
    row = db.query(PortfolioHolding).filter(PortfolioHolding.symbol==symbol).first()
    if row: row.amount = amount
    else: db.add(PortfolioHolding(symbol=symbol, amount=amount))
    db.commit()
    return {"status": "ok"}

@router.delete("/{symbol}")
def remove(symbol: str, db: Session = Depends(get_db)):
    row = db.query(PortfolioHolding).filter(PortfolioHolding.symbol==symbol.upper()).first()
    if row: db.delete(row); db.commit()
    return {"status": "ok"}
