import React from 'react'
import SignalToggles from '../components/SignalToggles'

export default function SignalsPage() {
  const [signals, setSignals] = React.useState<any[]>([])
  return (
    <div>
      <h2>Signals</h2>
      <SignalToggles value={signals} onChange={setSignals} />
      <pre>{JSON.stringify(signals, null, 2)}</pre>
    </div>
  )
}
