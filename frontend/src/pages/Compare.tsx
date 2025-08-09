import React, { useState } from 'react'

export default function ComparePage(){
  const [symbols, setSymbols] = useState('BTC,ETH,SOL')
  const [timeframe,setTimeframe] = useState('1h')
  const [data,setData] = useState<any[]>([])
  const load = async () => {
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
    const qs = symbols.split(',').map(s=>`symbols=${s.trim()}`).join('&')
    const url = `${base}/compare?${qs}&timeframe=${timeframe}`
    const r = await fetch(url)
    const j = await r.json()
    setData(j)
  }
  return (
    <div className="space-y-3">
      <div className="card flex items-center gap-2">
        <input className="input" value={symbols} onChange={e=>setSymbols(e.target.value)} />
        <select value={timeframe} onChange={e=>setTimeframe(e.target.value)}>
          {['1m','5m','15m','1h','4h','1d','1w'].map(tf=> <option key={tf}>{tf}</option>)}
        </select>
        <button className="btn" onClick={load}>Compare</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {data.map((d:any)=> (
          <div key={d.symbol} className="card">
            <div className="text-sm opacity-60">{d.symbol}</div>
            <div className="text-2xl font-bold">${d.last.toFixed(2)}</div>
            <div>Return: {(d.return*100).toFixed(2)}%</div>
            <div>Volatility: {(d.volatility*100).toFixed(2)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
