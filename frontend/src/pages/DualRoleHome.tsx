import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Store, Heart, TrendingUp, Package } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import { dashboardService, donationsService } from '../services/api'
import RoleCard from '../components/dashboard/RoleCard'
import ImpactDashboard from '../components/dashboard/ImpactDashboard'
import LiveFoodFeed from '../components/dashboard/LiveFoodFeed'
import type { Donation } from '../types/api'

export default function DualRoleHome() {
  const user = useAppStore((s) => s.user)
  const navigate = useNavigate()

  // Fetch platform-wide metrics for impact dashboard
  const donorStats = useQuery({
    queryKey: ['home-donor-stats'],
    queryFn: () => dashboardService.donor(),
    staleTime: 1000 * 30,
  })

  const recipientStats = useQuery({
    queryKey: ['home-recipient-stats'],
    queryFn: () => dashboardService.recipient(),
    staleTime: 1000 * 30,
  })

  // Fetch recent donations for live feed
  const recentDonations = useQuery<{ data: Donation[]; total: number }>({
    queryKey: ['home-recent-donations'],
    queryFn: () => donationsService.list({ limit: 6, sort: 'expiry' }),
    staleTime: 1000 * 20,
  })

  // Calculate platform-wide metrics
  const platformMetrics = {
    totalMealsSaved: (donorStats.data?.completedDonations || 0) * 15 + 1247, // Demo multiplier
    activeFoodListings: recipientStats.data?.availableDonations || 8,
    ngosConnected: 23, // Demo count
    foodWastePrevented: (donorStats.data?.availableQuantity || 0) * 0.5 + 489, // Demo calculation
  }

  const handleDonorClick = () => {
    // If already a donor, go to donor dashboard; otherwise navigate to role-based flow
    if (user?.role === 'donor' || user?.role === 'admin') {
      navigate('/donor')
    } else {
      navigate('/donor/new')
    }
  }

  const handleRecipientClick = () => {
    // If already a recipient, go to browse; otherwise navigate to role-based flow
    if (user?.role === 'recipient' || user?.role === 'admin') {
      navigate('/browse')
    } else {
      navigate('/browse')
    }
  }

  const handleClaimClick = (donationId: string) => {
    navigate(`/browse/${donationId}`)
  }

  return (
    <div className="flex flex-col w-full pb-16 space-y-8 max-w-[1600px] mx-auto">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl bg-gradient-to-br from-[#131713] to-[#0D0F0D] border border-[#262E26] p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#143527]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#410002]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#D7EF4A] flex items-center justify-center">
              <Package className="w-6 h-6 text-[#090B09]" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-[#D7EF4A]/10 border border-[#D7EF4A]/30 text-[#D7EF4A] font-mono text-[10px] uppercase font-bold tracking-wider">
                LIVE PLATFORM
              </span>
            </div>
          </div>

          <h1 className="font-['Anton'] text-4xl md:text-5xl text-white uppercase tracking-wide mb-3">
            FoodBridge Dual-Role Platform
          </h1>
          <p className="text-lg text-[#B8BDB6] max-w-3xl leading-relaxed">
            Connect surplus food from restaurants, hotels, and events directly with NGOs, shelters, and community kitchens.
            Choose your role to start making an impact in real-time.
          </p>

          {user && (
            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-[#1C221C] border border-[#262E26]">
              <div className="w-10 h-10 rounded-lg bg-[#143527] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-[#D7EF4A]">
                  account_circle
                </span>
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  {user.organization || user.full_name || 'Demo User'}
                </p>
                <p className="font-mono text-[11px] text-[#858C84] uppercase">
                  {user.role} • {user.city || 'Chennai'}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Dual Role Selector Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RoleCard
          title="Donor"
          description="Share surplus food from your restaurant, hotel, event, or household. List excess meals, ingredients, or packaged goods with quantity, expiry, and pickup details."
          icon={Store}
          accentColor="#D7EF4A"
          bgGradient="linear-gradient(135deg, #131713 0%, #1C221C 100%)"
          features={[
            'List food batches in 30 seconds',
            'Set expiry windows & pickup locations',
            'Track real-time claims from NGOs',
            'Automatic expiry countdown alerts',
          ]}
          buttonText="Share Surplus Food"
          onClick={handleDonorClick}
          badge={user?.role === 'donor' ? 'ACTIVE' : undefined}
        />

        <RoleCard
          title="Acceptor"
          description="Browse and claim available food donations for your NGO, shelter, volunteer group, or community kitchen. Filter by distance, urgency, and food type."
          icon={Heart}
          accentColor="#FF5449"
          bgGradient="linear-gradient(135deg, #131713 0%, #1C221C 100%)"
          features={[
            'Real-time food availability feed',
            'Filter by distance & expiry urgency',
            'One-click claim & pickup scheduling',
            'Direct communication with donors',
          ]}
          buttonText="Request / Claim Food"
          onClick={handleRecipientClick}
          badge={user?.role === 'recipient' ? 'ACTIVE' : undefined}
        />
      </div>

      {/* Live Impact Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ImpactDashboard
          metrics={platformMetrics}
          loading={donorStats.isLoading || recipientStats.isLoading}
        />
      </motion.div>

      {/* Live Food Availability Feed */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <LiveFoodFeed
          donations={recentDonations.data?.data || []}
          loading={recentDonations.isLoading}
          onClaimClick={handleClaimClick}
          onViewAllClick={() => navigate('/browse')}
          userRole={user?.role}
        />
      </motion.div>

      {/* Platform Activity Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-[#0D0F0D] border border-[#262E26] p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#330036] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#E74AEF]" />
          </div>
          <div>
            <h2 className="font-['Anton'] text-xl text-white uppercase tracking-wide">
              Platform Activity Breakdown
            </h2>
            <p className="font-mono text-[10px] text-[#858C84] uppercase tracking-wider">
              Daily rescue trend & category distribution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <div className="col-span-2 space-y-3">
            <h3 className="font-mono text-xs text-[#858C84] uppercase tracking-wider font-bold mb-3">
              Meals Rescued by Category (Today)
            </h3>
            {[
              { label: 'Prepared Food', value: 85, color: '#D7EF4A' },
              { label: 'Grains & Cereals', value: 65, color: '#4AE7EF' },
              { label: 'Fruits & Vegetables', value: 50, color: '#4AEF7A' },
              { label: 'Baked Goods', value: 40, color: '#FFA04A' },
              { label: 'Canned Goods', value: 30, color: '#E74AEF' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#E6E9E3]">{item.label}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: item.color }}>
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 bg-[#131713] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-[#858C84] uppercase tracking-wider font-bold mb-3">
              Today's Highlights
            </h3>
            {[
              { label: 'Peak Listing Hour', value: '6:00 PM', icon: 'schedule' },
              { label: 'Avg Response Time', value: '12 min', icon: 'timer' },
              { label: 'Success Rate', value: '94%', icon: 'check_circle' },
              { label: 'Active Donors', value: '18', icon: 'store' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#131713] border border-[#262E26]"
              >
                <span className="material-symbols-outlined text-[20px] text-[#D7EF4A]">
                  {stat.icon}
                </span>
                <div>
                  <p className="font-mono text-xs text-[#858C84] uppercase">{stat.label}</p>
                  <p className="font-bold text-white text-sm">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
