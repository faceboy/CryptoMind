import pandas as pd
import numpy as np
from .base import BaseSignal

class WilliamsR(BaseSignal):
    """Williams %R signal"""
    
    def compute(self, df: pd.DataFrame, **params) -> pd.DataFrame:
        period = params.get('period', 14)
        overbought = params.get('overbought', -20)
        oversold = params.get('oversold', -80)
        
        # Calculate Williams %R
        highest_high = df['high'].rolling(window=period).max()
        lowest_low = df['low'].rolling(window=period).min()
        williams_r = -100 * ((highest_high - df['close']) / (highest_high - lowest_low))
        
        # Generate signals
        signals = []
        for i in range(len(df)):
            if pd.isna(williams_r.iloc[i]):
                signals.append(0)
            elif williams_r.iloc[i] < oversold:
                signals.append(1)  # Buy signal (oversold)
            elif williams_r.iloc[i] > overbought:
                signals.append(-1)  # Sell signal (overbought)
            else:
                signals.append(0)  # Neutral
        
        result = df.copy()
        result['williams_r'] = williams_r
        result['williams_r_signal'] = signals
        
        return result
