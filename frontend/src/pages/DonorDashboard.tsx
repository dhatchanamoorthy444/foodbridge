import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import useAppStore from '../store/useAppStore'
import { donationsService, dashboardService } from '../services/api'
import { useMyDonationsLive } from '../hooks/useAppData'
import { formatRelativeTime } from '../lib/utils'
import { Donation } from '../types/api'

export function StatusChip({ status }: { status: string }) {
  if (status === 'available') {
    return (
      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#263300] text-[#D7EF4A] border border-[#BCD147]/30">
        Available
      </span>
    )
  }
  if (status === 'partially_fulfilled') {
    return (
      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#1C221C] text-[#BCD147] border border-[#262E26]">
        Partially Allocated
      </span>
    )
  }
  if (status === 'completed') {
    return (
      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#131713] text-[#858C84] border border-[#262E26]">
        Dispatched
      </span>
    )
  }
  return (
    <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#410002] text-[#FF5449] border border-[#FF5449]/40">
      Cancelled
    </span>
  )
}

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
      toast.success('Batch cancelled successfully')
      setConfirmCancel(null)
      invalidate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cancellation failed')
    }
  }

  const stats = statsQuery.data
  const donations = useMemo(() => donationsQuery.data?.data ?? [], [donationsQuery.data])

  // Split donations into critical expiry vs active
  const criticalBatches = useMemo(() => {
    return donations.filter((d) => {
      if (d.status === 'cancelled' || d.status === 'completed') return false
      if (!d.expires_at) return false
      const expiry = new Date(d.expires_at).getTime()
      const now = Date.now()
      const diffHours = (expiry - now) / (1000 * 60 * 60)
      return diffHours <= 6
    })
  }, [donations])

  const facilityName =
    user?.organization?.trim() || user?.full_name || 'CENTRAL RESILIENCE COMMISSARY'

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 max-w-7xl mx-auto">
      {/* ── Operational Hub Breadcrumb / Header Strip ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#D7EF4A] text-[#090B09] font-mono text-[10px] uppercase font-bold tracking-wider">
              LIVE NODE
            </span>
            <span className="font-mono text-xs text-[#858C84] uppercase tracking-wider">
              DONOR PORTAL // FACILITY ID: DN-{user?.id ? user.id.slice(0, 6).toUpperCase() : '8041'}
            </span>
          </div>
          <h1 className="font-['Anton'] text-2xl md:text-3xl text-white uppercase tracking-wide mt-1.5">
            {facilityName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131713] border border-[#262E26]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D7EF4A] animate-pulse" />
            <span className="font-mono text-[11px] text-[#F6F7F2] uppercase tracking-wider font-bold">
              STATUS: ACTIVE DISPATCH MODE
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#1C221C] border border-[#262E26] font-mono text-[11px] text-[#BCD147] uppercase font-bold">
            SYNC: LIVE
          </div>
        </div>
      </div>

      {/* ── Primary Operations Bar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 rounded-xl bg-[#131713] border border-[#262E26] shadow-xl">
        <div className="lg:col-span-6 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/donor/new')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#D7EF4A] text-[#090B09] font-mono text-xs uppercase tracking-wider font-extrabold hover:bg-[#E8F5A4] transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            LOG SURPLUS BATCH (+)
          </button>
          <button
            onClick={() => navigate('/alerts')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#410002] border border-[#FF5449]/40 text-[#FFDAD6] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#690005] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
            EMERGENCY RADAR ({stats?.openEmergencyAlerts ?? 0})
          </button>
          <button
            onClick={() => navigate('/pickups')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1C221C] border border-[#262E26] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#252B25] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            TRANSITS
          </button>
        </div>

        <div className="lg:col-span-6 flex items-center justify-end gap-6 text-right">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#858C84] uppercase">Live Batches</span>
            <span className="font-['Anton'] text-xl text-[#D7EF4A]">{stats?.myDonations ?? 0} ACTIVE</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#858C84] uppercase">Unclaimed Qty</span>
            <span className="font-['Anton'] text-xl text-white">{stats?.availableQuantity ?? 0} UNITS</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#858C84] uppercase">Pending Requests</span>
            <span className="font-['Anton'] text-xl text-[#BCD147]">{stats?.pendingRequests ?? 0} QUEUED</span>
          </div>
        </div>
      </div>

      {/* ── Operational KPI Metric Array ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#131713] border border-[#262E26] flex flex-col justify-between shadow-md hover:bg-[#1C221C] transition-all">
          <div className="flex items-center justify-between text-[#858C84]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">Active Inventory</span>
            <span className="material-symbols-outlined text-[20px] text-[#D7EF4A]">inventory_2</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-['Anton'] text-3xl text-white">{stats?.myDonations ?? 0}</span>
            <span className="font-mono text-[10px] text-[#D7EF4A] font-bold">BATCHES</span>
          </div>
          <span className="text-xs text-[#858C84] mt-1">Ready for regional matching</span>
        </div>

        <div className="p-4 rounded-xl bg-[#131713] border border-[#262E26] flex flex-col justify-between shadow-md hover:bg-[#1C221C] transition-all">
          <div className="flex items-center justify-between text-[#858C84]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">Available Portions</span>
            <span className="material-symbols-outlined text-[20px] text-[#D7EF4A]">restaurant</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-['Anton'] text-3xl text-[#BCD147]">{stats?.availableQuantity ?? 0}</span>
            <span className="font-mono text-[10px] text-[#858C84] font-bold">SERVINGS</span>
          </div>
          <span className="text-xs text-[#858C84] mt-1">Surplus meal stock unallocated</span>
        </div>

        <div className="p-4 rounded-xl bg-[#131713] border border-[#262E26] flex flex-col justify-between shadow-md hover:bg-[#1C221C] transition-all">
          <div className="flex items-center justify-between text-[#858C84]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">Upcoming Pickups</span>
            <span className="material-symbols-outlined text-[20px] text-[#D7EF4A]">local_shipping</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-['Anton'] text-3xl text-white">{stats?.upcomingPickups ?? 0}</span>
            <span className="font-mono text-[10px] text-[#D7EF4A] font-bold">DISPATCHES</span>
          </div>
          <span className="text-xs text-[#858C84] mt-1">Shelters / drivers in transit</span>
        </div>

        <div className="p-4 rounded-xl bg-[#131713] border border-[#262E26] flex flex-col justify-between shadow-md hover:bg-[#1C221C] transition-all">
          <div className="flex items-center justify-between text-[#858C84]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">Emergency Requisitions</span>
            <span className="material-symbols-outlined text-[20px] text-[#FF5449]">crisis_alert</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-['Anton'] text-3xl text-white">{stats?.openEmergencyAlerts ?? 0}</span>
            <span className="font-mono text-[10px] text-[#FF5449] font-bold">CRITICAL</span>
          </div>
          <span className="text-xs text-[#858C84] mt-1">Local shelter distress alerts</span>
        </div>
      </div>

      {/* ── Expiry Critical Monitoring Radar ── */}
      <div className="flex flex-col space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D7EF4A] text-[22px]">radar</span>
            <h2 className="font-['Anton'] text-xl text-white uppercase tracking-wide">
              EXPIRY CRITICAL MONITORING RADAR
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#858C84] uppercase">
            MONITORED BATCHES: {String(criticalBatches.length).padStart(2, '0')}
          </span>
        </div>

        {criticalBatches.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#131713] border border-[#262E26] text-center">
            <span className="material-symbols-outlined text-3xl text-[#BCD147] mb-2">verified_user</span>
            <p className="text-sm font-bold text-white uppercase font-mono">Radar Status Clear</p>
            <p className="text-xs text-[#858C84] mt-1">No monitored batches currently in critical expiry danger.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {criticalBatches.slice(0, 3).map((batch) => {
              const expiryMs = batch.expires_at ? new Date(batch.expires_at).getTime() : Date.now() + 3600000
              const diffHours = Math.max(0, (expiryMs - Date.now()) / (1000 * 60 * 60))
              const hours = Math.floor(diffHours)
              const mins = Math.floor((diffHours - hours) * 60)
              const urgency = diffHours <= 2 ? 'CRITICAL RESCUE' : diffHours <= 4 ? 'HIGH' : 'MEDIUM'
              const percentage = Math.min(100, Math.max(10, Math.round((diffHours / 12) * 100)))

              return (
                <div
                  key={batch.id}
                  className="relative p-5 rounded-xl bg-[#131713] border border-[#262E26] flex flex-col justify-between shadow-lg overflow-hidden group hover:bg-[#1C221C] transition-all"
                >
                  {diffHours <= 2 && (
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FF5449]/10 rounded-full blur-xl pointer-events-none" />
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-[#D7EF4A] font-bold uppercase tracking-wider">
                        BATCH #{batch.id.slice(0, 7).toUpperCase()}
                      </span>
                      <h3 className="font-['Anton'] text-lg text-white uppercase mt-1">
                        {batch.food_name}
                      </h3>
                      <span className="text-xs text-[#858C84] mt-0.5">
                        {batch.quantity} {batch.unit} • {batch.food_category?.toUpperCase() || 'COOKED MEALS'}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold tracking-wider ${
                        diffHours <= 2
                          ? 'bg-[#410002] border border-[#FF5449] text-[#FF5449] animate-pulse'
                          : 'bg-[#263300] text-[#D7EF4A]'
                      }`}
                    >
                      {urgency}
                    </span>
                  </div>

                  <div className="my-5 flex items-center gap-4">
                    {/* SVG Radial countdown */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#252B25] stroke-current"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          strokeWidth="3"
                        />
                        <path
                          className={`${diffHours <= 2 ? 'text-[#FF5449]' : 'text-[#D7EF4A]'} stroke-current`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          strokeDasharray={`${percentage}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-mono text-[11px] text-white font-bold leading-none">
                          {hours}h {mins}m
                        </span>
                        <span className="font-mono text-[7px] text-[#858C84] uppercase mt-0.5">
                          REMAINING
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1 min-w-0">
                      <span className="font-mono text-[10px] text-[#D7EF4A] font-bold uppercase truncate">
                        STORAGE: {batch.storage_requirement?.toUpperCase() || 'HOT-HOLDING'}
                      </span>
                      <span className="text-xs text-[#858C84] line-clamp-2">
                        {batch.description || 'Verified food batch prepared under hygienic safety standard.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#262E26]">
                    <span className="font-mono text-[10px] text-[#858C84] uppercase font-bold">
                      {batch.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => navigate(`/donor/${batch.id}/edit`)}
                      className="px-3 py-1 rounded bg-[#1C221C] text-white font-mono text-[10px] uppercase font-bold hover:bg-[#D7EF4A] hover:text-[#090B09] transition-colors"
                    >
                      MANAGE BATCH →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Complete Live Inventory Ledger ── */}
      <div className="rounded-xl bg-[#131713] border border-[#262E26] p-5 shadow-md flex flex-col space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#262E26]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D7EF4A] text-[20px]">list_alt</span>
            <h3 className="font-['Anton'] text-lg text-white uppercase tracking-wide">
              FACILITY SURPLUS INVENTORY LOG ({donations.length})
            </h3>
          </div>
          <button
            onClick={() => navigate('/donor/new')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D7EF4A] text-[#090B09] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#E8F5A4] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Entry
          </button>
        </div>

        {donations.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#858C84] font-mono">
            No surplus inventory posted yet. Click "LOG SURPLUS BATCH" to publish your first entry.
          </div>
        ) : (
          <div className="divide-y divide-[#262E26]">
            {donations.map((d) => (
              <div
                key={d.id}
                className="py-3.5 flex flex-wrap items-center justify-between gap-4 hover:bg-[#1C221C]/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#143527] border border-[#262E26] flex items-center justify-center flex-shrink-0 text-[#D7EF4A]">
                    <span className="material-symbols-outlined text-[20px]">restaurant</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">{d.food_name}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#1C221C] text-[#D7EF4A] border border-[#262E26] uppercase">
                        {d.food_category}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#858C84] mt-0.5">
                      {d.quantity} {d.unit} • Expires: {d.expires_at ? new Date(d.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} ({d.expires_at ? formatRelativeTime(d.expires_at) : ''})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusChip status={d.status} />

                  <button
                    onClick={() => navigate(`/donor/${d.id}/edit`)}
                    className="p-1.5 text-[#858C84] hover:text-white transition-colors"
                    title="Edit batch"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>

                  {d.status === 'available' && (
                    <button
                      onClick={() => setConfirmCancel(d)}
                      className="p-1.5 text-[#858C84] hover:text-[#FF5449] transition-colors"
                      title="Cancel batch"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation confirmation modal */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#131713] border border-[#FF5449]/40 p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#FF5449]">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="font-['Anton'] text-lg uppercase">Withdraw Surplus Batch?</h3>
            </div>
            <p className="text-xs text-[#B8BDB6]">
              Are you sure you want to cancel the batch <strong className="text-white">"{confirmCancel.food_name}"</strong>? Any active notifications sent to shelters will be marked as cancelled.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmCancel(null)}
                className="px-4 py-2 rounded-lg bg-[#1C221C] text-white font-mono text-xs uppercase font-bold"
              >
                Nevermind
              </button>
              <button
                onClick={() => cancelMutation(confirmCancel)}
                className="px-4 py-2 rounded-lg bg-[#410002] border border-[#FF5449] text-[#FFDAD6] font-mono text-xs uppercase font-bold hover:bg-[#690005]"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
