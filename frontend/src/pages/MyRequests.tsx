import { useQuery } from '@tanstack/react-query'
import { ClipboardList, RefreshCw, Clock } from 'lucide-react'
import toastApiError, { requestsService } from '../services/api'
import { EmptyState, ErrorState, SkeletonList } from '../components/ui/Feedback'
import { UNIT_LABELS } from '../types/api'
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
  const query = useQuery({
    queryKey: ['my-requests'],
    queryFn: () => requestsService.mine(),
    refetchInterval: 15000,
  })

  const requests = query.data ?? []
  const donationLabel = (r: (typeof requests)[number]) =>
    r.donation_id ? 'batch ' + r.donation_id.slice(0, 6) : 'batch'

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
              <div>
                <p className="text-[14px] font-semibold text-text">
                  {donationLabel(r)}
                </p>
                <p className="mt-0.5 text-[12px] text-text-2">
                  {r.requested_quantity} {UNIT_LABELS[r.unit]?.toLowerCase() ?? r.unit}
                  {r.people_to_feed ? ` · feeding ~${r.people_to_feed} people` : ''}
                </p>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-3">
                <span className={cn('rounded-full px-2 py-0.5 font-bold uppercase tracking-wider', STATUS_STYLE[r.status])}>
                  {STATUS_LABEL[r.status]}
                </span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> sent {formatDateTime(r.created_at)}</span>
              </div>
              {r.status === 'rejected' && (
                <p className="mt-2 rounded-lg bg-danger-soft px-3 py-2 text-[12px] text-danger">
                  This batch went to another recipient or was cancelled. Keep browsing for new donors nearby.
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
    </div>
  )
}
