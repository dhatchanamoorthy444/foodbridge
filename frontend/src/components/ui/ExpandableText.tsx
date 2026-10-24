"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface ExpandableTextProps {
  text: string
  maxLength?: number
  className?: string
}

export function ExpandableText({ text, maxLength = 200, className }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const shouldTruncate = text.length > maxLength
  const displayText = isExpanded ? text : text.slice(0, maxLength)

  return (
    <div className={cn('relative', className)}>
      <p className="text-stone leading-relaxed">
        {displayText}
        {shouldTruncate && !isExpanded && '...'}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-botanical-light hover:text-botanical font-medium text-sm mt-2 transition-colors"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}