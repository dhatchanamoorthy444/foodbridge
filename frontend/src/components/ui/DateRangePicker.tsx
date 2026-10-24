"use client"

import React, { useState } from 'react'
import { Calendar } from './Calendar'
import { cn } from '../lib/utils'

interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onChange?: (start: Date | undefined, end: Date | undefined) => void
  className?: string
  placeholder?: string
}

export function DateRangePicker({ startDate, endDate, onChange, className, placeholder }: DateRangePickerProps) {
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  const handleStartDateSelect = (date: Date) => {
    onChange?.(date, endDate)
    setIsStartOpen(false)
  }

  const handleEndDateSelect = (date: Date) => {
    onChange?.(startDate, date)
    setIsEndOpen(false)
  }

  const formatDate = (date?: Date) => {
    if (!date) return placeholder || 'Select date'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={cn('flex flex-col sm:flex-row gap-3', className)}>
      <div className="relative flex-1">
        <button
          onClick={() => setIsStartOpen(!isStartOpen)}
          className="w-full px-3 py-2 rounded-lg border bg-surface-elevated text-cream text-left hover:border-botanical/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className={cn(!startDate && 'text-stone')}>{formatDate(startDate)}</span>
            <svg className="w-5 h-5 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </button>
        {isStartOpen && (
          <div className="absolute top-full mt-2 z-50 w-full">
            <Calendar
              value={startDate}
              onChange={handleStartDateSelect}
              maxDate={endDate || undefined}
            />
          </div>
        )}
      </div>

      <div className="relative flex-1">
        <button
          onClick={() => setIsEndOpen(!isEndOpen)}
          className="w-full px-3 py-2 rounded-lg border bg-surface-elevated text-cream text-left hover:border-botanical/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className={cn(!endDate && 'text-stone')}>{formatDate(endDate)}</span>
            <svg className="w-5 h-5 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </button>
        {isEndOpen && (
          <div className="absolute top-full mt-2 z-50 w-full">
            <Calendar
              value={endDate}
              onChange={handleEndDateSelect}
              minDate={startDate || undefined}
            />
          </div>
        )}
      </div>
    </div>
  )
}