"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface GridLayoutProps {
  children: React.ReactNode[]
  className?: string
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
    wide?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3' | '3:2'
}

export function GridLayout({ children, className, cols, gap = 'md', aspectRatio = 'auto' }: GridLayoutProps) {
  const colClasses = {
    mobile: cols?.mobile && `grid-cols-${cols.mobile}`, // For custom grid layouts
    tablet: cols?.tablet && `md:grid-cols-${cols.tablet}`,
    desktop: cols?.desktop && `lg:grid-cols-${cols.desktop}`,
    wide: cols?.wide && `xl:grid-cols-${cols.wide}`
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  }

  const aspectClasses = {
    'auto': '',
    '1:1': '[&>div]:aspect-square',
    '16:9': '[&>div]:aspect-video',
    '4:3': '[&>div]:aspect-[4/3]',
    '3:2': '[&>div]:aspect-[3/2]'
  }

  const defaultCols = cols?.mobile === 3 || cols?.tablet === 3 || cols?.desktop === 3 || cols?.wide === 3
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  return (
    <div
      className={cn(
        'grid',
        defaultCols,
        colClasses.mobile,
        colClasses.tablet,
        colClasses.desktop,
        colClasses.wide,
        gapClasses[gap],
        aspectClasses[aspectRatio],
        className
      )}
    >
      {children}
    </div>
  )
}