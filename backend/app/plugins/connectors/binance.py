import httpx
from datetime import datetime, timezone
from typing import List, Dict
from app.plugins.connectors.base import BaseConnector
from app.utils.timeframes import BINANCE_INTERVALS
from tenacity import retry, stop_after_attempt, wait_fixed

BASE = "https://api.binance.com/api/v3"

def _to_ms(dt: datetime) -> int:
    return int(dt.timestamp() * 1000)

@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
async def _fetch_klines(session, symbol, interval, limit=1000, startTime=None):
    params = {"symbol": symbol, "interval": interval, "limit": limit}
    if startTime is not None:
        params["startTime"] = startTime
    r = await session.get(f"{BASE}/klines", params=params, timeout=30.0)
    r.raise_for_status()
    return r.json()

class BinanceConnector(BaseConnector):
    name = "binance"

    async def backfill(self, symbol: str, timeframe: str, days: int) -> List[Dict]:
        interval = BINANCE_INTERVALS.get(timeframe)
        if not interval:
            raise ValueError(f"Unsupported timeframe for Binance: {timeframe}")
        now_ms = _to_ms(datetime.now(timezone.utc))
        total_ms = days * 86_400_000
        start_ms = now_ms - total_ms
        out: List[Dict] = []
        async with httpx.AsyncClient() as session:
            cur = start_ms
            while cur < now_ms:
                chunk = await _fetch_klines(session, symbol, interval, limit=1000, startTime=cur)
                if not chunk:
                    break
                for c in chunk:
                    # c: [ open time, open, high, low, close, volume, close time, ... ]
                    out.append({
                        "ts": datetime.fromtimestamp(c[0]/1000, tz=timezone.utc).replace(tzinfo=None),
                        "open": float(c[1]),
                        "high": float(c[2]),
                        "low": float(c[3]),
                        "close": float(c[4]),
                        "volume": float(c[5]),
                    })
                # paginate by last open time + 1 ms
                last_open = chunk[-1][0]
                if len(chunk) < 1000:
                    break
                cur = last_open + 1
        # dedupe by timestamp
        seen = set(); dedup = []
        for r in out:
            if r["ts"] not in seen:
                dedup.append(r); seen.add(r["ts"])
        return dedup
