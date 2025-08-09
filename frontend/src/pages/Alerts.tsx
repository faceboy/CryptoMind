import React, { useEffect, useState } from 'react'

export default function AlertsPage(){
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
  const [items,setItems] = useState<any[]>([])
  const [symbol,setSymbol] = useState('BTC')
  const [timeframe,setTimeframe] = useState('1h')
  const [rule,setRule] = useState('rsi<30 and ema_cross_up')
  const [webhook,setWebhook] = useState('https://example.com/webhook')

  const load = async () => {
    const j = await (await fetch(`${base}/alerts/`)).json()
    const arr = Object.entries(j).map(([id, v]:any)=> ({ id, ...(v as any) }))
    setItems(arr)
  }
  useEffect(()=>{ load() }, [])

  const create = async () => {
    await fetch(`${base}/alerts/`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({symbol, timeframe, rule, webhook})})
    load()
  }
  const del = async (id:string) => {
    await fetch(`${base}/alerts/${id}`, { method:'DELETE'}); load()
  }

  return (
    <div className="space-y-3">
      <div className="card grid md:grid-cols-4 gap-2">
        <input className="input" value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())} />
        <select value={timeframe} onChange={e=>setTimeframe(e.target.value)}>
          {['1m','5m','15m','1h','4h','1d','1w'].map(tf=> <option key={tf}>{tf}</option>)}
        </select>
        <input className="input" value={rule} onChange={e=>setRule(e.target.value)} />
        <input className="input" value={webhook} onChange={e=>setWebhook(e.target.value)} />
        <div className="md:col-span-4"><button className="btn" onClick={create}>Create Alert</button></div>
      </div>

      <div className="grid gap-2">
        {items.map(i => (
          <div key={i.id} className="card flex items-center justify-between">
            <div>
              <div className="font-semibold">{i.symbol} / {i.timeframe}</div>
              <div className="text-sm opacity-60">{i.rule}</div>
            </div>
            <button className="btn" onClick={()=>del(i.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
