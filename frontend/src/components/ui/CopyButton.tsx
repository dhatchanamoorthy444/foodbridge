"use client"

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '../lib/utils'

interface CopyButtonProps {
  value: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CopyButton({ value, className, size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-200',
        'text-stone hover:text-cream hover:bg-forest-800/40',
        sizeClasses[size],
        className
      )}
    >
      {copied ? (
        <Check className={cn(iconSizes[size], 'text-green-400')} />
      ) : (
        <Copy className={cn(iconSizes[size], 'text-stone')} />
      )}
    </button>
  )
}