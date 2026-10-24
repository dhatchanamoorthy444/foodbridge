import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Filter, CheckCircle2, AlertCircle, Clock, Users, Package, ChevronRight } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { getStatusColor, calculateMatchScore, getCategoryLabel, formatDate } from '../lib/utils'
import { Recipient, MatchResult, FoodItem, MatchScore } from '../types'
import useAppStore from '../store/useAppStore'

const fetchRecipients = async (): Promise<Recipient[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { id: 'r1', userId: 'u1', organization: 'City Food Bank', maxCapacity: 500, storageCapabilities: ['room_temperature', 'refrigerated'], acceptedCategories: ['fruits', 'vegetables', 'grains'], pickupRadius: 10, pickupHours: ['09:00', '11:00', '14:00'], currentInventory: 120, weeklyPickups: 3, status: 'eligible', rating: 4.8 },
    { id: 'r2', userId: 'u2', organization: 'Community Shelter', maxCapacity: 300, storageCapabilities: ['room_temperature', 'refrigerated', 'frozen'], acceptedCategories: ['dairy', 'meat', 'baked_goods'], pickupRadius: 5, pickupHours: ['10:00', '16:00'], currentInventory: 80, weeklyPickups: 5, status: 'eligible', rating: 4.9 },
    { id: 'r3', userId: 'u3', organization: 'Neighborhood Kitchen', maxCapacity: 200, storageCapabilities: ['room_temperature'], acceptedCategories: ['canned_goods', 'grains', 'baked_goods'], pickupRadius: 8, pickupHours: ['08:00', '12:00'], currentInventory: 150, weeklyPickups: 4, status: 'eligible', rating: 4.5 },
    { id: 'r4', userId: 'u4', organization: 'Emergency Relief Fund', maxCapacity: 1000, storageCapabilities: ['room_temperature', 'refrigerated', 'frozen', 'dry_cool'], acceptedCategories: ['all'], pickupRadius: 15, pickupHours: ['09:00', '13:00', '17:00'], currentInventory: 400, weeklyPickups: 7, status: 'eligible', rating: 4.7 },
  ]
}

const fetchAvailableFood = async (): Promise<FoodItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { id: 'f1', donorId: 'd1', name: 'Fresh Apples', category: 'fruits', quantity: 100, unit: 'kg', availableQuantity: 100, expiryDate: new Date('2026-11-10'), storageRequirement: 'room_temperature', status: 'normal', createdAt: new Date(), updatedAt: new Date() },
    { id: 'f2', donorId: 'd2', name: 'Organic Carrots', category: 'vegetables', quantity: 80, unit: 'kg', availableQuantity: 80, expiryDate: new Date('2026-10-30'), storageRequirement: 'refrigerated', status: 'urgent', createdAt: new Date(), updatedAt: new Date() },
    { id: 'f3', donorId: 'd3', name: 'Whole Wheat Bread', category: 'baked_goods', quantity: 200, unit: 'pieces', availableQuantity: 200, expiryDate: new Date('2026-10-26'), storageRequirement: 'room_temperature', status: 'urgent', createdAt: new Date(), updatedAt: new Date() },
  ]
}

const fetchMatches = async (): Promise<MatchResult[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { id: 'm1', recipientId: 'r1', foodItemId: 'f1', requestedQuantity: 50, allocatedQuantity: 50, score: { total: 85, breakdown: { category: 40, quantity: 20, pickup: 16, storage: 15 } }, status: 'pending', createdAt: new Date(), updatedAt: new Date() },
    { id: 'm2', recipientId: 'r2', foodItemId: 'f2', requestedQuantity: 40, allocatedQuantity: 40, score: { total: 90, breakdown: { category: 40, quantity: 20, pickup: 20, storage: 10 } }, status: 'approved', createdAt: new Date(), updatedAt: new Date() },
  ]
}

