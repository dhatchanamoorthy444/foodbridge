"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  maxVisible?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisible = 5
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisible / 2)

    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          currentPage === 1
            ? 'text-stone cursor-not-allowed opacity-50'
            : 'text-cream hover:bg-forest-800/40 hover:text-botanical'
        )}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all duration-200',
            page === currentPage
              ? 'bg-botanical/20 text-cream border border-botanical/40'
              : 'text-stone hover:text-cream hover:bg-forest-800/40'
          )}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          currentPage === totalPages
            ? 'text-stone cursor-not-allowed opacity-50'
            : 'text-cream hover:bg-forest-800/40 hover:text-botanical'
        )}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}