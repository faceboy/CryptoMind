import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export default function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'btn'
  
  const variantClasses = {
    default: '',
    primary: 'btn-primary',
    success: 'btn-success',
    warning: 'bg-[rgb(var(--warning))] text-white border-[rgb(var(--warning))] hover:bg-yellow-600 hover:border-yellow-600',
    error: 'bg-[rgb(var(--error))] text-white border-[rgb(var(--error))] hover:bg-red-600 hover:border-red-600'
  }
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loading && 'opacity-75 cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
}
