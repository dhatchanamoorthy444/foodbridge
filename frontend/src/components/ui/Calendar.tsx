"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  className?: string
  locale?: 'en'
}

export function Calendar({ value, onChange, minDate, maxDate, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const today = new Date()

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (onChange) {
      onChange(selectedDate)
    }
    setCurrentDate(selectedDate)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isDateDisabled = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isDateSelected = (day: number) => {
    if (!value) return false
    return value.getDate() === day &&
           value.getMonth() === currentDate.getMonth() &&
           value.getFullYear() === currentDate.getFullYear()
  }

  const isToday = (day: number) => {
    return day === today.getDate() &&
           today.getMonth() === currentDate.getMonth() &&
           today.getFullYear() === currentDate.getFullYear()
  }

  const renderDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day)
      const selected = isDateSelected(day)
      const isTodayDate = isToday(day)

      days.push(
        <button
          key={day}
          onClick={() => !disabled && handleDateClick(day)}
          disabled={disabled}
          className={cn(
            'h-8 w-8 rounded-lg text-sm font-medium transition-all duration-200',
            selected && 'bg-botanical text-cream font-semibold',
            isTodayDate && !selected && 'bg-forest-800/40 text-cream',
            !selected && !disabled && 'text-stone hover:bg-forest-800/40 hover:text-cream',
            disabled && 'text-stone/40 cursor-not-allowed opacity-50'
          )}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <div className={cn('p-4 rounded-xl bg-surface border border-surface-border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg text-stone hover:text-cream hover:bg-forest-800/40 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-lg font-semibold text-cream">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg text-stone hover:text-cream hover:bg-forest-800/40 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-stone">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  )
}