"use client"

import React from 'react'
import { cn } from '../lib/utils'

export function BackgroundElements({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {/* Subtle noise texture */}
      <div className="absolute inset-0 pointer-events-none z-0 noise-overlay" />

      {/* Minimalist geometric shapes - avoiding harsh gradients and decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-botanical/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-forest-800/5 rounded-full filter blur-3xl" />

      {/* Subtle grid pattern - avoiding generic dot grids (constraint 23) */}
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