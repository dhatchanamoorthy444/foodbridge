import { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    direction: 'up' | 'down'
    period: string
  }
  icon: ReactNode
  iconBg?: string
  iconColor?: string
  className?: string
}

export function StatCard({ title, value, change, icon, iconBg = 'bg-primary-500/10', iconColor = 'text-primary-400', className }: StatCardProps) {
  return (
    <div className={cn('glass-card p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
          {change && (
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className={change.direction === 'up' ? 'text-green-400' : 'text-red-400'}>
                {change.direction === 'up' ? '↑' : '↓'} {change.value}%
              </span>
              <span className="text-slate-500">{change.period}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconBg, iconColor)}>
          {icon}
        </div>
      </div>
    </div>
  )
}