"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  label?: string
  showValue?: boolean
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, className, label, showValue = true }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newValue = Math.round(min + percentage * (max - min) / step) * step
    onChange(newValue)
  }

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-cream mb-2">
          {label}
        </label>
      )}
      <div
        className="relative h-8 flex items-center cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Track */}
        <div className="absolute inset-0 h-1 bg-surface-border rounded-full" />

        {/* Active track */}
        <div
          className="absolute h-1 bg-botanical rounded-full"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          className="absolute w-5 h-5 bg-cream border-2 border-botanical rounded-full shadow-md"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>

      {showValue && (
        <div className="mt-2 text-sm text-stone text-right">
          {value}
        </div>
      )}
    </div>
  )
}