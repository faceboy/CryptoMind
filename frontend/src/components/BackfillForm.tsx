import React, { useState } from 'react'
import { backfill } from '../api'

export default function BackfillForm() {
  const [symbol,setSymbol] = useState('BTC')
  const [timeframe,setTimeframe] = useState('1h')
  const [days,setDays] = useState(90)
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
    <form onSubmit={submit} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <input value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())} placeholder="Symbol (e.g., BTC)" />
      <select value={timeframe} onChange={e=>setTimeframe(e.target.value)}>
        {['1m','5m','15m','1h','4h','1d','1w'].map(tf=> <option key={tf} value={tf}>{tf}</option>)}
      </select>
      <input type="number" value={days} onChange={e=>setDays(parseInt(e.target.value || '1'))} min={1} max={2000}/>
      <button>Backfill</button>
      <span>{status}</span>
    </form>
  )
}
