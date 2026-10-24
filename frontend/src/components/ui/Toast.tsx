"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '../lib/utils'

export interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  duration?: number
  onClose?: () => void
}

export function Toast({ title, description, variant = 'default', duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onClose?.()
        }, 300) // Wait for exit animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const variantClasses = {
    default: 'bg-surface-elevated border-surface-border text-cream',
    success: 'bg-green-950/80 border-green-800/40 text-green-100',
    warning: 'bg-amber-950/80 border-amber-800/40 text-amber-100',
    danger: 'bg-red-950/80 border-red-800/40 text-red-100',
    info: 'bg-blue-950/80 border-blue-800/40 text-blue-100',
  }

  return (
    <div
      className={cn(
        'p-4 rounded-lg border shadow-lg transition-all duration-300',
        variantClasses[variant],
        isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          {description && (
            <p className="text-xs mt-1 opacity-90">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...props, id }
    setToasts(prev => [...prev, newToast])
    return id
  }

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return { toast, dismiss, toasts }
}