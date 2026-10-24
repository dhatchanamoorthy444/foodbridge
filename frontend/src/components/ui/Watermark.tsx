"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface WatermarkProps {
  text?: string
  opacity?: number
  rotation?: number
  className?: string
}

export function Watermark({ text = 'FoodBridge', opacity = 0.03, rotation = -30, className }: WatermarkProps) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-0 flex items-center justify-center', className)}
      style={{
        opacity: opacity / 100
      }}
    >
      <div
        className="text-[8rem] font-serif font-bold text-cream/10 whitespace-nowrap"
        style={{
          transform: `rotate(${rotation}deg)`,
          userSelect: 'none',
n          WebkitUserSelect: 'none'
        }}
      >
        {text}
      </div>
    </div>
  )
}