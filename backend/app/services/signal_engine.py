import importlib
import pandas as pd
from sqlalchemy.orm import Session
from app.models import Asset, PriceOHLCV, SignalRun
from typing import List, Dict

SIGNAL_IMPLS = {
    "ema": "app.plugins.signals.ema:EMA",
    "rsi": "app.plugins.signals.rsi:RSI",
    "macd": "app.plugins.signals.macd:MACD",
    "bollinger": "app.plugins.signals.bollinger:Bollinger",
    "volume_surge": "app.plugins.signals.volume_surge:VolumeSurge",
    "stochastic": "app.plugins.signals.stochastic:Stochastic",
    "williams_r": "app.plugins.signals.williams_r:WilliamsR",
    "adx": "app.plugins.signals.adx:ADX",
}

def _load_class(dotted: str):
    mod, cls = dotted.split(":")
    m = importlib.import_module(mod)
    return getattr(m, cls)()

def _to_df(rows):
    data = [{
        "ts": r.ts, "open": r.open, "high": r.high, "low": r.low,
        "close": r.close, "volume": r.volume
    } for r in rows]
    df = pd.DataFrame(data).sort_values("ts").reset_index(drop=True)
    return df

def run_signals(db: Session, symbol: str, timeframe: str, configs: List[Dict]):
    asset = db.query(Asset).filter(Asset.symbol==symbol).first()
    if not asset:
        raise ValueError(f"Unknown asset: {symbol}")
    rows = db.query(PriceOHLCV).filter(
        PriceOHLCV.asset_id==asset.id,
        PriceOHLCV.timeframe==timeframe
    ).order_by(PriceOHLCV.ts).all()
    if not rows:
        raise ValueError("No data for asset/timeframe; run backfill first.")
    df = _to_df(rows)
    results = {}
    for cfg in configs:
        impl = _load_class(SIGNAL_IMPLS[cfg["name"]])
        out = impl.compute(df.copy(), **(cfg.get("params") or {}))
        results[cfg["name"]] = out[["ts","value","trigger"]].tail(1).to_dict(orient="records")[0]
        last = out.tail(1).iloc[0]
        db.add(SignalRun(
            asset_id=asset.id, timeframe=timeframe, name=cfg["name"],
            ts=last["ts"], value=float(last["value"]), trigger=int(last.get("trigger", 0))
        ))
    db.commit()
    return results

def get_dataframe(db: Session, symbol: str, timeframe: str):
    asset = db.query(Asset).filter(Asset.symbol==symbol).first()
    rows = db.query(PriceOHLCV).filter(PriceOHLCV.asset_id==asset.id, PriceOHLCV.timeframe==timeframe).order_by(PriceOHLCV.ts).all()
    return _to_df(rows)
