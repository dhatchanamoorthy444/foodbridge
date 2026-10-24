"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface ToggleProps {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Toggle({ options, value, onChange, className }: ToggleProps) {
  return (
    <div className={cn('inline-flex rounded-lg p-1 bg-surface-elevated border border-surface-border', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            value === option.value
              ? 'bg-botanical text-cream shadow-sm'
              : 'text-stone hover:text-cream hover:bg-forest-800/40'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}