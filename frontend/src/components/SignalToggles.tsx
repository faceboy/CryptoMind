import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'

interface SignalConfig {
  name: string
  params: Record<string, any>
}

interface SignalDefinition {
  name: string
  label: string
  description: string
  category: string
  defaultParams: Record<string, any>
  paramDefinitions: Record<string, {
    label: string
    type: 'number' | 'boolean'
    min?: number
    max?: number
    step?: number
    default: any
  }>
}

const SIGNAL_DEFINITIONS: SignalDefinition[] = [
  {
    name: 'ema',
    label: 'EMA',
    description: 'Exponential Moving Average',
    category: 'Trend',
    defaultParams: { period: 20 },
    paramDefinitions: {
      period: { label: 'Period', type: 'number', min: 1, max: 200, default: 20 }
    }
  },
  {
    name: 'rsi',
    label: 'RSI',
    description: 'Relative Strength Index',
    category: 'Momentum',
    defaultParams: { period: 14, overbought: 70, oversold: 30 },
    paramDefinitions: {
      period: { label: 'Period', type: 'number', min: 2, max: 50, default: 14 },
      overbought: { label: 'Overbought', type: 'number', min: 50, max: 100, default: 70 },
      oversold: { label: 'Oversold', type: 'number', min: 0, max: 50, default: 30 }
    }
  },
  {
    name: 'macd',
    label: 'MACD',
    description: 'Moving Average Convergence Divergence',
    category: 'Momentum',
    defaultParams: { fast: 12, slow: 26, signal: 9 },
    paramDefinitions: {
      fast: { label: 'Fast Period', type: 'number', min: 1, max: 50, default: 12 },
      slow: { label: 'Slow Period', type: 'number', min: 1, max: 100, default: 26 },
      signal: { label: 'Signal Period', type: 'number', min: 1, max: 50, default: 9 }
    }
  },
  {
    name: 'bollinger',
    label: 'Bollinger Bands',
    description: 'Bollinger Bands volatility indicator',
    category: 'Volatility',
    defaultParams: { period: 20, mult: 2.0 },
    paramDefinitions: {
      period: { label: 'Period', type: 'number', min: 2, max: 100, default: 20 },
      mult: { label: 'Multiplier', type: 'number', min: 0.1, max: 5, step: 0.1, default: 2.0 }
    }
  },
  {
    name: 'stochastic',
    label: 'Stochastic',
    description: 'Stochastic Oscillator',
    category: 'Momentum',
    defaultParams: { k_period: 14, d_period: 3, overbought: 80, oversold: 20 },
    paramDefinitions: {
      k_period: { label: '%K Period', type: 'number', min: 1, max: 50, default: 14 },
      d_period: { label: '%D Period', type: 'number', min: 1, max: 20, default: 3 },
      overbought: { label: 'Overbought', type: 'number', min: 50, max: 100, default: 80 },
      oversold: { label: 'Oversold', type: 'number', min: 0, max: 50, default: 20 }
    }
  },
  {
    name: 'williams_r',
    label: 'Williams %R',
    description: 'Williams Percent Range',
    category: 'Momentum',
    defaultParams: { period: 14, overbought: -20, oversold: -80 },
    paramDefinitions: {
      period: { label: 'Period', type: 'number', min: 1, max: 50, default: 14 },
      overbought: { label: 'Overbought', type: 'number', min: -50, max: 0, default: -20 },
      oversold: { label: 'Oversold', type: 'number', min: -100, max: -50, default: -80 }
    }
  },
  {
    name: 'adx',
    label: 'ADX',
    description: 'Average Directional Index',
    category: 'Trend',
    defaultParams: { period: 14, adx_threshold: 25 },
    paramDefinitions: {
      period: { label: 'Period', type: 'number', min: 1, max: 50, default: 14 },
      adx_threshold: { label: 'ADX Threshold', type: 'number', min: 10, max: 50, default: 25 }
    }
  },
  {
    name: 'volume_surge',
    label: 'Volume Surge',
    description: 'Volume surge detection',
    category: 'Volume',
    defaultParams: { lookback: 20, mult: 2.0 },
    paramDefinitions: {
      lookback: { label: 'Lookback Period', type: 'number', min: 5, max: 100, default: 20 },
      mult: { label: 'Multiplier', type: 'number', min: 1, max: 10, step: 0.1, default: 2.0 }
    }
  }
]

