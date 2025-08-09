import pandas as pd
from app.plugins.signals.base import BaseSignal

class RSI(BaseSignal):
    name = "rsi"

    def compute(self, df: pd.DataFrame, **params) -> pd.DataFrame:
        period = int(params.get("period", 14))
        delta = df["close"].diff()
        up = delta.clip(lower=0)
        down = -1 * delta.clip(upper=0)
        gain = up.rolling(window=period, min_periods=period).mean()
        loss = down.rolling(window=period, min_periods=period).mean()
        rs = gain / (loss.replace(0, 1e-9))
        rsi = 100 - (100 / (1 + rs))
        out = df.copy()
        out["value"] = rsi
        out["trigger"] = 0
        out.loc[out["value"] < params.get("oversold", 30), "trigger"] = 1
        out.loc[out["value"] > params.get("overbought", 70), "trigger"] = -1
        return out
