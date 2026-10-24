"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  color?: 'default' | 'botanical' | 'forest' | 'stone'
}

export function Divider({ orientation = 'horizontal', className, color = 'default' }: DividerProps) {
  const orientationClasses = {
    horizontal: 'w-full h-px',
    vertical: 'h-full w-px'
  }

  const colorClasses = {
    default: 'bg-surface-border',
    botanical: 'bg-botanical/30',
    forest: 'bg-forest-800/40',
    stone: 'bg-stone/30'
  }

  return (
    <div
      className={cn(orientationClasses[orientation], colorClasses[color], className)}
      role="separator"
      aria-orientation={orientation}
    />
  )
}