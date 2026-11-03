import {
  Verified,
  Cpu,
  Group,
  Leaf,
  Package,
  Route,
} from 'lucide-react'
import { cn } from '../lib/utils'

const KPI_CARDS = [
  {
    label: 'Verified Users',
    value: '412',
    delta: '+14%',
    sub: 'RBAC segregated',
    icon: Group,
    iconColor: 'text-secondary',
  },
  {
    label: 'Waste Diverted',
    value: '98.7%',
    delta: 'Optimal',
    sub: '14,820 KG rescued',
    icon: Leaf,
    iconColor: 'text-secondary',
  },
  {
    label: 'Live Batches',
    value: '94',
    delta: 'Active',
    sub: 'FIFO queue enabled',
    icon: Package,
    iconColor: 'text-primary',
  },
  {
    label: 'Active Dispatches',
    value: '18',
    delta: 'Transit',
    sub: 'Avg latency: 22m',
    icon: Route,
    iconColor: 'text-primary',
  },
]

export default function Analytics() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5 pb-8">

      {/* Header banner */}
      <div className="rounded-xl bg-surface-container-high p-4 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-primary">
          <Cpu className="w-[140px] h-[140px]" />
        </div>
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm">
              <Verified className="w-3.5 h-3.5" />
              ACADEMIC ARCHITECTURE V4.2
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
              Java 21 LTS • Spring Boot 3.2
            </span>
          </div>
          <h1
            className="text-headline-lg-mobile text-primary tracking-tight font-medium"
            style={{ fontFamily: 'Anton, Impact, sans-serif' }}
          >
            Evaluation & Engine Core
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Strict 3NF MySQL relational topology, declarative domain contracts, and
            polymorphic redistribution dispatchers.
          </p>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-2">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface-container-lowest p-3 rounded-lg shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                {kpi.label}
              </span>
              <kpi.icon className={cn('w-[18px] h-[18px]', kpi.iconColor)} />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-headline-sm text-primary font-semibold tabular-nums">
                {kpi.value}
              </span>
              <span
                className={cn(
                  'font-label-sm text-label-sm font-bold',
                  kpi.delta.startsWith('+') ? 'text-secondary' : 'text-on-surface-variant'
                )}
              >
                {kpi.delta}
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">
              {kpi.sub}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}
