"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface MenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  divider?: boolean
  disabled?: boolean
}

interface MenuProps {
  trigger: React.ReactNode
  items: MenuItem[]
  className?: string
  align?: 'left' | 'right'
}

export function Menu({ trigger, items, className, align = 'left' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const alignClasses = {
    left: 'left-0',
    right: 'right-0'
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <div className="relative">
        {React.isValidElement(trigger)
          ? React.cloneElement(trigger, { onClick: () => setIsOpen(!isOpen) })
          : (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-stone hover:text-cream hover:bg-forest-800/40 transition-colors"
            >
              {trigger}
            </button>
          )
        }
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute mt-2 w-56 rounded-lg border border-surface-border bg-surface-elevated',
            'shadow-lg py-1 z-50',
            alignClasses[align]
          )}
          onMouseLeave={() => setIsOpen(false)}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && <div className="h-px bg-surface-border my-1" />}
              <button
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 text-left',
                  'text-stone hover:text-cream hover:bg-forest-800/40',
                  'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  item.disabled && 'cursor-not-allowed'
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