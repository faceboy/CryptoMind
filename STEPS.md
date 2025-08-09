# Step-by-step setup

## 0) Prereqs
```bash
docker --version
docker compose version
```

## 1) Start the stack
```bash
docker compose up --build
```
Wait until you see:
- postgres healthy
- backend on http://0.0.0.0:8080
- frontend prints a Vite URL like http://localhost:5173

## 2) Seed assets
```bash
curl http://localhost:8080/assets/seed
```

## 3) Backfill history (example: BTC 1h for 365 days)
```bash
curl -X POST http://localhost:8080/data/backfill   -H 'Content-Type: application/json'   -d '{"symbol":"BTC","timeframe":"1h","days":365}'
```

## 4) Get a decision
```bash
curl -X POST http://localhost:8080/decisions/BTC   -H 'Content-Type: application/json'   -d '{
        "symbol":"BTC",
        "timeframe":"1h",
        "signals":[
          {"name":"ema","params":{"period":20}},
          {"name":"rsi","params":{"period":14,"overbought":70,"oversold":30}}
        ]
      }'
```

## 5) Use the UI
Open http://localhost:5173
- Backfill tab loads data
- Dashboard toggles signals and requests a decision
- Watchlist manages symbols

## 6) Optional: run tests
```bash
docker compose exec backend bash -lc "pip install -q pytest && pytest -q"
```

## Common operations
```bash
# Rebuild after changes
docker compose build --no-cache

# Logs
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f postgres

# Reset everything (removes volumes)
docker compose down -v
```
