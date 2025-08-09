import pandas as pd
import numpy as np
from .base import BaseSignal

class Stochastic(BaseSignal):
    """Stochastic Oscillator signal"""
    
    def compute(self, df: pd.DataFrame, **params) -> pd.DataFrame:
        k_period = params.get('k_period', 14)
        d_period = params.get('d_period', 3)
        overbought = params.get('overbought', 80)
        oversold = params.get('oversold', 20)
        
        # Calculate %K
        lowest_low = df['low'].rolling(window=k_period).min()
        highest_high = df['high'].rolling(window=k_period).max()
        k_percent = 100 * ((df['close'] - lowest_low) / (highest_high - lowest_low))
        
        # Calculate %D (moving average of %K)
        d_percent = k_percent.rolling(window=d_period).mean()
        
        # Generate signals
        signals = []
        for i in range(len(df)):
            if pd.isna(k_percent.iloc[i]) or pd.isna(d_percent.iloc[i]):
                signals.append(0)
            elif k_percent.iloc[i] < oversold and d_percent.iloc[i] < oversold:
                signals.append(1)  # Buy signal
            elif k_percent.iloc[i] > overbought and d_percent.iloc[i] > overbought:
                signals.append(-1)  # Sell signal
            else:
                signals.append(0)  # Neutral
        
        result = df.copy()
        result['stoch_k'] = k_percent
        result['stoch_d'] = d_percent
        result['stoch_signal'] = signals
        
        return result
