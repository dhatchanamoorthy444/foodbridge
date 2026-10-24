import { z } from 'zod'

// Food item validation schema
export const foodItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
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
  ]),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.enum(['kg', 'g', 'lb', 'oz', 'liters', 'ml', 'pieces', 'boxes', 'pallets']),
  expiryDate: z.string().refine((date) => {
    const expiry = new Date(date)
    const now = new Date()
    return expiry > now
  }, 'Expiry date must be in the future'),
  storageRequirement: z.enum([
    'room_temperature',
    'refrigerated',
    'frozen',
    'dry_cool',
    'special',
  ]),
  conditionNotes: z.string().max(1000).optional(),
})

export type FoodItemFormData = z.infer<typeof foodItemSchema>

// Recipient validation schema
export const recipientSchema = z.object({
  organization: z.string().min(2, 'Organization name must be at least 2 characters'),
  maxCapacity: z.number().positive('Maximum capacity must be positive'),
  storageCapabilities: z.array(
    z.enum(['room_temperature', 'refrigerated', 'frozen', 'dry_cool', 'special'])
  ).min(1, 'Select at least one storage capability'),
  acceptedCategories: z.array(
    z.enum([
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
    ])
  ).min(1, 'Select at least one category'),
  pickupRadius: z.number().min(1, 'Pickup radius must be at least 1 km').max(100),
  pickupHours: z.array(z.string()).min(1, 'Add at least one pickup time'),
  notes: z.string().max(1000).optional(),
})

export type RecipientFormData = z.infer<typeof recipientSchema>

// User profile validation schema
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  organization: z.string().optional(),
  phone: z.string().regex(/^\+?[\d\s-]+$/, 'Invalid phone format').optional(),
  address: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Pickup scheduling schema
export const pickupSchema = z.object({
  scheduledDate: z.string().refine((date) => {
    const pickup = new Date(date)
    const now = new Date()
    const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // tomorrow
    return pickup >= minDate
  }, 'Pickup must be scheduled at least 24 hours in advance'),
  scheduledTime: z.string().min(1, 'Select a time slot'),
  notes: z.string().max(500).optional(),
})

export type PickupFormData = z.infer<typeof pickupSchema>

// Filter schemas
export const inventoryFiltersSchema = z.object({
  category: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  storageRequirement: z.array(z.string()).optional(),
  dateRange: z.tuple([z.string(), z.string()]).optional(),
  search: z.string().optional(),
})

export type InventoryFilters = z.infer<typeof inventoryFiltersSchema>

// Validation helper
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  result.error.errors.forEach((error) => {
    const path = error.path.join('.')
    errors[path] = error.message
  })

  return { success: false, errors }
}

// Form-specific validators
export const validators = {
  required: (value: any) => (value ? undefined : 'This field is required'),
  minLength: (min: number) => (value: string) =>
    value.length >= min ? undefined : `Must be at least ${min} characters`,
  maxLength: (max: number) => (value: string) =>
    value.length <= max ? undefined : `Must be at most ${max} characters`,
  positiveNumber: (value: number) =>
    value > 0 ? undefined : 'Must be a positive number',
  validEmail: (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Invalid email address',
  futureDate: (value: string) => {
    const date = new Date(value)
    const now = new Date()
    return date > now ? undefined : 'Date must be in the future',
  },
}