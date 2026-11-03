import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  Bolt,
  MapPin,
  Snowflake,
  CheckCircle2,
  History,
  Timer,
  MousePointerClick,
  ArrowRight,
  Milk,
  Package,
  Leaf,
  Brain,
  MapPinned,
  ListOrdered,
  Clock,
  Phone,
  X,
  Check,
  ShieldCheck,
  Navigation,
  Truck,
} from 'lucide-react'
import { cn } from '../lib/utils'

/* ─── Types & demo data ─── */

type Category = 'all' | 'produce' | 'bakery' | 'meals' | 'dairy'

const FILTERS: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Lots' },
  { id: 'produce', label: 'Fresh Produce' },
  { id: 'bakery', label: 'Bakery & Grains' },
  { id: 'meals', label: 'Prepared Meals' },
  { id: 'dairy', label: 'Dairy & Chilled' },
]

interface SurplusLot {
  id: string
  category: Exclude<Category, 'all'>
  categoryLabel: string
  title: string
  donor: string
  distanceKm: number
  storage: string
  storageKind: 'chilled' | 'fresh' | 'ambient'
  remaining: string
  remainingNote: string
  quantityLabel: string
  detail?: string
  image?: string
  imageCaption?: string
  hasSlider?: boolean
  sliderMax?: number
  sliderMin?: number
  sliderStep?: number
  sliderStart?: number
  crates?: string
  alt?: string
}

const LOTS: SurplusLot[] = [
  {
    id: 'lot-produce',
    category: 'produce',
    categoryLabel: 'Produce',
    title: 'Farm Fresh Spinach & Lacinato Kale',
    donor: 'Riverdale Organics Hub • Harvested yesterday',
    distanceKm: 3.1,
    storage: 'Chilled 4°C',
    storageKind: 'chilled',
    remaining: '18h remaining',
    remainingNote: '',
    quantityLabel: '50 kg Max',
    hasSlider: true,
    sliderMax: 50,
    sliderMin: 10,
    sliderStep: 5,
    sliderStart: 25,
    crates: 'Crated in 5 wood boxes',
  },
  {
    id: 'lot-meals',
    category: 'meals',
    categoryLabel: 'Prepared Meals',
    title: '80 Packed Vegetarian Lunch Boxes',
    donor: 'Metro Executive Catering • Freshly chilled',
    distanceKm: 1.8,
    storage: 'Fresh 36h',
    storageKind: 'fresh',
    remaining: 'Individually sealed',
    remainingNote: '',
    quantityLabel: '80 Total Meals',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    imageCaption: 'Nutritional Breakdown • Gluten-Free Option Included',
    alt: 'Eco-friendly lunch bowls with roasted vegetables and quinoa',
  },
  {
    id: 'lot-dairy',
    category: 'dairy',
    categoryLabel: 'Dairy & Alternatives',
    title: 'Pasteurized Whole Milk & Barista Oat',
    donor: 'Highland Dairy Collective • Unopened sealed crates',
    distanceKm: 4.2,
    storage: '28h left',
    storageKind: 'ambient',
    remaining: 'Refrigerated',
    remainingNote: '',
    quantityLabel: '60 Liters (30 Cow / 30 Oat)',
  },
  {
    id: 'lot-bakery',
    category: 'bakery',
    categoryLabel: 'Bakery',
    title: 'Artisan Heritage Sourdough & Brioche',
    donor: 'Green Leaf Hearth • Stone-milled batards',
    distanceKm: 2.4,
    storage: 'Food Safe Verified • Ambient Temp',
    storageKind: 'ambient',
    remaining: '6h 40m left',
    remainingNote: 'Top Recommendation',
    quantityLabel: '45 kg Available',
  },
]

