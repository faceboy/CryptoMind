import React, { useEffect, useState } from 'react'

export default function PortfolioPage(){
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
  const [rows,setRows] = useState<any>({total_value:0, holdings:[]})
  const [sym,setSym] = useState('BTC')
  const [amt,setAmt] = useState(1)
  const load = async () => {
    const j = await (await fetch(`${base}/portfolio/`)).json()
    setRows(j)
  }
  useEffect(()=>{ load() },[])
  const upsert = async () => {
    await fetch(`${base}/portfolio/${sym}?amount=${amt}`, { method:'POST' })
    load()
  }
  const remove = async (s:string) => {
    await fetch(`${base}/portfolio/${s}`, { method:'DELETE' })
    load()
  }
  return (
    <div className="space-y-3">
      <div className="card flex items-center gap-2">
        <input className="input" value={sym} onChange={e=>setSym(e.target.value.toUpperCase())} />
        <input className="input" type="number" value={amt} onChange={e=>setAmt(parseFloat(e.target.value))} />
        <button className="btn" onClick={upsert}>Save</button>
      </div>
      <div className="card">
        <div className="text-sm opacity-60">Total value</div>
        <div className="text-3xl font-bold">${rows.total_value.toFixed(2)}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {rows.holdings.map((h:any)=> (
          <div key={h.symbol} className="card flex items-center justify-between">
            <div>
              <div className="font-semibold">{h.symbol}</div>
              <div className="text-sm opacity-60">{h.amount} @ ${h.price.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-bold">${h.value.toFixed(2)}</div>
              <button className="btn" onClick={()=>remove(h.symbol)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
