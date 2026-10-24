"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface CreativeGridProps {
  children: React.ReactNode[]
  className?: string
  columns?: {
    sm?: number
    md?: number
    lg?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

export function CreativeGrid({ children, className, columns = { sm: 1, md: 2, lg: 3 }, gap = 'md' }: CreativeGridProps) {
  const columnClasses = {
    sm: 'grid-cols-1',
    md: 'grid-cols-2',
    lg: 'grid-cols-3'
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  }

  // Adjust for constraint 6 - avoid exactly 3 feature cards in a row
  const adjustedClasses = columns.lg === 3 ? 'lg:grid-cols-[repeat(3,_1fr)]' : columnClasses.lg

  return (
    <div
      className={cn(
        'grid',
        columnClasses.sm,
        columnClasses.md,
        adjustedClasses,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}