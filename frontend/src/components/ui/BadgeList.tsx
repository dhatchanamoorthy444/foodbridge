"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variantClasses = {
    default: 'bg-botanical/20 text-botanical-light border border-botanical/40',
    outline: 'bg-transparent text-stone border border-forest-600/40',
    filled: 'bg-forest-800/40 text-cream border border-forest-600/40'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}

interface BadgeListProps {
  items: Array<{ id: string; content: React.ReactNode }>
  className?: string
  separator?: boolean
}

export function BadgeList({ items, className, separator = true }: BadgeListProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <Badge>{item.content}</Badge>
          {separator && index < items.length - 1 && <span className="text-stone/40">•</span>}
        </React.Fragment>
      ))}
    </div>
  )
}