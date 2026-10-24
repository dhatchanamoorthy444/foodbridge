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