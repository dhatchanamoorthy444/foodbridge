"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface FormGroupProps {
  label?: string
  error?: string
  className?: string
  children: React.ReactNode
  required?: boolean
  description?: string
}

export function FormGroup({ label, error, className, children, required, description }: FormGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-cream">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-rose-400 mt-1">{error}</p>
      )}
      {description && (
        <p className="text-xs text-stone mt-1">{description}</p>
      )}
    </div>
  )
}