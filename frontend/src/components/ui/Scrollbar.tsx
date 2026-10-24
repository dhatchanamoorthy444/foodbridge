"use client"

import React from 'react'
import './Scrollbar.css'

interface ScrollbarProps {
  children: React.ReactNode
  className?: string
  thumbColor?: string
  trackColor?: string
}

export function Scrollbar({ children, className, thumbColor, trackColor }: ScrollbarProps) {
  return (
    <div
      className={cn(
        'scrollbar-custom',
        className
      )}
      style={{
        '--thumb-color': thumbColor || 'rgba(75, 140, 101, 0.5)',
        '--track-color': trackColor || 'rgba(15, 41, 30, 0.3)'
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Helper function to generate dynamic scrollbar styles
export function getScrollbarStyles(thumbColor: string, trackColor: string) {
  return {
    '--thumb-color': thumbColor,
    '--track-color': trackColor
  } as React.CSSProperties
}

// Re-export the CSS file for manual imports if needed
export { Scrollbar }