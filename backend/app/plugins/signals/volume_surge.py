import pandas as pd
from app.plugins.signals.base import BaseSignal

class VolumeSurge(BaseSignal):
    name = "volume_surge"

    def compute(self, df: pd.DataFrame, **params) -> pd.DataFrame:
        lookback = int(params.get("lookback", 20))
        mult = float(params.get("mult", 2.0))
        vma = df["volume"].rolling(window=lookback, min_periods=lookback).mean()
        out = df.copy()
        out["value"] = df["volume"] / (vma.replace(0, 1e-9))
        out["trigger"] = 0
        out.loc[out["value"] > mult, "trigger"] = 1
        return out
