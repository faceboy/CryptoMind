from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, UniqueConstraint, Index
from app.db import Base
from datetime import datetime

class Asset(Base):
    __tablename__ = "assets"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(32), index=True, unique=True)
    name: Mapped[str] = mapped_column(String(128))
    binance_symbol: Mapped[str | None] = mapped_column(String(64), nullable=True)
    coingecko_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    category: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    market_cap_rank: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    description: Mapped[str | None] = mapped_column(String(512), nullable=True)
    website: Mapped[str | None] = mapped_column(String(256), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True, index=True)

class PriceOHLCV(Base):
    __tablename__ = "price_ohlcv"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"), index=True)
    ts: Mapped[datetime] = mapped_column(DateTime, index=True)
    timeframe: Mapped[str] = mapped_column(String(8), index=True)  # 1m,5m,1h,4h,1d,1w
    open: Mapped[float] = mapped_column(Float)
    high: Mapped[float] = mapped_column(Float)
    low: Mapped[float] = mapped_column(Float)
    close: Mapped[float] = mapped_column(Float)
    volume: Mapped[float] = mapped_column(Float, default=0.0)
    source: Mapped[str] = mapped_column(String(32), default="binance")

    __table_args__ = (
        UniqueConstraint("asset_id", "ts", "timeframe", name="uix_asset_ts_tf"),
        Index("idx_price_lookup", "asset_id", "timeframe", "ts"),
    )

class Watchlist(Base):
    __tablename__ = "watchlist"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(32), index=True, unique=True)

class SignalRun(Base):
    __tablename__ = "signal_run"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"), index=True)
    timeframe: Mapped[str] = mapped_column(String(8), index=True)
    name: Mapped[str] = mapped_column(String(64), index=True)
    ts: Mapped[datetime] = mapped_column(DateTime, index=True)
    value: Mapped[float] = mapped_column(Float)
    trigger: Mapped[int] = mapped_column(Integer, default=0)  # -1 sell, 0 neutral, 1 buy

    __table_args__ = (Index("idx_signal_lookup", "asset_id", "timeframe", "name", "ts"),)


class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(32), index=True)
    amount: Mapped[float] = mapped_column(Float, default=0.0)
