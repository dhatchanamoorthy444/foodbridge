"use client"

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '../lib/utils'

interface WarningBannerProps {
  title: string
  message: string
  variant?: 'warning' | 'info' | 'error'
  className?: string
}

export function WarningBanner({ title, message, variant = 'warning', className }: WarningBannerProps) {
  const variantStyles = {
    warning: {
      bg: 'bg-amber-950/30',
      border: 'border-amber-800/50',
      icon: 'text-amber-400',
      title: 'text-amber-300',
      message: 'text-amber-200'
    },
    info: {
      bg: 'bg-blue-950/30',
      border: 'border-blue-800/50',
      icon: 'text-blue-400',
      title: 'text-blue-300',
      message: 'text-blue-200'
    },
    error: {
      bg: 'bg-red-950/30',
      border: 'border-red-800/50',
      icon: 'text-red-400',
      title: 'text-red-300',
      message: 'text-red-200'
    }
  }

  const styles = variantStyles[variant]

  return (
    <div className={cn('p-4 rounded-lg border', styles.bg, styles.border, className)}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={cn('w-5 h-5 mt-0.5', styles.icon)} />
        <div>
          <h4 className={cn('font-medium', styles.title)}>{title}</h4>
          <p className={cn('text-sm mt-1', styles.message)}>{message}</p>
        </div>
      </div>
    </div>
  )
}