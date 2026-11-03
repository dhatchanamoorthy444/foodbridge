"use client"

import React from 'react'
import { cn } from '../../lib/utils'

export function BackgroundElements({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {/* Subtle noise texture */}
      <div className="absolute inset-0 pointer-events-none z-0 noise-overlay" />

      {/* Subtle line grid — not orbs, not dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgb(var(--fb-line) / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--fb-line) / 0.07) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(#2d5a3c 1px, transparent 1px), linear-gradient(90deg, #2d5a3c 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.05
        }}
      />
    </div>
  )
}