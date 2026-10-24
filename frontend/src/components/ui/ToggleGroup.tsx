"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface ToggleGroupProps {
  value: string
  onValueChange: (value: string) => void
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>
  className?: string
  variant?: 'default' | 'outline'
}

export function ToggleGroup({ value, onValueChange, options, className, variant = 'default' }: ToggleGroupProps) {
  return (
    <div className={cn('inline-flex rounded-lg p-1', className)}>
      {options.map((option) => {
        const isSelected = value === option.value
        return (
          <button
            key={option.value}
            onClick={() => onValueChange(option.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
              isSelected
                ? variant === 'default'
                  ? 'bg-botanical text-cream shadow-sm'
                  : 'bg-botanical/20 text-cream border border-botanical/40'
                : 'text-stone hover:text-cream hover:bg-forest-800/40'
            )}
          >
            {option.icon && <span className="text-lg">{option.icon}</span>}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}