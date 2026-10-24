"use client"

import React from 'react'

interface FormatNumberProps {
  value: number
  options?: Intl.NumberFormatOptions
  className?: string
}

export function FormatNumber({ value, options, className }: FormatNumberProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', options).format(num)
  }

  return <span className={className}>{formatNumber(value)}</span>
}