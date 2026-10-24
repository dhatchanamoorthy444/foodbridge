// User types
export type UserRole = 'donor' | 'recipient' | 'admin' | 'volunteer'
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  status: UserStatus
  organization?: string
  phone?: string
  address?: string
  createdAt: Date
  lastLogin?: Date
}

// Food inventory types
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

// Matching and allocation types
export type EligibilityStatus = 'eligible' | 'ineligible' | 'pending'
export type RejectionReason =
  | 'quantity_exceeded'
  | 'storage_incompatible'
  | 'category_mismatch'
  | 'pickup_unavailable'
  | 'expiry_imminent'
  | 'other'

export interface Recipient {
  id: string
  userId: string
  organization: string
  maxCapacity: number
  storageCapabilities: StorageRequirement[]
  acceptedCategories: FoodCategory[]
  pickupRadius: number // km
  pickupHours: string[]
  currentInventory: number
  weeklyPickups: number
  status: EligibilityStatus
  rating: number // 1-5
  notes?: string
}

export interface MatchScore {
  total: number // 0-100
  breakdown: {
    category: number // 0-40
    quantity: number // 0-25
    pickup: number // 0-20
    storage: number // 0-15
  }
  rejectionReasons?: RejectionReason[]
}

export interface MatchResult {
  recipientId: string
  foodItemId: string
  requestedQuantity: number
  allocatedQuantity: number
  score: MatchScore
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Pickup and scheduling types
export type PickupStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_transit'
  | 'delivered'
  | 'collected'
  | 'cancelled'

export interface Pickup {
  id: string
  matchId: string
  scheduledDate: Date
  scheduledTime: string
  status: PickupStatus
  volunteerId?: string
  recipientId: string
  donorId: string
  foodItems: Array<{
    itemId: string
    allocatedQuantity: number
    actualQuantity?: number
  }>
  notes?: string
  confirmationCode?: string
  confirmedAt?: Date
  collectedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Analytics types
export interface DashboardStats {
  totalDonations: number
  totalRedistributed: number
  activeDonors: number
  activeRecipients: number
  foodWastePrevented: number // kg
  upcomingExpirations: number
  pendingPickups: number
  completionRate: number // percentage
}

export interface CategoryDistribution {
  category: FoodCategory
  count: number
  totalQuantity: number
}

export interface MonthlyStats {
  month: string
  donations: number
  redistributed: number
  wastePrevented: number
}

// Notification types
export type NotificationType =
  | 'expiry_warning'
  | 'match_found'
  | 'pickup_scheduled'
  | 'pickup_confirmed'
  | 'system_alert'
  | 'welcome'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data?: Record<string, any>
  createdAt: Date
}

// Form validation types
export interface InventoryFormData {
  name: string
  description?: string
  category: FoodCategory
  quantity: number
  unit: Unit
  expiryDate: string
  storageRequirement: StorageRequirement
  conditionNotes?: string
}

// 3D scene types
export interface FoodItem3D {
  id: string
  type: FoodCategory
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  status: ExpiryStatus
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}