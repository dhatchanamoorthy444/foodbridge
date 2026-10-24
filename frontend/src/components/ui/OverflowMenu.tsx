"use client"

import React, { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { cn } from '../lib/utils'

interface OverflowMenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  divider?: boolean
  disabled?: boolean
  variant?: 'default' | 'danger'
}

interface OverflowMenuProps {
  items: OverflowMenuItem[]
  className?: string
}

export function OverflowMenu({ items, className }: OverflowMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        onClick={(e) => {
          handleClick(e)
          setIsOpen(!isOpen)
        }}
        className="p-2 rounded-lg text-stone hover:text-cream hover:bg-forest-800/40 transition-colors"
        aria-label="More options"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg border border-surface-border bg-surface-elevated shadow-lg z-50 py-1"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(false)
          }}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && <div className="h-px bg-surface-border my-1" />}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  item.onClick()
                }}
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 text-left',
                  'text-stone hover:text-cream hover:bg-forest-800/40',
                  'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  item.variant === 'danger' && 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/30'
                )}
              >
                {item.icon && <span className="text-stone">{item.icon}</span>}
                <span className="text-sm">{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}