"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical'
  children?: React.ReactNode
  className?: string
}

export function PriorityBadge({ priority, children, className }: PriorityBadgeProps) {
  const variants = {
    low: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/40',
    medium: 'bg-amber-950/80 text-amber-300 border-amber-700/40',
    high: 'bg-orange-950/80 text-orange-300 border-orange-700/40',
    critical: 'bg-red-950/80 text-red-300 border-red-700/40'
  }

  const labels = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    critical: 'Critical'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[priority],
        className
      )}
    >
      {children || labels[priority]}
    </span>
  )
}