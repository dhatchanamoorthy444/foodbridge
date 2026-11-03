"use client"

import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`

    return (
      <div className={cn('relative', className)}>
        <div className="flex items-start">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border-2 border-line bg-app-deep',
              'text-harvest accent-harvest focus:ring-2 focus:ring-harvest/30 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-error-red'
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                'ml-2 block text-sm text-cream',
                props.disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {label}
            </label>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-xs',
            error ? 'text-error-red' : 'text-stone'
          )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)