"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  label?: string
}

export function Switch({ checked, onCheckedChange, disabled = false, className, label }: SwitchProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            'w-11 h-6 rounded-full transition-colors duration-200',
            checked ? 'bg-botanical' : 'bg-surface-border'
          )}
        >
          <div
            className={cn(
              'w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200',
              'absolute top-1 left-1',
              checked && 'translate-x-5'
            )}
          />
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm text-stone">{label}</span>
      )}
    </label>
  )
}