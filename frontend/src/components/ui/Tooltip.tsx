"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  position?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
  delay?: number
}

export function Tooltip({ children, content, position = 'top', className, delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  let timeoutId: NodeJS.Timeout

  const showTooltip = () => {
    timeoutId = setTimeout(() => setIsVisible(true), delay)
  }

  const hideTooltip = () => {
    clearTimeout(timeoutId)
    setIsVisible(false)
  }

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2'
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      <div
        className={cn(
          'absolute z-50 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap',
          'bg-surface-elevated border border-surface-border text-stone',
          'shadow-lg transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={position === 'top' || position === 'bottom' ? { minWidth: 'max-content' } : {}}
      >
        {content}
        <div
          className={cn(
            'absolute w-2 h-2 bg-surface-elevated border-surface-border transform rotate-45',
            position === 'top' && 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2',
            position === 'right' && 'right-full top-1/2 -translate-y-1/2 translate-x-1/2',
            position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2',
            position === 'left' && 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2'
          )}
        />
      </div>
    </div>
  )
}