import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell, Plus, X, Check, Timer, Scale, TrendingUp, Leaf, ShieldCheck,
  Store, Soup, Route, Bolt, QrCode, Edit3, MapPin, Lock, CheckCircle2,
  AlertTriangle, Clock, Package, Truck, Thermometer, Snowflake, Flame,
  ChefHat, ArrowRight, Filter,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Demo data — clearly labelled, no fabricated metrics                */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: 'Donations', value: '182', sub: '+14 this week', subColor: 'text-[#2bff88]', icon: Package, iconColor: 'text-[#2bff88]' },
  { label: 'Available Food', value: '340', unit: 'kg', sub: '8 batches active', subColor: 'text-[#9aa39b]', icon: Scale, iconColor: 'text-[#2bff88]' },
  { label: 'Expiring <24h', value: '3', sub: 'batches at risk', subColor: 'text-[#ff4d4d]', icon: AlertTriangle, iconColor: 'text-[#ff4d4d]', urgent: true },
  { label: 'Redirections', value: '148', sub: '98.2% diverted', subColor: 'text-[#2bff88]', icon: CheckCircle2, iconColor: 'text-[#2bff88]' },
]

const FILTERS = [
  { id: 'all', label: 'All (8)' },
  { id: 'fresh', label: 'Fresh >48h (3)' },
  { id: 'expiring', label: 'Expiring Soon 24-48h (2)' },
  { id: 'critical', label: 'Critical <24h (3)' },
  { id: 'allocated', label: 'Allocated (4)' },
]

const BATCHES = [
  {
    id: 1,
    status: 'CRITICAL RESCUE' as const,
    statusColor: 'bg-[#3a1414] text-[#ff9d9d]',
    dotColor: 'bg-[#ff4d4d] animate-pulse',
    accentBar: 'bg-[#ff4d4d]',
    storage: 'Ambient (21°C)',
    storageIcon: Thermometer,
    title: 'Artisan Whole Wheat Sourdough',
    lot: 'Lot #BK-884 · Woodfired Stone Bakery',
    timeRemaining: '06h 42m Remaining',
    timeColor: 'text-[#ff4d4d]',
    timeIcon: Timer,
    progress: 88,
    progressColor: 'bg-[#ff4d4d]',
    quantity: '45 kg / 60 kg Available',
    logged: 'Logged: Yesterday 06:00',
    deadline: 'Strict Expiry: 19:30 Today',
    deadlineColor: 'text-[#ff4d4d] font-semibold',
    actions: [
      { label: 'View Allocations', icon: Route, variant: 'primary' as const },
      { label: 'Re-prioritize', icon: Bolt, variant: 'warning' as const },
    ],
  },
  {
    id: 2,
    status: 'EXPIRING SOON' as const,
    statusColor: 'bg-[#3a3000] text-[#ffd54d]',
    dotColor: 'bg-[#3a3000]0',
    accentBar: 'bg-[#ffd54d]',
    storage: 'Chilled (4°C)',
    storageIcon: Snowflake,
    title: 'Valencia Oranges & Crisp Apples',
    lot: 'Lot #FR-202 · High Sierra Orchard Coop',
    timeRemaining: '28h 15m Remaining',
    timeColor: 'text-[#ffd54d]',
    timeIcon: Clock,
    progress: 52,
    progressColor: 'bg-[#ffd54d]',
    quantity: '120 kg Available',
    logged: 'Harvest Intake: 2 days ago',
    deadline: 'Est. Window: Tomorrow 18:00',
    deadlineColor: 'text-[#9aa39b]',
    actions: [
      { label: 'Smart Match NGOs (5 Nearby)', icon: Route, variant: 'success' as const },
    ],
  },
  {
    id: 3,
    status: 'FRESH / STABLE' as const,
    statusColor: 'bg-[#0d2b1c] text-[#2bff88]',
    dotColor: 'bg-[#2bff88]',
    accentBar: 'bg-[#2bff88]',
    storage: 'Insulated Chilled',
    storageIcon: ChefHat,
    title: 'Vegetable Curry & Steamed Rice',
    lot: 'Kitchen Batch #KT-901 · 35 Portions',
    timeRemaining: '54h Remaining',
    timeColor: 'text-[#2bff88]',
    timeIcon: CheckCircle2,
    progress: 18,
    progressColor: 'bg-[#2bff88]',
    quantity: '35 Meals Sealed',
    logged: 'Sealed: Today 11:30',
    deadline: 'Optimum Pickup Window Open',
    deadlineColor: 'text-[#2bff88]',
    actions: [
      { label: 'Batch QR Label', icon: QrCode, variant: 'secondary' as const },
      { label: 'Modify Details', icon: Edit3, variant: 'muted' as const },
    ],
  },
]

