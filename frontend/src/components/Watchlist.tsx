import React, { useEffect, useState } from 'react'

export default function Watchlist() {
  const [items,setItems] = useState<any[]>([])

  const load = async () => {
    const r = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:8080') + '/watchlist/')
    setItems(await r.json())
  }
  useEffect(() => { load() }, [])

  const add = async (s:string) => {
    await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:8080') + '/watchlist/'+s, { method: 'POST' })
    load()
  }
  const rm = async (s:string) => {
    await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:8080') + '/watchlist/'+s, { method: 'DELETE' })
    load()
  }

  const [sym,setSym] = useState('BTC')

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input value={sym} onChange={e=>setSym(e.target.value.toUpperCase())} />
        <button onClick={()=>add(sym)}>Add</button>
      </div>
      <ul>
        {items.map(i => (
          <li key={i.symbol} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <code>{i.symbol}</code>
            <button onClick={()=>rm(i.symbol)}>remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
