"use client"

import React, { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from './Calendar'
import { cn } from '../lib/utils'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  className?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

export function DatePicker({ value, onChange, placeholder, className, minDate, maxDate, disabled = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onChange?.(date)
    setIsOpen(false)
  }

  const displayValue = selectedDate ? format(selectedDate, 'MMM dd, yyyy') : placeholder || 'Select date'

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-surface-elevated text-cream',
          'flex items-center justify-between',
          'hover:bg-surface-hover transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-botanical focus:border-transparent',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={cn(!selectedDate && 'text-stone')}>{displayValue}</span>
        <svg
          className="w-5 h-5 text-stone"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 z-50">
          <Calendar
            value={selectedDate}
            onChange={handleDateSelect}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  )
}