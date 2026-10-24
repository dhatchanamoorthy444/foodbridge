"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface StatDisplayProps {
  value: string | number
  label: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive?: boolean
  }
  className?: string
}

export function StatDisplay({ value, label, icon, trend, className }: StatDisplayProps) {
  return (
    <div className={cn('p-6 rounded-xl bg-surface-elevated border border-forest-600/30', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-stone">{label}</p>
          <h3 className="text-3xl font-bold text-cream mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>
        {icon && <div className="text-botanical">{icon}</div>}
      </div>
      {trend && (
        <div className={cn(
          'mt-4 flex items-center gap-1 text-sm',
          trend.isPositive ? 'text-green-400' : 'text-red-400'
        )}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-stone">from last month</span>
        </div>
      )}
      }
    </div>
  )
}