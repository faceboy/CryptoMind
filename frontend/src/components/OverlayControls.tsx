import React from 'react'
import { motion } from 'framer-motion'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'

interface OverlayControlsProps {
  showEMA: boolean
  setShowEMA: (b: boolean) => void
  showBB: boolean
  setShowBB: (b: boolean) => void
}

function ToggleSwitch({ 
  enabled, 
  onChange, 
  label, 
  description 
}: { 
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border))]">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[rgb(var(--text-primary))]">
            {label}
          </span>
          {description && (
            <span className="text-xs text-[rgb(var(--text-muted))]">
              {description}
            </span>
          )}
        </div>
      </div>
      
      <Switch
        checked={enabled}
        onChange={onChange}
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:ring-offset-2',
          enabled ? 'bg-[rgb(var(--accent))]' : 'bg-[rgb(var(--border))]'
        )}
      >
        <motion.span
          layout
          className={clsx(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </Switch>
    </div>
  )
}

export default function OverlayControls({ showEMA, setShowEMA, showBB, setShowBB }: OverlayControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-[rgb(var(--warning))] rounded-full"></div>
        <span className="text-sm font-medium text-[rgb(var(--text-secondary))]">
          Technical Indicators
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ToggleSwitch
          enabled={showEMA}
          onChange={setShowEMA}
          label="EMA"
          description="Exponential Moving Average (20)"
        />
        
        <ToggleSwitch
          enabled={showBB}
          onChange={setShowBB}
          label="Bollinger Bands"
          description="Period: 20, Deviation: 2"
        />
      </div>
      
      {/* Legend */}
      <div className="mt-4 p-3 bg-[rgb(var(--bg-tertiary))] rounded-lg border border-[rgb(var(--border))]">
        <div className="text-xs font-medium text-[rgb(var(--text-secondary))] mb-2">Legend</div>
        <div className="flex flex-wrap gap-4 text-xs">
          {showEMA && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[rgb(var(--warning))] rounded"></div>
              <span className="text-[rgb(var(--text-muted))]">EMA(20)</span>
            </div>
          )}
          {showBB && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[rgb(var(--accent))] rounded border-dashed border border-[rgb(var(--accent))]"></div>
              <span className="text-[rgb(var(--text-muted))]">Bollinger Bands</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[rgb(var(--success))] rounded-sm"></div>
            <span className="text-[rgb(var(--text-muted))]">Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[rgb(var(--error))] rounded-sm"></div>
            <span className="text-[rgb(var(--text-muted))]">Bearish</span>
          </div>
        </div>
      </div>
    </div>
  )
}
