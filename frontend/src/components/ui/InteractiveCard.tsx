"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function InteractiveCard({ children, className, hover = true, glow = false, onClick }: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn('relative', className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div
        className={cn(
          'p-6 rounded-xl border transition-all duration-300',
          'border-forest-600/30 bg-surface-elevated',
          hover && 'hover:border-botanical/40 hover:shadow-lg',
          glow && isHovered && 'shadow-botanical/20',
          onClick && 'cursor-pointer'
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}