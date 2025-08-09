import pandas as pd
from app.plugins.signals.base import BaseSignal

class EMA(BaseSignal):
    name = "ema"

    def compute(self, df: pd.DataFrame, **params) -> pd.DataFrame:
        period = int(params.get("period", 20))
        ema = df["close"].ewm(span=period, adjust=False).mean()
        out = df.copy()
        out["value"] = ema
        out["trigger"] = 0
        prev = df["close"].shift(1) - ema.shift(1)
        cur = df["close"] - ema
        buy = (prev <= 0) & (cur > 0)
        sell = (prev >= 0) & (cur < 0)
        out.loc[buy, "trigger"] = 1
        out.loc[sell, "trigger"] = -1
        return out
