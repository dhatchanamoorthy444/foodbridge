"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface FilterOption {
  id: string
  label: string
  value: string | number | boolean
  count?: number
}

interface FiltersProps {
  filters: {
    category: FilterOption[]
    status: FilterOption[]
    dateRange: {
      start?: Date
      end?: Date
    }
  }
  onFilterChange: (filters: any) => void
  className?: string
}

export function Filters({ filters, onFilterChange, className }: FiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId)
    setSelectedCategories(newCategories)
    onFilterChange({ ...filters, category: newCategories })
  }

  const handleStatusChange = (statusId: string, checked: boolean) => {
    const newStatuses = checked
      ? [...selectedStatuses, statusId]
      : selectedStatuses.filter(id => id !== statusId)
    setSelectedStatuses(newStatuses)
    onFilterChange({ ...filters, status: newStatuses })
  }

  return (
    <div className={cn('p-4 rounded-xl bg-surface border border-surface-border', className)}>
      <h3 className="text-lg font-semibold text-cream mb-4">Filters</h3>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-stone mb-3">Category</h4>
        <div className="space-y-2">
          {filters.category.map((option) => (
            <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(option.id)}
                onChange={(e) => handleCategoryChange(option.id, e.target.checked)}
                className="w-4 h-4 rounded border-surface-border text-botanical focus:ring-botanical focus:ring-2"
              />
              <span className="text-sm text-stone group-hover:text-cream transition-colors">
                {option.label}
                {option.count !== undefined && (
                  <span className="ml-2 text-xs text-stone/60">({option.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-stone mb-3">Status</h4>
        <div className="space-y-2">
          {filters.status.map((option) => (
            <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedStatuses.includes(option.id)}
                onChange={(e) => handleStatusChange(option.id, e.target.checked)}
                className="w-4 h-4 rounded border-surface-border text-botanical focus:ring-botanical focus:ring-2"
              />
              <span className="text-sm text-stone group-hover:text-cream transition-colors">
                {option.label}
                {option.count !== undefined && (
                  <span className="ml-2 text-xs text-stone/60">({option.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}