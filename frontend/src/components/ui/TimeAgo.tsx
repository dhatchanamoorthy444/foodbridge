"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '../lib/utils'

interface TimeAgoProps {
  date: Date | string
  className?: string
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const targetDate = new Date(date)
    const updateTimeAgo = () => {
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds}s ago`)
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        setTimeAgo(`${minutes}m ago`)
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        setTimeAgo(`${hours}h ago`)
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400)
        setTimeAgo(`${days}d ago`)
      } else {
        const weeks = Math.floor(diffInSeconds / 604800)
        setTimeAgo(`${weeks}w ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000)

    return () => clearInterval(interval)
  }, [date])

  return (
    <span className={cn('text-xs text-stone', className)}>
      {timeAgo}
    </span>
  )
}