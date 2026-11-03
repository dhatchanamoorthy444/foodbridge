import { Package, Inbox, AlertTriangle, RefreshCw, Clock } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({
  title,
  message,
  icon,
  action,
}: {
  title: string
  message?: string
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-panel px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-text-2">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-text-2">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-panel px-6 py-10 text-center">
      <AlertTriangle className="mb-3 h-8 w-8 text-danger" />
      <p className="font-medium text-text">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      )}
    </div>
  )
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse rounded-xl border border-line bg-panel p-4">
      <div className="mb-3 flex gap-3">
        <div className="h-14 w-14 rounded-xl bg-elevated" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-1/3 rounded bg-elevated" />
          <div className="h-3 w-1/2 rounded bg-elevated" />
        </div>
      </div>
      {Array.from({ length: Math.max(0, lines - 1) }).map((_, i) => (
        <div key={i} className="h-3 w-full rounded bg-elevated" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-text-2">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-line border-t-primary" />
      {label && <p className="mt-3 text-sm">{label}</p>}
    </div>
  )
}

export function ExpiryBadge({ expiresAt }: { expiresAt: string | null }) {
  if (!expiresAt) return null
  const diff = new Date(expiresAt).getTime() - Date.now()
  const hours = Math.floor(diff / 3_600_000)
  let tone = 'text-text-2'
  let label = `${hours}h left`
  if (hours <= 0) {
    label = 'Expired'
    tone = 'text-danger'
  } else if (hours <= 24) {
    label = `${hours}h left`
    tone = 'text-tertiary'
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${tone}`}>
      <Clock className="h-3 w-3" /> {label}
    </span>
  )
}

export function NoFoodIcon() {
  return <Package className="h-6 w-6" />
}
