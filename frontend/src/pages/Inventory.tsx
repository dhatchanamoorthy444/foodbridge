import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Package, Clock, CheckCircle2, AlertTriangle, X, Trash2, Edit3, Filter } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const C = {
  primary: '#dfff00', primaryContainer: '#0e5c35',
  secondary: '#2bff88', secondaryContainer: '#2bff88',
  secondaryFixed: '#6ffbbe', onSecondaryFixed: '#002113',
  surface: '#0a0a0a', surfaceLowest: '#141614',
  surfaceContainerLow: '#1b1e1b', surfaceContainer: '#232723',
  surfaceContainerHigh: '#2e322e', surfaceContainerHighest: '#343834',
  onSurface: '#ffffff', onSurfaceVariant: '#9aa39b',
  error: '#ff4d4d', errorContainer: '#3a1414', onErrorContainer: '#ff9d9d',
  tertiaryFixed: '#3a3000', tertiaryContainer: '#ffd54d',
}

interface FoodItem {
  id: string; name: string; category: string; quantity: number; unit: string
  expiryDate: string; storage: string; status: 'normal' | 'urgent' | 'critical' | 'expired'
  notes: string; img: string
}

const MOCK_ITEMS: FoodItem[] = [
  { id: '1', name: 'Fresh Organic Apples', category: 'Produce', quantity: 50, unit: 'kg', expiryDate: '2026-11-05', storage: 'Room Temp', status: 'normal', notes: 'Organic, Grade A, Bramhall Farm', img: '/stickers/03_foodbridge_process_and_environment/reduce_food_waste.png' },
  { id: '2', name: 'Farm Fresh Spinach', category: 'Produce', quantity: 30, unit: 'kg', expiryDate: '2026-11-02', storage: 'Chilled 4°C', status: 'urgent', notes: 'Harvested today, cold chain verified', img: '/stickers/03_foodbridge_process_and_environment/sustainable_food_system.png' },
  { id: '3', name: 'Whole Wheat Sourdough', category: 'Bakery', quantity: 45, unit: 'kg', expiryDate: '2026-11-01', storage: 'Ambient', status: 'critical', notes: 'Woodfired stone baked this morning', img: '/stickers/03_foodbridge_process_and_environment/cook.png' },
  { id: '4', name: 'Canned Chickpeas & Lentils', category: 'Canned', quantity: 80, unit: 'boxes', expiryDate: '2027-06-15', storage: 'Room Temp', status: 'normal', notes: 'Non-perishable, pantry staple', img: '/stickers/03_foodbridge_process_and_environment/collect_process.png' },
  { id: '5', name: 'Artisan Greek Yogurt', category: 'Dairy', quantity: 20, unit: 'liters', expiryDate: '2026-11-03', storage: 'Chilled 3°C', status: 'urgent', notes: 'Full fat, unpasteurised — cold chain required', img: '/stickers/03_foodbridge_process_and_environment/donate_process.png' },
]

const STATUS_CONFIG = {
  normal:   { bg: '#232723', color: C.secondary, label: 'Fresh / Stable', dotColor: C.secondary },
  urgent:   { bg: C.tertiaryFixed, color: C.tertiaryContainer, label: 'Expiring Soon', dotColor: '#ffd54d' },
  critical: { bg: C.errorContainer, color: C.onErrorContainer, label: 'Critical <24h', dotColor: C.error },
  expired:  { bg: '#232723', color: '#9aa39b', label: 'Expired', dotColor: '#9aa39b' },
}

const CATEGORIES = ['All', 'Produce', 'Bakery', 'Dairy', 'Canned', 'Meals']

const fetchItems = async (): Promise<FoodItem[]> => {
  await new Promise(r => setTimeout(r, 400))
  return MOCK_ITEMS
}

