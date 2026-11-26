import React from 'react'
import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  animated?: boolean
}

export function Skeleton({ className, animated = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-elevated rounded-[8px]',
        animated && 'animate-pulse',
        className
      )}
    />
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  const widths = [85, 70, 55, 90, 65]
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-elevated rounded-[6px] animate-pulse"
          style={{ width: `${widths[i % widths.length]}%` }}
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('p-6 rounded-[10px] border-2 border-line/40 bg-panel', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-elevated rounded-[6px] animate-pulse" />
          <div className="h-7 w-20 bg-elevated rounded-[6px] animate-pulse" />
          <div className="h-3 w-28 bg-elevated rounded-[6px] animate-pulse" />
        </div>
        <div className="w-11 h-11 bg-elevated rounded-[10px] animate-pulse ml-4" />
      </div>
    </div>
  )
}
