export type DonationStatus =
  | 'available'
  | 'partially_fulfilled'
  | 'completed'
  | 'cancelled'

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export type AllocationStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export type PickupStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_transit'
  | 'delivered'
  | 'collected'
  | 'completed'
  | 'cancelled'

export type AlertStatus =
  | 'open'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'cancelled'
  | 'expired'

export type ResponseStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn'

export interface DonationRow {
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

export interface FoodRequestRow {
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
  decided_by: string | null
  decided_at: string | null
  created_at: string
  updated_at: string
}

export interface AllocationRow {
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

export interface PickupRow {
  id: string
  allocation_id: string | null
  donation_id: string | null
  response_id: string | null
  donor_id: string
  recipient_id: string
  scheduled_at: string | null
  pickup_address: string | null
  pickup_instructions: string | null
  status: PickupStatus
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface NotificationRow {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  data: Record<string, unknown>
  created_at: string
}

export interface EmergencyAlertRow {
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

export interface EmergencyResponseRow {
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