function ItemCard({ item, onDelete }: { item: FoodItem; onDelete: (id: string) => void }) {
  const s = STATUS_CONFIG[item.status]
  const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 shadow-sm flex gap-3 relative overflow-hidden"
      style={{ background: C.surfaceLowest }}>
      {/* left accent bar */}
      <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl" style={{ background: s.dotColor }} />

      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ml-1" style={{ background: C.surfaceContainerLow }}>
        <img src={item.img} alt={item.name} className="w-10 h-10 object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                style={{ background: C.surfaceContainerHigh, color: C.onSurfaceVariant, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
                {item.category}
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: s.bg, color: s.color, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.06em' }}>
                <span className="w-1 h-1 rounded-full" style={{ background: s.dotColor }} />
                {s.label}
              </span>
            </div>
            <h3 className="font-semibold text-sm leading-tight truncate" style={{ color: C.onSurface, fontFamily: 'Rubik, sans-serif' }}>{item.name}</h3>
            <p className="text-xs mt-0.5 truncate" style={{ color: C.onSurfaceVariant, fontFamily: 'Rubik, sans-serif' }}>{item.notes}</p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: C.surfaceContainerLow, color: C.onSurfaceVariant }}>
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: C.errorContainer, color: C.onErrorContainer }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, color: C.primary }}>
            <Package className="w-3 h-3" /> {item.quantity} {item.unit}
          </div>
          <div className="flex items-center gap-1" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, color: C.onSurfaceVariant }}>
            <Clock className="w-3 h-3" /> {item.storage}
          </div>
          <div className="flex items-center gap-1 ml-auto" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, color: daysLeft <= 1 ? C.error : daysLeft <= 3 ? '#ffd54d' : C.secondary }}>
            {daysLeft <= 0 ? 'Expired' : daysLeft === 1 ? 'Expires today' : `${daysLeft}d left`}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AddItemModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setSubmitted(true)
    setTimeout(() => { setSubmitted(false); onAdd(); onClose() }, 1800)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(38,51,42,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}>
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-lg rounded-t-2xl p-6 flex flex-col gap-4 shadow-xl max-h-[85vh] overflow-y-auto"
            style={{ background: C.surfaceLowest }}>
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${C.surfaceContainer}` }}>
              <div>
                <p style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Inventory Management</p>
                <h2 style={{ fontFamily: 'Rubik, sans-serif', fontSize: 18, fontWeight: 600, color: C.onSurface }}>Add New Food Item</h2>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: C.surfaceContainer, color: C.onSurfaceVariant }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {[
                { label: 'Item Name', placeholder: 'e.g. Organic Sourdough Loaves', type: 'text' },
                { label: 'Quantity', placeholder: '50', type: 'number' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif' }}>{f.label}</label>
                  <input type={f.type} required placeholder={f.placeholder}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: C.surfaceContainerLow, color: C.onSurface, border: `1px solid ${C.surfaceContainerHigh}`, fontFamily: 'Rubik, sans-serif' }} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif' }}>Category</label>
                  <select className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: C.surfaceContainerLow, color: C.onSurface, border: `1px solid ${C.surfaceContainerHigh}`, fontFamily: 'Rubik, sans-serif' }}>
                    {['Produce', 'Bakery', 'Dairy', 'Canned', 'Meals', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif' }}>Unit</label>
                  <select className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: C.surfaceContainerLow, color: C.onSurface, border: `1px solid ${C.surfaceContainerHigh}`, fontFamily: 'Rubik, sans-serif' }}>
                    {['kg', 'liters', 'pieces', 'boxes', 'portions'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif' }}>Expiry Date</label>
                <input type="date" required className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: C.surfaceContainerLow, color: C.onSurface, border: `1px solid ${C.surfaceContainerHigh}`, fontFamily: 'Rubik, sans-serif' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif' }}>Storage Requirement</label>
                <select className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: C.surfaceContainerLow, color: C.onSurface, border: `1px solid ${C.surfaceContainerHigh}`, fontFamily: 'Rubik, sans-serif' }}>
                  {['Room Temperature', 'Chilled (2–5°C)', 'Frozen (−18°C)', 'Warm / Insulated'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{ background: C.surfaceContainer, color: C.onSurface, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all"
                  style={{ background: C.primaryContainer, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
                  {submitted ? <><CheckCircle2 className="w-4 h-4" /> Added!</> : <><Plus className="w-4 h-4" /> Add Item</>}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Inventory() {
  const { user } = useAppStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [items, setItems] = useState<FoodItem[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const { data: fetchedItems = [], isLoading } = useQuery({ queryKey: ['inventory'], queryFn: fetchItems })

  const displayItems = items.length > 0 ? items : fetchedItems

  const filtered = displayItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || item.category === category
    return matchSearch && matchCat
  })

  const handleDelete = (id: string) => {
    setItems(prev => (prev.length > 0 ? prev : fetchedItems).filter(i => i.id !== id))
    setToast('Item removed from inventory')
    setTimeout(() => setToast(null), 3500)
  }

  const criticalCount = displayItems.filter(i => i.status === 'critical').length
  const urgentCount = displayItems.filter(i => i.status === 'urgent').length

  return (
    <div className="space-y-4 pt-4 pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Surplus Management</span>
          <h1 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 28, lineHeight: '34px', letterSpacing: '-0.01em', color: C.primary }}>Food Inventory</h1>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
          style={{ background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Alert strip */}
      {(criticalCount > 0 || urgentCount > 0) && (
        <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: C.errorContainer }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: C.onErrorContainer }} />
          <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onErrorContainer }}>
            <strong>{criticalCount} critical</strong> and <strong>{urgentCount} expiring</strong> items require immediate action.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.onSurfaceVariant }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search food items, categories..."
          className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none"
          style={{ background: C.surfaceLowest, border: `1px solid ${C.surfaceContainerHigh}`, color: C.onSurface, fontFamily: 'Rubik, sans-serif' }} />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
            style={category === cat
              ? { background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }
              : { background: C.surfaceContainer, color: C.onSurfaceVariant, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }
            }>{cat}</button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total Items', value: displayItems.length, color: C.primary },
          { label: 'Critical', value: criticalCount, color: C.error },
          { label: 'Expiring', value: urgentCount, color: '#ffd54d' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: C.surfaceLowest }}>
            <div style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 24, color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.onSurfaceVariant, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: 'Rubik, sans-serif', fontSize: 15, fontWeight: 600, color: C.onSurface }}>{filtered.length} items</h2>
          <div className="flex items-center gap-1" style={{ color: C.onSurfaceVariant }}>
            <Filter className="w-3.5 h-3.5" />
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 600 }}>Sort: Expiry</span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[0,1,2].map(i => (
              <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: C.surfaceContainer }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <img src="/stickers/03_foodbridge_process_and_environment/collect_process.png" alt="" className="w-20 h-20 mx-auto object-contain opacity-60" />
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 15, color: C.onSurfaceVariant }}>No items found</p>
          </div>
        ) : (
          filtered.map(item => <ItemCard key={item.id} item={item} onDelete={handleDelete} />)
        )}
      </div>

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={() => setToast('New item added to inventory')} />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-4 right-4 z-50 p-3.5 rounded-xl shadow-2xl flex items-center gap-3 max-w-lg mx-auto"
            style={{ background: C.primary, color: '#0a0a0a' }}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: C.onSecondaryFixed }} />
            <span style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 600 }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
