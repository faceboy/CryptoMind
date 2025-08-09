import pandas as pd
import numpy as np
from .base import BaseSignal

class ADX(BaseSignal):
    """Average Directional Index (ADX) signal"""
    
    def compute(self, df: pd.DataFrame, **params) -> pd.DataFrame:
        period = params.get('period', 14)
        adx_threshold = params.get('adx_threshold', 25)
        
        # Calculate True Range (TR)
        high_low = df['high'] - df['low']
        high_close_prev = np.abs(df['high'] - df['close'].shift(1))
        low_close_prev = np.abs(df['low'] - df['close'].shift(1))
        tr = np.maximum(high_low, np.maximum(high_close_prev, low_close_prev))
        
        # Calculate Directional Movement
        plus_dm = np.where((df['high'] - df['high'].shift(1)) > (df['low'].shift(1) - df['low']),
                          np.maximum(df['high'] - df['high'].shift(1), 0), 0)
        minus_dm = np.where((df['low'].shift(1) - df['low']) > (df['high'] - df['high'].shift(1)),
                           np.maximum(df['low'].shift(1) - df['low'], 0), 0)
        
        # Smooth the values
        tr_smooth = pd.Series(tr).rolling(window=period).mean()
        plus_dm_smooth = pd.Series(plus_dm).rolling(window=period).mean()
        minus_dm_smooth = pd.Series(minus_dm).rolling(window=period).mean()
        
        # Calculate Directional Indicators
        plus_di = 100 * (plus_dm_smooth / tr_smooth)
        minus_di = 100 * (minus_dm_smooth / tr_smooth)
        
        # Calculate ADX
        dx = 100 * np.abs(plus_di - minus_di) / (plus_di + minus_di)
        adx = dx.rolling(window=period).mean()
        
        # Generate signals based on trend strength and direction
        signals = []
        for i in range(len(df)):
            if pd.isna(adx.iloc[i]) or pd.isna(plus_di.iloc[i]) or pd.isna(minus_di.iloc[i]):
                signals.append(0)
            elif adx.iloc[i] > adx_threshold:
                if plus_di.iloc[i] > minus_di.iloc[i]:
                    signals.append(1)  # Strong uptrend
                else:
                    signals.append(-1)  # Strong downtrend
            else:
                signals.append(0)  # Weak trend
        
        result = df.copy()
        result['adx'] = adx
        result['plus_di'] = plus_di
        result['minus_di'] = minus_di
        result['adx_signal'] = signals
        
        return result
