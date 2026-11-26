import { motion } from 'framer-motion'
import { TrendingUp, Users, Package, Leaf } from 'lucide-react'
import { useMemo } from 'react'

export interface PlatformMetrics {
  totalMealsSaved: number
  activeFoodListings: number
  ngosConnected: number
  foodWastePrevented: number // in kg
}

interface ImpactDashboardProps {
  metrics: PlatformMetrics
  loading?: boolean
}

export default function ImpactDashboard({ metrics, loading }: ImpactDashboardProps) {
  const cards = useMemo(
    () => [
      {
        label: 'Total Meals Saved',
        value: metrics.totalMealsSaved,
        unit: 'MEALS',
        icon: Package,
        color: '#D7EF4A',
        bgColor: '#263300',
      },
      {
        label: 'Active Food Listings',
        value: metrics.activeFoodListings,
        unit: 'LIVE',
        icon: TrendingUp,
        color: '#4AE7EF',
        bgColor: '#003336',
      },
      {
        label: 'NGOs Connected',
        value: metrics.ngosConnected,
        unit: 'ORGS',
        icon: Users,
        color: '#E74AEF',
        bgColor: '#330036',
      },
      {
        label: 'Food Waste Prevented',
        value: metrics.foodWastePrevented,
        unit: 'KG',
        icon: Leaf,
        color: '#4AEF7A',
        bgColor: '#003320',
      },
    ],
    [metrics]
  )

  return (
    <div className="rounded-2xl bg-[#0D0F0D] border border-[#262E26] p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#262E26]">
        <div className="w-10 h-10 rounded-lg bg-[#D7EF4A]/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-[#D7EF4A]" />
        </div>
        <div>
          <h2 className="font-['Anton'] text-xl text-white uppercase tracking-wide">
            Live Platform Impact
          </h2>
          <p className="font-mono text-[10px] text-[#858C84] uppercase tracking-wider">
            Real-Time Network Analytics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative p-4 rounded-xl bg-[#131713] border border-[#262E26] overflow-hidden group hover:border-[#D7EF4A]/30 transition-all"
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"
              style={{ background: card.color }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
                <span
                  className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ background: card.bgColor, color: card.color }}
                >
                  {card.unit}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                {loading ? (
                  <div className="h-9 w-20 bg-[#1C221C] animate-pulse rounded" />
                ) : (
                  <span
                    className="font-['Anton'] text-3xl"
                    style={{ color: card.color }}
                  >
                    {card.value.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="font-mono text-[10px] text-[#858C84] uppercase tracking-wider leading-tight">
                {card.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
