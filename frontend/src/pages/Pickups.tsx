import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Truck, Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Filter, Search } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { getStatusColor, formatDate } from '../lib/utils'
import { Pickup, PickupStatus } from '../types'
import useAppStore from '../store/useAppStore'

const fetchPickups = async (): Promise<Pickup[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    {
      id: 'p1',
      matchId: 'm1',
      scheduledDate: new Date('2026-10-25'),
      scheduledTime: '09:00',
      status: 'scheduled',
      volunteerId: 'v1',
      recipientId: 'r1',
      donorId: 'd1',
      foodItems: [{ itemId: 'f1', allocatedQuantity: 50 }],
      notes: 'Left at front desk',
      confirmationCode: 'ABC123',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'p2',
      matchId: 'm2',
      scheduledDate: new Date('2026-10-24'),
      scheduledTime: '10:00',
      status: 'confirmed',
      volunteerId: 'v2',
      recipientId: 'r2',
      donorId: 'd2',
      foodItems: [{ itemId: 'f2', allocatedQuantity: 40 }],
      notes: 'Call when arriving',
      confirmationCode: 'DEF456',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'p3',
      matchId: 'm3',
      scheduledDate: new Date('2026-10-26'),
      scheduledTime: '14:00',
      status: 'in_transit',
      volunteerId: 'v3',
      recipientId: 'r3',
      donorId: 'd3',
      foodItems: [{ itemId: 'f3', allocatedQuantity: 30 }],
      confirmationCode: 'GHI789',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'p4',
      matchId: 'm4',
      scheduledDate: new Date('2026-10-20'),
      scheduledTime: '08:00',
      status: 'collected',
      volunteerId: 'v1',
      recipientId: 'r1',
      donorId: 'd1',
      foodItems: [{ itemId: 'f4', allocatedQuantity: 25, actualQuantity: 25 }],
      confirmedAt: new Date(),
      collectedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

export default function Pickups() {
  const { user } = useAppStore()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: pickups = [], isLoading } = useQuery({
    queryKey: ['pickups'],
    queryFn: fetchPickups,
  })

  const statusConfig: Record<PickupStatus, { label: string; color: string; icon: any }> = {
    scheduled: { label: 'Scheduled', color: 'primary', icon: Calendar },
    confirmed: { label: 'Confirmed', color: 'primary', icon: CheckCircle2 },
    in_transit: { label: 'In Transit', color: 'accent', icon: Truck },
    delivered: { label: 'Delivered', color: 'primary', icon: CheckCircle2 },
    collected: { label: 'Collected', color: 'primary', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'danger', icon: AlertCircle },
  }

  const filteredPickups = pickups.filter((pickup) => {
    const matchesStatus = filterStatus === 'all' || pickup.status === filterStatus
    const matchesSearch = pickup.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Pickup Schedule</h1>
          <p className="text-slate-400 mt-1">
            Manage and track all food pickup operations
          </p>
        </div>
        <Button className="btn-primary">
          <Calendar className="w-4 h-4" /> Schedule Pickup
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search pickups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', 'scheduled', 'confirmed', 'in_transit', 'collected', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Pickups Grid */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
                <div className="h-3 bg-slate-700 rounded w-1/2 mb-2" />
              </Card>
            ))}
          </div>
        ) : filteredPickups.length === 0 ? (
          <Card className="p-8 text-center">
            <Truck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No pickups found</h3>
            <p className="text-slate-400 mt-1">Try adjusting your filters</p>
          </Card>
        ) : (
          filteredPickups.map((pickup, idx) => {
            const statusConfig = {
              scheduled: { color: 'primary', label: 'Scheduled' },
              confirmed: { color: 'primary', label: 'Confirmed' },
              in_transit: { color: 'accent', label: 'In Transit' },
              delivered: { color: 'primary', label: 'Delivered' },
              collected: { color: 'primary', label: 'Collected' },
              cancelled: { color: 'danger', label: 'Cancelled' },
            }
            const status = statusConfig[pickup.status]

            return (
              <motion.div
                key={pickup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-6 hover:border-primary-500/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {/* Status Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${status.color}-500/20 text-${status.color}-400`}>
                        {status.label === 'Scheduled' && <Calendar className="w-6 h-6" />}
                        {status.label === 'Confirmed' && <CheckCircle2 className="w-6 h-6" />}
                        {status.label === 'In Transit' && <Truck className="w-6 h-6" />}
                        {status.label === 'Delivered' && <CheckCircle2 className="w-6 h-6" />}
                        {status.label === 'Collected' && <CheckCircle2 className="w-6 h-6" />}
                        {status.label === 'Cancelled' && <AlertCircle className="w-6 h-6" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-lg text-white">Pickup #{pickup.id.slice(-6)}</span>
                          <Badge variant={status.color}>{status.label}</Badge>
                        </div>

                        {/* Pickup Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mt-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(pickup.scheduledDate)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {pickup.scheduledTime}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            Donor Location
                          </span>
                        </div>

                        {/* Food Items */}
                        <div className="mt-3">
                          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Food Items</p>
                          <div className="flex flex-wrap gap-2">
                            {pickup.foodItems.map((item, i) => (
                              <div key={i} className="px-2 py-1 rounded bg-surface-elevated text-xs text-slate-300">
                                Item #{i + 1}: {item.allocatedQuantity} units
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        {pickup.status === 'scheduled' && (
                          <div className="mt-4 flex gap-2">
                            <Button className="btn-primary text-xs py-1.5">Confirm</Button>
                            <Button className="btn-secondary text-xs py-1.5">Reschedule</Button>
                            <Button className="btn-danger text-xs py-1.5">Cancel</Button>
                          </div>
                        )}

                        {pickup.status === 'confirmed' && (
                          <div className="mt-4 flex gap-2">
                            <Button className="btn-primary text-xs py-1.5">Mark as In Transit</Button>
                            <Button className="btn-secondary text-xs py-1.5">Cancel</Button>
                          </div>
                        )}

                        {pickup.status === 'in_transit' && (
                          <div className="mt-4 flex gap-2">
                            <Button className="btn-primary text-xs py-1.5">Mark as Collected</Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Confirmation Code */}
                    {pickup.confirmationCode && (
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase font-medium mb-1">Confirmation</div>
                        <div className="font-mono text-xl text-slate-300 tracking-widest">{pickup.confirmationCode}</div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}