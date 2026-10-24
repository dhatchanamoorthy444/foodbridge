"use client"

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

interface Step {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface StepperProps {
  steps: Step[]
  currentStep: string
  onStepClick?: (stepId: string) => void
  className?: string
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  const isStepCompleted = (stepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    const stepIndex = steps.findIndex(s => s.id === stepId)
    return stepIndex < currentIndex
  }

  const isStepCurrent = (stepId: string) => stepId === currentStep

  return (
    <nav className={cn('w-full', className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const completed = isStepCompleted(step.id)
          const current = isStepCurrent(step.id)
          const isClickable = completed || current

          return (
            <li key={step.id} className={cn('relative flex-1 group', index < steps.length - 1 && 'pr-8')}>
              <div className="flex items-center">
                <button
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-botanical focus:ring-offset-2 focus:ring-offset-surface',
                    completed
                      ? 'bg-botanical/20 text-botanical border border-botanical/40 cursor-pointer hover:bg-botanical/30'
                      : current
                      ? 'bg-botanical text-cream border-2 border-botanical shadow-lg'
                      : 'bg-surface-elevated text-stone border border-surface-border cursor-not-allowed opacity-50'
                  )}
                >
                  {completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.icon || step.label.charAt(0).toUpperCase()
                  )}
                </button>

                <div className="ml-3">
                  <p className={cn('text-sm font-medium', current ? 'text-cream' : 'text-stone')}>{
                    step.label
                  }</p>
                  {step.description && (
                    <p className="text-xs text-stone mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute top-5 left-full w-8 h-0.5 bg-surface-border -ml-8" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}