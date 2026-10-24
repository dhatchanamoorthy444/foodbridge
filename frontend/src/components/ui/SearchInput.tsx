"use client"

import React, { useState, forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../lib/utils'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  onClear?: () => void
  className?: string
  placeholder?: string
  showClearButton?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onClear, placeholder = "Search...", showClearButton = true, ...props }, ref) => {
    const [value, setValue] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      onSearch?.(newValue)
    }

    const handleClear = () => {
      setValue('')
      onSearch?.('')
      onClear?.()
    }

    return (
      <div className={cn('relative', className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn(
              'w-full bg-[#12241b] border border-forest-600/40 rounded-lg pl-10 pr-10 py-2.5 text-cream placeholder-stone-dark/70',
              'focus:outline-none focus:ring-2 focus:ring-botanical focus:border-transparent',
              'transition-all duration-200 text-sm'
            )}
            {...props}
          />
          {showClearButton && value && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-cream hover:bg-forest-800/40 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'