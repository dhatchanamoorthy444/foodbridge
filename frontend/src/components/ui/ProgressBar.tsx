"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showValue = false,
  className
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const variantStyles = {
    default: 'bg-botanical',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500'
  }

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-1">
        {showValue && (
          <span className="text-sm font-medium text-stone">{value}%</span>
        )
        }
      </div>
      <div className="w-full bg-surface-border rounded-full overflow-hidden">
        <div
          className={cn('rounded-full transition-all duration-300 ease-out', sizeStyles[size], variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}