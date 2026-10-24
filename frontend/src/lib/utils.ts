import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(d)
}

export function calculateExpiryStatus(expiryDate: Date | string): 'normal' | 'urgent' | 'critical' | 'expired' {
  const expiry = new Date(expiryDate)
  const now = new Date()
  const diff = expiry.getTime() - now.getTime()
  const daysUntilExpiry = Math.ceil(diff / 86400000)

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 1) return 'critical'
  if (daysUntilExpiry <= 3) return 'urgent'
  return 'normal'
}

export function getDaysUntilExpiry(expiryDate: Date | string): number {
  const expiry = new Date(expiryDate)
  const now = new Date()
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / 86400000)
}

export function calculateMatchScore(
  category: string,
  quantityMatch: number,
  pickupFeasibility: number,
  storageCompatibility: number
): { total: number; breakdown: { category: number; quantity: number; pickup: number; storage: number } } {
  const categoryScore = Math.min(category / 40 * 100, 40)
  const quantityScore = Math.min(quantityMatch / 25 * 100, 25)
  const pickupScore = Math.min(pickupFeasibility / 20 * 100, 20)
  const storageScore = Math.min(storageCompatibility / 15 * 100, 15)

  return {
    total: Math.round(categoryScore + quantityScore + pickupScore + storageScore),
    breakdown: {
      category: Math.round(categoryScore),
      quantity: Math.round(quantityScore),
      pickup: Math.round(pickupScore),
      storage: Math.round(storageScore),
    },
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function downloadCSV(data: Record<string, any>[], filename: string): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header]
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value ?? ''
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function groupBy<T, K extends string | number>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const key = getKey(item)
      if (!result[key]) {
        result[key] = []
      }
      result[key].push(item)
      return result
    },
    {} as Record<K, T[]>
  )
}

const categoryLabels: Record<string, string> = {
  fruits: 'Fruits',
  vegetables: 'Vegetables',
  dairy: 'Dairy',
  meat: 'Meat',
  grains: 'Grains',
  canned_goods: 'Canned Goods',
  baked_goods: 'Baked Goods',
  beverages: 'Beverages',
  prepared_food: 'Prepared Food',
  other: 'Other',
}

const storageLabels: Record<string, string> = {
  room_temperature: 'Room Temperature',
  refrigerated: 'Refrigerated',
  frozen: 'Frozen',
  dry_cool: 'Dry/Cool',
  special: 'Special Storage',
}

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category
}

export function getStorageLabel(storage: string): string {
  return storageLabels[storage] || storage
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    normal: 'primary',
    urgent: 'warning',
    critical: 'accent',
    expired: 'danger',
    safety_review: 'purple',
    scheduled: 'primary',
    confirmed: 'primary',
    in_transit: 'warning',
    delivered: 'primary',
    collected: 'primary',
    cancelled: 'danger',
  }
  return colors[status] || 'primary'
}