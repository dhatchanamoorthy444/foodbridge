import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ClipboardList, RefreshCw, Package, Clock, X } from 'lucide-react'
import toast from 'react-hot-toast'
import toastApiError, { requestsService } from '../services/api'
import { EmptyState, ErrorState, SkeletonList } from '../components/ui/Feedback'
import { UNIT_LABELS, FoodRequest } from '../types/api'
import { formatDateTime } from '../lib/utils'
import { cn } from '../lib/utils'

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-tertiary-container text-tertiary',
  approved: 'bg-primary-container text-on-primary-container',
  rejected: 'bg-danger-soft text-danger',
  completed: 'bg-elevated text-text-2',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Awaiting donor response',
  approved: 'Approved — pickup coming',
  rejected: 'Declined by donor',
  completed: 'Delivered',
}

export default function MyRequests() {
  const queryClient = useQueryClient()
  const [cancelTarget, setCancelTarget] = useState<FoodRequest | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const query = useQuery({
    queryKey: ['my-requests'],
    queryFn: () => requestsService.mine(),
    refetchInterval: 15000,
  })

  const requests = query.data?.data ?? []

  const cancelRequest = async (r: FoodRequest) => {
    setCancelling(true)
    try {
      await requestsService.cancel(r.id)
      toast.success('Request withdrawn')
      setCancelTarget(null)
      queryClient.invalidateQueries({ queryKey: ['my-requests'] })
    } catch (err) {
      toastApiError(err, 'Withdraw failed')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Anton'] text-2xl text-text tracking-tight">My Requests</h1>
          <p className="text-[13px] text-text-2">Track every food request you have sent to donors</p>
        </div>
        <button onClick={() => query.refetch()} className="btn-secondary rounded-lg p-2" aria-label="Refresh">
          <RefreshCw className={cn('h-4 w-4', query.isFetching && 'animate-spin')} />
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {query.isLoading ? (
          <SkeletonList count={3} />
        ) : query.isError ? (
          <ErrorState message="Could not load your requests" onRetry={() => query.refetch()} />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6" />}
            title="No requests yet"
            message="Browse available donations and send your first request — donors respond fast."
            action={<a href="/browse" className="btn-primary rounded-lg px-4 py-2 text-[13px]">Browse donations</a>}
          />
        ) : (
          requests.map((r) => (
            <div key={r.id} className="rounded-xl border border-line bg-panel p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-text">
                    {r.donation?.food_name ?? 'Donation'}
                  </p>
                  <p className="mt-0.5 text-[12px] text-text-2">
                    {r.requested_quantity} {UNIT_LABELS[r.unit]?.toLowerCase() ?? r.unit}
                    {r.people_to_feed ? ` · feeding ~${r.people_to_feed} people` : ''}
                  </p>
                </div>
                {(r.status === 'pending' || r.status === 'approved') && (
                  <button
                    onClick={() => setCancelTarget(r)}
                    className="rounded-lg p-2 text-text-3 hover:bg-danger-soft hover:text-danger"
                    aria-label="Withdraw request"
                    title="Withdraw request"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-3">
                <span className={cn('rounded-full px-2 py-0.5 font-bold uppercase tracking-wider', STATUS_STYLE[r.status])}>
                  {STATUS_LABEL[r.status]}
                </span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> sent {formatDateTime(r.created_at)}</span>
                {r.donation?.city && (
                  <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {r.donation.city}</span>
                )}
              </div>
              {r.status === 'rejected' && (
                <p className="mt-2 rounded-lg bg-danger-soft px-3 py-2 text-[12px] text-danger">
                  This batch was allocated to another recipient or cancelled. Keep browsing for new donors nearby.
                </p>
              )}
              {r.status === 'approved' && (
                <p className="mt-2 rounded-lg bg-primary-container px-3 py-2 text-[12px] text-on-primary-container">
                  The donor approved your request. Watch your pickups list for scheduling details.
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Withdraw confirm */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app-deep/70" onClick={(e) => e.target === e.currentTarget && setCancelTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-panel border border-line p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-text">Withdraw request?</h3>
                <p className="mt-1 text-[13px] text-text-2">
                  {cancelTarget.requested_quantity} {cancelTarget.unit} of {cancelTarget.donation?.food_name ?? 'food'} will be removed from the donor queue.
                </p>
              </div>
              <button onClick={() => setCancelTarget(null)} className="text-text-3 hover:text-text" aria-label="Close"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-secondary flex-1 rounded-lg py-2.5 text-[13px]" onClick={() => setCancelTarget(null)}>Keep request</button>
              <button
                disabled={cancelling}
                className="flex-1 rounded-lg bg-danger py-2.5 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-60"
                onClick={() => cancelRequest(cancelTarget)}
              >Withdraw</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
