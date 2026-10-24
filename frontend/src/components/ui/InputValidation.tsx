"use client"

import React, { useState, forwardRef } from 'react'
import { cn } from '../lib/utils'

interface InputValidationProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  helperText?: string
  validationType?: 'email' | 'password' | 'text' | 'number'
  showPasswordToggle?: boolean
}

const InputValidation = forwardRef<HTMLInputElement, InputValidationProps>(
  ({ className, label, error, success, helperText, validationType, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const getValidationRegex = () => {
      switch (validationType) {
        case 'email':
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        case 'password':
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        case 'number':
          return /^-?\d*\.?\d*$/
        default:
          return null
      }
    }

    const validateValue = (value: string) => {
      if (!validationType) return true
      const regex = getValidationRegex()
      return regex?.test(value) ?? true
    }

    const isValid = validateValue(props.value as string || '')

    const getBorderColor = () => {
      if (error) return 'border-rose-500/50 focus:ring-rose-500'
      if (success && isValid) return 'border-green-500/50 focus:ring-green-500'
      if (isFocused) return 'border-botanical/50 focus:ring-botanical'
      return 'border-forest-600/40'
    }

    const getPlaceholder = () => {
      if (props.placeholder) return props.placeholder
      switch (validationType) {
        case 'email': return 'email@example.com'
        case 'password': return 'Enter secure password'
        case 'number': return 'Enter number'
        default: return props.placeholder || ''
      }
    }

    const inputType = validationType === 'password' && showPassword ? 'text' : validationType

    return (
      <div className="w-full">
        {label && (
          <label className="input-label block mb-2">{label}</label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            placeholder={getPlaceholder()}
            className={cn(
              'w-full bg-[#12241b] border rounded-lg px-3.5 py-2.5 text-cream placeholder-stone-dark/70',
              'focus:outline-none focus:ring-2 transition-all duration-200 text-sm',
              getBorderColor(),
              showPasswordToggle ? 'pr-10' : '',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {showPasswordToggle && validationType === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-cream"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn('mt-1 text-xs', error ? 'text-rose-400' : 'text-stone')}>{
            error || helperText
          }</p>
        )}
        {success && isValid && (
          <p className="mt-1 text-xs text-green-400">✓ Validation passed</p>
        )}
      </div>
    )
  }
)

InputValidation.displayName = 'InputValidation'

export { InputValidation }