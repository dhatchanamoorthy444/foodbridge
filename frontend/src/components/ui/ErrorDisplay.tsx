"use client"

import React from 'react'
import { AlertCircle, X } from 'lucide-react'
import { cn } from '../lib/utils'

interface ErrorDisplayProps {
  title?: string
  message: string
  onClose?: () => void
  variant?: 'default' | 'destructive' | 'warning' | 'info'
  className?: string
  details?: string
}

export function ErrorDisplay({ title, message, onClose, variant = 'default', className, details }: ErrorDisplayProps) {
  const variantStyles = {
    default: 'bg-surface-elevated border-surface-border text-cream',
    destructive: 'bg-red-950/30 border-red-800/50 text-red-100',
    warning: 'bg-amber-950/30 border-amber-800/50 text-amber-100',
    info: 'bg-blue-950/30 border-blue-800/50 text-blue-100'
  }

  const variantIcons = {
    default: AlertCircle,
    destructive: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle
  }

  const Icon = variantIcons[variant]

  return (
    <div className={cn('p-4 rounded-lg border', variantStyles[variant], className)}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5" />
        <div className="flex-1">
          {title && <h4 className="font-medium text-sm mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
          {details && (
            <details className="mt-2">
              <summary className="text-xs cursor-pointer hover:underline">Technical Details</summary>
              <pre className="mt-1 p-2 rounded bg-black/30 text-xs overflow-auto whitespace-pre-wrap">
                {details}
              </pre>
            </details>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-stone hover:text-cream transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}