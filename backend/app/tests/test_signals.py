import pandas as pd
from app.plugins.signals.ema import EMA
from app.plugins.signals.rsi import RSI
from app.plugins.signals.macd import MACD
from app.plugins.signals.bollinger import Bollinger
from app.plugins.signals.volume_surge import VolumeSurge

def sample_df(n=100):
    import numpy as np
    ts = pd.date_range("2024-01-01", periods=n, freq="H")
    price = pd.Series(range(n)) + np.random.randn(n) * 0.5 + 100
    vol = pd.Series(1000 + (np.random.randn(n)*50).abs())
    return pd.DataFrame({"ts": ts, "open": price, "high": price+1, "low": price-1, "close": price, "volume": vol})

def test_signals():
    df = sample_df()
    for Sig in [EMA, RSI, MACD, Bollinger, VolumeSurge]:
        out = Sig().compute(df.copy())
        assert "value" in out.columns
        assert "trigger" in out.columns
