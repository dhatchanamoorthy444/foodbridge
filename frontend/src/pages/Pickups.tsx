import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Truck, Clock, MapPin, CheckCircle2, AlertCircle, Search, ChevronRight, QrCode, X } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const C = {
  primary: '#dfff00', primaryContainer: '#0e5c35',
  secondary: '#2bff88', secondaryContainer: '#2bff88',
  secondaryFixed: '#6ffbbe', onSecondaryFixed: '#002113',
  surface: '#0a0a0a', surfaceLowest: '#141614',
  surfaceContainerLow: '#1b1e1b', surfaceContainer: '#232723',
  surfaceContainerHigh: '#2e322e', surfaceContainerHighest: '#343834',
  onSurface: '#ffffff', onSurfaceVariant: '#9aa39b',
  error: '#ff4d4d', errorContainer: '#3a1414',
  tertiaryFixed: '#3a3000', tertiaryContainer: '#ffd54d',
}

interface Pickup {
  id: string; confirmationCode: string; status: 'scheduled' | 'confirmed' | 'in_transit' | 'completed' | 'cancelled'
  scheduledDate: string; scheduledTime: string; itemName: string; quantity: string
  donor: string; recipient: string; volunteer: string; address: string; otp?: string
  progress?: number
}

const PICKUPS: Pickup[] = [
  { id: 'p1', confirmationCode: 'ABC-123', status: 'in_transit', scheduledDate: '2026-11-01', scheduledTime: '09:00', itemName: 'Mixed Greens & Salad Kits', quantity: '25 kg', donor: 'Sun Valley Market', recipient: 'Hope Community Kitchen', volunteer: 'Marcus Vance', address: '42 Green Lane, Central Quarter', otp: '#7492', progress: 72 },
  { id: 'p2', confirmationCode: 'DEF-456', status: 'confirmed', scheduledDate: '2026-11-01', scheduledTime: '11:30', itemName: 'Artisan Sourdough Loaves', quantity: '18 kg', donor: "L'Etoile Boulangerie", recipient: 'St. Jude Community Centre', volunteer: 'Priya Sharma', address: '15 Harvest Rd, North District', progress: 0 },
  { id: 'p3', confirmationCode: 'GHI-789', status: 'scheduled', scheduledDate: '2026-11-02', scheduledTime: '08:00', itemName: 'Valencia Oranges & Apples', quantity: '40 kg', donor: 'High Sierra Orchard', recipient: 'Riverside Pantry Network', volunteer: 'Unassigned', address: '88 Orchard Way, East Hub', progress: 0 },
  { id: 'p4', confirmationCode: 'JKL-321', status: 'completed', scheduledDate: '2026-10-31', scheduledTime: '14:00', itemName: 'Vegetable Curry Portions', quantity: '35 meals', donor: 'Central Kitchen', recipient: 'Shelter Home East', volunteer: 'David Kim', address: '22 Shelter Ave, East Zone', progress: 100 },
]

const STATUS_CONFIG: Record<Pickup['status'], { bg: string; color: string; label: string; dot: string; pulse?: boolean }> = {
  scheduled:  { bg: C.surfaceContainerHigh, color: C.onSurfaceVariant, label: 'Scheduled',  dot: C.onSurfaceVariant },
  confirmed:  { bg: '#232723', color: C.secondary, label: 'Confirmed', dot: C.secondary },
  in_transit: { bg: C.secondaryContainer, color: C.onSecondaryFixed, label: 'In Transit', dot: C.secondary, pulse: true },
  completed:  { bg: '#343834', color: C.primaryContainer, label: 'Completed', dot: C.primary },
  cancelled:  { bg: C.errorContainer, color: C.error, label: 'Cancelled', dot: C.error },
}

const fetchPickups = async (): Promise<Pickup[]> => {
  await new Promise(r => setTimeout(r, 400))
  return PICKUPS
}