export default function Matching() {
  const { user } = useAppStore()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'available' | 'matches' | 'all'>('available')

  const { data: recipients = [], isLoading: recipientsLoading } = useQuery({
    queryKey: ['recipients'],
    queryFn: fetchRecipients,
  })

  const { data: foodItems = [], isLoading: foodLoading } = useQuery({
    queryKey: ['availableFood'],
    queryFn: fetchAvailableFood,
  })

  const { data: matches = [] } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  })

  const generateMatches = useMutation({
    mutationFn: async ({ foodId, recipientIds }: { foodId: string; recipientIds: string[] }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return recipientIds.map((recipientId) => ({
        id: crypto.randomUUID(),
        recipientId,
        foodItemId: foodId,
        requestedQuantity: 0,
        allocatedQuantity: 0,
        score: { total: 0, breakdown: { category: 0, quantity: 0, pickup: 0, storage: 0 } },
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    },
    onSuccess: (newMatches) => {
      queryClient.setQueryData(['matches'], (old: MatchResult[] = []) => [...old, ...newMatches])
    },
  })

  // Calculate match scores
  const getMatchScores = (food: FoodItem, recipient: Recipient): MatchScore => {
    // Category match (40% weight)
    const categoryMatch = recipient.acceptedCategories.includes('all') || recipient.acceptedCategories.includes(food.category) ? 100 : 0
    const categoryScore = categoryMatch * 0.4

    // Quantity match (25% weight)
    const quantityScore = Math.min((food.availableQuantity / recipient.maxCapacity) * 100, 100) * 0.25

    // Pickup feasibility (20% weight)
    const pickupScore = recipient.pickupRadius >= 10 ? 80 : recipient.pickupRadius >= 5 ? 100 : 50
    const pickupFeasibility = pickupScore * 0.2

    // Storage compatibility (15% weight)
    const storageScore = recipient.storageCapabilities.includes(food.storageRequirement) ? 100 : 0
    const storageCompatibility = storageScore * 0.15

    return {
      total: Math.round(categoryScore + quantityScore + pickupFeasibility + storageCompatibility),
      breakdown: {
        category: Math.round(categoryScore),
        quantity: Math.round(quantityScore),
        pickup: Math.round(pickupFeasibility),
        storage: Math.round(storageCompatibility),
      },
    }
  }

  const statusColors = {
    pending: 'warning',
    approved: 'primary',
    rejected: 'danger',
    cancelled: 'secondary',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Recipient Matching</h1>
          <p className="text-slate-400 mt-1">
            Find the best recipients for your food donations using our AI-powered matching engine
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['available', 'matches', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'available' && (
        <div className="space-y-4">
          {/* Search */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search available food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500"
              />
              <Button className="btn-secondary">Filter</Button>
            </div>
          </Card>

          {/* Available Food */}
          {foodLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
                  <div className="h-3 bg-slate-700 rounded w-1/2 mb-2" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {foodItems.map((food, idx) => {
                const matchingRecipients = recipients.filter((r) =>
                  r.acceptedCategories.includes('all') || r.acceptedCategories.includes(food.category)
                ).slice(0, 3)

                return (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="p-6 hover:border-primary-500/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-botanical/20 to-botanical/30 flex items-center justify-center text-3xl text-botanical">
                            {food.category === 'fruits' && '🍎'}
                            {food.category === 'vegetables' && '🥦'}
                            {food.category === 'baked_goods' && '🍞'}
                            {food.category === 'dairy' && '🥛'}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{food.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {food.availableQuantity} {food.unit} available
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Expires {formatDate(food.expiryDate)}
                              </span>
                              <span className="capitalize">{food.category.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(food.status)}>
                            {food.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      {/* Matching recipients */}
                      <div className="mt-4 pt-4 border-t border-surface-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-400">Best Matches:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {matchingRecipients.length > 0 ? (
                            matchingRecipients.map((recipient, rIdx) => {
                              const score = getMatchScores(food, recipient)
                              return (
                                <button
                                  key={recipient.id}
                                  onClick={() =>
                                    generateMatches.mutate({
                                      foodId: food.id,
                                      recipientIds: [recipient.id],
                                    })
                                  }
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-surface-border hover:border-primary-500/30 transition-all"
                                >
                                  <span className="text-sm font-medium text-slate-200">{recipient.organization}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300`}>
                                    {score.total}% match
                                  </span>
                                  <ChevronRight className="w-3 h-3 text-slate-500" />
                                </button>
                              )
                            })
                          ) : (
                            <span className="text-sm text-slate-500 italic">No direct matches found</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">Recent Matches ({matches.length})</h3>
              <Button className="btn-secondary">View All</Button>
            </div>
          </Card>

          {matches.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">No matches yet</h3>
              <p className="text-slate-400 mt-1">Generate matches from available food items</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {matches.map((match, idx) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            match.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            match.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {match.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> :
                             match.status === 'pending' ? <Clock className="w-5 h-5" /> :
                             <AlertCircle className="w-5 h-5" />}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">Match #{match.id.slice(-6)}</span>
                            <Badge variant={statusColors[match.status]}>{match.status}</Badge>
                          </div>
                          <p className="text-sm text-slate-400">
                            {match.allocatedQuantity} units matched
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{match.score.total}%</div>
                        <div className="text-xs text-slate-500">Match Score</div>
                      </div>
                    </div>

                    {/* Score breakdown */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Category match (40%):</span>
                        <span className="text-slate-300">{match.score.breakdown.category}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${match.score.breakdown.category * 0.4}%` }} />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Quantity match (25%):</span>
                        <span className="text-slate-300">{match.score.breakdown.quantity}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${match.score.breakdown.quantity * 0.25}%` }} />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Pickup feasibility (20%):</span>
                        <span className="text-slate-300">{match.score.breakdown.pickup}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${match.score.breakdown.pickup * 0.2}%` }} />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Storage compatibility (15%):</span>
                        <span className="text-slate-300">{match.score.breakdown.storage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${match.score.breakdown.storage * 0.15}%` }} />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-surface-border flex justify-end">
                      <Button className="btn-secondary text-xs py-1.5">View Details</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'all' && (
        <div className="text-center py-12">
          <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-white">All Matches</h3>
          <p className="text-slate-400 mt-1">View complete history of all matches</p>
        </div>
      )}
    </div>
  )
}