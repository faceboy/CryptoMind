const base = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8080'

export async function backfill(symbol: string, timeframe: string, days: number) {
  const r = await fetch(`${base}/data/backfill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, timeframe, days })
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getOHLCV(symbol: string, timeframe: string, limit = 1000) {
  const url = new URL(`${base}/data/ohlcv`)
  url.searchParams.set('symbol', symbol)
  url.searchParams.set('timeframe', timeframe)
  url.searchParams.set('limit', String(limit))
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function runSignals(symbol: string, timeframe: string, signals: any[]) {
  const r = await fetch(`${base}/signals/${symbol}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, timeframe, signals })
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function decide(symbol: string, timeframe: string, signals: any[], weights?: any) {
  const r = await fetch(`${base}/decisions/${symbol}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, timeframe, signals, weights })
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function seedAssets() {
  const r = await fetch(`${base}/assets/seed`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getAssets() {
  const r = await fetch(`${base}/assets/`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getAssetCategories() {
  const r = await fetch(`${base}/assets/categories`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getAssetsByCategory(category: string) {
  const r = await fetch(`${base}/assets/category/${category}`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getWatchlist() {
  const r = await fetch(`${base}/watchlist/`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function addToWatchlist(symbol: string) {
  const r = await fetch(`${base}/watchlist/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol })
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function removeFromWatchlist(symbol: string) {
  const r = await fetch(`${base}/watchlist/${symbol}`, {
    method: 'DELETE'
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getPortfolio() {
  const r = await fetch(`${base}/portfolio/`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function updatePortfolioHolding(symbol: string, amount: number) {
  const r = await fetch(`${base}/portfolio/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, amount })
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
