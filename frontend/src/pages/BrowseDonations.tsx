import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDonations } from '../hooks/useAppData'
import { EmptyState, ErrorState, SkeletonList, ExpiryBadge } from '../components/ui/Feedback'
import { storagePublicUrl } from '../lib/supabase'
import { FOOD_CATEGORIES, CATEGORY_LABELS, Donation } from '../types/api'
import { formatRelativeTime } from '../lib/utils'

export default function BrowseDonations() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [city, setCity] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const query = useDonations({
    search: search || undefined,
    category: category === 'all' ? undefined : category,
    city: city || undefined,
    sort: 'expiry',
  })

  const donations = query.data?.data ?? []
  const clearFilters = () => { setCategory('all'); setCity(''); setSearch('') }

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 max-w-7xl mx-auto">
      {/* ── Operational Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#D7EF4A] text-[#090B09] font-mono text-[10px] uppercase font-bold tracking-wider">
              RECIPIENT MARKETPLACE
            </span>
            <span className="font-mono text-xs text-[#858C84] uppercase tracking-wider">
              SURPLUS RADAR // VERIFIED PURVEYOR INVENTORY
            </span>
          </div>
          <h1 className="font-['Anton'] text-2xl md:text-3xl text-white uppercase tracking-wide mt-1.5">
            AVAILABLE SURPLUS REDISTRIBUTION
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C221C] border border-[#262E26] text-white font-mono text-xs uppercase font-bold hover:bg-[#252B25] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            FILTERS {category !== 'all' || city ? '(ACTIVE)' : ''}
          </button>
          <button
            onClick={() => navigate('/alerts')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#410002] border border-[#FF5449]/40 text-[#FFDAD6] font-mono text-xs uppercase font-bold hover:bg-[#690005] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
            POST URGENT NEED
          </button>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858C84] text-[20px] pointer-events-none">
          search
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH VERIFIED FOOD BATCHES, HOT MEALS, RAW PRODUCE..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#131713] border border-[#262E26] text-white font-mono text-xs uppercase placeholder-[#858C84] focus:outline-none focus:border-[#D7EF4A]"
        />
      </div>

      {/* ── Filters Drawer ── */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[#131713] border border-[#262E26] grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div>
            <label className="block font-mono text-[10px] text-[#858C84] uppercase font-bold mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1C221C] border border-[#262E26] text-white text-xs uppercase font-mono"
            >
              <option value="all">ALL FOOD CATEGORIES</option>
              {FOOD_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c].toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#858C84] uppercase font-bold mb-1.5">
              City / Region
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Chennai, Bangalore"
              className="w-full px-3 py-2 rounded-lg bg-[#1C221C] border border-[#262E26] text-white text-xs font-mono uppercase"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full py-2 rounded-lg bg-[#252B25] text-white font-mono text-xs uppercase font-bold hover:bg-[#D7EF4A] hover:text-[#090B09] transition-all"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Active Listings Feed ── */}
      {query.isLoading ? (
        <div className="py-20 text-center font-mono text-xs text-[#858C84] uppercase">
          Scanning surplus food radar...
        </div>
      ) : query.isError ? (
        <ErrorState message="Could not connect to live surplus feed" onRetry={() => query.refetch()} />
      ) : donations.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#131713] border border-[#262E26]">
          <span className="material-symbols-outlined text-4xl text-[#858C84] mb-2">inventory_2</span>
          <p className="font-['Anton'] text-lg text-white uppercase">No Active Surplus Batches</p>
          <p className="text-xs text-[#858C84] mt-1 font-mono">
            Check back shortly or publish an Emergency Need Alert to notify donors nearby.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {donations.map((d) => {
            const expiryMs = d.expires_at ? new Date(d.expires_at).getTime() : Date.now() + 3600000
            const diffHours = Math.max(0, (expiryMs - Date.now()) / (1000 * 60 * 60))
            const hours = Math.floor(diffHours)
            const mins = Math.floor((diffHours - hours) * 60)
            const imageUrl = storagePublicUrl(d.image_path)

            return (
              <div
                key={d.id}
                onClick={() => navigate(`/browse/${d.id}`)}
                className="relative rounded-xl bg-[#131713] border border-[#262E26] overflow-hidden flex flex-col justify-between hover:border-[#D7EF4A]/40 transition-all cursor-pointer group shadow-lg"
              >
                {/* Photo or Pattern Header */}
                <div className="relative h-40 w-full bg-[#1C221C] overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={d.food_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#D7EF4A]/30 bg-gradient-to-br from-[#143527]/30 to-[#0D231A]">
                      <span className="material-symbols-outlined text-5xl">restaurant</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131713] via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#090B09]/80 backdrop-blur border border-[#262E26] font-mono text-[9px] text-[#D7EF4A] uppercase font-bold">
                    {d.food_category?.toUpperCase()}
                  </span>

                  {/* Expiry Pill */}
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold ${
                      diffHours <= 3
                        ? 'bg-[#410002] border border-[#FF5449] text-[#FF5449] animate-pulse'
                        : 'bg-[#263300] text-[#D7EF4A]'
                    }`}
                  >
                    {hours}H {mins}M LEFT
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <h3 className="font-['Anton'] text-lg text-white uppercase group-hover:text-[#D7EF4A] transition-colors line-clamp-1">
                      {d.food_name}
                    </h3>
                    <p className="text-xs text-[#858C84] line-clamp-2 mt-1">
                      {d.description || 'Prepared fresh and verified under safe hygiene standards.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#262E26] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#858C84] uppercase">Available:</span>
                      <span className="font-mono font-bold text-white">
                        {d.available_quantity ?? d.quantity} {d.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#858C84] uppercase">Location:</span>
                      <span className="font-mono text-[#BCD147] truncate max-w-[180px]">
                        {d.city || 'Regional Center'}
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded-lg bg-[#D7EF4A] text-[#090B09] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#E8F5A4] transition-all">
                    REQUEST ALLOCATION →
                  </button>
                </div>
              </div>
              </div>
            })
          }
        </div>
      )}
    </div>
  )
}
