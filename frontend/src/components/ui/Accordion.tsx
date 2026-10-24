"use client"

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

interface AccordionProps {
  items: Array<{
    id: string
    title: string
    content: React.ReactNode
    defaultOpen?: boolean
  }>
  className?: string
  allowMultiple?: boolean
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    items.filter(item => item.defaultOpen).map(item => item.id)
  )

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setOpenItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => (
        <div key={item.id} className="border border-surface-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-forest-800/20 transition-colors"
          >
            <span className="font-medium text-cream">{item.title}</span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-stone transition-transform',
                openItems.includes(item.id) && 'rotate-180'
              )}
            />
          </button>
          {openItems.includes(item.id) && (
            <div className="p-4 border-t border-surface-border bg-surface-elevated/50">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}