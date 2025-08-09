export type Candle = { ts: string; open: number; high: number; low: number; close: number; volume: number }

export function ema(values: number[], period: number) {
  const k = 2 / (period + 1)
  const out: number[] = []
  let prev: number | null = null
  for (let i=0;i<values.length;i++) {
    const v = values[i]
    if (prev === null) prev = v
    const next = v * k + prev * (1 - k)
    out.push(next)
    prev = next
  }
  return out
}

export function bollinger(values: number[], period: number, mult: number) {
  const out: { ma:number; upper:number; lower:number }[] = []
  const win: number[] = []
  let sum = 0
  for (let i=0;i<values.length;i++) {
    const v = values[i]
    win.push(v); sum += v
    if (win.length > period) sum -= win.shift()!
    const ma = win.length >= period ? sum / win.length : NaN
    let std = NaN
    if (win.length >= period) {
      const m = ma
      const s = win.reduce((acc,x)=>acc+(x-m)*(x-m),0) / win.length
      std = Math.sqrt(s)
    }
    out.push({ ma, upper: ma + mult*std, lower: ma - mult*std })
  }
  return out
}
