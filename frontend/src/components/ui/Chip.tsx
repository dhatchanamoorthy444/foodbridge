"use client"

import React from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

interface ChipProps {
  label: string
  onRemove?: () => void
  variant?: 'default' | 'outline' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Chip({ label, onRemove, variant = 'default', size = 'md', className }: ChipProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const variantClasses = {
    default: 'bg-botanical/20 text-botanical-light border border-botanical/40',
    outline: 'bg-transparent text-stone border border-forest-600/40 hover:bg-forest-800/40',
    filled: 'bg-forest-800/40 text-cream border border-forest-600/40'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}