"use client"

import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrent?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-stone" />
          )}
          {item.isCurrent ? (
            <span className="text-cream font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.href || '#'}
              className="text-stone hover:text-cream transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}