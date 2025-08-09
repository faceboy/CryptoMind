import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Row = { ts: string, close: number }
export default function Chart({ data }: { data: Row[] }) {
  const rows = data.map(d => ({ ...d, ts: new Date(d.ts).toLocaleString() }))
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={rows}>
          <XAxis dataKey="ts" minTickGap={32} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="close" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
