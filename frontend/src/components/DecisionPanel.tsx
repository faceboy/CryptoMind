import React, { useState } from 'react'
import { decide } from '../api'

export default function DecisionPanel({ symbol, timeframe, signals } : { symbol:string, timeframe:string, signals:any[] }) {
  const [result, setResult] = useState<any>(null)
  const run = async () => {
    const r = await decide(symbol, timeframe, signals)
    setResult(r)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button onClick={run}>Get Decision</button>
      {result && (
        <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
          <div><b>Recommendation:</b> {result.rec}</div>
          <div><b>Score:</b> {result.score.toFixed(3)}</div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result.details, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
