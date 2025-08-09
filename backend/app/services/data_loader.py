from sqlalchemy.orm import Session
from app.models import Asset, PriceOHLCV
from app.plugins.connectors.binance import BinanceConnector
from app.plugins.connectors.coingecko import CoinGeckoConnector

CONNECTORS = {
    "binance": BinanceConnector(),
    "coingecko": CoinGeckoConnector(),
}

DEFAULT_ASSETS = [
    # Major Cryptocurrencies (Top 10)
    {"symbol": "BTC", "name": "Bitcoin", "binance_symbol": "BTCUSDT", "coingecko_id": "bitcoin", "category": "Layer 1", "market_cap_rank": 1, "description": "The first and largest cryptocurrency by market cap", "website": "https://bitcoin.org"},
    {"symbol": "ETH", "name": "Ethereum", "binance_symbol": "ETHUSDT", "coingecko_id": "ethereum", "category": "Layer 1", "market_cap_rank": 2, "description": "Decentralized platform for smart contracts and DApps", "website": "https://ethereum.org"},
    {"symbol": "BNB", "name": "BNB", "binance_symbol": "BNBUSDT", "coingecko_id": "binancecoin", "category": "Exchange", "market_cap_rank": 4, "description": "Binance exchange native token", "website": "https://www.binance.com"},
    {"symbol": "SOL", "name": "Solana", "binance_symbol": "SOLUSDT", "coingecko_id": "solana", "category": "Layer 1", "market_cap_rank": 5, "description": "High-performance blockchain for DeFi and Web3", "website": "https://solana.com"},
    {"symbol": "XRP", "name": "XRP", "binance_symbol": "XRPUSDT", "coingecko_id": "ripple", "category": "Payment", "market_cap_rank": 6, "description": "Digital payment protocol for financial institutions", "website": "https://ripple.com"},
    {"symbol": "USDC", "name": "USD Coin", "binance_symbol": "USDCUSDT", "coingecko_id": "usd-coin", "category": "Stablecoin", "market_cap_rank": 7, "description": "Fully regulated US dollar stablecoin", "website": "https://www.centre.io"},
    {"symbol": "ADA", "name": "Cardano", "binance_symbol": "ADAUSDT", "coingecko_id": "cardano", "category": "Layer 1", "market_cap_rank": 8, "description": "Proof-of-stake blockchain platform", "website": "https://cardano.org"},
    {"symbol": "AVAX", "name": "Avalanche", "binance_symbol": "AVAXUSDT", "coingecko_id": "avalanche-2", "category": "Layer 1", "market_cap_rank": 9, "description": "Platform for decentralized applications and custom blockchain networks", "website": "https://www.avax.network"},
    {"symbol": "DOGE", "name": "Dogecoin", "binance_symbol": "DOGEUSDT", "coingecko_id": "dogecoin", "category": "Meme", "market_cap_rank": 10, "description": "The original meme cryptocurrency", "website": "https://dogecoin.com"},
    {"symbol": "TRX", "name": "TRON", "binance_symbol": "TRXUSDT", "coingecko_id": "tron", "category": "Layer 1", "market_cap_rank": 11, "description": "Decentralized blockchain platform for content sharing", "website": "https://tron.network"},
    
    # Layer 2 Solutions
    {"symbol": "MATIC", "name": "Polygon", "binance_symbol": "MATICUSDT", "coingecko_id": "matic-network", "category": "Layer 2", "market_cap_rank": 15, "description": "Ethereum scaling solution", "website": "https://polygon.technology"},
    {"symbol": "OP", "name": "Optimism", "binance_symbol": "OPUSDT", "coingecko_id": "optimism", "category": "Layer 2", "market_cap_rank": 25, "description": "Ethereum Layer 2 optimistic rollup", "website": "https://optimism.io"},
    {"symbol": "ARB", "name": "Arbitrum", "binance_symbol": "ARBUSDT", "coingecko_id": "arbitrum", "category": "Layer 2", "market_cap_rank": 30, "description": "Ethereum Layer 2 scaling solution", "website": "https://arbitrum.io"},
    
    # DeFi Tokens
    {"symbol": "UNI", "name": "Uniswap", "binance_symbol": "UNIUSDT", "coingecko_id": "uniswap", "category": "DeFi", "market_cap_rank": 20, "description": "Leading decentralized exchange protocol", "website": "https://uniswap.org"},
    {"symbol": "LINK", "name": "Chainlink", "binance_symbol": "LINKUSDT", "coingecko_id": "chainlink", "category": "Oracle", "market_cap_rank": 12, "description": "Decentralized oracle network", "website": "https://chain.link"},
    {"symbol": "AAVE", "name": "Aave", "binance_symbol": "AAVEUSDT", "coingecko_id": "aave", "category": "DeFi", "market_cap_rank": 35, "description": "Decentralized lending protocol", "website": "https://aave.com"},
    {"symbol": "MKR", "name": "Maker", "binance_symbol": "MKRUSDT", "coingecko_id": "maker", "category": "DeFi", "market_cap_rank": 40, "description": "Decentralized autonomous organization and creator of DAI", "website": "https://makerdao.com"},
    {"symbol": "COMP", "name": "Compound", "binance_symbol": "COMPUSDT", "coingecko_id": "compound-governance-token", "category": "DeFi", "market_cap_rank": 80, "description": "Algorithmic money market protocol", "website": "https://compound.finance"},
    {"symbol": "SUSHI", "name": "SushiSwap", "binance_symbol": "SUSHIUSDT", "coingecko_id": "sushi", "category": "DeFi", "market_cap_rank": 90, "description": "Community-driven decentralized exchange", "website": "https://sushi.com"},
    {"symbol": "CRV", "name": "Curve DAO Token", "binance_symbol": "CRVUSDT", "coingecko_id": "curve-dao-token", "category": "DeFi", "market_cap_rank": 85, "description": "Decentralized exchange for stablecoins", "website": "https://curve.fi"},
    {"symbol": "1INCH", "name": "1inch Network", "binance_symbol": "1INCHUSDT", "coingecko_id": "1inch", "category": "DeFi", "market_cap_rank": 100, "description": "DEX aggregator protocol", "website": "https://1inch.io"},
    
    # Gaming & Metaverse
    {"symbol": "SAND", "name": "The Sandbox", "binance_symbol": "SANDUSDT", "coingecko_id": "the-sandbox", "category": "Gaming", "market_cap_rank": 60, "description": "Virtual world and gaming ecosystem", "website": "https://www.sandbox.game"},
    {"symbol": "MANA", "name": "Decentraland", "binance_symbol": "MANAUSDT", "coingecko_id": "decentraland", "category": "Gaming", "market_cap_rank": 65, "description": "Virtual reality platform powered by Ethereum", "website": "https://decentraland.org"},
    {"symbol": "AXS", "name": "Axie Infinity", "binance_symbol": "AXSUSDT", "coingecko_id": "axie-infinity", "category": "Gaming", "market_cap_rank": 70, "description": "Blockchain-based trading and battling game", "website": "https://axieinfinity.com"},
    {"symbol": "ENJ", "name": "Enjin Coin", "binance_symbol": "ENJUSDT", "coingecko_id": "enjincoin", "category": "Gaming", "market_cap_rank": 120, "description": "Blockchain platform for gaming", "website": "https://enjin.io"},
    {"symbol": "GALA", "name": "Gala", "binance_symbol": "GALAUSDT", "coingecko_id": "gala", "category": "Gaming", "market_cap_rank": 110, "description": "Blockchain gaming ecosystem", "website": "https://gala.games"},
    
    # AI & Data
    {"symbol": "FET", "name": "Fetch.ai", "binance_symbol": "FETUSDT", "coingecko_id": "fetch-ai", "category": "AI", "market_cap_rank": 75, "description": "AI and machine learning blockchain platform", "website": "https://fetch.ai"},
    {"symbol": "OCEAN", "name": "Ocean Protocol", "binance_symbol": "OCEANUSDT", "coingecko_id": "ocean-protocol", "category": "AI", "market_cap_rank": 130, "description": "Decentralized data exchange protocol", "website": "https://oceanprotocol.com"},
    {"symbol": "GRT", "name": "The Graph", "binance_symbol": "GRTUSDT", "coingecko_id": "the-graph", "category": "Data", "market_cap_rank": 55, "description": "Indexing protocol for querying blockchain data", "website": "https://thegraph.com"},
    
    # Meme Coins
    {"symbol": "SHIB", "name": "Shiba Inu", "binance_symbol": "SHIBUSDT", "coingecko_id": "shiba-inu", "category": "Meme", "market_cap_rank": 13, "description": "Decentralized meme token", "website": "https://shibatoken.com"},
    {"symbol": "PEPE", "name": "Pepe", "binance_symbol": "PEPEUSDT", "coingecko_id": "pepe", "category": "Meme", "market_cap_rank": 45, "description": "Meme coin inspired by Pepe the Frog", "website": "https://www.pepe.vip"},
    {"symbol": "FLOKI", "name": "FLOKI", "binance_symbol": "FLOKIUSDT", "coingecko_id": "floki", "category": "Meme", "market_cap_rank": 95, "description": "Utility meme token", "website": "https://floki.com"},
    
    # Privacy Coins
    {"symbol": "XMR", "name": "Monero", "binance_symbol": None, "coingecko_id": "monero", "category": "Privacy", "market_cap_rank": 28, "description": "Privacy-focused cryptocurrency", "website": "https://www.getmonero.org"},
    {"symbol": "ZEC", "name": "Zcash", "binance_symbol": "ZECUSDT", "coingecko_id": "zcash", "category": "Privacy", "market_cap_rank": 50, "description": "Privacy-preserving digital currency", "website": "https://z.cash"},
    
    # Infrastructure
    {"symbol": "DOT", "name": "Polkadot", "binance_symbol": "DOTUSDT", "coingecko_id": "polkadot", "category": "Infrastructure", "market_cap_rank": 14, "description": "Multi-chain interoperability protocol", "website": "https://polkadot.network"},
    {"symbol": "ATOM", "name": "Cosmos", "binance_symbol": "ATOMUSDT", "coingecko_id": "cosmos", "category": "Infrastructure", "market_cap_rank": 22, "description": "Internet of blockchains", "website": "https://cosmos.network"},
    {"symbol": "NEAR", "name": "NEAR Protocol", "binance_symbol": "NEARUSDT", "coingecko_id": "near", "category": "Layer 1", "market_cap_rank": 24, "description": "User-friendly blockchain platform", "website": "https://near.org"},
    {"symbol": "ALGO", "name": "Algorand", "binance_symbol": "ALGOUSDT", "coingecko_id": "algorand", "category": "Layer 1", "market_cap_rank": 32, "description": "Pure proof-of-stake blockchain", "website": "https://algorand.com"},
    {"symbol": "VET", "name": "VeChain", "binance_symbol": "VETUSDT", "coingecko_id": "vechain", "category": "Supply Chain", "market_cap_rank": 38, "description": "Enterprise blockchain platform", "website": "https://www.vechain.org"},
    
    # Exchange Tokens
    {"symbol": "CRO", "name": "Cronos", "binance_symbol": "CROUSDT", "coingecko_id": "crypto-com-chain", "category": "Exchange", "market_cap_rank": 26, "description": "Crypto.com native token", "website": "https://crypto.com"},
    {"symbol": "LEO", "name": "UNUS SED LEO", "binance_symbol": None, "coingecko_id": "leo-token", "category": "Exchange", "market_cap_rank": 18, "description": "Bitfinex exchange token", "website": "https://www.bitfinex.com"},
    
    # Stablecoins
    {"symbol": "USDT", "name": "Tether", "binance_symbol": None, "coingecko_id": "tether", "category": "Stablecoin", "market_cap_rank": 3, "description": "Most widely used stablecoin", "website": "https://tether.to"},
    {"symbol": "BUSD", "name": "Binance USD", "binance_symbol": "BUSDUSDT", "coingecko_id": "binance-usd", "category": "Stablecoin", "market_cap_rank": 16, "description": "Binance regulated stablecoin", "website": "https://www.binance.com"},
    {"symbol": "DAI", "name": "Dai", "binance_symbol": "DAIUSDT", "coingecko_id": "dai", "category": "Stablecoin", "market_cap_rank": 17, "description": "Decentralized stablecoin", "website": "https://makerdao.com"},
    
    # Emerging Layer 1s
    {"symbol": "APT", "name": "Aptos", "binance_symbol": "APTUSDT", "coingecko_id": "aptos", "category": "Layer 1", "market_cap_rank": 29, "description": "Scalable Layer 1 blockchain", "website": "https://aptoslabs.com"},
    {"symbol": "SUI", "name": "Sui", "binance_symbol": "SUIUSDT", "coingecko_id": "sui", "category": "Layer 1", "market_cap_rank": 33, "description": "Next-generation smart contract platform", "website": "https://sui.io"},
    {"symbol": "SEI", "name": "Sei", "binance_symbol": "SEIUSDT", "coingecko_id": "sei-network", "category": "Layer 1", "market_cap_rank": 42, "description": "Sector-specific Layer 1 for trading", "website": "https://www.sei.io"},
    
    # Additional Popular Tokens
    {"symbol": "LTC", "name": "Litecoin", "binance_symbol": "LTCUSDT", "coingecko_id": "litecoin", "category": "Payment", "market_cap_rank": 19, "description": "Peer-to-peer cryptocurrency", "website": "https://litecoin.org"},
    {"symbol": "BCH", "name": "Bitcoin Cash", "binance_symbol": "BCHUSDT", "coingecko_id": "bitcoin-cash", "category": "Payment", "market_cap_rank": 21, "description": "Bitcoin fork focused on payments", "website": "https://bitcoincash.org"},
    {"symbol": "ETC", "name": "Ethereum Classic", "binance_symbol": "ETCUSDT", "coingecko_id": "ethereum-classic", "category": "Layer 1", "market_cap_rank": 23, "description": "Original Ethereum blockchain", "website": "https://ethereumclassic.org"},
    {"symbol": "XLM", "name": "Stellar", "binance_symbol": "XLMUSDT", "coingecko_id": "stellar", "category": "Payment", "market_cap_rank": 27, "description": "Cross-border payment network", "website": "https://www.stellar.org"},
    {"symbol": "FIL", "name": "Filecoin", "binance_symbol": "FILUSDT", "coingecko_id": "filecoin", "category": "Storage", "market_cap_rank": 31, "description": "Decentralized storage network", "website": "https://filecoin.io"},
    {"symbol": "HBAR", "name": "Hedera", "binance_symbol": "HBARUSDT", "coingecko_id": "hedera-hashgraph", "category": "Infrastructure", "market_cap_rank": 34, "description": "Enterprise-grade distributed ledger", "website": "https://hedera.com"},
    {"symbol": "ICP", "name": "Internet Computer", "binance_symbol": "ICPUSDT", "coingecko_id": "internet-computer", "category": "Infrastructure", "market_cap_rank": 36, "description": "Blockchain that runs at web speed", "website": "https://internetcomputer.org"},
    {"symbol": "THETA", "name": "Theta Network", "binance_symbol": "THETAUSDT", "coingecko_id": "theta-token", "category": "Media", "market_cap_rank": 37, "description": "Decentralized video delivery network", "website": "https://www.thetatoken.org"},
    
    # Additional DeFi & Infrastructure
    {"symbol": "LIDO", "name": "Lido DAO", "binance_symbol": "LDOUSDT", "coingecko_id": "lido-dao", "category": "DeFi", "market_cap_rank": 41, "description": "Liquid staking protocol", "website": "https://lido.fi"},
    {"symbol": "RUNE", "name": "THORChain", "binance_symbol": "RUNEUSDT", "coingecko_id": "thorchain", "category": "DeFi", "market_cap_rank": 43, "description": "Cross-chain liquidity protocol", "website": "https://thorchain.org"},
    {"symbol": "INJ", "name": "Injective", "binance_symbol": "INJUSDT", "coingecko_id": "injective-protocol", "category": "DeFi", "market_cap_rank": 44, "description": "Decentralized derivatives exchange", "website": "https://injective.com"},
    {"symbol": "QNT", "name": "Quant", "binance_symbol": "QNTUSDT", "coingecko_id": "quant-network", "category": "Infrastructure", "market_cap_rank": 46, "description": "Blockchain interoperability platform", "website": "https://www.quant.network"},
    {"symbol": "FLOW", "name": "Flow", "binance_symbol": "FLOWUSDT", "coingecko_id": "flow", "category": "Layer 1", "market_cap_rank": 47, "description": "Blockchain for NFTs and games", "website": "https://flow.com"},
]

