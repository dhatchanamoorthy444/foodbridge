import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Package, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDonations } from '../hooks/useAppData'
import { EmptyState, ErrorState, SkeletonList, ExpiryBadge } from '../components/ui/Feedback'
import { storagePublicUrl } from '../lib/supabase'
import { FOOD_CATEGORIES, CATEGORY_LABELS, Donation } from '../types/api'
import { cn } from '../lib/utils'

export default function BrowseDonations() {
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

  const clearFilters = () => { setCategory('all'); setCity(''); setSearch('') }

  return (
    <div className="mx-auto max-w-3xl pb-10">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-text tracking-tight">Browse Donations</h1>
          <p className="text-[13px] text-text-2">Live surplus Listings from verified donors</p>
        </div>
        <button onClick={() => setShowFilters((v) => !v)} className="btn-secondary rounded-lg px-3 py-2 text-[12px] flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search food names…"
          className="input-field pl-10"
          aria-label="Search donations"
        />
      </div>

      {/* Filter drawer */}
      {showFilters && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 overflow-hidden rounded-xl border border-line bg-panel p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text-3">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                <option value="all">All categories</option>
                {FOOD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text-3">City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Chennai" className="input-field" />
            </div>
          </div>
          <button onClick={clearFilters} className="mt-3 text-[12px] font-semibold text-primary-fixed hover:text-text">Clear filters</button>
        </motion.div>
      )}

      {/* Chips row (when filter active, outside drawer) */}
      {(category !== 'all' || city) && !showFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {category !== 'all' && (
            <Chip onClear={() => setCategory('all')}>{CATEGORY_LABELS[category]}</Chip>
          )}
          {city && <Chip onClear={() => setCity('')}>City: {city}</Chip>}
        </div>
      )}

      {/* Result count */}
      <p className="mt-4 text-[11px] uppercase tracking-widest text-text-3">
        {query.isLoading ? 'Loading…' : `${query.data?.total ?? 0} available listing${query.data?.total === 1 ? '' : 's'}`}
        <LiveDot live={query.connected} />
      </p>

      {/* List */}
      <div className="mt-3 flex flex-col gap-3">
        {query.isLoading ? (
          <SkeletonList count={4} />
        ) : query.isError ? (
          <ErrorState message="Could not load donations" onRetry={query.refetch} />
        ) : (query.data?.data.length ?? 0) === 0 ? (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="No food donations available yet"
            message={search || city || category !== 'all' ? 'Try clearing filters or checking back soon.' : 'When donors publish surplus food, it will appear here for instant requests.'}
          />
        ) : (
          query.data?.data.map((d, i) => <DonationCard key={d.id} donation={d} index={i} />)
        )}
      </div>
    </div>
  )
}

function Chip({ onClear, children }: { onClear: () => void; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-elevated px-2.5 py-1 text-[11px] font-semibold text-text-2">
      {children}
      <button onClick={onClear} className="text-text-3 hover:text-text" aria-label="Remove filter"><X className="h-3 w-3" /></button>
    </span>
  )
}

function LiveDot({ live }: { live: boolean }) {
  if (!live) return null
  return (
    <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-secondary">
      <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> live
    </span>
  )
}

export function DonationCard({ donation: d, index = 0 }: { donation: Donation; index?: number }) {
  const imageUrl = storagePublicUrl(d.image_path)
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.3) }}>
      <Link to={`/donation/${d.id}`} className="block">
        <div className="group overflow-hidden rounded-xl border border-line bg-panel transition-colors hover:border-text-3">
          {imageUrl && (
            <img src={imageUrl} alt={d.food_name} className="photo-natural h-44 w-full object-cover" loading="lazy" />
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-text">{d.food_name}</p>
                <p className="mt-0.5 text-[12px] text-text-2">
                  {CATEGORY_LABELS[d.food_category] ?? d.food_category} · {d.available_quantity} available
                </p>
              </div>
              <ExpiryBadge expiresAt={d.expires_at} />
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-3">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.city}</span>
              <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {d.donor_business_name || 'Verified donor'}</span>
            </div>
            {d.description && (
              <p className="mt-2 line-clamp-2 text-[12px] text-text-3">{d.description}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
