from app.services.signal_engine import run_signals
from app.core.config import settings

def decide(db, symbol, timeframe, configs, weights=None):
    w = weights or {
        "technical": settings.WEIGHT_TECHNICAL,
        "onchain": settings.WEIGHT_ONCHAIN,
        "sentiment": settings.WEIGHT_SENTIMENT,
    }
    res = run_signals(db, symbol, timeframe, configs)
    triggers = [v["trigger"] for v in res.values() if "trigger" in v]
    tech_score = (sum(triggers) / max(1.0, len(triggers))) if triggers else 0.0
    score = w["technical"] * tech_score
    rec = "BUY" if score > 0.25 else "SELL" if score < -0.25 else "HOLD"
    return {"score": score, "rec": rec, "details": res, "weights": w}
