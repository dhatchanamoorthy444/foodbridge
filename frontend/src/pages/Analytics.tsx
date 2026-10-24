import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Download,
  Filter,
  Calendar,
  Clock,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getStatusColor, getCategoryLabel, formatNumber } from '../lib/utils'
import { DashboardStats, CategoryDistribution, MonthlyStats } from '../types'
import useAppStore from '../store/useAppStore'

const fetchMonthlyStats = async (): Promise<MonthlyStats[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { month: 'Jul', donations: 120, redistributed: 95, wastePrevented: 280 },
    { month: 'Aug', donations: 135, redistributed: 108, wastePrevented: 310 },
    { month: 'Sep', donations: 152, redistributed: 127, wastePrevented: 365 },
    { month: 'Oct', donations: 168, redistributed: 142, wastePrevented: 410 },
    { month: 'Nov', donations: 189, redistributed: 168, wastePrevented: 485 },
    { month: 'Dec', donations: 215, redistributed: 198, wastePrevented: 565 },
  ]
}

const fetchCategoryDistribution = async (): Promise<CategoryDistribution[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { category: 'fruits', count: 45, totalQuantity: 230 },
    { category: 'vegetables', count: 38, totalQuantity: 185 },
    { category: 'baked_goods', count: 62, totalQuantity: 312 },
    { category: 'canned_goods', count: 28, totalQuantity: 98 },
    { category: 'dairy', count: 32, totalQuantity: 145 },
    { category: 'meat', count: 15, totalQuantity: 67 },
  ]
}

const fetchActivityTrends = async (): Promise<MonthlyStats[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { month: 'Jan', donations: 110, redistributed: 88 },
    { month: 'Feb', donations: 125, redistributed: 102 },
    { month: 'Mar', donations: 118, redistributed: 99 },
    { month: 'Apr', donations: 142, redistributed: 118 },
    { month: 'May', donations: 155, redistributed: 135 },
    { month: 'Jun', donations: 168, redistributed: 148 },
  ]
}

export default function Analytics() {
  const { user } = useAppStore()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  const { data: monthlyStats = [] } = useQuery({
    queryKey: ['monthlyStats'],
    queryFn: fetchMonthlyStats,
  })

  const { data: categoryDistribution = [] } = useQuery({
    queryKey: ['categoryDistribution'],
    queryFn: fetchCategoryDistribution,
  })

  const { data: activityTrends = [] } = useQuery({
    queryKey: ['activityTrends'],
    queryFn: fetchActivityTrends,
  })

  const COLORS = ['#22c55e', '#f97316', '#a855f7', '#3b82f6', '#eab308', '#ef4444']

  // Calculate totals
  const totalDonations = monthlyStats.reduce((sum, m) => sum + m.donations, 0)
  const totalRedistributed = monthlyStats.reduce((sum, m) => sum + m.redistributed, 0)
  const totalWastePrevented = monthlyStats.reduce((sum, m) => sum + m.wastePrevented, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-slate-400 mt-1">
            Track your impact and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="btn-secondary">
            <Calendar className="w-4 h-4" /> {timeRange.toUpperCase()}
          </Button>
          <Button className="btn-primary">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Donations</p>
              <h3 className="text-3xl font-bold text-white mt-1">{totalDonations}</h3>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  12.5%
                </span>
                <span className="text-slate-500">vs last month</span>
              </div>
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
              <h3 className="text-3xl font-bold text-white mt-1">{totalRedistributed}</h3>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  18.2%
                </span>
                <span className="text-slate-500">vs last month</span>
              </div>
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
              <h3 className="text-3xl font-bold text-white mt-1">{totalWastePrevented} kg</h3>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  15.8%
                </span>
                <span className="text-slate-500">vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-accent-500/10">
              <Clock className="w-6 h-6 text-accent-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trends Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Monthly Trends</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-lg ${chartType === 'line' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-500'}`}
              >
                <LineChart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-lg ${chartType === 'bar' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-500'}`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={activityTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="donations" name="Donations" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="redistributed" name="Redistributed" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={activityTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend />
                  <Bar dataKey="donations" name="Donations" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="redistributed" name="Redistributed" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-6">Category Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="category"
                  fontSize={12}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categoryDistribution.map((item, index) => (
              <div key={item.category} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-300 capitalize">{getCategoryLabel(item.category)}</span>
                <span className="text-slate-500 ml-auto">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Detailed Metrics</h3>
          <Button className="btn-secondary text-xs">Download CSV</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="table-header">Month</th>
                <th className="table-header">Donations</th>
                <th className="table-header">Redistributed</th>
                <th className="table-header">Waste Prevented (kg)</th>
                <th className="table-header">Redistribution Rate</th>
                <th className="table-header">Meals Provided</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((stat, idx) => {
                const rate = stat.donations > 0 ? ((stat.redistributed / stat.donations) * 100).toFixed(1) : '0.0'
                const meals = Math.round(stat.redistributed * 2.5) // Approximate meals per kg

                return (
                  <motion.tr
                    key={stat.month}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="table-row"
                  >
                    <td className="table-cell font-medium text-white">{stat.month}</td>
                    <td className="table-cell">{stat.donations}</td>
                    <td className="table-cell text-primary-400 font-medium">{stat.redistributed}</td>
                    <td className="table-cell text-green-400">{stat.wastePrevented}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(rate) >= 80 ? 'bg-green-500/20 text-green-400' :
                        parseFloat(rate) >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {rate}%
                      </span>
                    </td>
                    <td className="table-cell">{formatNumber(meals)}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}