import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Package,
  Users,
  Truck,
  Clock,
  TrendingUp,
  AlertTriangle,
  Utensils,
  DollarSign,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card } from '../components/ui/Card'
import { getStatusColor, formatDate } from '../lib/utils'
import { ExpiryStatus, DashboardStats, FoodItem, MatchResult, Pickup } from '../types'
import { useAppStore } from '../store/useAppStore'

const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444', '#a855f7']

// Simulated API
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    totalDonations: 1247,
    totalRedistributed: 892,
    activeDonors: 45,
    activeRecipients: 28,
    foodWastePrevented: 3452,
    upcomingExpirations: 23,
    pendingPickups: 5,
    completionRate: 94.6,
  }
}

const fetchExpiryBreakdown = async (): Promise<Array<{ name: string; value: number; color: string }>> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    { name: 'Normal', value: 45, color: '#22c55e' },
    { name: 'Urgent', value: 23, color: '#eab308' },
    { name: 'Critical', value: 18, color: '#f97316' },
    { name: 'Expired', value: 14, color: '#ef4444' },
    { name: 'Safety Review', value: 10, color: '#a855f7' },
  ]
}

const fetchRecentActivity = async (): Promise<FoodItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return [
    { id: '1', donorId: 'd1', name: 'Fresh Apples', category: 'fruits', quantity: 50, unit: 'kg', availableQuantity: 50, expiryDate: new Date('2026-10-30'), storageRequirement: 'room_temperature', status: 'normal', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', donorId: 'd2', name: 'Organic Spinach', category: 'vegetables', quantity: 30, unit: 'kg', availableQuantity: 30, expiryDate: new Date('2026-10-25'), storageRequirement: 'refrigerated', status: 'urgent', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', donorId: 'd1', name: 'Bread Loaves', category: 'baked_goods', quantity: 100, unit: 'pieces', availableQuantity: 100, expiryDate: new Date('2026-10-24'), storageRequirement: 'room_temperature', status: 'critical', createdAt: new Date(), updatedAt: new Date() },
  ]
}

export default function Dashboard() {
  const { user } = useAppStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  })

  const { data: expiryBreakdown } = useQuery({
    queryKey: ['expiryBreakdown'],
    queryFn: fetchExpiryBreakdown,
  })

  const { data: recentActivity } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity,
  })

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num
  }

  const StatusBadge = ({ status }: { status: ExpiryStatus }) => {
    const colors: Record<ExpiryStatus, string> = {
      normal: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
      urgent: 'bg-warning-500/20 text-warning-300 border-warning-500/30',
      critical: 'bg-accent-500/20 text-accent-300 border-accent-500/30',
      expired: 'bg-danger-500/20 text-danger-300 border-danger-500/30',
      safety_review: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    }

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status]} capitalize`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Good {time.getHours() < 12 ? 'Morning' : time.getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.fullName?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-slate-400 mt-1">
            {formatDate(time)}, {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-slate-400">Current Role</p>
          <p className="font-medium text-primary-400 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Donations</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats?.totalDonations ?? 0}</h3>
              <p className="text-xs text-primary-400 mt-1">+12% this month</p>
            </div>
            <div className="p-3 rounded-lg bg-primary-500/10">
              <Package className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Food Redistributed</p>
              <h3 className="text-3xl font-bold text-white mt-1">{formatNumber(stats?.totalRedistributed ?? 0)}</h3>
              <p className="text-xs text-green-400 mt-1">+18% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Waste Prevented</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats?.foodWastePrevented ?? 0} kg</h3>
              <p className="text-xs text-primary-400 mt-1">Equivalent to 1,234 meals</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-500/10">
              <Utensils className="w-6 h-6 text-accent-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Completion Rate</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats?.completionRate ?? 0}%</h3>
              <p className="text-xs text-slate-500 mt-1">94.6% success rate</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-6">Food Expiry Status</h3>
          <div className="h-[250px]">
            {expiryBreakdown && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expiryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {expiryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-white mb-6">Recent Expiring Items</h3>
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
            {recentActivity?.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center text-xl text-botanical">
                    {item.category === 'fruits' && '🍎'}
                    {item.category === 'vegetables' && '🥦'}
                    {item.category === 'baked_goods' && '🍞'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      {item.quantity} {item.unit} • Expires {formatDate(item.expiryDate)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold text-white mb-4">Important Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-danger-500/10 border border-danger-500/20">
              <AlertTriangle className="w-6 h-6 text-danger-400 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-danger-300">3 Items Expiring Today</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Bread, Milk, and Yogurt need immediate attention. Consider scheduling pickups or donating.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent-500/10 border border-accent-500/20">
              <Clock className="w-6 h-6 text-accent-400 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-accent-300">Pickup Request Pending</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Community Food Bank has a new request for dry goods.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Donors</span>
              <span className="font-bold text-white">{stats?.activeDonors ?? 0}</span>
            </div>
            <div className="w-full h-px bg-surface-border" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Recipients</span>
              <span className="font-bold text-white">{stats?.activeRecipients ?? 0}</span>
            </div>
            <div className="w-full h-px bg-surface-border" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pending Pickups</span>
              <span className="font-bold text-white">{stats?.pendingPickups ?? 0}</span>
            </div>
            <div className="w-full h-px bg-surface-border" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Upcoming Expirations</span>
              <span className="font-bold text-danger-400">{stats?.upcomingExpirations ?? 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}