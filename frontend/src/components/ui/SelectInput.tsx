"use client"

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

interface SelectInputProps {
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function SelectInput({ options, value, onChange, placeholder, className, disabled = false }: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-surface-elevated text-cream',
          'flex items-center justify-between',
          'hover:border-botanical/40 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-botanical focus:ring-offset-2 focus:ring-offset-surface',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={cn(!selectedOption && 'text-stone')}>
          {selectedOption ? selectedOption.label : placeholder || 'Select an option'}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-stone transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full mt-1 w-full rounded-lg border border-surface-border bg-surface-elevated shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'w-full px-3 py-2 text-left text-sm',
                'hover:bg-forest-800/40 hover:text-cream transition-colors',
                value === option.value && 'bg-botanical/20 text-cream font-medium'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}