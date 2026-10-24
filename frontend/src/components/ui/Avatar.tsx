"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface AvatarProps {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div
      className={cn(
        'rounded-full bg-botanical flex items-center justify-center text-cream font-medium',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{name ? getInitials(name) : '?'}</span>
      )}
    </div>
  )
}