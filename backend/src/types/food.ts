export type FoodCategory =
  | 'fruits'
  | 'vegetables'
  | 'dairy'
  | 'meat'
  | 'grains'
  | 'canned_goods'
  | 'baked_goods'
  | 'beverages'
  | 'prepared_food'
  | 'other'

export type StorageRequirement =
  | 'room_temperature'
  | 'refrigerated'
  | 'frozen'
  | 'dry_cool'
  | 'special'

export type Unit =
  | 'kg'
  | 'g'
  | 'lb'
  | 'oz'
  | 'liters'
  | 'ml'
  | 'pieces'
  | 'boxes'
  | 'pallets'

export type ExpiryStatus =
  | 'normal'
  | 'urgent'
  | 'critical'
  | 'expired'
  | 'safety_review'

export interface FoodItem {
  id: string
  donorId: string
  name: string
  description?: string
  category: FoodCategory
  quantity: number
  unit: Unit
  availableQuantity: number
  expiryDate: Date
  storageRequirement: StorageRequirement
  conditionNotes?: string
  status: ExpiryStatus
  createdAt: Date
  updatedAt: Date
}