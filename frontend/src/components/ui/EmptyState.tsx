import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="inline-block p-4 rounded-full bg-bone/5 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-bone">{title}</h3>
      {description && (
        <p className="text-muted mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 rounded-lg bg-primary-500/20 border border-primary-500/30 text-primary-300 hover:bg-primary-500/30 transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}