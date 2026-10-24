"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface Column<T> {
  key: string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  className?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T>({ columns, data, className, emptyMessage, onRowClick }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key]
      const bValue = (b as any)[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null

    return (
      <svg
        className={cn('w-4 h-4 inline ml-1', sortConfig?.key === column.key ? 'text-botanical' : 'text-stone')}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {sortConfig?.key === column.key && sortConfig?.direction === 'asc' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        )}
      </svg>
    )
  }

  return (
    <div className={cn('rounded-xl border border-surface-border bg-surface-elevated overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border bg-surface">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-4 text-left text-sm font-medium text-cream',
                    column.sortable && 'cursor-pointer hover:text-botanical',
                    column.headerClassName
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-stone">
                  {emptyMessage || 'No data available'}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    'border-b border-surface-border hover:bg-forest-800/20 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-6 py-4 text-sm', column.className)}>
                      {column.render
                        ? column.render((row as any)[column.key], row)
                        : (row as any)[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}