import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Package, Timer, Clock, CheckCircle2, Route, Zap,
  QrCode, Edit3, Wifi, X, ShieldCheck, TrendingUp, Scale, Plus,
} from 'lucide-react'
import { SkeletonCard } from '../components/ui/Skeleton'
import useAppStore from '../store/useAppStore'

/* ── Design tokens ── */
const C = {
  primary: '#dfff00', primaryContainer: '#0e5c35',
  secondary: '#2bff88', secondaryContainer: '#2bff88',
  secondaryFixed: '#6ffbbe', onSecondaryFixed: '#002113',
  surface: '#0a0a0a', surfaceLowest: '#141614',
  surfaceContainerLow: '#1b1e1b', surfaceContainer: '#232723',
  surfaceContainerHigh: '#2e322e', surfaceContainerHighest: '#343834',
  onSurface: '#ffffff', onSurfaceVariant: '#9aa39b',
  error: '#ff4d4d', errorContainer: '#3a1414', onErrorContainer: '#ff9d9d',
  tertiaryFixed: '#3a3000', tertiaryContainer: '#ffd54d', onTertiaryFixed: '#ffd54d',
}

interface BatchItem {
  id: string; name: string; lot: string; status: 'critical' | 'expiring' | 'fresh'
  storage: string; storageTemp: string; remainingHours: number; remainingLabel: string
  quantity: string; logged: string; expiry: string; progress: number
}

const BATCHES: BatchItem[] = [
  { id: 'b1', name: 'Artisan Whole Wheat Sourdough', lot: 'Lot #BK-884 • Woodfired Stone Bakery', status: 'critical', storage: 'Ambient', storageTemp: '21°C', remainingHours: 6.7, remainingLabel: '06h 42m Remaining', quantity: '45 kg / 60 kg Available', logged: 'Yesterday 06:00', expiry: 'Strict Expiry: 19:30 Today', progress: 88 },
  { id: 'b2', name: 'Valencia Oranges & Crisp Apples', lot: 'Lot #FR-202 • High Sierra Orchard Coop', status: 'expiring', storage: 'Chilled', storageTemp: '4°C', remainingHours: 28.25, remainingLabel: '28h 15m Remaining', quantity: '120 kg Available', logged: '2 days ago', expiry: 'Est. Window: Tomorrow 18:00', progress: 52 },
  { id: 'b3', name: 'Vegetable Curry & Steamed Rice', lot: 'Kitchen Batch #KT-901 • 35 Portions', status: 'fresh', storage: 'Insulated Chilled', storageTemp: '', remainingHours: 54, remainingLabel: '54h Remaining', quantity: '35 Meals Sealed', logged: 'Today 11:30', expiry: 'Optimum Pickup Window Open', progress: 18 },
]

const STATUS_META = {
  critical: { topBar: C.error, badgeBg: C.errorContainer, badgeColor: C.onErrorContainer, label: 'CRITICAL RESCUE', dotColor: C.error, animate: true, timerColor: C.error, TimerIcon: Timer },
  expiring: { topBar: '#ffd54d', badgeBg: C.tertiaryFixed, badgeColor: C.tertiaryContainer, label: 'EXPIRING SOON', dotColor: '#ffd54d', animate: false, timerColor: '#ffd54d', TimerIcon: Clock },
  fresh:    { topBar: C.secondary, badgeBg: C.surfaceContainer, badgeColor: C.secondary, label: 'FRESH / STABLE', dotColor: C.secondary, animate: false, timerColor: C.secondary, TimerIcon: CheckCircle2 },
}
const PROGRESS_COLOR = { critical: C.error, expiring: '#ffd54d', fresh: C.secondary }

const FILTER_LABELS = [
  { id: 'all', label: 'All (8)' }, { id: 'fresh', label: 'Fresh >48h (3)' },
  { id: 'expiring', label: 'Expiring Soon 24–48h (2)' }, { id: 'critical', label: 'Critical <24h (3)' },
  { id: 'allocated', label: 'Allocated (4)' },
]

const fetchStats = async () => {
  await new Promise(r => setTimeout(r, 500))
  return { donations: 182, available: 340, critical: 3, redirections: 148, diverted: 98.2 }
}