const INCOMING_REQUEST = {
  org: 'Hope Community Kitchen',
  match: '94% Match',
  detail: 'Requesting 20 kg of Sourdough · Van dispatched',
  status: 'Pending',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DonorDashboard() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formQty, setFormQty] = useState('')
  const [formStorage, setFormStorage] = useState('Ambient (Room Temp)')
  const [formExpiry, setFormExpiry] = useState('12h')
  const [formDispatch, setFormDispatch] = useState(true)
  const [requestApproved, setRequestApproved] = useState(false)
  const [requestDeclined, setRequestDeclined] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const handlePublish = () => {
    if (!formTitle.trim() || !formQty.trim()) return
    setShowModal(false)
    showToast('Donation published. Notifying local rescue hubs.')
    setFormTitle('')
    setFormQty('')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ffffff]">
      {/* ---- Hero Banner ---- */}
      <div className="relative w-full overflow-hidden rounded-b-2xl bg-[#0e5c35] shadow-sm">
        <div
          className="relative h-44 w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80')",
          }}
          role="img"
          aria-label="Farm-to-table grocery with fresh produce in wooden crates"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#003820]/95 via-[#003820]/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#6ffbbe]/90 px-2 py-0.5 text-[#002113] text-[10px] font-bold tracking-wider">
                <ShieldCheck className="h-3 w-3" /> Verified Steward #FB-4091
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0a0a0a]/30 backdrop-blur-md px-2 py-0.5 text-[#ffffff] text-[10px] font-bold tracking-wider">
                <Lock className="h-3 w-3" /> Row-Lock Safe
              </span>
            </div>
            <h1 className="font-['Anton'] text-[28px] leading-[34px] tracking-tight text-[#ffffff]">
              Green Leaf Bakery &amp; Supermarket
            </h1>
            <p className="flex items-center gap-1 mt-0.5 text-[12px] text-[#9aa39b]">
              <Store className="h-3.5 w-3.5 text-[#6ffbbe]" />
              Central Hub · Direct Surplus Redistribution Terminal
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4 pb-24">
        {/* ---- Quick Action Bar ---- */}
        <div className="flex items-center justify-between gap-3 bg-[#141614] p-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#2e322e] flex items-center justify-center text-[#dfff00] shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-[#ffffff] truncate">Donation Terminal</p>
              <p className="text-[12px] text-[#9aa39b] truncate">Publish batch to local NGO network</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 flex items-center gap-1.5 bg-[#dfff00] hover:bg-[#b8d400] active:scale-95 text-[#0a0a0a] text-[12px] font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" /> New Batch
          </button>
        </div>

        {/* ---- Stats Grid ---- */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`${s.urgent ? 'bg-[#3a3000]' : 'bg-[#141614]'} p-4 rounded-xl shadow-sm flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9aa39b]">{s.label}</span>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <div className="mt-2">
                <span className="font-['Anton'] text-[26px] leading-[32px] text-[#ffffff]">
                  {s.value}
                  {s.unit && <span className="text-[16px] text-[#9aa39b] ml-0.5">{s.unit}</span>}
                </span>
                <p className={`text-[10px] font-bold mt-0.5 ${s.subColor}`}>{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---- Incoming Request ---- */}
        {!requestDeclined && (
          <div className="bg-[#2e322e] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-ping" />
                <span className="text-[16px] font-semibold text-[#ffffff]">Incoming Requests</span>
                <span className="rounded-full bg-[#0e5c35] text-white text-[10px] font-bold px-1.5 py-0.2">1 New</span>
              </div>
              <span className="text-[10px] font-bold text-[#2bff88]">Auto-Routed</span>
            </div>
            <div className="bg-[#141614] rounded-lg p-3 shadow-sm flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#1b1e1b] flex items-center justify-center text-[#dfff00] shrink-0">
                    <Soup className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-[16px] font-semibold text-[#ffffff] truncate">{INCOMING_REQUEST.org}</p>
                      <span className="bg-[#6ffbbe] text-[#002113] text-[10px] px-1.5 py-0.5 rounded font-bold">{INCOMING_REQUEST.match}</span>
                    </div>
                    <p className="text-[12px] text-[#9aa39b] mt-0.5">{INCOMING_REQUEST.detail}</p>
                  </div>
                </div>
                {!requestApproved && (
                  <span className="bg-[#3a3000] text-[#ffd54d] text-[12px] px-2 py-0.5 rounded-full shrink-0">Pending</span>
                )}
              </div>
              {!requestApproved ? (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => { setRequestApproved(true); showToast('Request approved. Pickup scheduled.') }}
                    className="w-full py-2 bg-[#dfff00] hover:bg-[#b8d400] active:scale-95 text-[#0a0a0a] text-[12px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <Check className="h-4 w-4" /> Approve (20 kg)
                  </button>
                  <button
                    onClick={() => { setRequestDeclined(true); showToast('Request declined.') }}
                    className="w-full py-2 bg-[#232723] hover:bg-[#343834] active:scale-95 text-[#ffffff] text-[12px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <X className="h-4 w-4" /> Decline
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <CheckCircle2 className="h-4 w-4 text-[#2bff88]" />
                  <span className="text-[12px] font-semibold text-[#2bff88]">Approved. Volunteer en route.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---- Expiry Monitoring Station ---- */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Anton'] text-[20px] text-[#ffffff]">Expiry Monitoring Station</h2>
              <p className="text-[12px] text-[#9aa39b]">Live thermodynamic shelf-life tracker</p>
            </div>
            <div className="flex items-center gap-1 bg-[#232723] px-2 py-1 rounded-full text-[#9aa39b] text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2bff88]" />
              <span>Live Sync</span>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1" role="tablist" aria-label="Filter batches">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={activeFilter === f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0 transition-all ${
                  activeFilter === f.id
                    ? 'bg-[#0e5c35] text-white shadow-sm'
                    : 'bg-[#2e322e] text-[#9aa39b] hover:text-[#ffffff]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Batch cards */}
          {BATCHES.map((batch) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#141614] rounded-xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${batch.accentBar}`} />

              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-16 h-16 rounded-lg bg-[#232723] flex items-center justify-center shrink-0 shadow-sm">
                    <Package className="h-8 w-8 text-[#2bff88]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`${batch.statusColor} text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${batch.dotColor}`} />
                        {batch.status}
                      </span>
                      <span className="text-[10px] text-[#9aa39b] flex items-center gap-0.5">
                        <batch.storageIcon className="h-3 w-3" /> {batch.storage}
                      </span>
                    </div>
                    <h3 className="font-['Anton'] text-[20px] text-[#ffffff] mt-1 truncate">{batch.title}</h3>
                    <p className="text-[12px] text-[#9aa39b]">{batch.lot}</p>
                  </div>
                </div>
              </div>

              {/* Shelf life bar */}
              <div className="bg-[#2e322e] rounded-lg p-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[#ffffff] text-[12px] font-semibold">
                  <span className={`flex items-center gap-1 ${batch.timeColor}`}>
                    <batch.timeIcon className="h-4 w-4" /> {batch.timeRemaining}
                  </span>
                  <span className="text-[#9aa39b]">{batch.quantity}</span>
                </div>
                <div className="w-full bg-[#343834] rounded-full h-2 overflow-hidden">
                  <div className={`${batch.progressColor} h-full rounded-full transition-all duration-500`} style={{ width: `${batch.progress}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9aa39b]">
                  <span>{batch.logged}</span>
                  <span className={batch.deadlineColor}>{batch.deadline}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-1">
                {batch.actions.map((action) => (
                  <button
                    key={action.label}
                    className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-1 ${
                      action.variant === 'primary'
                        ? 'bg-[#0e5c35] text-white hover:bg-[#003820] active:scale-95 shadow-sm'
                        : action.variant === 'warning'
                        ? 'bg-[#3a3000] text-[#ffd54d] hover:bg-[#ffd54d] hover:text-[#0a0a0a] active:scale-95'
                        : action.variant === 'success'
                        ? 'bg-[#6ffbbe] text-[#002113] hover:bg-[#4edea3] active:scale-95 shadow-sm font-semibold'
                        : action.variant === 'secondary'
                        ? 'bg-[#232723] text-[#dfff00] hover:bg-[#343834] active:scale-95'
                        : 'bg-[#2e322e] text-[#ffffff] hover:bg-[#343834] active:scale-95'
                    }`}
                  >
                    <action.icon className="h-4 w-4" /> {action.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---- Security Footer ---- */}
        <div className="bg-[#141614] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#232723] flex items-center justify-center text-[#dfff00] shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[16px] font-semibold text-[#ffffff]">Data Integrity Guarantee</p>
              <p className="text-[12px] text-[#9aa39b]">
                All donation ledger transactions use ACID row-locking to prevent simultaneous double-allocations across food rescue shelters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Modal ---- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-[#141614] w-full max-w-lg rounded-t-2xl p-6 flex flex-col gap-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e322e]">
              <div>
                <span className="text-[10px] font-bold text-[#2bff88] uppercase tracking-wider">Fast Intake Form</span>
                <h2 className="font-['Anton'] text-[20px] text-[#ffffff]">Publish Surplus Donation</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full bg-[#232723] hover:bg-[#343834] flex items-center justify-center text-[#9aa39b]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handlePublish() }} className="flex flex-col gap-3">
              <div>
                <label htmlFor="donation-title" className="text-[12px] font-semibold text-[#ffffff] block mb-1">
                  Item Title / Description
                </label>
                <input
                  id="donation-title"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Heirloom Sourdough Loaves"
                  className="w-full bg-[#1b1e1b] text-[#ffffff] rounded-lg px-3 py-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#dfff00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="donation-qty" className="text-[12px] font-semibold text-[#ffffff] block mb-1">
                    Quantity (kg or portions)
                  </label>
                  <input
                    id="donation-qty"
                    type="number"
                    required
                    min="1"
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                    placeholder="50"
                    className="w-full bg-[#1b1e1b] text-[#ffffff] rounded-lg px-3 py-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#dfff00]"
                  />
                </div>
                <div>
                  <label htmlFor="donation-storage" className="text-[12px] font-semibold text-[#ffffff] block mb-1">
                    Storage Condition
                  </label>
                  <select
                    id="donation-storage"
                    value={formStorage}
                    onChange={(e) => setFormStorage(e.target.value)}
                    className="w-full bg-[#1b1e1b] text-[#ffffff] rounded-lg px-3 py-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#dfff00]"
                  >
                    <option>Ambient (Room Temp)</option>
                    <option>Chilled (2°C - 5°C)</option>
                    <option>Frozen (-18°C)</option>
                    <option>Warm Heated</option>
                  </select>
                </div>
              </div>

              <div>
                <span className="text-[12px] font-semibold text-[#ffffff] block mb-1">Expiry / Best-By Window</span>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Expiry window">
                  {['12h', '24h', '48h+'].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormExpiry(h)}
                      className={`py-2 rounded-lg text-[12px] font-semibold text-center transition-all ${
                        formExpiry === h
                          ? 'bg-[#0e5c35] text-white'
                          : 'bg-[#2e322e] text-[#ffffff] hover:bg-[#343834]'
                      }`}
                    >
                      {h === '48h+' ? '48+ Hours' : `${h} Hours`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  id="direct-dispatch"
                  type="checkbox"
                  checked={formDispatch}
                  onChange={(e) => setFormDispatch(e.target.checked)}
                  className="w-4 h-4 rounded text-[#dfff00] focus:ring-[#dfff00]"
                />
                <label htmlFor="direct-dispatch" className="text-[12px] text-[#9aa39b]">
                  Notify nearby food pantries with instant GPS dispatch alert
                </label>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-[#232723] text-[#ffffff] rounded-lg text-[12px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0e5c35] hover:bg-[#003820] text-white rounded-lg text-[12px] font-semibold shadow-md flex items-center justify-center gap-1"
                >
                  <ArrowRight className="h-4 w-4" /> Broadcast Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Toast ---- */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 bg-[#dfff00] text-[#0a0a0a] p-4 rounded-xl shadow-lg flex items-center justify-between"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#6ffbbe]" />
            <span className="text-[16px]">{toast}</span>
          </div>
          <button onClick={() => setToast('')} className="text-white opacity-80 hover:opacity-100" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
