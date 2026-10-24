"use client"

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../lib/utils'

interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'range' | 'date'
  value?: any
  options?: Array<{ value: string; label: string }>
}

interface FilterBarProps {
  filters: FilterOption[]
  onFilterChange: (filters: Record<string, any>) => void
  className?: string
}

export function FilterBar({ filters, onFilterChange, className }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [searchValue, setSearchValue] = useState('')

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value }
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onFilterChange({ ...activeFilters, search: value })
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setSearchValue('')
    onFilterChange({})
  }

  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <div className={cn('p-4 rounded-xl bg-surface border border-surface-border', className)}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-[#12241b] border border-forest-600/40 rounded-lg pl-10 pr-4 py-2.5 text-cream placeholder-stone-dark/70 focus:outline-none focus:ring-2 focus:ring-botanical focus:border-transparent"
          />
        </div>

        {/* Active filters indicator */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-botanical-light">
            <span>{activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}</span>
            <button
              onClick={clearAllFilters}
              className="p-1 hover:bg-forest-800/40 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter controls */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filters.map((filter) => {
          if (filter.type === 'select' && filter.options) {
            return (
              <div key={filter.key} className="relative">
                <select
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-forest-600/40 bg-[#12241b] text-cream focus:outline-none focus:ring-2 focus:ring-botanical"
                >
                  <option value="">{filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          }

          if (filter.type === 'text') {
            return (
              <div key={filter.key}>
                <input
                  type="text"
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  placeholder={filter.label}
                  className="w-full px-3 py-2 rounded-lg border border-forest-600/40 bg-[#12241b] text-cream placeholder-stone-dark/70 focus:outline-none focus:ring-2 focus:ring-botanical"
                />
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}