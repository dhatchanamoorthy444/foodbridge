import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Download, Trash2, Edit, Package, Clock, AlertTriangle } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Input, Select, Button } from '../components/ui/Form'
import { getStatusColor, formatDate, getDaysUntilExpiry, getCategoryLabel, getStorageLabel } from '../lib/utils'
import { FoodItem, FoodCategory, StorageRequirement, Unit, ExpiryStatus, InventoryFilters } from '../types'
import useAppStore from '../store/useAppStore'

// Mock API
const fetchInventory = async (): Promise<FoodItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { id: '1', donorId: 'd1', name: 'Fresh Apples', category: 'fruits', quantity: 50, unit: 'kg', availableQuantity: 50, expiryDate: new Date('2026-10-30'), storageRequirement: 'room_temperature', conditionNotes: 'Organic, Grade A', status: 'normal', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', donorId: 'd1', name: 'Organic Spinach', category: 'vegetables', quantity: 30, unit: 'kg', availableQuantity: 30, expiryDate: new Date('2026-10-25'), storageRequirement: 'refrigerated', conditionNotes: 'Fresh picked today', status: 'urgent', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', donorId: 'd2', name: 'Whole Wheat Bread', category: 'baked_goods', quantity: 100, unit: 'pieces', availableQuantity: 100, expiryDate: new Date('2026-10-24'), storageRequirement: 'room_temperature', conditionNotes: '', status: 'critical', createdAt: new Date(), updatedAt: new Date() },
    { id: '4', donorId: 'd3', name: 'Canned Beans', category: 'canned_goods', quantity: 50, unit: 'boxes', availableQuantity: 50, expiryDate: new Date('2027-03-15'), storageRequirement: 'room_temperature', conditionNotes: 'Multiple flavors', status: 'normal', createdAt: new Date(), updatedAt: new Date() },
    { id: '5', donorId: 'd2', name: 'Expired Yogurt', category: 'dairy', quantity: 20, unit: 'liters', availableQuantity: 0, expiryDate: new Date('2026-10-22'), storageRequirement: 'refrigerated', conditionNotes: 'Past expiry', status: 'expired', createdAt: new Date(), updatedAt: new Date() },
  ]
}

const deleteItem = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
}

export default function Inventory() {
  const { user } = useAppStore()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<InventoryFilters>({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filters.category ? filters.category.includes(item.category) : true
    const matchesStatus = filters.status ? filters.status.includes(item.status) : true
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: ExpiryStatus) => {
    const styles = {
      normal: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
      urgent: 'bg-warning-500/20 text-warning-300 border-warning-500/30',
      critical: 'bg-accent-500/20 text-accent-300 border-accent-500/30',
      expired: 'bg-danger-500/20 text-danger-300 border-danger-500/30',
      safety_review: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    }
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]} capitalize`}>{status.replace('_', ' ')}</span>
  }

  const columns = [
    { header: 'Item', key: 'name', width: '30%' },
    { header: 'Category', key: 'category', width: '15%' },
    { header: 'Available', key: 'availableQuantity', width: '15%' },
    { header: 'Expiry', key: 'expiryDate', width: '15%' },
    { header: 'Status', key: 'status', width: '15%' },
    { header: 'Actions', key: 'actions', width: '10%' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Food Inventory</h1>
          <p className="text-slate-400 mt-1">Manage your donations and track food availability</p>
        </div>
        {user?.role === 'donor' && (
          <Button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="btn-secondary">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-card border-b border-surface-border">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={`table-header ${col.width === '10%' ? 'text-center' : 'text-left'}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No items found matching your filters
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <div className="font-medium text-slate-200">{item.name}</div>
                      <div className="text-xs text-slate-500">ID: {item.id}</div>
                    </td>
                    <td className="table-cell capitalize">{getCategoryLabel(item.category)}</td>
                    <td className="table-cell">
                      {item.availableQuantity} {item.unit}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {formatDate(item.expiryDate)}
                        {getDaysUntilExpiry(item.expiryDate) < 3 && (
                          <span className="text-xs text-danger-400 font-medium">
                            ({getDaysUntilExpiry(item.expiryDate)} days)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="table-cell text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        {user?.role === 'donor' && (
                          <button
                            onClick={() => deleteMutation.mutate(item.id)}
                            className="p-1.5 rounded hover:bg-danger-500/20 text-slate-400 hover:text-danger-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}