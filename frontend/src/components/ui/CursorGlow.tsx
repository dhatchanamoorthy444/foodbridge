"use client"

import React, { useState, useEffect } from 'react'

interface CursorGlowProps {
  intensity?: number
  size?: number
  color?: string
  className?: string
}

export function CursorGlow({ intensity = 0.5, size = 50, color = 'rgba(45, 90, 60, 0.08)', className }: CursorGlowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-0', className)}
      style={{
        background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${color}, transparent 50%)`,
        opacity: intensity
      }}
    />
  )
}