const categoryColors: Record<string, string> = {
  'Trend': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Momentum': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Volatility': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Volume': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
}

interface SignalTogglesProps {
  value: SignalConfig[]
  onChange: (signals: SignalConfig[]) => void
}

export default function SignalToggles({ value, onChange }: SignalTogglesProps) {
  const [editingSignal, setEditingSignal] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(SIGNAL_DEFINITIONS.map(s => s.category)))]

  const filteredSignals = SIGNAL_DEFINITIONS.filter(signal => 
    selectedCategory === 'All' || signal.category === selectedCategory
  )

  const isSignalActive = (signalName: string) => {
    return value.some(s => s.name === signalName)
  }

  const getSignalConfig = (signalName: string) => {
    return value.find(s => s.name === signalName)
  }

  const toggleSignal = (signalName: string) => {
    const signalDef = SIGNAL_DEFINITIONS.find(s => s.name === signalName)
    if (!signalDef) return

    if (isSignalActive(signalName)) {
      onChange(value.filter(s => s.name !== signalName))
    } else {
      onChange([...value, { name: signalName, params: { ...signalDef.defaultParams } }])
    }
  }

  const updateSignalParams = (signalName: string, params: Record<string, any>) => {
    onChange(value.map(s => 
      s.name === signalName ? { ...s, params } : s
    ))
  }

  const SignalCard = ({ signal }: { signal: SignalDefinition }) => {
    const isActive = isSignalActive(signal.name)
    const config = getSignalConfig(signal.name)
    const isEditing = editingSignal === signal.name

    return (
      <Card key={signal.name} compact className={`transition-all ${
        isActive ? 'ring-2 ring-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5' : ''
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`px-2 py-1 rounded text-xs border ${
                categoryColors[signal.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}>
                {signal.category}
              </div>
              <h3 className="font-medium text-[rgb(var(--text-primary))]">
                {signal.label}
              </h3>
            </div>
            <p className="text-sm text-[rgb(var(--text-muted))] mb-3">
              {signal.description}
            </p>
            
            {isActive && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-muted))]">
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                  Parameters
                </div>
                
                <AnimatePresence>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 p-3 bg-[rgb(var(--bg-tertiary))] rounded-lg"
                    >
                      {Object.entries(signal.paramDefinitions).map(([key, def]) => (
                        <div key={key} className="flex items-center gap-3">
                          <label className="text-xs text-[rgb(var(--text-secondary))] min-w-[80px]">
                            {def.label}
                          </label>
                          <input
                            type="number"
                            value={config?.params[key] || def.default}
                            onChange={(e) => {
                              const newValue = def.type === 'number' ? parseFloat(e.target.value) : e.target.value
                              updateSignalParams(signal.name, {
                                ...config?.params,
                                [key]: newValue
                              })
                            }}
                            min={def.min}
                            max={def.max}
                            step={def.step || 1}
                            className="flex-1 px-2 py-1 text-xs bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] 
                                     rounded text-[rgb(var(--text-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent))]"
                          />
                        </div>
                      ))}
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => setEditingSignal(null)}
                        >
                          Done
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(config?.params || {}).map(([key, value]) => (
                        <span key={key} className="text-xs bg-[rgb(var(--bg-tertiary))] px-2 py-1 rounded">
                          {signal.paramDefinitions[key]?.label}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isActive && (
              <Button
                size="sm"
                variant="default"
                onClick={() => setEditingSignal(isEditing ? null : signal.name)}
                icon={<CogIcon className="w-4 h-4" />}
              >
                Config
              </Button>
            )}
            <Button
              size="sm"
              variant={isActive ? 'error' : 'primary'}
              onClick={() => toggleSignal(signal.name)}
              icon={isActive ? <XMarkIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
            >
              {isActive ? 'Remove' : 'Add'}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              selectedCategory === category
                ? 'bg-[rgb(var(--accent))] text-white border-[rgb(var(--accent))]'
                : 'bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--bg-secondary))]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Active Signals Summary */}
      {value.length > 0 && (
        <Card compact>
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
            <div>
              <h3 className="font-medium text-[rgb(var(--text-primary))]">
                Active Signals ({value.length})
              </h3>
              <p className="text-sm text-[rgb(var(--text-muted))]">
                {value.map(s => s.name.toUpperCase()).join(', ')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Signal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSignals.map(signal => (
          <SignalCard key={signal.name} signal={signal} />
        ))}
      </div>
    </div>
  )
}
