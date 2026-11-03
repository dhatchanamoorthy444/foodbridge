import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Leaf,
  Thermometer,
  Radar,
  Timer,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Scale,
  UtensilsCrossed,
  Users,
  CheckCircle2,
  ChevronRight,
  Plus,
  Heart,
  Store,
  Network,
  Route,
  Activity,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

/* ─── Demo data (no fabricated platform-wide metrics) ─── */

const URGENCY_ITEMS = [
  {
    id: 'u1',
    title: 'Heritage Country Sourdough',
    provider: "L'Etoile Boulangerie",
    qty: '18 loaves',
    timeLeft: '03h 42m Left',
    distance: '0.8 km away',
    location: 'Central Quarter',
    desc: 'Baked dawn today with organic wild yeast, whole wheat.',
    status: 'critical' as const,
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
  },
  {
    id: 'u2',
    title: 'Hydroponic Salad Medley',
    provider: 'Verdant Urban Farms',
    qty: '24 crates',
    timeLeft: '07h 15m Left',
    distance: '1.4 km away',
    location: 'Dockside Greenhouse',
    desc: 'Harvested yesterday afternoon, cold storage kept.',
    status: 'expiring' as const,
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
  },
  {
    id: 'u3',
    title: 'Pasture Milk & Curd',
    provider: 'Alder Brook Cooperative',
    qty: '40 units',
    timeLeft: '02h 10m Left',
    distance: '2.1 km away',
    location: 'West Market Depot',
    desc: 'Certified cold-chain logged at 3.8°C throughout transport.',
    status: 'critical' as const,
    image:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
  },
]

const ROLE_TABS = [
  { id: 'donor', label: 'Donor' },
  { id: 'recipient', label: 'Recipient NGO' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'admin', label: 'Admin' },
] as const

type RoleId = (typeof ROLE_TABS)[number]['id']

const ROLE_PANELS: Record<
  RoleId,
  { icon: React.ElementType; title: string; sub: string; badge: string; metricLabel: string; metric: string; action: string; note: string }
> = {
  donor: {
    icon: Store,
    title: 'Purveyor Quick-Post',
    sub: 'Log batch expiry in under 30 seconds',
    badge: 'Active Station',
    metricLabel: 'Tax Deduction Credit Generated',
    metric: '$3,420.00 USD',
    action: 'Post Batch',
    note: 'Automatic barcode & photo verification enabled',
  },
  recipient: {
    icon: Network,
    title: 'Pantry Allocation Radar',
    sub: 'Pre-reserve deliveries based on inventory deficit',
    badge: 'Live Feeds',
    metricLabel: 'Expected Inbound Parcels',
    metric: '14 Shipments Today',
    action: 'Receive',
    note: 'HACCP cold chain logging required upon arrival',
  },
  volunteer: {
    icon: Route,
    title: 'Last-Mile Rescue Routes',
    sub: 'Zero-emission pick-up and distribution tasks',
    badge: '5 Available',
    metricLabel: 'Active Leg: 1.2 km ride',
    metric: 'St. Jude Community Kitchen',
    action: 'Accept Run',
    note: 'Optimized multi-stop transit matrix enabled',
  },
  admin: {
    icon: Activity,
    title: 'Bioregional Redistribution Engine',
    sub: 'Algorithmic waste balance & hub audit telemetry',
    badge: 'System Nominal',
    metricLabel: 'Relational Transaction Rate',
    metric: '410 TPS Engine',
    action: 'Health Metrics',
    note: 'Cryptographic proof-of-dispatch chain active',
  },
}

