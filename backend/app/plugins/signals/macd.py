import pandas as pd
from app.plugins.signals.base import BaseSignal

class MACD(BaseSignal):
    name = "macd"

    def compute(self, df: pd.DataFrame, **params) -> pd.DataFrame:
        fast = int(params.get("fast", 12))
        slow = int(params.get("slow", 26))
        signal_p = int(params.get("signal", 9))
        ema_fast = df["close"].ewm(span=fast, adjust=False).mean()
        ema_slow = df["close"].ewm(span=slow, adjust=False).mean()
        macd = ema_fast - ema_slow
        signal = macd.ewm(span=signal_p, adjust=False).mean()
        hist = macd - signal
        out = df.copy()
        out["value"] = macd
        out["trigger"] = 0
        cross_up = (macd > signal) & (macd.shift(1) <= signal.shift(1))
        cross_down = (macd < signal) & (macd.shift(1) >= signal.shift(1))
        out.loc[cross_up, "trigger"] = 1
        out.loc[cross_down, "trigger"] = -1
        return out
