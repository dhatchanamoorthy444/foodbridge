import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Package, Plus, Clock, Truck, ClipboardList, AlertTriangle, Pencil, Trash2, X, Images,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../store/useAppStore'
import { donationsService, dashboardService } from '../services/api'
import { useMyDonationsLive } from '../hooks/useAppData'
import { EmptyState, ErrorState, SkeletonList, ExpiryBadge } from '../components/ui/Feedback'
import { storagePublicUrl } from '../lib/supabase'
import { CATEGORY_LABELS, UNIT_LABELS, Donation } from '../types/api'
import { cn } from '../lib/utils'

export default function DonorDashboard() {
  const user = useAppStore((s) => s.user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmCancel, setConfirmCancel] = useState<Donation | null>(null)

  const enabled = !!user && user.role === 'donor'
  const donationsQuery = useMyDonationsLive(enabled)
  const statsQuery = useQuery({
    queryKey: ['donor-stats'],
    queryFn: () => dashboardService.donor(),
    enabled,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['my-donations'] })
    queryClient.invalidateQueries({ queryKey: ['donor-stats'] })
  }

  const cancelMutation = async (donation: Donation) => {
    try {
      await donationsService.cancel(donation.id)
      toast.success('Donation cancelled')
      setConfirmCancel(null)
      invalidate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cancel failed')
    }
  }

  const stats = statsQuery.data
  const donations = useMemo(() => donationsQuery.data?.data ?? [], [donationsQuery.data])

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-['Anton'] text-2xl text-text tracking-tight">Donor Dashboard</h1>
          <p className="text-[13px] text-text-2">
            {user?.organization?.trim() || user?.full_name || user?.email}'s actual inventory
          </p>
        </div>
        <button onClick={() => navigate('/donor/new')} className="btn-primary rounded-xl px-4 py-2.5 text-[13px] flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> New Donation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Active donations" value={stats?.myDonations ?? 0} icon={<Package className="h-4 w-4" />} loading={statsQuery.isLoading} />
        <StatCard label="Available qty" value={stats?.availableQuantity ?? 0} icon={<ClipboardList className="h-4 w-4" />} loading={statsQuery.isLoading} subtle="Current unclaimed stock" />
        <StatCard label="Pending requests" value={stats?.pendingRequests ?? 0} icon={<Clock className="h-4 w-4" />} loading={statsQuery.isLoading} tone={stats && stats.pendingRequests > 0 ? 'warn' : 'default'} />
        <StatCard label="Upcoming pickups" value={stats?.upcomingPickups ?? 0} icon={<Truck className="h-4 w-4" />} loading={statsQuery.isLoading} />
      </div>

      {/* Emergency alerts needing help */}
      {stats && stats.openEmergencyAlerts > 0 && (
        <Link to="/alerts" className="flex items-center gap-3 rounded-xl border border-line bg-tertiary-container/40 p-3.5 hover:bg-tertiary-container/60 transition-colors">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-tertiary-container text-tertiary">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-text">{stats.openEmergencyAlerts} emergency alert{stats.openEmergencyAlerts === 1 ? '' : 's'} need support</p>
            <p className="text-[12px] text-text-2">Recipients nearby have urgent food requirements</p>
          </div>
          <span className="text-[12px] font-semibold text-tertiary">View</span>
        </Link>
      )}

      {/* Donation list */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-text-2">My donations</h2>
          {stats && stats.completedDonations > 0 && (
            <span className="text-[11px] text-text-3">{stats.completedDonations} fully allocated</span>
          )}
        </div>

        {donationsQuery.isLoading ? (
          <SkeletonList count={3} />
        ) : donationsQuery.isError ? (
          <ErrorState message="Could not load your donations" onRetry={() => donationsQuery.refetch()} />
        ) : donations.length === 0 ? (
          <EmptyState
            icon={<Images className="h-6 w-6" />}
            title="Your donation history will appear here"
            message="No donations published yet. Share your first surplus batch and eligible recipients will see it instantly."
            action={
              <button onClick={() => navigate('/donor/new')} className="btn-primary rounded-lg px-4 py-2 text-[13px]">
                Create first donation
              </button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {donations.map((d, i) => (
              <DonationRow key={d.id} donation={d} index={i} onEdit={() => navigate(`/donor/${d.id}/edit`)} onDelete={() => setConfirmCancel(d)} />
            ))}
          </div>
        )}
      </section>

      {/* Cancel confirm */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app-deep/70" onClick={(e) => e.target === e.currentTarget && setConfirmCancel(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm rounded-2xl bg-panel border border-line p-5">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-text">Cancel this donation?</h3>
              <button onClick={() => setConfirmCancel(null)} className="text-text-3 hover:text-text" aria-label="Close"><X className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-[13px] text-text-2">"{confirmCancel.food_name}" ({confirmCancel.available_quantity} {confirmCancel.unit} unclaimed) will be removed from browse lists and pending requests will be declined.</p>
            <div className="mt-4 flex gap-2">
              <button className="btn-secondary flex-1 rounded-lg py-2.5 text-[13px]" onClick={() => setConfirmCancel(null)}>Keep it</button>
              <button className="flex-1 rounded-lg bg-danger text-white py-2.5 text-[13px] font-semibold hover:opacity-90" onClick={() => cancelMutation(confirmCancel)}>Cancel donation</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, loading, tone = 'default', subtle }: {
  label: string
  value: number
  icon: React.ReactNode
  loading?: boolean
  tone?: 'default' | 'warn'
  subtle?: string
}) {
  return (
    <div className="rounded-xl border border-line bg-panel p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">{label}</span>
        <span className={cn('flex h-6 w-6 items-center justify-center rounded-md', tone === 'warn' ? 'bg-tertiary-container text-tertiary' : 'bg-elevated text-text-2')}>{icon}</span>
      </div>
      {loading ? (
        <div className="mt-2 h-7 w-14 animate-pulse rounded bg-elevated" />
      ) : (
        <p className="mt-1 font-['Anton'] text-[24px] tracking-tight text-text tabular-nums">{value}</p>
      )}
      {subtle && <p className="text-[10px] text-text-3">{subtle}</p>}
    </div>
  )
}

function DonationRow({ donation: d, onEdit, onDelete }: { donation: Donation; index: number; onEdit: () => void; onDelete: () => void }) {
  const imageUrl = storagePublicUrl(d.image_path)
  const claimed = d.quantity - d.available_quantity
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-line bg-panel p-4">
      <div className="flex gap-3">
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-elevated">
          {imageUrl ? <img src={imageUrl} alt={d.food_name} className="h-full w-full object-cover" loading="lazy" /> : <span className="flex h-full w-full items-center justify-center"><Package className="h-5 w-5 text-text-3" /></span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-text">{d.food_name}</p>
              <p className="mt-0.5 text-[12px] text-text-2">
                {CATEGORY_LABELS[d.food_category] ?? d.food_category} · {d.quantity} {UNIT_LABELS[d.unit]?.toLowerCase() ?? d.unit} {claimed > 0 && `· ${claimed} claimed`}
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-1">
              <button onClick={onEdit} className="rounded-lg p-2 text-text-3 hover:bg-elevated hover:text-text transition-colors" aria-label="Edit donation"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={onDelete} className="rounded-lg p-2 text-text-3 hover:bg-danger-soft hover:text-danger transition-colors" aria-label="Cancel donation"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StatusChip status={d.status} />
            <ExpiryBadge expiresAt={d.expires_at} />
            <span className="text-[11px] text-text-3">{d.city}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function StatusChip({ status }: { status: Donation['status'] }) {
  const cfg: Record<string, string> = {
    available: 'bg-primary-container text-on-primary-container',
    partially_fulfilled: 'bg-tertiary-container text-tertiary',
    completed: 'bg-elevated text-text-2',
    cancelled: 'bg-danger-soft text-danger',
  }
  const label: Record<string, string> = {
    available: 'Available',
    partially_fulfilled: 'Partially claimed',
    completed: 'Fully allocated',
    cancelled: 'Cancelled',
  }
  return <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', cfg[status])}>{label[status]}</span>
}
