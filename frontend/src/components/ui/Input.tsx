import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export default function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--text-muted))]">
            <span className="w-4 h-4">{icon}</span>
          </div>
        )}
        <input
          className={clsx(
            'input',
            icon && 'pl-10',
            error && 'border-[rgb(var(--error))] focus:border-[rgb(var(--error))] focus:ring-[rgb(var(--error))]/20',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[rgb(var(--error))]">{error}</p>
      )}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'input',
          error && 'border-[rgb(var(--error))] focus:border-[rgb(var(--error))] focus:ring-[rgb(var(--error))]/20',
          className
        )}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-[rgb(var(--error))]">{error}</p>
      )}
    </div>
  )
}