function PickupCard({ pickup, onOTPView }: { pickup: Pickup; onOTPView: (p: Pickup) => void }) {
  const s = STATUS_CONFIG[pickup.status]
  const isActive = pickup.status === 'in_transit'

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl shadow-sm overflow-hidden" style={{ background: C.surfaceLowest }}>
      {/* Top accent bar for in_transit */}
      {isActive && <div className="h-1" style={{ background: C.secondary }} />}

      <div className="p-4 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded font-bold text-[10px]"
                style={{ background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                #{pickup.confirmationCode}
              </span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: C.secondary }} />}
            </div>
            <h3 className="font-semibold text-sm leading-tight" style={{ color: C.onSurface, fontFamily: 'Rubik, sans-serif' }}>{pickup.itemName}</h3>
            <p className="text-xs mt-0.5" style={{ color: C.onSurfaceVariant, fontFamily: 'Rubik, sans-serif' }}>{pickup.donor} · {pickup.quantity}</p>
          </div>
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold flex-shrink-0"
            style={{ background: s.bg, color: s.color, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.pulse ? 'animate-pulse' : ''}`} style={{ background: s.dot }} />
            {s.label}
          </span>
        </div>

        {/* Progress bar for in_transit */}
        {isActive && pickup.progress !== undefined && (
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: C.surfaceContainerHigh }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pickup.progress}%` }} transition={{ duration: 0.8 }}
                className="h-full rounded-full" style={{ background: C.secondary }} />
            </div>
            <div className="flex justify-between text-[10px]" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', color: C.onSurfaceVariant }}>
              <span>En route from {pickup.donor}</span>
              <span className="font-bold" style={{ color: C.secondary }}>ETA ~15 min</span>
            </div>
          </div>
        )}

        {/* Details row */}
        <div className="flex flex-wrap gap-2 text-xs" style={{ color: C.onSurfaceVariant, fontFamily: 'Rubik, sans-serif' }}>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" style={{ color: C.secondary }} /> {pickup.scheduledDate} · {pickup.scheduledTime}</span>
          <span className="flex items-center gap-1"><Truck className="w-3 h-3" style={{ color: C.secondary }} /> {pickup.volunteer}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: C.secondary }} /> {pickup.recipient}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          {isActive && (
            <button onClick={() => onOTPView(pickup)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
              style={{ background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
              <QrCode className="w-3.5 h-3.5" /> View OTP Pass
            </button>
          )}
          {pickup.status === 'confirmed' && (
            <button className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
              style={{ background: C.surfaceContainer, color: C.primary, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Pickup
            </button>
          )}
          {pickup.status === 'scheduled' && (
            <button className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
              style={{ background: C.surfaceContainerHigh, color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
              <ChevronRight className="w-3.5 h-3.5" /> View Details
            </button>
          )}
          {pickup.status === 'completed' && (
            <div className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
              style={{ background: '#343834', color: C.onSurfaceVariant, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Handover Verified
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function OTPModal({ pickup, onClose }: { pickup: Pickup; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(38,51,42,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl"
        style={{ background: C.surfaceLowest }}>
        <div className="w-full flex items-center justify-between">
          <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Secure Handover OTP</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.surfaceContainer }}>
            <X className="w-4 h-4" style={{ color: C.onSurfaceVariant }} />
          </button>
        </div>
        <div className="w-24 h-24 rounded-2xl flex items-center justify-center" style={{ background: C.surfaceContainerLow }}>
          <QrCode className="w-14 h-14" style={{ color: C.primary }} />
        </div>
        <div className="text-center">
          <p style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.onSurfaceVariant, letterSpacing: '0.06em', textTransform: 'uppercase' }}>One-Time Passcode</p>
          <div style={{ fontFamily: 'Rubik, sans-serif', fontSize: 42, fontWeight: 700, letterSpacing: '0.12em', color: C.primary, fontVariantNumeric: 'tabular-nums' }}>
            {pickup.otp?.replace('#', '') ?? '7492'}
          </div>
        </div>
        <p className="text-center" style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onSurfaceVariant }}>
          Share this code with <strong style={{ color: C.onSurface }}>{pickup.volunteer}</strong> upon pickup confirmation at <strong style={{ color: C.onSurface }}>{pickup.recipient}</strong>.
        </p>
        <div className="w-full rounded-xl p-3 flex items-center gap-2" style={{ background: C.surfaceContainerLow }}>
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: C.secondary }} />
          <span style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>Valid for single use only · Expires after handover</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Pickups() {
  const { user } = useAppStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [otpPickup, setOtpPickup] = useState<Pickup | null>(null)

  const { data: pickups = [], isLoading } = useQuery({ queryKey: ['pickups'], queryFn: fetchPickups })

  const filtered = pickups.filter(p => {
    const matchSearch = p.itemName.toLowerCase().includes(search.toLowerCase()) ||
      p.donor.toLowerCase().includes(search.toLowerCase()) ||
      p.recipient.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeCount = pickups.filter(p => p.status === 'in_transit').length

  return (
    <div className="space-y-4 pt-4 pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Logistics Ledger</span>
          <h1 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 28, lineHeight: '34px', letterSpacing: '-0.01em', color: C.primary }}>Pickup Schedules</h1>
        </div>
        {activeCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(43,255,136,0.14)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.secondary }} />
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: '0.04em' }}>
              {activeCount} In Transit
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.onSurfaceVariant }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search pickups, donors, recipients..."
          className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none"
          style={{ background: C.surfaceLowest, border: `1px solid ${C.surfaceContainerHigh}`, color: C.onSurface, fontFamily: 'Rubik, sans-serif' }} />
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        {[
          { id: 'all', label: 'All' },
          { id: 'in_transit', label: 'In Transit' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'scheduled', label: 'Scheduled' },
          { id: 'completed', label: 'Completed' },
        ].map(f => (
          <button key={f.id} onClick={() => setStatusFilter(f.id)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
            style={statusFilter === f.id
              ? { background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }
              : { background: C.surfaceContainer, color: C.onSurfaceVariant, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }
            }>{f.label}</button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Scheduled', count: pickups.filter(p => p.status === 'scheduled').length, color: C.onSurfaceVariant },
          { label: 'Confirmed', count: pickups.filter(p => p.status === 'confirmed').length, color: C.secondary },
          { label: 'In Transit', count: pickups.filter(p => p.status === 'in_transit').length, color: C.primary },
          { label: 'Completed', count: pickups.filter(p => p.status === 'completed').length, color: C.primary },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: C.surfaceLowest }}>
            <div style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 22, color: s.color }}>{s.count}</div>
            <div style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 9, fontWeight: 700, color: C.onSurfaceVariant, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pickup cards */}
      <div className="space-y-3">
        <h2 style={{ fontFamily: 'Rubik, sans-serif', fontSize: 15, fontWeight: 600, color: C.onSurface }}>{filtered.length} pickups</h2>

        {isLoading ? (
          <div className="space-y-3">
            {[0,1,2].map(i => <div key={i} className="h-32 rounded-xl animate-pulse" style={{ background: C.surfaceContainer }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <img src="/stickers/03_foodbridge_process_and_environment/distribute.png" alt="" className="w-20 h-20 mx-auto object-contain opacity-60" />
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 15, color: C.onSurfaceVariant }}>No pickups found</p>
          </div>
        ) : (
          filtered.map(p => <PickupCard key={p.id} pickup={p} onOTPView={setOtpPickup} />)
        )}
      </div>

      <AnimatePresence>
        {otpPickup && <OTPModal pickup={otpPickup} onClose={() => setOtpPickup(null)} />}
      </AnimatePresence>
    </div>
  )
}
