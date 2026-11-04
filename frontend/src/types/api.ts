export type AppRole = 'donor' | 'recipient' | 'admin' | 'volunteer'

export const UNITS = [
  'kg',
  'g',
  'litres',
  'ml',
  'meals',
  'packets',
  'boxes',
  'pieces',
] as const
export type UnitValue = (typeof UNITS)[number]

export const FOOD_CATEGORIES = [
  'fruits',
  'vegetables',
  'dairy',
  'meat',
  'grains',
  'canned_goods',
  'baked_goods',
  'beverages',
  'prepared_food',
  'other',
] as const
export type FoodCategoryValue = (typeof FOOD_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<string, string> = {
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

export const UNIT_LABELS: Record<string, string> = {
  kg: 'Kilograms',
  g: 'Grams',
  litres: 'Litres',
  ml: 'Millilitres',
  meals: 'Meals',
  packets: 'Packets',
  boxes: 'Boxes',
  pieces: 'Pieces',
}

export const DONOR_ACCOUNT_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'supermarket', label: 'Supermarket' },
  { value: 'grocery_store', label: 'Grocery Store' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'catering_service', label: 'Catering Service' },
  { value: 'food_manufacturer', label: 'Food Manufacturer' },
  { value: 'other_food_business', label: 'Other Food Business' },
]

export const RECIPIENT_ACCOUNT_TYPES = [
  { value: 'ngo', label: 'NGO' },
  { value: 'orphanage', label: 'Orphanage' },
  { value: 'old_age_home', label: 'Old-age Home' },
  { value: 'homeless_shelter', label: 'Homeless Shelter' },
  { value: 'community_kitchen', label: 'Community Kitchen' },
  { value: 'individual_household', label: 'Individual Household' },
  { value: 'other_eligible_organization', label: 'Other Eligible Organization' },
]

export const STORAGE_REQUIREMENTS = [
  { value: 'room_temperature', label: 'Room temperature' },
  { value: 'refrigerated', label: 'Refrigerated' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'dry_cool', label: 'Dry & cool' },
  { value: 'special', label: 'Special handling' },
]

export interface Profile {
  id: string
  email: string
  role: AppRole
  full_name: string | null
  organization: string | null
  phone: string | null
  account_type: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  beneficiary_count: number | null
  latitude: number | null
  longitude: number | null
  avatar_url: string | null
  created_at: string
}

export interface Page<T> {
  data: T[]
  total: number
  limit?: number
  offset?: number
}

export type DonationStatus =
  | 'available'
  | 'partially_fulfilled'
  | 'completed'
  | 'cancelled'

export interface Donation {
  id: string
  donor_id: string
  food_name: string
  food_category: string
  description: string | null
  image_path: string | null
  quantity: number
  available_quantity: number
  unit: string
  prepared_at: string | null
  expires_at: string | null
  storage_requirement: string
  temperature_category: string | null
  packaging_condition: string | null
  is_vegetarian: boolean | null
  allergen_info: string | null
  pickup_address: string
  area: string | null
  city: string
  postal_code: string | null
  latitude: number | null
  longitude: number | null
  pickup_window: string | null
  pickup_instructions: string | null
  donor_business_name: string | null
  contact_name: string | null
  contact_phone: string | null
  alternate_contact: string | null
  status: DonationStatus
  created_at: string
  updated_at: string
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface FoodRequest {
  id: string
  donation_id: string
  recipient_id: string
  requested_quantity: number
  unit: string
  contact_name: string | null
  contact_phone: string | null
  pickup_address: string
  latitude: number | null
  longitude: number | null
  preferred_time: string | null
  people_to_feed: number | null
  instructions: string | null
  status: RequestStatus
  decided_at: string | null
  created_at: string
  updated_at: string
}

export type AllocationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Allocation {
  id: string
  donation_id: string | null
  request_id: string | null
  response_id: string | null
  donor_id: string
  recipient_id: string
  quantity: number
  unit: string
  status: AllocationStatus
  created_at: string
  updated_at: string
}

export type PickupStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_transit'
  | 'delivered'
  | 'collected'
  | 'completed'
  | 'cancelled'

export interface Pickup {
  id: string
  allocation_id: string | null
  donation_id: string | null
  response_id: string | null
  donor_id: string
  recipient_id: string
  quantity: number
  unit: string
  scheduled_at: string | null
  pickup_address: string | null
  pickup_instructions: string | null
  status: PickupStatus
  completed_at: string | null
  created_at: string
  donation?: { food_name: string } | null
}

export type AlertStatus =
  | 'open'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'cancelled'
  | 'expired'

export type ResponseStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn'

export interface EmergencyAlert {
  id: string
  recipient_id: string
  food_name: string
  food_category: string
  required_quantity: number
  fulfilled_quantity: number
  unit: string
  people_to_feed: number | null
  required_by: string
  emergency_location: string | null
  area: string | null
  city: string
  recipient_org_name: string | null
  reason: string
  additional_requirements: string | null
  image_path: string | null
  status: AlertStatus
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

export interface EmergencyResponse {
  id: string
  alert_id: string
  donor_id: string
  donation_id: string | null
  food_name: string
  offered_quantity: number
  unit: string
  availability_note: string | null
  message: string | null
  status: ResponseStatus
  decided_at: string | null
  created_at: string
  updated_at: string
}

export interface AlertDetail {
  data: EmergencyAlert
  contact: { contact_name: string; contact_phone: string } | null
  myResponse: EmergencyResponse[] | null
}

export interface NotificationItem {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  data: Record<string, unknown>
  created_at: string
}

export interface DonorStats {
  myDonations: number
  availableQuantity: number
  pendingRequests: number
  confirmedAllocations: number
  upcomingPickups: number
  completedDonations: number
  openEmergencyAlerts: number
}

export interface RecipientStats {
  availableDonations: number
  myRequestsTotal: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  myAllocations: number
  upcomingPickups: number
  myOpenAlerts: number
  remainingOnAlerts: number
}
