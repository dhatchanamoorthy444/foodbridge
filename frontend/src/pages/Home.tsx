import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import useAppStore from '../store/useAppStore'
import { dashboardService, donationsService } from '../services/api'
import { formatRelativeTime } from '../lib/utils'
import { Donation, DonorStats, RecipientStats } from '../types/api'

export default function Home() {
  const user = useAppStore((s) => s.user)
  const navigate = useNavigate()
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

  const batches = recent.data?.data ?? []

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 max-w-7xl mx-auto">
      {/* ── Operational Station Banner ── */}
      <div className="relative rounded-2xl bg-[#131713] border border-[#262E26] p-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#143527]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#D7EF4A] text-[#090B09] font-mono text-[10px] uppercase font-bold tracking-wider">
                LIVE TELEMETRY
              </span>
              <span className="font-mono text-xs text-[#858C84] uppercase tracking-wider">
                NODE // {isDonor ? 'PURVEYOR TERMINAL' : 'RECEIVING STATION'}
              </span>
            </div>
            <h1 className="font-['Anton'] text-3xl md:text-4xl text-white uppercase tracking-wide mt-2">
              {user?.organization || user?.full_name || 'FoodBridge Station Ops'}
            </h1>
            <p className="text-sm text-[#B8BDB6] mt-1.5 leading-relaxed">
              Real-time food redistribution network active. Expiry tracking, verified logistics, and zero-waste telemetry connected.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isDonor ? (
              <button
                onClick={() => navigate('/donor/new')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D7EF4A] text-[#090B09] font-mono text-xs uppercase tracking-wider font-extrabold hover:bg-[#E8F5A4] transition-all shadow-lg active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                LOG SURPLUS BATCH (+)
              </button>
            ) : (
              <button
                onClick={() => navigate('/browse')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D7EF4A] text-[#090B09] font-mono text-xs uppercase tracking-wider font-extrabold hover:bg-[#E8F5A4] transition-all shadow-lg active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                BROWSE MARKETPLACE →
              </button>
            )}
            <button
              onClick={() => navigate('/alerts')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#410002] border border-[#FF5449]/40 text-[#FFDAD6] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#690005] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
              RADAR ALERTS
            </button>
          </div>
        </div>
      </div>

      {/* ── Key Operational Telemetry Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isDonor ? (
          <>
            <MetricTile
              label="Active Surplus Batches"
              value={donorStats.data?.myDonations ?? 0}
              unit="BATCHES"
              icon="inventory_2"
              loading={statsLoading}
              accent
            />
            <MetricTile
              label="Available Inventory"
              value={donorStats.data?.availableQuantity ?? 0}
              unit="UNITS"
              icon="restaurant"
              loading={statsLoading}
            />
            <MetricTile
              label="Queued Requests"
              value={donorStats.data?.pendingRequests ?? 0}
              unit="SHELTERS"
              icon="pending_actions"
              loading={statsLoading}
            />
            <MetricTile
              label="Active Fleet Transits"
              value={donorStats.data?.upcomingPickups ?? 0}
              unit="DISPATCH"
              icon="local_shipping"
              loading={statsLoading}
            />
          </>
        ) : (
          <>
            <MetricTile
              label="Active Requests"
              value={recipientStats.data?.myRequestsTotal ?? 0}
              unit="CLAIMS"
              icon="receipt_long"
              loading={statsLoading}
              accent
            />
            <MetricTile
              label="Approved Allocations"
              value={recipientStats.data?.approvedRequests ?? 0}
              unit="PORTIONS"
              icon="volunteer_activism"
              loading={statsLoading}
            />
            <MetricTile
              label="Active Transits"
              value={recipientStats.data?.upcomingPickups ?? 0}
              unit="PICKUPS"
              icon="local_shipping"
              loading={statsLoading}
            />
            <MetricTile
              label="Urgent Broadcasts"
              value={recipientStats.data?.myOpenAlerts ?? 0}
              unit="ACTIVE"
              icon="crisis_alert"
              loading={statsLoading}
            />
          </>
        )}
      </div>

      {/* ── Live Batch Feed ── */}
      <div className="rounded-xl bg-[#131713] border border-[#262E26] p-5 shadow-md flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#262E26]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D7EF4A] text-[20px]">radar</span>
            <h3 className="font-['Anton'] text-lg text-white uppercase tracking-wide">
              {isDonor ? 'RECENT DISPATCH INVENTORY' : 'LIVE SURPLUS RADAR FEED'}
            </h3>
          </div>
          <Link
            to={isDonor ? '/donor' : '/browse'}
            className="font-mono text-xs text-[#D7EF4A] hover:text-[#E8F5A4] uppercase font-bold tracking-wider"
          >
            VIEW ALL →
          </Link>
        </div>

        {recent.isLoading ? (
          <div className="py-12 text-center font-mono text-xs text-[#858C84] uppercase">
            Syncing telemetry feed...
          </div>
        ) : batches.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-[#858C84] uppercase">
            No live batches reported on radar
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {batches.map((b) => (
              <div
                key={b.id}
                onClick={() => navigate(isDonor ? `/donor/${b.id}/edit` : `/browse/${b.id}`)}
                className="p-4 rounded-xl bg-[#1C221C] border border-[#262E26] hover:border-[#D7EF4A]/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#143527] text-[#D7EF4A] flex items-center justify-center font-bold flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">restaurant</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="font-bold text-white text-sm truncate uppercase group-hover:text-[#D7EF4A] transition-colors">
                      {b.food_name}
                    </h4>
                    <span className="font-mono text-[11px] text-[#858C84]">
                      {b.available_quantity ?? b.quantity} {b.unit} • {b.food_category?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#263300] text-[#D7EF4A] uppercase font-bold">
                    {b.status}
                  </span>
                  <span className="font-mono text-[9px] text-[#858C84] mt-1">
                    {b.expires_at ? formatRelativeTime(b.expires_at) : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MetricTile({
  label,
  value,
  unit,
  icon,
  loading,
  accent,
}: {
  label: string
  value?: number
  unit: string
  icon: string
  loading: boolean
  accent?: boolean
}) {
  return (
    <div className="p-4 rounded-xl bg-[#131713] border border-[#262E26] flex flex-col justify-between shadow-md hover:bg-[#1C221C] transition-all">
      <div className="flex items-center justify-between text-[#858C84]">
        <span className="font-mono text-[10px] uppercase tracking-wider font-bold truncate">
          {label}
        </span>
        <span className={`material-symbols-outlined text-[20px] ${accent ? 'text-[#D7EF4A]' : 'text-[#858C84]'}`}>
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        {loading ? (
          <div className="h-8 w-16 bg-[#1C221C] animate-pulse rounded" />
        ) : (
          <span className={`font-['Anton'] text-3xl ${accent ? 'text-[#D7EF4A]' : 'text-white'}`}>
            {value ?? 0}
          </span>
        )}
        <span className="font-mono text-[10px] text-[#858C84] font-bold">{unit}</span>
      </div>
    </div>
  )
}