export default function Matching() {
  const [activeFilter, setActiveFilter] = useState<Category>('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [radius, setRadius] = useState(5)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'lot-produce': 25,
  })
  const [claimModal, setClaimModal] = useState<{
    title: string
    donor: string
    qty: string
  } | null>(null)
  const [routeOpen, setRouteOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3200)
  }

  const visibleLots = useMemo(() => {
    return LOTS.filter((lot) => {
      const catOk = activeFilter === 'all' || lot.category === activeFilter
      const searchOk =
        !search ||
        lot.title.toLowerCase().includes(search.toLowerCase()) ||
        lot.donor.toLowerCase().includes(search.toLowerCase())
      const radiusOk = lot.distanceKm <= radius
      return catOk && searchOk && radiusOk
    })
  }, [activeFilter, search, radius])

  const openClaim = (title: string, donor: string, qty: string) => {
    setClaimModal({ title, donor, qty })
  }

  const confirmClaim = () => {
    setClaimModal(null)
    showToast('Lot reserved! Dispatching courier pickup ticket.')
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5 pb-8">
      {/* ── Editorial header ── */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
            Harvesters Sanctuary Hub
          </span>
          <h1
            className="text-headline-lg-mobile text-primary tracking-tight"
            style={{ fontFamily: 'Anton, Impact, sans-serif' }}
          >
            Daily Surplus Discovery
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            Live Ledger
          </span>
        </div>
      </div>

      {/* ── Search & filters ── */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surplus inventory, farms, or kitchens..."
            className="input-field pl-10 pr-10"
            aria-label="Search surplus inventory"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
            aria-label="Toggle filters"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                'flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-sm shadow-sm transition-transform active:scale-95',
                activeFilter === f.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant hover:text-primary'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-3 p-4 rounded-xl bg-surface-container-low shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface">
                  Maximum Radius:{' '}
                  <span className="text-secondary font-bold tabular-nums">
                    {radius.toFixed(1)} km
                  </span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Inner Metro District
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer h-1.5 bg-surface-container-high rounded-lg appearance-none"
                aria-label="Maximum radius in kilometers"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="font-label-md text-label-md text-on-surface">
                  Priority Sort
                </span>
                <span className="px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold flex items-center gap-1">
                  <Bolt className="w-3.5 h-3.5" /> Critical Expiry First
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Active transport status ── */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider font-bold">
              In Route #RQ-882
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Scheduled Today
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <h4 className="text-title-md text-on-surface truncate">
              Sun Valley Market • 25 kg Mixed Greens
            </h4>
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mt-0.5">
              <Truck className="w-4 h-4 text-secondary" />
              <span>
                Volunteer: <strong className="text-on-surface">Marcus Vance</strong>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="font-label-sm text-label-sm text-secondary font-bold tabular-nums">
              ETA 15 min
            </span>
            <div className="mt-1 px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm tracking-widest font-mono font-semibold">
              OTP: <span className="text-primary font-bold">#7492</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-1 flex flex-col gap-1.5">
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden flex">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-700"
              style={{ width: '72%' }}
            />
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>Dispatched from Market 09:12 AM</span>
            <button
              onClick={() => setRouteOpen(true)}
              className="text-secondary font-bold flex items-center gap-0.5 hover:underline"
            >
              Live Route <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Algorithmic match banner ── */}
      <div className="rounded-xl bg-surface-container p-4 flex flex-col gap-1 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-secondary font-semibold font-label-md text-label-md">
            <Brain className="w-[18px] h-[18px]" />
            <span>Adaptive Algorithmic Match</span>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
            96% Capacity Synergy
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Optimized for your sanctuary's{' '}
          <strong className="text-on-surface">12:30 PM lunch service</strong> and 60-seat
          refrigerated cold storage capacity.
        </p>
        <div className="flex items-center gap-3 pt-1 text-on-surface-variant font-label-sm text-label-sm flex-wrap">
          <span className="flex items-center gap-1">
            <MapPinned className="w-3.5 h-3.5 text-secondary" /> 2.4 km away
          </span>
          <span className="flex items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5 text-secondary" /> Fit: ~45 kg buffer
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-secondary" /> Ready now
          </span>
        </div>
      </div>

      {/* ── Top recommendation card ── */}
      <div className="relative rounded-xl bg-surface-container-lowest overflow-hidden shadow-sm flex flex-col">
        <div className="relative w-full h-44">
          <img
            src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=900&q=80"
            alt="Artisan sourdough loaves in wooden crates"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-black/20" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider shadow-sm">
              Top Recommendation
            </span>
            <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" /> 6h 40m left
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-surface-variant opacity-90">
                Green Leaf Hearth • 2.4 km
              </span>
              <h3
                className="text-headline-sm leading-snug"
                style={{ fontFamily: 'Anton, Impact, sans-serif' }}
              >
                Artisan Heritage Sourdough & Brioche
              </h3>
            </div>
            <span className="font-label-md text-label-md font-bold px-2.5 py-1 rounded bg-primary-container text-on-primary-container shadow-sm flex-shrink-0">
              45 kg Available
            </span>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Stone-milled whole wheat batards and fresh organic brioches baked this morning.
            Packaged into food-grade unbleached linen totes ready for instant collection.
          </p>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-on-surface font-label-md text-label-md">
              <CheckCircle2 className="w-[18px] h-[18px] text-secondary" />
              <span>Food Safe Verified • Ambient Temp</span>
            </div>
            <button
              onClick={() =>
                openClaim(
                  'Artisan Heritage Sourdough & Brioche',
                  'Green Leaf Hearth',
                  '45 kg'
                )
              }
              className="px-4 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold tracking-wide hover:bg-primary transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
            >
              <MousePointerClick className="w-4 h-4" />
              <span>Claim Lot</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Available surplus ── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2
            className="text-headline-sm text-primary"
            style={{ fontFamily: 'Anton, Impact, sans-serif' }}
          >
            Available Surplus Lots
          </h2>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Real-time redistribution inventory
          </span>
        </div>
        <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-semibold">
          {visibleLots.length} Nearby
        </span>
      </div>

      {visibleLots.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low p-8 text-center text-on-surface-variant">
          No lots match your filters. Try widening the radius or clearing search.
        </div>
      ) : (
        visibleLots.map((lot) => (
          <SurplusCard
            key={lot.id}
            lot={lot}
            qty={quantities[lot.id] ?? lot.sliderStart ?? 0}
            onQty={(v) => setQuantities((q) => ({ ...q, [lot.id]: v }))}
            onClaim={openClaim}
          />
        ))
      )}

      {/* ── Impact strip ── */}
      <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between text-on-surface shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-title-md font-bold leading-tight tabular-nums">
              342 kg Rescued
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              This week by Harvesters Sanctuary
            </span>
          </div>
        </div>
        <span className="font-label-sm text-label-sm font-bold text-secondary uppercase tracking-wider">
          Top 5% NGO
        </span>
      </div>

      {/* ── Claim bottom sheet ── */}
      <AnimatePresence>
        {claimModal && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 backdrop-blur-sm"
            onClick={() => setClaimModal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl p-6 shadow-xl flex flex-col gap-4"
              role="dialog"
              aria-modal="true"
              aria-label="Confirm claim"
            >
              <div className="flex items-center justify-between border-b pb-3 border-surface-container">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                    Fast Allocation Protocol
                  </span>
                  <h3
                    className="text-headline-sm text-primary"
                    style={{ fontFamily: 'Anton, Impact, sans-serif' }}
                  >
                    {claimModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setClaimModal(null)}
                  className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
                <div className="flex justify-between py-1 border-b border-surface-container/60">
                  <span>Supplier Partner:</span>
                  <span className="text-on-surface font-semibold">{claimModal.donor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container/60">
                  <span>Claim Quantity:</span>
                  <span className="text-primary font-bold tabular-nums">
                    {claimModal.qty}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container/60">
                  <span>Intended Destination:</span>
                  <span className="text-on-surface font-semibold">
                    Sanctuary Kitchen • Service 12:30 PM
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Logistics Dispatch:</span>
                  <span className="text-secondary font-semibold">
                    Autonomous Volunteer Relay
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
                <span className="font-body-sm text-body-sm text-on-surface">
                  By confirming, your team commits to immediate temperature-safe
                  distribution within the expiry window.
                </span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setClaimModal(null)}
                  className="flex-1 py-3 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClaim}
                  className="flex-1 py-3 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md font-bold tracking-wide hover:bg-primary hover:text-on-primary shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Check className="w-[18px] h-[18px]" />
                  <span>Confirm & Dispatch</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Route modal ── */}
      <AnimatePresence>
        {routeOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm"
            onClick={() => setRouteOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-surface-container-lowest rounded-xl p-4 shadow-xl flex flex-col gap-3"
              role="dialog"
              aria-modal="true"
              aria-label="Live route tracking"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  <h3 className="text-title-md text-primary font-bold">
                    Marcus Vance • Courier Active
                  </h3>
                </div>
                <button
                  onClick={() => setRouteOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
                  aria-label="Close route map"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full h-52 bg-surface-container rounded-lg relative overflow-hidden flex items-end p-3">
                <div className="bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-md text-primary font-label-sm text-label-sm font-bold shadow-md flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-secondary" />
                  <span className="tabular-nums">
                    2.1 km to Harvesters Sanctuary • 15 mins
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-body-sm text-on-surface pt-1">
                <span>Emergency Contact:</span>
                <a
                  className="text-secondary font-bold flex items-center gap-1"
                  href="tel:5550192"
                >
                  <Phone className="w-4 h-4" /> (555) 019-2841
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-lg flex items-center gap-2"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="w-[18px] h-[18px] text-secondary-fixed" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Surplus card sub-component ─── */

function SurplusCard({
  lot,
  qty,
  onQty,
  onClaim,
}: {
  lot: SurplusLot
  qty: number
  onQty: (v: number) => void
  onClaim: (title: string, donor: string, qty: string) => void
}) {
  const storageIcon =
    lot.storageKind === 'chilled' ? (
      <Snowflake className="w-3.5 h-3.5" />
    ) : lot.storageKind === 'fresh' ? (
      <CheckCircle2 className="w-3.5 h-3.5" />
    ) : (
      <History className="w-3.5 h-3.5" />
    )

  const storageChip =
    lot.storageKind === 'chilled'
      ? 'bg-surface-container text-primary'
      : lot.storageKind === 'fresh'
        ? 'bg-secondary-container text-on-secondary-container'
        : 'bg-tertiary-fixed text-on-tertiary-fixed'

  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm font-semibold">
              {lot.categoryLabel}
            </span>
            <span className="flex items-center gap-0.5 font-label-sm text-label-sm text-on-surface-variant">
              <MapPin className="w-3.5 h-3.5" /> {lot.distanceKm} km
            </span>
          </div>
          <h3 className="text-title-md text-on-surface leading-tight">{lot.title}</h3>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            {lot.donor}
          </span>
        </div>
        <div className="flex flex-col items-end flex-shrink-0">
          <span
            className={cn(
              'px-2 py-1 rounded font-label-sm text-label-sm font-bold flex items-center gap-1',
              storageChip
            )}
          >
            {storageIcon} {lot.storage}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
            {lot.remaining}
          </span>
        </div>
      </div>

      {lot.hasSlider && (
        <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
          <div className="flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">Claim Allocation:</span>
            <span className="text-primary font-bold tabular-nums">
              {qty} kg / {lot.sliderMax} kg Max
            </span>
          </div>
          <input
            type="range"
            min={lot.sliderMin}
            max={lot.sliderMax}
            step={lot.sliderStep}
            value={qty}
            onChange={(e) => onQty(parseInt(e.target.value))}
            className="w-full accent-primary cursor-pointer h-1.5 bg-surface-container-high rounded-lg appearance-none"
            aria-label={`Claim quantity for ${lot.title}`}
          />
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>Min: {lot.sliderMin} kg crate</span>
            <span>Max: Full Lot ({lot.sliderMax} kg)</span>
          </div>
        </div>
      )}

      {lot.image && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden">
          <img src={lot.image} alt={lot.alt || lot.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          {lot.imageCaption && (
            <div className="absolute bottom-2 left-3 text-white">
              <span className="font-label-sm text-label-sm">{lot.imageCaption}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        {lot.hasSlider ? (
          <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
            <Package className="w-4 h-4 text-secondary" />
            {lot.crates}
          </span>
        ) : (
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Available Quantity
            </span>
            <span className="text-title-md text-on-surface font-semibold">
              {lot.quantityLabel}
            </span>
          </div>
        )}
        <button
          onClick={() =>
            onClaim(lot.title, lot.donor.split('•')[0].trim(), lot.hasSlider ? `${qty} kg` : lot.quantityLabel)
          }
          className={cn(
            'px-3.5 py-2 rounded-lg font-label-md text-label-md font-semibold transition-all active:scale-95 flex items-center gap-1',
            lot.hasSlider
              ? 'bg-surface-container text-primary hover:bg-primary hover:text-on-primary'
              : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary shadow-sm'
          )}
        >
          <span>{lot.hasSlider ? 'Request Claim' : 'Claim Allocation'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
