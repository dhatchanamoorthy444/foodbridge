import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Truck, RefreshCw, Clock, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { toastApiError, pickupsService } from '../services/api'
import { useAppStore } from '../store/useAppStore'
import { EmptyState, ErrorState, SkeletonList } from '../components/ui/Feedback'
import type { Pickup, PickupStatus } from '../types/api'
import { UNIT_LABELS } from '../types/api'
import { formatDateTime, cn } from '../lib/utils'

const STATUS_STYLE: Record<string, string> = {
  scheduled: 'bg-primary-container text-on-primary-container',
  confirmed: 'bg-secondary-container text-secondary',
  in_transit: 'bg-tertiary-container text-tertiary',
  delivered: 'bg-secondary-container text-secondary',
  collected: 'bg-elevated text-text-2',
  cancelled: 'bg-danger-soft text-danger',
}

/* donor-only transitions per current stage */
const NEXT: Record<string, { status: PickupStatus; label: string; danger?: boolean }[]> = {
  scheduled: [
    { status: 'confirmed', label: 'Confirm' },
    { status: 'cancelled', label: 'Cancel', danger: true },
  ],
  confirmed: [
    { status: 'in_transit', label: 'In transit' },
    { status: 'cancelled', label: 'Cancel', danger: true },
  ],
  in_transit: [
    { status: 'delivered', label: 'Mark delivered' },
    { status: 'cancelled', label: 'Cancel', danger: true },
  ],
  delivered: [{ status: 'collected', label: 'Mark collected' }],
}

export default function Pickups() {
  const user = useAppStore((s) => s.user)
  const queryClient = useQueryClient()
  const isDonor = user?.role === 'donor'

  const query = useQuery({
    queryKey: ['pickups'],
    queryFn: () => pickupsService.mine(),
    enabled: !!user,
    refetchInterval: 20000,
  })
  const pickups = query.data ?? []

  const updateStatus = async (p: Pickup, status: PickupStatus) => {
    try {
      await pickupsService.updateStatus(p.id, { status })
      toast.success('Pickup updated')
      queryClient.invalidateQueries({ queryKey: ['pickups'] })
    } catch (err) {
      toastApiError(err, 'Update failed')
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Anton'] text-2xl text-text tracking-tight">Pickups</h1>
          <p className="text-[13px] text-text-2">
            {isDonor ? 'Approved allocations awaiting collection' : 'Food collections approved for you'}
          </p>
        </div>
        <button onClick={() => query.refetch()} className="btn-secondary rounded-lg p-2" aria-label="Refresh">
          <RefreshCw className={cn('h-4 w-4', query.isFetching && 'animate-spin')} />
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {query.isLoading ? (
          <SkeletonList count={2} />
        ) : query.isError ? (
          <ErrorState message="Could not load pickups" onRetry={() => query.refetch()} />
        ) : pickups.length === 0 ? (
          <EmptyState
            icon={<Truck className="h-6 w-6" />}
            title={isDonor ? 'No pickups yet' : 'Nothing to collect yet'}
            message={isDonor
              ? 'When you approve recipient requests, scheduled pickups appear here.'
              : 'After a donor approves your request, the scheduled collection appears here.'}
          />
        ) : (
          pickups.map((p) => (
            <div key={p.id} className="rounded-xl border border-line bg-panel p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-text">
                    {p.donation?.food_name ?? 'Food allocation'}
                  </p>
                  <p className="mt-0.5 text-[12px] text-text-2">
                    {p.quantity} {UNIT_LABELS[p.unit]?.toLowerCase() ?? p.unit}
                  </p>
                </div>
                <span className={cn('flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', STATUS_STYLE[p.status])}>
                  {p.status.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-3">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.scheduled_at ? formatDateTime(p.scheduled_at) : 'Time not set'}</span>
                <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" /> {p.pickup_address}</span>
              </div>
              {p.pickup_instructions && <p className="mt-1.5 text-[11px] text-text-3">{p.pickup_instructions}</p>}

              {isDonor && NEXT[p.status] && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {NEXT[p.status].map((a) => (
                    <button
                      key={a.status}
                      onClick={() => updateStatus(p, a.status)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors',
                        a.danger ? 'bg-danger-soft text-danger hover:opacity-80' : 'btn-secondary'
                      )}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
