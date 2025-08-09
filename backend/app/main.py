from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import assets, data, signals, decisions, backtest, watchlist, compare, portfolio, reports, alerts, ws

# Initialize FastAPI application with metadata
app = FastAPI(title="CryptoMind Analytics", version="0.1.0")

# Configure CORS origins from environment settings
# Split comma-separated origins or default to allow all origins in development
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assets.router, prefix="/assets", tags=["assets"])
app.include_router(data.router, prefix="/data", tags=["data"])
app.include_router(signals.router, prefix="/signals", tags=["signals"])
app.include_router(decisions.router, prefix="/decisions", tags=["decisions"])
app.include_router(backtest.router, prefix="/backtest", tags=["backtest"])
app.include_router(compare.router, prefix="/compare", tags=["compare"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
app.include_router(ws.router, tags=["ws"])
app.include_router(watchlist.router, prefix="/watchlist", tags=["watchlist"])

@app.get("/health")
def health():
    return {"status": "ok"}
