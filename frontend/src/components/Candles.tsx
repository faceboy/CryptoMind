import React, { useMemo } from 'react'

type Row = { ts:string, open:number, high:number, low:number, close:number, ema20?:number, bbU?:number, bbL?:number }

function scaleLinear(domain:[number,number], range:[number,number]){
  const [d0,d1] = domain, [r0,r1] = range
  const m = (r1 - r0) / (d1 - d0 || 1)
  return (v:number) => r0 + (v - d0) * m
}

function pathFromPoints(points:{x:number,y:number}[]) {
  if(points.length===0) return ''
  return 'M' + points.map((p,i)=>`${i?'L':''}${p.x},${p.y}`).join(' ')
}

export default function Candles({ data }:{ data: Row[] }){
  const vbW = 1000, vbH = 420
  const padL = 50, padR = 20, padT = 20, padB = 30
  const innerW = vbW - padL - padR
  const innerH = vbH - padT - padB

  const prepared = useMemo(()=>{
    if(!data || data.length===0) return { candles:[], emaPts:[], bbUPts:[], bbLPts:[], x: (i:number)=>i, y:(v:number)=>v, min:0, max:1 }
    const lows = data.map(d=>d.low)
    const highs = data.map(d=>d.high)
    const extras = [
      ...data.map(d=>d.bbL ?? d.low),
      ...data.map(d=>d.bbU ?? d.high),
      ...data.map(d=>d.ema20 ?? d.close),
    ]
    let min = Math.min(...lows, ...extras)
    let max = Math.max(...highs, ...extras)
    if(!(isFinite(min)&&isFinite(max))) { min = Math.min(...lows); max = Math.max(...highs) }
    const pad = (max-min)*0.02 || 1
    min -= pad; max += pad

    const x = scaleLinear([0, Math.max(1, data.length-1)], [padL, padL + innerW])
    const y = scaleLinear([min, max], [padT + innerH, padT])

    const width = innerW / Math.max(1, data.length)
    const bodyW = Math.max(1.5, width * 0.6)

    const candles = data.map((d,i)=>{
      const up = d.close >= d.open
      const xC = x(i)
      const wickX = xC
      const yH = y(d.high), yL = y(d.low)
      const yO = y(d.open), yC = y(d.close)
      const bodyY = Math.min(yO, yC)
      const bodyH = Math.max(1, Math.abs(yO - yC))
      return { i, up, wickX, yH, yL, bodyX: xC - bodyW/2, bodyY, bodyW, bodyH }
    })

    const emaPts = data.map((d,i)=> (d.ema20!=null ? { x: x(i), y: y(d.ema20) } : null)).filter(Boolean) as {x:number,y:number}[]
    const bbUPts = data.map((d,i)=> (d.bbU!=null ? { x: x(i), y: y(d.bbU) } : null)).filter(Boolean) as {x:number,y:number}[]
    const bbLPts = data.map((d,i)=> (d.bbL!=null ? { x: x(i), y: y(d.bbL) } : null)).filter(Boolean) as {x:number,y:number}[]

    return { candles, emaPts, bbUPts, bbLPts, x, y, min, max }
  }, [data])

  return (
    <div className="w-full bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] rounded-xl overflow-hidden">
      <svg 
        viewBox={`0 0 ${vbW} ${vbH}`} 
        width="100%" 
        height={vbH}
        role="img" 
        aria-label="Candlestick chart"
        className="block"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(var(--border))" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Axes */}
        <g>
          <line 
            x1={padL} y1={padT} x2={padL} y2={padT+innerH} 
            stroke="rgb(var(--border))" 
            strokeWidth="1.5" 
          />
          <line 
            x1={padL} y1={padT+innerH} x2={padL+innerW} y2={padT+innerH} 
            stroke="rgb(var(--border))" 
            strokeWidth="1.5" 
          />
        </g>

        {/* Bollinger Bands */}
        {prepared.bbUPts.length > 1 && prepared.bbLPts.length > 1 && (
          <g>
            {/* Fill area between bands */}
            <path 
              d={`${pathFromPoints(prepared.bbUPts)} L ${prepared.bbLPts[prepared.bbLPts.length-1].x},${prepared.bbLPts[prepared.bbLPts.length-1].y} ${pathFromPoints([...prepared.bbLPts].reverse())} Z`}
              fill="rgb(var(--accent))"
              fillOpacity="0.1"
            />
            {/* Upper band */}
            <path 
              d={pathFromPoints(prepared.bbUPts)} 
              fill="none" 
              stroke="rgb(var(--accent))" 
              strokeWidth="1.5" 
              opacity="0.7"
              strokeDasharray="4,4"
            />
            {/* Lower band */}
            <path 
              d={pathFromPoints(prepared.bbLPts)} 
              fill="none" 
              stroke="rgb(var(--accent))" 
              strokeWidth="1.5" 
              opacity="0.7"
              strokeDasharray="4,4"
            />
          </g>
        )}

        {/* EMA Line */}
        {prepared.emaPts.length > 1 && (
          <path 
            d={pathFromPoints(prepared.emaPts)} 
            fill="none" 
            stroke="rgb(var(--warning))" 
            strokeWidth="2" 
            opacity="0.9"
          />
        )}

        {/* Candlesticks */}
        <g>
          {prepared.candles.map((c, idx) => (
            <g key={idx}>
              {/* Wick */}
              <line 
                x1={c.wickX} x2={c.wickX} y1={c.yH} y2={c.yL} 
                stroke="rgb(var(--text-secondary))" 
                strokeWidth="1.5" 
                opacity="0.8" 
              />
              {/* Body */}
              <rect 
                x={c.bodyX} 
                y={c.bodyY} 
                width={c.bodyW} 
                height={c.bodyH} 
                fill={c.up ? 'rgb(var(--success))' : 'rgb(var(--error))'} 
                stroke={c.up ? 'rgb(var(--success))' : 'rgb(var(--error))'}
                strokeWidth="0.5"
                rx="1"
              />
            </g>
          ))}
        </g>

        {/* Price labels on Y-axis */}
        <g>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const yPos = padT + innerH * ratio
            const price = prepared.min + (prepared.max - prepared.min) * (1 - ratio)
            return (
              <g key={i}>
                <line 
                  x1={padL - 5} x2={padL} y1={yPos} y2={yPos}
                  stroke="rgb(var(--border))"
                  strokeWidth="1"
                />
                <text 
                  x={padL - 8} 
                  y={yPos + 4} 
                  textAnchor="end" 
                  fontSize="10" 
                  fill="rgb(var(--text-muted))"
                  fontFamily="monospace"
                >
                  ${price.toFixed(0)}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
