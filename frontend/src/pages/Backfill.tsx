import React, { useState } from 'react'
import { backfill } from '../api'

export default function BackfillPage() {
  const [symbol,setSymbol] = useState('BTC')
  const [timeframe,setTimeframe] = useState('1h')
  const [days,setDays] = useState(365)
  const [status,setStatus] = useState<string>('')

  const submit = async (e:any) => {
    e.preventDefault()
    setStatus('Loading...')
    try {
      const r = await backfill(symbol, timeframe, days)
      setStatus(`OK: ${r.inserted} candles from ${r.source}`)
    } catch (e:any) {
      setStatus(`Error: ${e.message}`)
    }
  }
  return (
    <div className="card">
      <form onSubmit={submit} className="flex gap-3 flex-wrap items-center">
        <input className="input" value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())} placeholder="Symbol (e.g., BTC)" />
        <select value={timeframe} onChange={e=>setTimeframe(e.target.value)}>
          {['1m','5m','15m','1h','4h','1d','1w'].map(tf=> <option key={tf} value={tf}>{tf}</option>)}
        </select>
        <input className="input" type="number" value={days} onChange={e=>setDays(parseInt(e.target.value || '1'))} min={1} max={2000}/>
        <button className="btn">Backfill</button>
        <span className="opacity-70">{status}</span>
      </form>
    </div>
  )
}
