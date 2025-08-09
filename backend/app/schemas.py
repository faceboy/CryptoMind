from pydantic import BaseModel
from typing import Optional, List, Dict

class AssetCreate(BaseModel):
    symbol: str
    name: str
    binance_symbol: Optional[str] = None
    coingecko_id: Optional[str] = None
    category: Optional[str] = None
    market_cap_rank: Optional[int] = None
    description: Optional[str] = None
    website: Optional[str] = None
    is_active: bool = True

class AssetResp(AssetCreate):
    id: int

class BackfillRequest(BaseModel):
    symbol: str
    timeframe: str = "1h"
    days: int = 90

class SignalConfig(BaseModel):
    name: str
    params: Dict[str, float] | None = None

class SignalRequest(BaseModel):
    symbol: str
    timeframe: str = "1h"
    signals: List[SignalConfig]

class DecisionWeights(BaseModel):
    technical: float = 0.6
    onchain: float = 0.2
    sentiment: float = 0.2

class DecisionRequest(BaseModel):
    symbol: str
    timeframe: str = "1h"
    signals: List[SignalConfig]
    weights: DecisionWeights | None = None

class BacktestRequest(BaseModel):
    symbol: str
    timeframe: str
    signals: List[SignalConfig]
    start: Optional[str] = None
    end: Optional[str] = None
    initial_cash: float = 10000.0
    fee_bps: float = 10.0
