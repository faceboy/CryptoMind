import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  compact?: boolean
  hover?: boolean
}

export default function Card({ children, className, compact = false, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={clsx(
        'card',
        compact && 'card-compact',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('mb-4 pb-4 border-b border-[rgb(var(--border))]', className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={clsx('text-subheading', className)}>
      {children}
    </h3>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={clsx('space-y-4', className)}>
      {children}
    </div>
  )
}
