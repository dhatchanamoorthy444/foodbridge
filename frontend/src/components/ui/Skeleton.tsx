"use client"

import React from 'react'
import { cn } from '../lib/utils'

interface SkeletonProps {
  className?: string
  animated?: boolean
}

export function Skeleton({ className, animated = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-surface-elevated rounded-lg',
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
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-surface-elevated rounded animate-pulse"
          style={{ width: `${Math.random() * 40 + 60}%` }}
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
    <div className={cn('p-6 rounded-xl border border-surface-border bg-surface-elevated', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="h-4 w-24 bg-surface rounded animate-pulse" />
          <div className="h-6 w-32 bg-surface rounded animate-pulse mt-2" />
          <div className="h-4 w-20 bg-surface rounded animate-pulse mt-2" />
        </div>
        <div className="w-10 h-10 bg-surface rounded-lg animate-pulse" />
      </div>
    </div>
  )
}