export default function Home() {
  const [activeRole, setActiveRole] = useState<RoleId>('donor')
  const [toast, setToast] = useState<string | null>(null)
  const [claimed, setClaimed] = useState<string[]>([])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleClaim = (item: (typeof URGENCY_ITEMS)[number]) => {
    if (claimed.includes(item.id)) return
    setClaimed((prev) => [...prev, prev.length ? item.id : item.id].slice(-3))
    if (!claimed.includes(item.id)) setClaimed([...claimed, item.id])
    showToast(`${item.title} reserved — 15m lock granted.`)
  }

  const role = ROLE_PANELS[activeRole]
  const RoleIcon = role.icon

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5 pb-8">
      {/* ── Live status banner ── */}
      <div className="flex items-center justify-between py-1.5 px-3 rounded-full bg-surface-container shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
          </span>
          <span className="font-label-md text-label-md text-primary tracking-wide">
            Piedmont Bioregion Dispatch Active
          </span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
          <Leaf className="w-3.5 h-3.5" />
          <span>Zero Loss Cohort</span>
        </div>
      </div>

      {/* ── Editorial hero ── */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
            Ecological Redistribution Portal
          </span>
          <h1 className="font-display-hero-mobile text-display-hero-mobile text-primary leading-[1.05] tracking-tight">
            Don't Waste Food.{' '}
            <span className="italic font-normal text-secondary">Bridge the Gap.</span>
          </h1>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Every meal deserves a purpose. FoodBridge connects artisanal surplus, local
          harvests, and neighborhood pantries through smart botanical logistics and
          real-time community care.
        </p>

        {/* Harvest basket hero card */}
        <div className="relative w-full rounded-xl p-[2px] mt-1 bg-gradient-to-br from-primary via-secondary to-primary/70 shadow-[0_10px_36px_-14px_rgba(223,255,0,0.55)]">
          <div className="relative h-64 w-full overflow-hidden rounded-[10px] bg-surface-container-low">
            <img
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1000&q=80"
              alt="Rustic farm stand with wooden crates of fresh produce and bread"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 rounded-[10px] ring-1 ring-inset ring-white/10 pointer-events-none" />
            {/* Floating badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-bright/90 backdrop-blur-md shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-secondary" />
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
                  100% Organic Rescue
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/90 backdrop-blur-md shadow-sm">
                <Thermometer className="w-3.5 h-3.5 text-on-secondary-container" />
                <span className="font-label-sm text-label-sm text-on-secondary-container font-semibold">
                  4.2°C Cold Sealed
                </span>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-md text-on-primary">
              <Radar className="w-3.5 h-3.5 text-tertiary-fixed" />
              <span className="font-label-sm text-label-sm tracking-wider font-semibold">
                HARVEST RADAR
              </span>
            </div>
            {/* Footer overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-secondary-fixed/80 uppercase tracking-wider">
                  Provenance Route #409
                </span>
                <span
                  className="text-headline-sm text-white font-medium"
                  style={{ fontFamily: 'Anton, Impact, sans-serif' }}
                >
                  Bramhall Organic Orchard
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-label-sm text-label-sm text-secondary-fixed">
                  Est. Shelf Life
                </span>
                <span className="text-title-md text-white font-semibold tabular-nums">
                  18h remaining
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Link
            to="/inventory"
            className="relative w-full h-12 px-4 rounded-lg bg-primary text-on-primary font-title-md text-title-md font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-secondary active:scale-[0.98] transition-all overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Heart className="w-5 h-5" />
            <span>Donate Surplus Food</span>
          </Link>
          <Link
            to="/matching"
            className="w-full h-12 px-4 rounded-lg bg-surface-container-highest text-primary font-title-md text-title-md font-semibold flex items-center justify-center gap-2 hover:bg-surface-variant active:scale-[0.98] transition-all"
          >
            <Search className="w-5 h-5" />
            <span>Find Available Food</span>
          </Link>
        </div>
      </section>

      {/* ── Impact metrics ── */}
      <section className="rounded-xl bg-surface-container p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1">
          <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
            Platform Pulse · Verified Impact
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Demo data
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: 'Food Rescued',
              value: '14,820',
              unit: 'kg',
              sub: '↑ 12.4% vs last week',
              icon: Scale,
              iconColor: 'text-secondary',
            },
            {
              label: 'Meals Served',
              value: '32,450',
              unit: '',
              sub: '85 hubs mobilized',
              icon: UtensilsCrossed,
              iconColor: 'text-primary',
            },
            {
              label: 'Partner NGOs',
              value: '184',
              unit: '',
              sub: '99% verified tier',
              icon: Users,
              iconColor: 'text-secondary',
            },
            {
              label: 'Rescue Rate',
              value: '99.4%',
              unit: '',
              sub: 'Near-zero spoilage',
              icon: CheckCircle2,
              iconColor: 'text-tertiary-fixed-dim',
            },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-lg bg-surface-container-lowest p-3 flex flex-col shadow-sm"
            >
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-sm text-label-sm">{m.label}</span>
                <m.icon className={cn('w-[18px] h-[18px]', m.iconColor)} />
              </div>
              <span className="text-headline-md text-primary mt-1 font-bold tabular-nums">
                {m.value}{' '}
                {m.unit && (
                  <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">
                    {m.unit}
                  </span>
                )}
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-medium mt-0.5">
                {m.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Live Urgency Radar ── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse" />
            <h2
              className="text-headline-sm text-primary"
              style={{ fontFamily: 'Anton, Impact, sans-serif' }}
            >
              Live Urgency Radar
            </h2>
          </div>
          <span className="font-label-sm text-label-sm uppercase font-bold text-error tracking-wider px-2 py-0.5 rounded-full bg-error-container text-on-error-container">
            Critical &lt; 24h
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
          {URGENCY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-72 rounded-xl bg-surface-container-low shadow-md overflow-hidden flex flex-col"
            >
              <div className="relative h-36 w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={cn(
                    'absolute top-2 left-2 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-sm',
                    item.status === 'critical'
                      ? 'bg-error text-on-error'
                      : 'bg-tertiary-container text-on-tertiary'
                  )}
                >
                  <Timer className="w-3 h-3" />
                  <span>{item.timeLeft}</span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold">
                  {item.distance}
                </div>
              </div>
              <div className="p-3 flex flex-col gap-1.5 flex-1">
                <div className="flex justify-between items-start">
                  <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">
                    {item.provider}
                  </span>
                  <span className="font-label-sm text-label-sm bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded">
                    {item.qty}
                  </span>
                </div>
                <h3 className="text-title-md text-primary font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                  {item.desc}
                </p>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>
                  <button
                    onClick={() => handleClaim(item)}
                    disabled={claimed.includes(item.id)}
                    className={cn(
                      'h-8 px-3 rounded font-label-md text-label-md font-semibold flex items-center gap-1 transition-colors',
                      claimed.includes(item.id)
                        ? 'bg-surface-variant text-on-surface-variant cursor-default'
                        : 'bg-secondary text-on-secondary hover:bg-primary'
                    )}
                  >
                    <span>{claimed.includes(item.id) ? 'Reserved' : 'Claim'}</span>
                    {!claimed.includes(item.id) && (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role switcher ── */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Synchronized Ecosystem
          </span>
          <h2
            className="text-headline-sm text-primary"
            style={{ fontFamily: 'Anton, Impact, sans-serif' }}
          >
            Tailored Views for Every Stakeholder
          </h2>
        </div>

        <div
          className="flex p-1 rounded-full bg-surface-container overflow-x-auto gap-1"
          role="tablist"
          aria-label="Select stakeholder role"
        >
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeRole === tab.id}
              onClick={() => setActiveRole(tab.id)}
              className={cn(
                'flex-1 py-1.5 px-3 rounded-full text-center font-label-md text-label-md font-semibold transition-all whitespace-nowrap',
                activeRole === tab.id
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 p-4 rounded-xl bg-surface-container-low shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                  <RoleIcon className="w-[18px] h-[18px]" />
                </div>
                <div>
                  <h4 className="text-title-md text-primary font-bold">{role.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {role.sub}
                  </p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
                {role.badge}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-lowest flex items-center justify-between shadow-sm">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {role.metricLabel}
                </span>
                <span className="text-title-lg text-primary font-semibold tabular-nums">
                  {role.metric}
                </span>
              </div>
              <button className="h-8 px-3 rounded bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1 hover:bg-secondary transition-colors">
                <Plus className="w-4 h-4" />
                <span>{role.action}</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm pt-1">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>{role.note}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Community story ── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2
            className="text-headline-sm text-primary"
            style={{ fontFamily: 'Anton, Impact, sans-serif' }}
          >
            Harvest Dispatch Highlights
          </h2>
          <Link
            to="/matching"
            className="font-label-md text-label-md text-secondary font-semibold flex items-center gap-0.5 hover:underline"
          >
            <span>View Gazette</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-xl overflow-hidden bg-surface-container-low shadow-sm flex flex-col">
          <div className="relative h-44 w-full">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"
              alt="Volunteers packing rescued food into bags"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
                Dispatch Report · 08:30 AM
              </span>
              <h3 className="text-title-lg font-bold leading-snug">
                The Morning Bread Run: 120 Loaves Saved in St. Jude's
              </h3>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <p className="font-body-md text-body-md text-on-surface-variant">
              "Before FoodBridge, unsold artisanal boules were discarded at closing.
              Today, seventy families enjoyed warm, wholesome crusts before midday."
            </p>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-label-md text-label-md font-bold">
                  MA
                </div>
                <span className="font-body-sm text-body-sm text-primary font-medium">
                  Marcie Alverez · Field Coordinator
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Verified Safe Handover
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture badge ── */}
      {/* ── Claim toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 flex items-center justify-between p-3.5 rounded-xl bg-primary text-on-primary shadow-2xl"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-title-md font-bold truncate">Parcel Reserved!</span>
                <span className="font-body-sm text-body-sm text-surface-variant truncate">
                  {toast}
                </span>
              </div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex-shrink-0 hover:bg-secondary-fixed-dim"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
