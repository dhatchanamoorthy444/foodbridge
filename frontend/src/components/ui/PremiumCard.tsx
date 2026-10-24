"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'eco' | 'glass'
}

export function PremiumCard({ children, className, variant = 'default' }: PremiumCardProps) {
  const variantClasses = {
    default: 'bg-surface-elevated border-forest-600/30',
    eco: 'bg-forest-900/30 border-forest-600/40',
    glass: 'bg-surface/80 backdrop-blur-md border-botanical/20'
  }

  return (
    <div
      className={cn(
        'rounded-xl p-6 border transition-all duration-300',
        'hover:border-opacity-60 hover:shadow-lg',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  )
}