from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import Base, engine, get_db
from app.models import Asset
from app.schemas import AssetCreate, AssetResp
from app.services.data_loader import ensure_assets

router = APIRouter()
Base.metadata.create_all(bind=engine)

@router.post("/", response_model=AssetResp)
def create_asset(payload: AssetCreate, db: Session = Depends(get_db)):
    a = Asset(**payload.model_dump())
    db.add(a); db.commit(); db.refresh(a)
    return AssetResp(
        id=a.id, 
        symbol=a.symbol, 
        name=a.name, 
        binance_symbol=a.binance_symbol, 
        coingecko_id=a.coingecko_id,
        category=a.category,
        market_cap_rank=a.market_cap_rank,
        description=a.description,
        website=a.website,
        is_active=a.is_active
    )

@router.get("/seed")
def seed_assets(db: Session = Depends(get_db)):
    ensure_assets(db)
    items = db.query(Asset).filter(Asset.is_active == True).order_by(Asset.market_cap_rank.asc().nulls_last()).all()
    return [{
        "id": a.id,
        "symbol": a.symbol, 
        "name": a.name, 
        "binance_symbol": a.binance_symbol, 
        "coingecko_id": a.coingecko_id,
        "category": a.category,
        "market_cap_rank": a.market_cap_rank,
        "description": a.description,
        "website": a.website,
        "is_active": a.is_active
    } for a in items]

@router.get("/")
def list_assets(db: Session = Depends(get_db)):
    items = db.query(Asset).filter(Asset.is_active == True).order_by(Asset.market_cap_rank.asc().nulls_last()).all()
    return [{
        "id": a.id,
        "symbol": a.symbol, 
        "name": a.name, 
        "binance_symbol": a.binance_symbol, 
        "coingecko_id": a.coingecko_id,
        "category": a.category,
        "market_cap_rank": a.market_cap_rank,
        "description": a.description,
        "website": a.website,
        "is_active": a.is_active
    } for a in items]

@router.get("/categories")
def get_asset_categories(db: Session = Depends(get_db)):
    """Get all unique asset categories"""
    categories = db.query(Asset.category).filter(Asset.category.isnot(None), Asset.is_active == True).distinct().all()
    return [{"category": cat[0]} for cat in categories if cat[0]]

@router.get("/category/{category}")
def get_assets_by_category(category: str, db: Session = Depends(get_db)):
    """Get assets filtered by category"""
    items = db.query(Asset).filter(
        Asset.category == category, 
        Asset.is_active == True
    ).order_by(Asset.market_cap_rank.asc().nulls_last()).all()
    return [{
        "id": a.id,
        "symbol": a.symbol, 
        "name": a.name, 
        "binance_symbol": a.binance_symbol, 
        "coingecko_id": a.coingecko_id,
        "category": a.category,
        "market_cap_rank": a.market_cap_rank,
        "description": a.description,
        "website": a.website,
        "is_active": a.is_active
    } for a in items]
