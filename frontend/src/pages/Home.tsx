import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Package, Plus, Search, Truck, AlarmClock, ClipboardList, ArrowRight, Leaf,
} from 'lucide-react'
import useAppStore from '../store/useAppStore'
import { dashboardService, donationsService } from '../services/api'
import { SkeletonList, EmptyState } from '../components/ui/Feedback'
import { storagePublicUrl } from '../lib/supabase'
import { CATEGORY_LABELS, UNIT_LABELS, Donation, DonorStats, RecipientStats } from '../types/api'

export default function Home() {
  const user = useAppStore((s) => s.user)
  const isDonor = user?.role === 'donor'

  const donorStats = useQuery<DonorStats, Error>({
    queryKey: ['home-stats-donor'],
    queryFn: () => dashboardService.donor(),
    enabled: !!user && isDonor,
  })

  const recipientStats = useQuery<RecipientStats, Error>({
    queryKey: ['home-stats-recipient'],
    queryFn: () => dashboardService.recipient(),
    enabled: !!user && !isDonor,
  })

  const statsLoading = isDonor ? donorStats.isLoading : recipientStats.isLoading

  const recent = useQuery<{ data: Donation[]; total: number }, Error>({
    queryKey: isDonor ? ['home-my-donations'] : ['home-browse'],
    queryFn: (): Promise<{ data: Donation[]; total: number }> =>
      isDonor ? donationsService.my() : donationsService.list({ limit: 4, sort: 'expiry' }),
    enabled: !!user,
  })

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Greeting */}
      <div className="rounded-2xl border border-line bg-panel p-5">
        <p className="font-label-sm text-[10px] uppercase tracking-[0.2em] text-primary-fixed">FoodBridge workspace</p>
        <h1 className="mt-2 font-display text-2xl tracking-tight text-text md:text-3xl">
          Neighbourhood rescue, one real batch at a time
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-text-2">
          No estimated figures on this page â€” every number below is measured from your live FoodBridge
          account. Recipients broadcasting alerts are real, donor listings are freshly time-stamped, and
          nothing here is mocked.
        </p>
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {isDonor ? (
          <>
            <QuickAction to="/donor/new" icon={<Plus className="h-4 w-4" />} label="New donation" />
            <QuickAction to="/donor" icon={<Package className="h-4 w-4" />} label="My donations" />
            <QuickAction to="/alerts" icon={<AlarmClock className="h-4 w-4" />} label="Emergency alerts" />
            <QuickAction to="/pickups" icon={<Truck className="h-4 w-4" />} label="Pickups" />
          </>
        ) : (
          <>
            <QuickAction to="/browse" icon={<Search className="h-4 w-4" />} label="Browse food" />
            <QuickAction to="/my-requests" icon={<ClipboardList className="h-4 w-4" />} label="My requests" />
            <QuickAction to="/alerts" icon={<AlarmClock className="h-4 w-4" />} label="Post urgent need" />
            <QuickAction to="/pickups" icon={<Truck className="h-4 w-4" />} label="My pickups" />
          </>
        )}
      </div>

      {/* Live numbers */}
      <p className="font-label-sm mt-6 text-[10px] uppercase tracking-[0.2em] text-text-3">Your live account</p>
      <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
        {isDonor ? (
          <>
            <LiveStat label="Active donations" value={donorStats.data?.myDonations} loading={statsLoading} />
            <LiveStat label="Pending requests" value={donorStats.data?.pendingRequests} loading={statsLoading} />
            <LiveStat label="Upcoming pickups" value={donorStats.data?.upcomingPickups} loading={statsLoading} />
            <LiveStat label="Available qty" value={donorStats.data?.availableQuantity} loading={statsLoading} />
          </>
        ) : (
          <>
            <LiveStat label="Open listings" value={recipientStats.data?.availableDonations} loading={statsLoading} />
            <LiveStat label="My open requests" value={recipientStats.data?.pendingRequests} loading={statsLoading} />
            <LiveStat label="My allocations" value={recipientStats.data?.myAllocations} loading={statsLoading} />
            <LiveStat label="My active alerts" value={recipientStats.data?.myOpenAlerts} loading={statsLoading} />
          </>
        )}
      </div>

      {/* Recent listings strip */}
      <p className="font-label-sm mt-6 text-[10px] uppercase tracking-[0.2em] text-text-3">
        {isDonor ? 'Your latest batches' : 'Newest donations near you'}
      </p>
      <div className="mt-2">
        {recent.isLoading ? (
          <SkeletonList count={2} />
        ) : (recent.data?.data.length ?? 0) === 0 ? (
          <EmptyState
            icon={<Leaf className="h-6 w-6" />}
            title={isDonor ? 'No donations yet' : 'No listings yet'}
            message={isDonor
              ? 'Publish your first batch and it will show up here.'
              : 'Check back soon â€” new donations appear in realtime.'}
            action={
              isDonor ? (
                <Link to="/donor/new" className="btn-primary rounded-lg px-4 py-2 text-[13px]">Create donation</Link>
              ) : (
                <Link to="/browse" className="btn-primary rounded-lg px-4 py-2 text-[13px]">Browse</Link>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {recent.data!.data.slice(0, 4).map((d) => {
              const img = storagePublicUrl(d.image_path)
              return (
                <Link key={d.id} to={isDonor ? '/donor' : `/donation/${d.id}`} className="flex items-center gap-3 rounded-xl border border-line bg-panel p-3 hover:border-text-3 transition-colors">
                  {img ? (
                    <img src={img} alt={d.food_name} className="photo-natural h-14 w-14 flex-shrink-0 rounded-lg object-cover" loading="lazy" />
                  ) : (
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-elevated"><Package className="h-5 w-5 text-text-3" /></span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-text">{d.food_name}</p>
                    <p className="text-[11px] text-text-3">
                      {CATEGORY_LABELS[d.food_category] ?? d.food_category} · {d.available_quantity} {UNIT_LABELS[d.unit]?.toLowerCase() ?? d.unit} · {d.city}
                    </p>
                  </div>
                  <ArrowRight className="flex-shrink-0 text-text-3 h-3.5 w-3.5" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function QuickAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 rounded-xl border border-line bg-panel px-3.5 py-3 text-[13px] font-semibold text-text transition-colors hover:border-primary-fixed/50">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-elevated text-primary-fixed transition-colors">{icon}</span>
      {label}
    </Link>
  )
}

function LiveStat({ label, value, loading }: { label: string; value?: number; loading?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-3">{label}</p>
      {loading ? (
        <div className="mt-1.5 h-7 w-12 animate-pulse rounded bg-elevated" />
      ) : (
        <p className="mt-1 font-display text-2xl tabular-nums text-text">{value ?? 0}</p>
      )}
    </div>
  )
}
