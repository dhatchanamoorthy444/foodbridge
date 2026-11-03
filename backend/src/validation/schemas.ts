import { z } from 'zod'

const datetime = z
  .string()
  .refine((v) => !Number.isNaN(new Date(v).getTime()), 'Invalid date-time')

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

export const STORAGE_REQUIREMENTS = [
  'room_temperature',
  'refrigerated',
  'frozen',
  'dry_cool',
  'special',
] as const
export type StorageRequirementValue = (typeof STORAGE_REQUIREMENTS)[number]

export const DONOR_ACCOUNT_TYPES = [
  'restaurant',
  'hotel',
  'supermarket',
  'grocery_store',
  'bakery',
  'catering_service',
  'food_manufacturer',
  'other_food_business',
] as const

export const RECIPIENT_ACCOUNT_TYPES = [
  'ngo',
  'orphanage',
  'old_age_home',
  'homeless_shelter',
  'community_kitchen',
  'individual_household',
  'other_eligible_organization',
] as const

const positiveQuantity = z.coerce.number().positive('Quantity must be positive')

const optionalText = z
  .string()
  .trim()
  .max(2000)
  .transform((v) => (v === '' ? undefined : v))
  .optional()

export const donationCreateSchema = z.object({
  food_name: z.string().trim().min(2).max(120),
  food_category: z.enum(FOOD_CATEGORIES),
  description: optionalText,
  image_path: optionalText,
  quantity: positiveQuantity,
  unit: z.enum(UNITS),
  prepared_at: datetime.optional(),
  expires_at: datetime,
  storage_requirement: z.enum(STORAGE_REQUIREMENTS).default('room_temperature'),
  temperature_category: optionalText,
  packaging_condition: optionalText,
  is_vegetarian: z.boolean().optional(),
  allergen_info: optionalText,
  pickup_address: z.string().trim().min(4).max(300),
  area: optionalText,
  city: z.string().trim().min(2).max(100),
  postal_code: optionalText,
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  pickup_window: optionalText,
  pickup_instructions: optionalText,
  donor_business_name: optionalText,
  contact_name: z.string().trim().min(2).max(120),
  contact_phone: z.string().trim().min(6).max(30),
  alternate_contact: optionalText,
})

export const donationUpdateSchema = donationCreateSchema
  .partial()
  .extend({
    status: z
      .enum(['available', 'cancelled'])
      .optional(),
  })

export const foodRequestCreateSchema = z.object({
  donation_id: z.string().uuid(),
  requested_quantity: positiveQuantity,
  unit: z.enum(UNITS).default('kg'),
  contact_name: z.string().trim().min(2).max(120),
  contact_phone: z.string().trim().min(6).max(30),
  pickup_address: z.string().trim().min(4).max(300),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  preferred_time: datetime.optional(),
  people_to_feed: z.coerce.number().int().positive().optional(),
  instructions: optionalText,
})

export const foodRequestDecisionSchema = z.object({
  action: z.enum(['approve', 'reject']),
})

export const emergencyAlertCreateSchema = z.object({
  food_name: z.string().trim().min(2).max(120),
  food_category: z.enum(FOOD_CATEGORIES),
  required_quantity: positiveQuantity,
  unit: z.enum(UNITS).default('kg'),
  people_to_feed: z.coerce.number().int().positive().min(1).max(100000).optional(),
  required_by: datetime,
  emergency_location: z.string().trim().min(2).max(200),
  area: optionalText,
  city: z.string().trim().min(2).max(100),
  reason: z.string().trim().min(10).max(1000),
  additional_requirements: optionalText,
  image_path: optionalText,
  contact_name: z.string().trim().min(2).max(120),
  contact_phone: z.string().trim().min(6).max(30),
})

export const emergencyResponseCreateSchema = z.object({
  food_name: z.string().trim().min(2).max(120),
  offered_quantity: positiveQuantity,
  unit: z.enum(UNITS).default('kg'),
  donation_id: z.string().uuid().optional(),
  availability_note: optionalText,
  message: optionalText,
})

export const emergencyResponseDecisionSchema = z.object({
  action: z.enum(['accept', 'decline']),
})

export const pickupScheduleSchema = z.object({
  allocation_id: z.string().uuid(),
  scheduled_at: datetime,
  pickup_address: z.string().trim().min(4).max(300).optional(),
  pickup_instructions: optionalText,
})

export const pickupStatusSchema = z.object({
  status: z.enum(['scheduled', 'confirmed', 'in_transit', 'delivered', 'collected', 'cancelled']),
})

export const profileUpdateSchema = z
  .object({
    full_name: z.string().trim().min(2).max(120).optional(),
    phone: z.string().trim().min(6).max(30).optional(),
    organization: z.string().trim().max(160).optional(),
    account_type: z.string().trim().max(80).optional(),
    address: z.string().trim().max(300).optional(),
    city: z.string().trim().max(100).optional(),
    postal_code: z.string().trim().max(20).optional(),
    beneficiary_count: z.coerce.number().int().positive().max(1_000_000).optional(),
  })
