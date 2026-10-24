"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  direction?: 'vertical' | 'horizontal'
  className?: string
}

export function Spacer({ size = 'md', direction = 'vertical', className }: SpacerProps) {
  const sizeClasses = {
    xs: direction === 'vertical' ? 'h-2' : 'w-2',
    sm: direction === 'vertical' ? 'h-4' : 'w-4',
    md: direction === 'vertical' ? 'h-8' : 'w-8',
    lg: direction === 'vertical' ? 'h-12' : 'w-12',
    xl: direction === 'vertical' ? 'h-16' : 'w-16',
    '2xl': direction === 'vertical' ? 'h-24' : 'w-24'
  }

  return <div className={cn(className, sizeClasses[size])} />
}