/* ── BatchCard ── */
function BatchCard({ batch, index }: { batch: BatchItem; index: number }) {
  const meta = STATUS_META[batch.status]
  const TimerIcon = meta.TimerIcon
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      className="relative overflow-hidden rounded-xl shadow-sm flex flex-col gap-3 p-4"
      style={{ background: C.surfaceLowest }}
    >
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: meta.topBar }} />
      <div className="flex items-start gap-3 pt-1">
        <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.surfaceContainer }}>
          <Package className="w-8 h-8" style={{ color: C.primary }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: meta.badgeBg, color: meta.badgeColor, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.06em' }}>
              <span className={`w-1.5 h-1.5 rounded-full ${meta.animate ? 'animate-pulse' : ''}`} style={{ background: meta.dotColor }} />
              {meta.label}
            </span>
            <span className="text-[10px]" style={{ color: C.onSurfaceVariant, fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              {batch.storage === 'Chilled' ? '❄ ' : batch.storage === 'Insulated Chilled' ? '🧊 ' : '🌡 '}
              {batch.storage}{batch.storageTemp ? ` (${batch.storageTemp})` : ''}
            </span>
          </div>
          <h3 className="font-semibold text-sm leading-tight truncate" style={{ color: C.onSurface, fontFamily: 'Rubik, sans-serif' }}>{batch.name}</h3>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: C.onSurfaceVariant, fontFamily: 'Rubik, sans-serif' }}>{batch.lot}</p>
        </div>
      </div>

      <div className="rounded-lg p-3 flex flex-col gap-1.5" style={{ background: C.surfaceContainerLow }}>
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1" style={{ color: meta.timerColor, fontFamily: 'Rubik, sans-serif' }}>
            <TimerIcon className="w-3.5 h-3.5" /> {batch.remainingLabel}
          </span>
          <span style={{ color: C.onSurfaceVariant, fontFamily: 'Rubik, sans-serif', fontWeight: 400 }}>{batch.quantity}</span>
        </div>
        <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: C.surfaceContainerHighest }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${batch.progress}%` }} transition={{ duration: 0.8, delay: 0.2 + index * 0.07 }}
            className="h-full rounded-full" style={{ background: PROGRESS_COLOR[batch.status] }}
          />
        </div>
        <div className="flex justify-between text-[10px]" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', color: C.onSurfaceVariant }}>
          <span>Logged: {batch.logged}</span>
          <span style={{ color: batch.status === 'critical' ? C.error : 'inherit', fontWeight: batch.status === 'critical' ? 700 : 400 }}>{batch.expiry}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {batch.status === 'critical' && (<>
          <button className="flex-1 py-2 rounded-lg text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95" style={{ background: C.primaryContainer, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
            <Route className="w-3.5 h-3.5" /> View Allocations
          </button>
          <button className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95" style={{ background: C.tertiaryFixed, color: C.tertiaryContainer, fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            <Zap className="w-3.5 h-3.5" /> Re-prioritize
          </button>
        </>)}
        {batch.status === 'expiring' && (
          <button className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95" style={{ background: C.secondaryContainer, color: C.onSecondaryFixed, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
            <Wifi className="w-3.5 h-3.5" /> Smart Match NGOs (5 Nearby)
          </button>
        )}
        {batch.status === 'fresh' && (<>
          <button className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95" style={{ background: C.surfaceContainer, color: C.primary, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
            <QrCode className="w-3.5 h-3.5" /> Batch QR Label
          </button>
          <button className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95" style={{ background: C.surfaceContainerHigh, color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
            <Edit3 className="w-3.5 h-3.5" /> Modify Details
          </button>
        </>)}
      </div>
    </motion.div>
  )
}

/* ── NewBatchModal ── */
function NewBatchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedExpiry, setSelectedExpiry] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setSubmitted(true)
    setTimeout(() => { setSubmitted(false); onClose() }, 2000)
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(38,51,42,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-lg rounded-t-2xl p-6 flex flex-col gap-4 shadow-xl max-h-[85vh] overflow-y-auto"
            style={{ background: C.surfaceLowest }}
          >
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${C.surfaceContainer}` }}>
              <div>
                <p style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Fast Intake Form</p>
                <h2 style={{ fontFamily: 'Rubik, sans-serif', fontSize: 18, fontWeight: 600, color: C.onSurface }}>Publish Surplus Donation</h2>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: C.surfaceContainer, color: C.onSurfaceVariant }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif' }}>Item Title / Description</label>
                <input type="text" required placeholder="e.g. Heirloom Sourdough Loaves"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
                  style={{ background: C.surfaceContainerLow, color: C.onSurface, border: `1px solid ${C.surfaceContainerHigh}`, fontFamily: 'Rubik, sans-serif' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif' }}>Quantity (kg or portions)</label>
                  <input type="number" required placeholder="50"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: C.surfaceContainerLow, color: C.onSurface, border: `1px solid ${C.surfaceContainerHigh}`, fontFamily: 'Rubik, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif' }}>Storage Condition</label>
                  <select className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: C.surfaceContainerLow, color: C.onSurface, border: `1px solid ${C.surfaceContainerHigh}`, fontFamily: 'Rubik, sans-serif' }}>
                    <option>Ambient (Room Temp)</option><option>Chilled (2°C – 5°C)</option><option>Frozen (−18°C)</option><option>Warm Heated</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif' }}>Expiry / Best-By Window</label>
                <div className="grid grid-cols-3 gap-2">
                  {['12 Hours', '24 Hours', '48+ Hours'].map((label, i) => (
                    <button key={label} type="button" onClick={() => setSelectedExpiry(i)}
                      className="py-2 rounded-lg text-xs font-semibold text-center transition-all"
                      style={{ background: selectedExpiry === i ? C.primaryContainer : C.surfaceContainer, color: selectedExpiry === i ? 'white' : C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}
                    >{label}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input type="checkbox" id="directDispatch" defaultChecked className="w-4 h-4 rounded" style={{ accentColor: C.primary }} />
                <label htmlFor="directDispatch" style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>
                  Notify nearby food pantries with instant GPS dispatch alert
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{ background: C.surfaceContainer, color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all"
                  style={{ background: C.primaryContainer, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
                  {submitted ? <><CheckCircle2 className="w-4 h-4" /> Published!</> : <><Package className="w-4 h-4" /> Broadcast Batch</>}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Toast ── */
function Toast({ msg, onDismiss }: { msg: string; onDismiss: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-4 right-4 z-50 p-3.5 rounded-xl shadow-2xl flex items-center justify-between gap-3 max-w-lg mx-auto"
      style={{ background: C.primary, color: '#0a0a0a' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.secondaryContainer }}>
          <CheckCircle2 className="w-4 h-4" style={{ color: C.onSecondaryFixed }} />
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-bold truncate" style={{ fontFamily: 'Rubik, sans-serif' }}>Action Completed</span>
          <span className="block text-xs truncate" style={{ color: '#0a0a0a', fontFamily: 'Rubik, sans-serif' }}>{msg}</span>
        </div>
      </div>
      <button onClick={onDismiss} className="px-2.5 py-1 rounded text-[10px] font-bold flex-shrink-0"
        style={{ background: C.secondaryFixed, color: C.onSecondaryFixed, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
        Dismiss
      </button>
    </motion.div>
  )
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  const { user } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['dashStats'], queryFn: fetchStats })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000) }

  const filteredBatches = BATCHES.filter(b =>
    activeFilter === 'all' || activeFilter === 'allocated' || b.status === activeFilter
  )

  return (
    <div className="space-y-5 pt-4 pb-8 animate-fade-in">

      {/* Hero banner */}
      <div className="relative rounded-xl overflow-hidden shadow-sm" style={{ background: C.surfaceContainerHigh }}>
        <div className="relative h-44 w-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #232723 0%, #2e322e 100%)' }}>
          <img src="/stickers/01_brand_and_donation/donate_food.png" alt="" className="h-32 w-auto object-contain opacity-80" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,56,32,0.92) 0%, rgba(0,56,32,0.5) 50%, transparent 100%)' }} />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: 'rgba(111,251,190,0.9)', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: '#002113', letterSpacing: '0.06em' }}>
                <ShieldCheck className="w-3 h-3" /> Verified Steward #FB-4091
              </span>
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.25)', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 600, color: '#0a0a0a', letterSpacing: '0.04em' }}>
                Row-Lock Safe
              </span>
            </div>
            <h1 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 28, lineHeight: '34px', letterSpacing: '-0.01em', color: '#0a0a0a' }}>
              {user?.organization || 'Green Leaf Bakery & Supermarket'}
            </h1>
            <p className="flex items-center gap-1 mt-0.5" style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: '#343834' }}>
              Central Hub · Direct Surplus Redistribution Terminal
            </p>
          </div>
        </div>

        {/* Donation Terminal bar */}
        <div className="flex items-center justify-between p-3" style={{ background: C.surfaceLowest }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.surfaceContainerHigh }}>
              <Package className="w-5 h-5" style={{ color: C.primary }} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: C.onSurface, fontFamily: 'Rubik, sans-serif' }}>Donation Terminal</p>
              <p className="text-xs truncate" style={{ color: C.onSurfaceVariant, fontFamily: 'Rubik, sans-serif' }}>Publish batch to local NGO network</p>
            </div>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95"
            style={{ background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
            <Plus className="w-4 h-4" /> New Batch
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statsLoading ? (
          [0,1,2,3].map(i => <SkeletonCard key={i} />)
        ) : (
          <>
            {[
              { label: 'Donations', value: stats?.donations ?? 182, sub: '+14 this week', icon: <TrendingUp className="w-5 h-5" style={{ color: C.primary }} />, bg: C.surfaceLowest },
              { label: 'Available Food', value: `${stats?.available ?? 340} kg`, sub: '8 batches active', icon: <Scale className="w-5 h-5" style={{ color: C.secondary }} />, bg: C.surfaceLowest },
              { label: 'Expiring <24h', value: stats?.critical ?? 3, sub: 'batches at risk', icon: <Timer className="w-5 h-5" style={{ color: C.error }} />, bg: C.tertiaryFixed },
              { label: 'Redirections', value: stats?.redirections ?? 148, sub: `${stats?.diverted ?? 98.2}% diverted`, icon: <CheckCircle2 className="w-5 h-5" style={{ color: C.primary }} />, bg: C.surfaceLowest },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4 shadow-sm flex flex-col justify-between" style={{ background: s.bg }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.onSurfaceVariant, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</span>
                  {s.icon}
                </div>
                <div className="mt-3">
                  <span style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 26, lineHeight: '32px', color: C.onSurface }}>{s.value}</span>
                  <p className="flex items-center gap-0.5 mt-0.5" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 600, color: i === 2 ? C.error : C.secondary, letterSpacing: '0.04em' }}>
                    {i === 0 && <TrendingUp className="w-3 h-3" />} {i === 3 && '🌱 '}{s.sub}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Incoming NGO request */}
      <div className="rounded-xl p-4 shadow-sm" style={{ background: C.surfaceContainerHigh }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ background: '#4edea3' }} />
            <span style={{ fontFamily: 'Rubik, sans-serif', fontSize: 15, fontWeight: 600, color: C.onSurface }}>Incoming Requests</span>
            <span className="rounded-full px-1.5 text-[10px] font-bold" style={{ background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif' }}>1 New</span>
          </div>
          <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: '0.04em' }}>Auto-Routed</span>
        </div>
        <div className="rounded-lg p-3 shadow-sm flex flex-col gap-3" style={{ background: C.surfaceLowest }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.surfaceContainerLow }}>
                <img src="/stickers/01_brand_and_donation/ngo.png" alt="" className="w-8 h-8 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-semibold text-sm truncate" style={{ color: C.onSurface, fontFamily: 'Rubik, sans-serif' }}>Hope Community Kitchen</p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: C.secondaryFixed, color: C.onSecondaryFixed, fontFamily: 'Be Vietnam Pro, sans-serif' }}>94% Match</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: C.onSurfaceVariant, fontFamily: 'Rubik, sans-serif' }}>
                  Requesting <strong style={{ color: C.onSurface }}>20 kg</strong> of Sourdough · Van dispatched
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0" style={{ background: 'rgba(247,190,29,0.4)', color: '#ffd54d', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>Pending</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => showToast('Hope Community Kitchen approved for 20 kg pickup')}
              className="py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
              style={{ background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
              <CheckCircle2 className="w-4 h-4" /> Approve (20 kg)
            </button>
            <button onClick={() => showToast('Request declined')}
              className="py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
              style={{ background: C.surfaceContainer, color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
              <X className="w-4 h-4" /> Decline
            </button>
          </div>
        </div>
      </div>

      {/* Expiry Monitoring Station */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 20, color: C.onSurface }}>Expiry Monitoring Station</h2>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>Live thermodynamic shelf-life tracker</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: C.surfaceContainer }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.secondary }} />
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 600, color: C.onSurfaceVariant }}>Live Sync</span>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
          {FILTER_LABELS.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
              style={activeFilter === f.id
                ? { background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }
                : { background: C.surfaceContainerHigh, color: C.onSurfaceVariant, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }
              }>
              {f.label}
            </button>
          ))}
        </div>

        {/* Batch cards */}
        <div className="space-y-3">
          {filteredBatches.map((batch, i) => <BatchCard key={batch.id} batch={batch} index={i} />)}
        </div>
      </div>

      {/* Data integrity footer */}
      <div className="rounded-xl p-4 flex items-center gap-3 shadow-sm" style={{ background: C.surfaceContainerLow }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.primaryContainer }}>
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 600, color: C.primary }}>Data Integrity Verified</p>
          <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>All batches are row-locked with cryptographic proof of dispatch. Last audit: 2 min ago.</p>
        </div>
      </div>

      <NewBatchModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <AnimatePresence>{toast && <Toast msg={toast} onDismiss={() => setToast(null)} />}</AnimatePresence>
    </div>
  )
}
