import { motion } from 'framer-motion'
import { Clock, MapPin, Package, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Donation } from '../../types/api'

interface LiveFoodFeedProps {
  donations: Donation[]
  loading?: boolean
  onClaimClick?: (id: string) => void
  onViewAllClick?: () => void
  userRole?: 'donor' | 'recipient' | 'admin' | 'volunteer'
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; bg: string; text: string }> = {
    available: { label: 'AVAILABLE', bg: '#263300', text: '#D7EF4A' },
    partially_fulfilled: { label: 'PARTIAL', bg: '#331A00', text: '#FFA04A' },
    completed: { label: 'COMPLETED', bg: '#001A33', text: '#4A9AFF' },
    cancelled: { label: 'CANCELLED', bg: '#330000', text: '#FF4A4A' },
  }
  return statusMap[status] || statusMap.available
}

function getExpiryColor(expiresAt: string | null): string {
  if (!expiresAt) return '#858C84'
  const now = new Date().getTime()
  const expiry = new Date(expiresAt).getTime()
  const hoursLeft = (expiry - now) / (1000 * 60 * 60)

  if (hoursLeft < 4) return '#FF5449' // critical
  if (hoursLeft < 12) return '#FFA04A' // urgent
  return '#D7EF4A' // normal
}

export default function LiveFoodFeed({
  donations,
  loading,
  onClaimClick,
  onViewAllClick,
  userRole,
}: LiveFoodFeedProps) {
  const isRecipient = userRole === 'recipient'

  return (
    <div className="rounded-2xl bg-[#0D0F0D] border border-[#262E26] p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#262E26]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#410002] flex items-center justify-center">
            <Package className="w-5 h-5 text-[#FFDAD6]" />
          </div>
          <div>
            <h2 className="font-['Anton'] text-xl text-white uppercase tracking-wide">
              {isRecipient ? 'Live Food Availability Feed' : 'Recent Dispatch Inventory'}
            </h2>
            <p className="font-mono text-[10px] text-[#858C84] uppercase tracking-wider">
              Real-time listings radar
            </p>
          </div>
        </div>

        {onViewAllClick && (
          <button
            onClick={onViewAllClick}
            className="flex items-center gap-2 font-mono text-xs text-[#D7EF4A] hover:text-[#E8F5A4] uppercase font-bold tracking-wider transition-colors"
          >
            VIEW ALL <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-[#131713] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="w-12 h-12 text-[#262E26] mx-auto mb-3" />
          <p className="font-mono text-xs text-[#858C84] uppercase tracking-wider">
            No live batches reported on radar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donations.map((donation, idx) => {
            const badge = getStatusBadge(donation.status)
            const expiryColor = getExpiryColor(donation.expires_at)
            const timeLeft = donation.expires_at
              ? formatDistanceToNow(new Date(donation.expires_at), { addSuffix: true })
              : 'No expiry set'

            return (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative p-4 rounded-xl bg-[#131713] border border-[#262E26] hover:border-[#D7EF4A]/40 transition-all group cursor-pointer"
                onClick={() => onClaimClick?.(donation.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-[#143527] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[22px] text-[#D7EF4A]">
                        restaurant
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white text-sm uppercase truncate group-hover:text-[#D7EF4A] transition-colors">
                        {donation.food_name}
                      </h3>
                      <p className="font-mono text-[11px] text-[#858C84] mt-0.5">
                        {donation.available_quantity} {donation.unit} • {donation.food_category.toUpperCase()}
                      </p>
                      {donation.donor_business_name && (
                        <p className="font-mono text-[10px] text-[#858C84] mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {donation.donor_business_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded flex-shrink-0"
                    style={{ background: badge.bg, color: badge.text }}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#262E26]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" style={{ color: expiryColor }} />
                    <span
                      className="font-mono text-[10px] font-bold"
                      style={{ color: expiryColor }}
                    >
                      {timeLeft}
                    </span>
                  </div>

                  {isRecipient && donation.status === 'available' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onClaimClick?.(donation.id)
                      }}
                      className="px-3 py-1 rounded-lg bg-[#D7EF4A] text-[#090B09] font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-[#E8F5A4] transition-colors"
                    >
                      CLAIM NOW
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
