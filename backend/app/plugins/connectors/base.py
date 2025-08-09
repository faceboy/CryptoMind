import abc
from typing import List, Dict

class BaseConnector(abc.ABC):
    name: str = "base"

    @abc.abstractmethod
    async def backfill(self, symbol: str, timeframe: str, days: int) -> List[Dict]:
        """Return list of dict with keys: ts, open, high, low, close, volume"""
        raise NotImplementedError
