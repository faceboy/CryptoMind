import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CpuChipIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'
import Candles from '../components/Candles'
import SignalToggles from '../components/SignalToggles'
import DecisionPanel from '../components/DecisionPanel'
import OverlayControls from '../components/OverlayControls'
import Button from '../components/ui/Button'
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Input from '../components/ui/Input'
import { Select } from '../components/ui/Input'
import AssetSelector from '../components/AssetSelector'
import { runSignals, seedAssets, getOHLCV, backfill } from '../api'
import { ema, bollinger } from '../ta'

function parseErrorMessage(raw: any) {
  try {
    const msg = String(raw || '')
    const m = msg.match(/"detail":"?([^"}]+)"?/)
    if (m) return m[1]
    return msg.replace(/^"|"$/g, '')
  } catch {
    return 'Unexpected error'
  }
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ComponentType<{ className?: string }>
  loading?: boolean
}

function MetricCard({ title, value, change, icon: Icon, loading }: MetricCardProps) {
  return (
    <Card compact className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-muted">{title}</p>
          {loading ? (
            <div className="skeleton h-8 w-20" />
          ) : (
            <p className="text-2xl font-bold text-[rgb(var(--text-primary))]">{value}</p>
          )}
          {change !== undefined && !loading && (
            <div className={`flex items-center gap-1 text-xs ${
              change >= 0 ? 'text-[rgb(var(--success))]' : 'text-[rgb(var(--error))]'
            }`}>
              {change >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3" />
              )}
              {Math.abs(change).toFixed(2)}%
            </div>
          )}
        </div>
        <div className="p-3 bg-[rgb(var(--bg-tertiary))] rounded-lg">
          <Icon className="w-6 h-6 text-[rgb(var(--accent))]" />
        </div>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const [symbol, setSymbol] = useState('BTC')
  const [timeframe, setTimeframe] = useState('1h')
  const [signals, setSignals] = useState<any[]>([
    { name: 'ema', params: { period: 20 } },
    { name: 'rsi', params: { period: 14, overbought: 70, oversold: 30 } },
  ])
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [backfillLoading, setBackfillLoading] = useState(false)
  const [signalsLoading, setSignalsLoading] = useState(false)
  const [showEMA, setShowEMA] = useState(true)
  const [showBB, setShowBB] = useState(false)

  const timeframeOptions = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' },
    { value: '1w', label: '1 Week' },
  ]

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getOHLCV(symbol, timeframe, 1000)
      setRows(applyOverlays(data))
      toast.success('Data loaded successfully')
    } catch (e: any) {
      toast.error(parseErrorMessage(e.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    seedAssets().catch(() => {})
  }, [])

  useEffect(() => {
    loadData()
  }, [symbol, timeframe, showEMA, showBB])

  const applyOverlays = (data: any[]) => {
    const closes = data.map(d => d.close)
    let ema20: number[] = []
    let bb: { ma: number; upper: number; lower: number }[] = []
    if (showEMA) ema20 = ema(closes, 20)
    if (showBB) bb = bollinger(closes, 20, 2.0)
    return data.map((d, i) => ({
      ...d,
      ema20: showEMA ? ema20[i] : undefined,
      bbU: showBB ? bb[i]?.upper : undefined,
      bbL: showBB ? bb[i]?.lower : undefined
    }))
  }

  const doBackfill = async () => {
    setBackfillLoading(true)
    try {
      const r = await backfill(symbol, timeframe, 365)
      toast.success(`Backfilled ${r.inserted} candles via ${r.source}`)
      loadData()
    } catch (e: any) {
      toast.error(parseErrorMessage(e.message))
    } finally {
      setBackfillLoading(false)
    }
  }

  const loadSignals = async () => {
    setSignalsLoading(true)
    try {
      await runSignals(symbol, timeframe, signals)
      toast.success('Signals computed successfully')
    } catch (e: any) {
      toast.error(parseErrorMessage(e.message))
    } finally {
      setSignalsLoading(false)
    }
  }

  const currentPrice = rows.length > 0 ? rows[rows.length - 1]?.close : 0
  const previousPrice = rows.length > 1 ? rows[rows.length - 2]?.close : 0
  const priceChange = previousPrice ? ((currentPrice - previousPrice) / previousPrice) * 100 : 0

  return (
    <div className="space-y-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgb(var(--bg-secondary))',
            color: 'rgb(var(--text-primary))',
            border: '1px solid rgb(var(--border))',
          },
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading">Trading Dashboard</h1>
          <p className="text-body mt-1">Monitor crypto markets and analyze trading signals</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={loadData}
            loading={loading}
            icon={<ChartBarIcon className="w-4 h-4" />}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Price"
          value={currentPrice ? `$${currentPrice.toLocaleString()}` : '--'}
          change={priceChange}
          icon={ChartBarIcon}
          loading={loading}
        />
        <MetricCard
          title="24h Volume"
          value="--"
          icon={ArrowTrendingUpIcon}
          loading={loading}
        />
        <MetricCard
          title="Active Signals"
          value={signals.length}
          icon={CpuChipIcon}
        />
        <MetricCard
          title="Last Update"
          value={rows.length > 0 ? new Date(rows[rows.length - 1]?.ts).toLocaleTimeString() : '--'}
          icon={ClockIcon}
          loading={loading}
        />
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Market Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
                Asset
              </label>
              <AssetSelector
                selectedSymbol={symbol}
                onSymbolChange={setSymbol}
              />
            </div>
            
            <Select
              label="Timeframe"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              options={timeframeOptions}
            />
            
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
                Actions
              </label>
              <Button
                onClick={doBackfill}
                loading={backfillLoading}
                icon={<ArrowTrendingDownIcon className="w-4 h-4" />}
                className="w-full"
              >
                Backfill (365d)
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
                Compute
              </label>
              <Button
                variant="success"
                onClick={loadSignals}
                loading={signalsLoading}
                icon={<CpuChipIcon className="w-4 h-4" />}
                className="w-full"
              >
                Run Signals
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Overlays</CardTitle>
        </CardHeader>
        <CardContent>
          <OverlayControls 
            showEMA={showEMA} 
            setShowEMA={setShowEMA} 
            showBB={showBB} 
            setShowBB={setShowBB} 
          />
        </CardContent>
      </Card>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price Chart - {symbol}/{timeframe}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-[rgb(var(--accent))] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-body">Loading chart data...</p>
              </div>
            </div>
          ) : rows.length > 0 ? (
            <Candles data={rows} />
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ExclamationTriangleIcon className="w-12 h-12 text-[rgb(var(--text-muted))] mx-auto" />
                <div>
                  <p className="text-subheading">No Data Available</p>
                  <p className="text-body">Try backfilling data for {symbol}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signal Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Signal Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <SignalToggles value={signals} onChange={setSignals} />
        </CardContent>
      </Card>

      {/* Decision Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Decision</CardTitle>
        </CardHeader>
        <CardContent>
          <DecisionPanel symbol={symbol} timeframe={timeframe} signals={signals} />
        </CardContent>
      </Card>
    </div>
  )
}
