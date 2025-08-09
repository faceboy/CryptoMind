import pandas as pd
from app.plugins.signals.base import BaseSignal

class Bollinger(BaseSignal):
    name = "bollinger"

    def compute(self, df: pd.DataFrame, **params) -> pd.DataFrame:
        period = int(params.get("period", 20))
        mult = float(params.get("mult", 2.0))
        ma = df["close"].rolling(window=period, min_periods=period).mean()
        std = df["close"].rolling(window=period, min_periods=period).std()
        upper = ma + mult * std
        lower = ma - mult * std
        out = df.copy()
        out["value"] = (df["close"] - ma) / (std.replace(0, 1e-9))
        out["trigger"] = 0
        out.loc[df["close"] < lower, "trigger"] = 1
        out.loc[df["close"] > upper, "trigger"] = -1
        return out