COINGECKO_OK_TIMEFRAMES = {"1d", "1w"}  # daily-based fallback only

def ensure_assets(db: Session):
    for a in DEFAULT_ASSETS:
        existing = db.query(Asset).filter(Asset.symbol==a["symbol"]).first()
        if not existing:
            db.add(Asset(**a))
        else:
            # Update existing assets with new fields
            for key, value in a.items():
                if hasattr(existing, key):
                    setattr(existing, key, value)
    db.commit()

async def backfill_prices(db: Session, symbol: str, timeframe: str, days: int):
    asset = db.query(Asset).filter(Asset.symbol==symbol).first()
    if not asset:
        raise ValueError(f"Unknown asset: {symbol}. Seed assets or create via /assets.")

    rows = []
    source = None
    # Try Binance first if we have a mapping
    if asset.binance_symbol:
        try:
            rows = await CONNECTORS["binance"].backfill(asset.binance_symbol, timeframe, days)
            source = "binance"
        except Exception as e:
            # fall back to coingecko for daily/weekly if possible
            if asset.coingecko_id and timeframe in COINGECKO_OK_TIMEFRAMES:
                rows = await CONNECTORS["coingecko"].backfill(asset.coingecko_id, timeframe, days)
                source = "coingecko"
            else:
                raise RuntimeError(f"Binance backfill failed for {asset.binance_symbol} ({timeframe}): {e}. "
                                   f"{'Try timeframe 1d/1w for CoinGecko fallback.' if asset.coingecko_id else ''}")
    else:
        # No Binance symbol, use CoinGecko if timeframe fits
        if asset.coingecko_id and timeframe in COINGECKO_OK_TIMEFRAMES:
            rows = await CONNECTORS["coingecko"].backfill(asset.coingecko_id, timeframe, days)
            source = "coingecko"
        else:
            raise RuntimeError(f"No available connector for {symbol} at timeframe={timeframe}. "
                               f"Provide binance_symbol or use timeframe in {sorted(COINGECKO_OK_TIMEFRAMES)}.")

    if not rows:
        raise RuntimeError(f"No rows returned from {source or 'connector'}.")

    for r in rows:
        db.merge(PriceOHLCV(
            asset_id=asset.id, ts=r["ts"], timeframe=timeframe,
            open=r["open"], high=r["high"], low=r["low"], close=r["close"],
            volume=r.get("volume", 0.0), source=source
        ))
    db.commit()
    return {"inserted": len(rows), "source": source}
