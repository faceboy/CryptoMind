import httpx
from datetime import datetime, timezone
from typing import List, Dict
from app.plugins.connectors.base import BaseConnector
from tenacity import retry, stop_after_attempt, wait_fixed

BASE = "https://api.coingecko.com/api/v3"

@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
async def _fetch_market_chart(id: str, vs_currency: str, days: int):
    async with httpx.AsyncClient() as session:
        r = await session.get(f"{BASE}/coins/{id}/market_chart", params={"vs_currency": vs_currency, "days": days}, timeout=30.0)
        r.raise_for_status()
        return r.json()

class CoinGeckoConnector(BaseConnector):
    name = "coingecko"

    async def backfill(self, symbol: str, timeframe: str, days: int) -> List[Dict]:
        data = await _fetch_market_chart(symbol, "usd", days)
        prices = data.get("prices", [])
        volumes = data.get("total_volumes", [])
        vmap = {datetime.fromtimestamp(v[0]/1000, tz=timezone.utc).replace(tzinfo=None): v[1] for v in volumes}
        out: List[Dict] = []
        for p in prices:
            ts = datetime.fromtimestamp(p[0]/1000, tz=timezone.utc).replace(tzinfo=None)
            close = float(p[1])
            out.append({
                "ts": ts,
                "open": close, "high": close, "low": close, "close": close,
                "volume": float(vmap.get(ts, 0.0))
            })
        return out
