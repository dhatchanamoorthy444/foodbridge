import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type {
  Donation,
  DonorStats,
  EmergencyAlert,
  EmergencyResponse,
  FoodRequest,
  NotificationItem,
  Pickup,
  Profile,
  RecipientStats,
} from '../types/api'
import { demoProfile, loadDemoSession, saveDemoSession } from './demoAuth'

const STORE_KEY = 'foodbridge-demo-data-v1'
const DEMO_RECIPIENT_ID = 'demo-recipient-0001'

interface DemoState {
  donations: Donation[]
  requests: FoodRequest[]
  alerts: EmergencyAlert[]
  responses: EmergencyResponse[]
  pickups: Pickup[]
  notifications: NotificationItem[]
}

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

function baseDonation(patch: Partial<Donation> & Pick<Donation, 'id' | 'food_name' | 'food_category' | 'quantity' | 'unit' | 'expires_at' | 'pickup_address' | 'city' | 'isEmergency'>): Donation {
  const now = new Date().toISOString()
  return {
    donor_id: 'demo-user-0001',
    description: null,
    image_path: null,
    available_quantity: patch.quantity,
    prepared_at: hoursFromNow(-2),
    storage_requirement: 'room_temperature',
    temperature_category: null,
    packaging_condition: null,
    is_vegetarian: null,
    allergen_info: null,
    area: null,
    postal_code: null,
    latitude: null,
    longitude: null,
    pickup_window: null,
    pickup_instructions: null,
    donor_business_name: 'FoodBridge Demo Kitchen',
    contact_name: 'Demo Operator',
    contact_phone: '+91 90000 00000',
    alternate_contact: null,
    status: 'available',
    isEmergency: patch.isEmergency ?? false,
    created_at: now,
    updated_at: now,
    ...patch,
  }
}

function seedState(): DemoState {
  const donations: Donation[] = [
    /* --- EMERGENCY / FAST-EXPIRING ITEM (pinned at top of Pickups) --- */
    baseDonation({
      id: 'chennai-001',
      food_name: 'Steamed Idli, Sambar & Coconut Chutney (Fresh Batch)',
      food_category: 'prepared_food',
      description: 'Traditional South Indian breakfast prepared this morning. Steamed idli with sambar and fresh coconut chutney. Ready for immediate dispatch.',
      quantity: 45,
      unit: 'meals',
      expires_at: hoursFromNow(0.7),  // ~42 minutes
      storage_requirement: 'refrigerated',
      is_vegetarian: true,
      allergen_info: 'Contains coconut',
      pickup_address: 'REC Campus Dining Hall',
      area: 'Thandalam',
      city: 'Chennai',
      donor_business_name: 'REC Campus Dining Hall – Thandalam',
      isEmergency: true,
      status: 'available',
    }),

    /* --- STANDARD ACTIVE LISTINGS --- */
    baseDonation({
      id: 'chennai-002',
      food_name: 'Vegetable Pulao & Dal Tadka',
      food_category: 'prepared_food',
      description: 'Hearty vegetable pulao with tempered dal and aromatic spices. Packed in insulated containers for hot delivery.',
      quantity: 60,
      unit: 'meals',
      expires_at: hoursFromNow(2.3),  // ~2 hours 18 minutes
      storage_requirement: 'refrigerated',
      is_vegetarian: true,
      allergen_info: 'Contains nuts (cashew garnish)',
      pickup_address: 'Annapoorna Catering Services',
      area: 'Poonamallee',
      city: 'Chennai',
      donor_business_name: 'Annapoorna Catering Services – Poonamallee',
      isEmergency: false,
      status: 'available',
    }),

    baseDonation({
      id: 'chennai-003',
      food_name: 'Chapati, Paneer Masala & Curd Rice',
      food_category: 'prepared_food',
      description: 'North Indian staple: wheat chapati with paneer masala gravy and fresh curd rice on the side. Family-style packing.',
      quantity: 35,
      unit: 'meals',
      expires_at: hoursFromNow(3.1),  // ~3 hours 6 minutes
      storage_requirement: 'refrigerated',
      is_vegetarian: false,
      allergen_info: 'Contains dairy and gluten',
      pickup_address: 'Sri Balaji Convention Hall',
      area: 'Sriperumbudur',
      city: 'Chennai',
      donor_business_name: 'Sri Balaji Convention Hall – Sriperumbudur',
      isEmergency: false,
      status: 'available',
    }),

    /* --- RECENTLY CLAIMED ITEM --- */
    baseDonation({
      id: 'chennai-004',
      food_name: 'Bakery Bread Loaves & Fruit Packs',
      food_category: 'baked_goods',
      description: 'Assorted bread loaves and fruit packs from FreshBake Kitchens. Quality surplus from daily production run.',
      quantity: 50,
      unit: 'packs',
      expires_at: hoursFromNow(6),
      storage_requirement: 'room_temperature',
      is_vegetarian: true,
      allergen_info: 'Contains gluten, may contain soy',
      pickup_address: 'FreshBake Kitchens',
      area: 'Porur',
      city: 'Chennai',
      donor_business_name: 'FreshBake Kitchens – Porur',
      isEmergency: false,
      status: 'partially_fulfilled',
    }),

    /* --- ADDITIONAL ACTIVE DONATIONS (for realistic KPI counts) --- */
    baseDonation({
      id: 'chennai-005',
      food_name: 'Hyderabadi Chicken Biryani Trays',
      food_category: 'prepared_food',
      description: 'Spiced chicken biryani from corporate event surplus. Fully sealed and hygienically packed for safe transport.',
      quantity: 30,
      unit: 'meals',
      expires_at: hoursFromNow(5),
      storage_requirement: 'refrigerated',
      is_vegetarian: false,
      allergen_info: 'Contains meat, dairy',
      pickup_address: 'Tech Park Canteen',
      area: 'Oragadam',
      city: 'Chennai',
      donor_business_name: 'Tech Park Canteen – Oragadam',
      isEmergency: false,
      status: 'available',
    }),

    baseDonation({
      id: 'chennai-006',
      food_name: 'Mixed Vegetable Crate (Tomato, Carrot, Beans)',
      food_category: 'vegetables',
      description: 'Fresh mixed vegetables from cancelled catering order. Tomatoes, carrots, beans — washed and packed in ventilated crates.',
      quantity: 50,
      unit: 'kg',
      expires_at: hoursFromNow(20),
      storage_requirement: 'refrigerated',
      is_vegetarian: true,
      pickup_address: 'Green Valley Catering',
      area: 'T. Nagar',
      city: 'Chennai',
      donor_business_name: 'Green Valley Catering – T. Nagar',
      isEmergency: false,
      status: 'available',
    }),

    baseDonation({
      id: 'chennai-007',
      food_name: 'Packaged Idli & Sambar (Institutional Qty)',
      food_category: 'prepared_food',
      description: 'Traditional South Indian breakfast in institutional packaging. Steamed idli with sambar and chutney — bulk pack for shelter distribution.',
      quantity: 80,
      unit: 'meals',
      expires_at: hoursFromNow(8),
      storage_requirement: 'refrigerated',
      is_vegetarian: true,
      pickup_address: 'Saravana Bhavan',
      area: 'Mylapore',
      city: 'Chennai',
      donor_business_name: 'Saravana Bhavan – Mylapore',
      isEmergency: false,
      status: 'available',
    }),

    baseDonation({
      id: 'chennai-008',
      food_name: 'Canned Goods Assortment (Near-Expiry)',
      food_category: 'canned_goods',
      description: 'Mixed canned vegetables, beans, and fruits. Near expiry but still fresh and safe for immediate consumption. Bulk pack.',
      quantity: 120,
      unit: 'pieces',
      expires_at: hoursFromNow(168),  // 7 days
      storage_requirement: 'room_temperature',
      is_vegetarian: true,
      pickup_address: 'Wholesale Grocers',
      area: 'Anna Nagar',
      city: 'Chennai',
      donor_business_name: 'Wholesale Grocers – Anna Nagar',
      isEmergency: false,
      status: 'available',
    }),

    baseDonation({
      id: 'chennai-009',
      food_name: 'Banana & Plantain Bunch',
      food_category: 'fruits',
      description: 'Fresh banana and plantain bunch from a supermarket surplus donation. Ripening naturally, best consumed within week.',
      quantity: 90,
      unit: 'kg',
      expires_at: hoursFromNow(48),
      storage_requirement: 'room_temperature',
      is_vegetarian: true,
      pickup_address: 'Fresh Mart Supermarket',
      area: 'Kodambakkam',
      city: 'Chennai',
      donor_business_name: 'Fresh Mart Supermarket – Kodambakkam',
      isEmergency: false,
      status: 'available',
    }),

    baseDonation({
      id: 'chennai-010',
      food_name: 'Hotel-style Lemon Rice & Vadapack',
      food_category: 'prepared_food',
      description: 'Tangy lemon rice with crispy vadapack — popular street-style pack. Ideal for quick community distribution.',
      quantity: 25,
      unit: 'meals',
      expires_at: hoursFromNow(1.5),  // ~1 hour 30 minutes
      storage_requirement: 'room_temperature',
      is_vegetarian: true,
      allergen_info: 'Contains peanuts (garnish)',
      pickup_address: 'Hotel Sangam',
      area: 'T. Nagar',
      city: 'Chennai',
      donor_business_name: 'Hotel Sangam – T. Nagar',
      isEmergency: false,
      status: 'available',
    }),

    /* --- REQUESTS FROM SHELTERS --- */
    baseDonation({
      id: 'chennai-011',
      food_name: 'Broken Rice & Moong Dal',
      food_category: 'grains',
      description: 'Request from community kitchen. Broken rice and moong dal for daily meal preparation.',
      quantity: 20,
      unit: 'kg',
      expires_at: hoursFromNow(72),
      storage_requirement: 'dry_cool',
      is_vegetarian: true,
      pickup_address: 'Hope Shelter',
      area: 'Kotturpuram',
      city: 'Chennai',
      donor_business_name: 'Hope Shelter – Kotturpuram',
      isEmergency: false,
      status: 'partially_fulfilled',
      available_quantity: 15,
    }),
  ]

  const requests: FoodRequest[] = [
    {
      id: 'chennai-req-001',
      donation_id: 'chennai-001',
      recipient_id: DEMO_RECIPIENT_ID,
      requested_quantity: 15,
      unit: 'meals',
      contact_name: 'Hope Hands Shelter',
      contact_phone: '+91 442654 0001',
      pickup_address: '45 Shelter Lane, Chennai',
      latitude: null,
      longitude: null,
      preferred_time: hoursFromNow(6),
      people_to_feed: 35,
      instructions: 'Please ring the back gate bell. Vegetarian only.',
      status: 'pending',
      decided_at: null,
      created_at: hoursFromNow(-12),
      updated_at: hoursFromNow(-12),
    },
    {
      id: 'chennai-req-002',
      donation_id: 'chennai-003',
      recipient_id: DEMO_RECIPIENT_ID,
      requested_quantity: 10,
      unit: 'meals',
      contact_name: 'Annai Community Kitchen',
      contact_phone: '+91 442654 0002',
      pickup_address: '8 Temple Road, Chennai',
      latitude: null,
      longitude: null,
      preferred_time: hoursFromNow(8),
      people_to_feed: 25,
      instructions: null,
      status: 'approved',
      decided_at: hoursFromNow(-2),
      created_at: hoursFromNow(-2),
      updated_at: hoursFromNow(-2),
    },
    {
      id: 'chennai-req-003',
      donation_id: 'chennai-005',
      recipient_id: DEMO_RECIPIENT_ID,
      requested_quantity: 20,
      unit: 'meals',
      contact_name: 'Kanchi Community Home',
      contact_phone: '+91 442654 0003',
      pickup_address: '12 Mettu Street, Kanchipuram',
      latitude: null,
      longitude: null,
      preferred_time: hoursFromNow(12),
      people_to_feed: 40,
      instructions: 'Contact: +91 442654 0003',
      status: 'pending',
      decided_at: null,
      created_at: hoursFromNow(-6),
      updated_at: hoursFromNow(-6),
    },
  ]

  const alerts: EmergencyAlert[] = [
    {
      id: 'chennai-alert-001',
      recipient_id: DEMO_RECIPIENT_ID,
      food_name: 'Steamed Idli, Sambar & Coconut Chutney',
      food_category: 'prepared_food',
      required_quantity: 50,
      fulfilled_quantity: 0,
      unit: 'meals',
      people_to_feed: 50,
      required_by: hoursFromNow(8),
      emergency_location: 'Night shelter main gate',
      area: 'Egmore',
      city: 'Chennai',
      recipient_org_name: 'Hope Night Shelter',
      reason: 'Fifty children at our shelter have had no proper meal since yesterday afternoon. Urgent breakfast needed before school.',
      additional_requirements: 'Vegetarian only — no onion or garlic',
      image_path: null,
      status: 'open',
      cancelled_at: null,
      created_at: hoursFromNow(-12),
      updated_at: hoursFromNow(-12),
    },
  ]

  const pickups: Pickup[] = [
    {
      id: 'chennai-pickup-001',
      allocation_id: 'chennai-alloc-001',
      donation_id: 'chennai-001',
      response_id: null,
      donor_id: 'demo-user-0001',
      recipient_id: DEMO_RECIPIENT_ID,
      quantity: 10,
      unit: 'meals',
      scheduled_at: hoursFromNow(4),  // ~4 hours from now
      pickup_address: 'REC Campus Dining Hall',
      pickup_instructions: 'Ring the service bell at the loading bay. Collectors welcome.',
      status: 'scheduled',
      completed_at: null,
      created_at: hoursFromNow(-1),
      donation: { food_name: 'Steamed Idli, Sambar & Coconut Chutney (Fresh Batch)' },
    },
  ]

  const notifications: NotificationItem[] = [
    {
      id: 'chennai-notif-001',
      user_id: 'demo-user-0001',
      type: 'emergency_alert',
      title: '🚨 Emergency Food Alert',
      message: 'Urgent: Steamed Idli, Sambar & Coconut Chutney needed (50 meals) — Fifty children at our shelter have had no proper meal since yesterday afternoon. Urgent breakfast needed before school.',
      read: false,
      data: { alert_id: 'chennai-alert-001', food_name: 'Steamed Idli, Sambar & Coconut Chutney', required_by: hoursFromNow(8) },
      created_at: hoursFromNow(-12),
    },
    {
      id: 'chennai-notif-002',
      user_id: 'demo-user-0001',
      type: 'pickup',
      title: 'Pickup scheduled',
      message: 'A collection is scheduled for your meal batch today. Collectors arriving at 4:00 PM at REC Campus.',
      read: false,
      data: { pickup_id: 'chennai-pickup-001' },
      created_at: hoursFromNow(-1),
    },
    {
      id: 'chennai-notif-003',
      user_id: 'demo-user-0001',
      type: 'request',
      title: 'New food request',
      message: 'Hope Hands Shelter requested 15 meals from your Steamed Idli, Sambar & Coconut Chutney batch.',
      read: false,
      data: { request_id: 'chennai-req-001' },
      created_at: hoursFromNow(-12),
    },
  ]

  return { donations, requests, alerts, responses: [], pickups, notifications }
}

function loadState(): DemoState {
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState
      if (parsed && Array.isArray(parsed.donations)) return parsed
    }
  } catch {
    // fall through to seed
  }
  const seeded = seedState()
  persist(seeded)
  return seeded
}

function persist(state: DemoState): void {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(state))
  } catch {
    // ignore storage failures
  }
}

let state: DemoState | null = null

function db(): DemoState {
  if (!state) state = loadState()
  return state
}

function currentProfile(): Profile {
  return loadDemoSession() ?? demoProfile()
}

function nowIso(): string {
  return new Date().toISOString()
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function ok(config: AxiosRequestConfig, data: unknown, status = 200): AxiosResponse {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: config as InternalAxiosRequestConfig,
  }
}

function fail(config: AxiosRequestConfig, status: number, message: string): never {
  const err = new Error(message) as Error & {
    isAxiosError: boolean
    response: { status: number; data: { error: string }; config: AxiosRequestConfig }
  }
  err.isAxiosError = true
  err.response = { status, data: { error: message }, config }
  throw err
}

function readBody(config: AxiosRequestConfig): Record<string, unknown> {
  const raw = config.data
  if (!raw) return {}
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  return raw as Record<string, unknown>
}

function queryParams(config: AxiosRequestConfig): Record<string, string> {
  const out: Record<string, string> = {}
  const url = config.url ?? ''
  const qs = url.split('?')[1]
  if (qs) {
    new URLSearchParams(qs).forEach((value, key) => {
      out[key] = value
    })
  }
  const params = (config.params ?? {}) as Record<string, unknown>
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) out[key] = String(value)
  }
  return out
}

function donorStats(): DonorStats {
  const data = db()
  const mine = data.donations.filter((d) => d.donor_id === currentProfile().id)
  const active = mine.filter((d) => d.status === 'available' || d.status === 'partially_fulfilled')
  return {
    myDonations: active.length,
    availableQuantity: active.reduce((sum, d) => sum + d.available_quantity, 0),
    pendingRequests: data.requests.filter((r) => r.status === 'pending').length,
    confirmedAllocations: data.pickups.filter((p) => p.status === 'confirmed').length,
    upcomingPickups: data.pickups.filter((p) => p.status === 'scheduled' || p.status === 'confirmed').length,
    completedDonations: mine.filter((d) => d.status === 'completed').length,
    openEmergencyAlerts: data.alerts.filter((a) => a.status === 'open').length,
  }
}

function recipientStats(): RecipientStats {
  const data = db()
  const profile = currentProfile()
  const mine = data.requests.filter((r) => r.recipient_id === profile.id)
  const myAlerts = data.alerts.filter((a) => a.recipient_id === profile.id)
  return {
    availableDonations: data.donations.filter((d) => d.status === 'available' || d.status === 'partially_fulfilled').length,
    myRequestsTotal: mine.length,
    pendingRequests: mine.filter((r) => r.status === 'pending').length,
    approvedRequests: mine.filter((r) => r.status === 'approved').length,
    rejectedRequests: mine.filter((r) => r.status === 'rejected').length,
    myAllocations: data.pickups.filter((p) => p.recipient_id === profile.id).length,
    upcomingPickups: data.pickups.filter((p) => p.recipient_id === profile.id && (p.status === 'scheduled' || p.status === 'confirmed')).length,
    myOpenAlerts: myAlerts.filter((a) => a.status === 'open').length,
    remainingOnAlerts: myAlerts.reduce((sum, a) => sum + Math.max(a.required_quantity - a.fulfilled_quantity, 0), 0),
  }
}

function findDonation(id: string): Donation | undefined {
  return db().donations.find((d) => d.id === id)
}

export async function demoAdapter(config: AxiosRequestConfig): Promise<AxiosResponse> {
  const data = db()
  const method = (config.method ?? 'get').toLowerCase()
  const path = (config.url ?? '').split('?')[0].replace(/\/+$/, '') || '/'
  const body = readBody(config)
  const profile = currentProfile()

  // ── Auth ─────────────────────────────────────────────────────────────
  if (path === '/auth/me' && method === 'get') {
    return ok(config, { data: { user: { id: profile.id, email: profile.email, role: profile.role, profile } } })
  }
  if (path === '/auth/me' && (method === 'patch' || method === 'put')) {
    const updated = { ...profile, ...body } as Profile
    saveDemoSession(updated)
    return ok(config, { data: updated })
  }

  // ── Donations ────────────────────────────────────────────────────────
  if (path === '/donations/my' && method === 'get') {
    const mine = data.donations.filter((d) => d.donor_id === profile.id)
    return ok(config, { data: mine, total: mine.length })
  }
  if (path === '/donations' && method === 'get') {
    const q = queryParams(config)
    let rows = [...data.donations]
    const search = (q.search ?? '').toLowerCase()
    if (search) rows = rows.filter((d) => `${d.food_name} ${d.description ?? ''} ${d.city}`.toLowerCase().includes(search))
    if (q.category) rows = rows.filter((d) => d.food_category === q.category)
    if (q.city) rows = rows.filter((d) => d.city.toLowerCase().includes(q.city.toLowerCase()))
    if (q.sort === 'expiry') rows.sort((a, b) => (a.expires_at ?? '').localeCompare(b.expires_at ?? ''))
    const total = rows.length
    const offset = Number(q.offset ?? 0) || 0
    const limit = Number(q.limit ?? 50) || 50
    return ok(config, { data: rows.slice(offset, offset + limit), total, limit, offset })
  }
  if (path === '/donations' && method === 'post') {
    const quantity = Number(body.quantity ?? 0) || 0
    const donation: Donation = baseDonation({
      id: uid('demo-donation'),
      food_name: String(body.food_name ?? 'Emergency food donation'),
      food_category: String(body.food_category ?? 'prepared_food'),
      description: (body.description as string) ?? null,
      image_path: (body.image_path as string) ?? null,
      quantity,
      unit: String(body.unit ?? 'meals'),
      expires_at: (body.expires_at as string) ?? hoursFromNow(24),
      prepared_at: (body.prepared_at as string) ?? null,
      storage_requirement: String(body.storage_requirement ?? 'room_temperature'),
      temperature_category: (body.temperature_category as string) ?? null,
      packaging_condition: (body.packaging_condition as string) ?? null,
      is_vegetarian: (body.is_vegetarian as boolean) ?? null,
      allergen_info: (body.allergen_info as string) ?? null,
      pickup_address: String(body.pickup_address ?? ''),
      area: (body.area as string) ?? null,
      city: String(body.city ?? 'Chennai'),
      postal_code: (body.postal_code as string) ?? null,
      pickup_window: (body.pickup_window as string) ?? null,
      pickup_instructions: (body.pickup_instructions as string) ?? null,
      contact_name: (body.contact_name as string) ?? profile.full_name,
      contact_phone: (body.contact_phone as string) ?? profile.phone,
      alternate_contact: (body.alternate_contact as string) ?? null,
      donor_id: profile.id,
      donor_business_name: profile.organization,
      isEmergency: body.isEmergency === true,
    })
    data.donations.unshift(donation)
    persist(data)
    return ok(config, { data: donation }, 201)
  }
  const donationMatch = path.match(/^\/donations\/([^/]+)$/)
  if (donationMatch && method === 'get') {
    const donation = findDonation(donationMatch[1])
    if (!donation) fail(config, 404, 'Donation not found')
    return ok(config, { data: donation })
  }
  if (donationMatch && (method === 'patch' || method === 'put')) {
    const donation = findDonation(donationMatch[1])
    if (!donation) fail(config, 404, 'Donation not found')
    Object.assign(donation, body, {
      updated_at: nowIso(),
      quantity: body.quantity !== undefined ? Number(body.quantity) : donation.quantity,
      available_quantity: body.quantity !== undefined ? Number(body.quantity) : donation.available_quantity,
    })
    persist(data)
    return ok(config, { data: donation })
  }
  const cancelMatch = path.match(/^\/donations\/([^/]+)\/cancel$/)
  if (cancelMatch && method === 'post') {
    const donation = findDonation(cancelMatch[1])
    if (!donation) fail(config, 404, 'Donation not found')
    donation.status = 'cancelled'
    donation.available_quantity = 0
    donation.updated_at = nowIso()
    persist(data)
    return ok(config, { success: true })
  }

  // ── Food requests ────────────────────────────────────────────────────
  if (path === '/food-requests/my' && method === 'get') {
    const mine = data.requests.filter((r) => r.recipient_id === profile.id)
    return ok(config, { data: mine, total: mine.length })
  }
  const donationRequestsMatch = path.match(/^\/food-requests\/donation\/([^/]+)$/)
  if (donationRequestsMatch && method === 'get') {
    const rows = data.requests.filter((r) => r.donation_id === donationRequestsMatch[1])
    return ok(config, { data: rows })
  }
  if (path === '/food-requests' && method === 'post') {
    const donation = findDonation(String(body.donation_id ?? ''))
    if (donation && donation.status === 'cancelled') fail(config, 400, 'This donation is no longer available')
    const request: FoodRequest = {
      id: uid('demo-request'),
      donation_id: String(body.donation_id ?? ''),
      recipient_id: profile.id,
      requested_quantity: Number(body.requested_quantity ?? 0) || 0,
      unit: String(body.unit ?? 'kg'),
      contact_name: (body.contact_name as string) ?? profile.full_name,
      contact_phone: (body.contact_phone as string) ?? profile.phone,
      pickup_address: String(body.pickup_address ?? ''),
      latitude: null,
      longitude: null,
      preferred_time: (body.preferred_time as string) ?? null,
      people_to_feed: body.people_to_feed ? Number(body.people_to_feed) : null,
      instructions: (body.instructions as string) ?? null,
      status: 'pending',
      decided_at: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    }
    data.requests.unshift(request)
    persist(data)
    return ok(config, { data: request }, 201)
  }
  const requestMatch = path.match(/^\/food-requests\/([^/]+)$/)
  if (requestMatch && method === 'get') {
    const request = data.requests.find((r) => r.id === requestMatch[1])
    if (!request) fail(config, 404, 'Request not found')
    return ok(config, { data: request })
  }

  // ── Emergency alerts ─────────────────────────────────────────────────
  if (path === '/emergency-alerts' && method === 'get') {
    return ok(config, { data: [...data.alerts] })
  }
  if (path === '/emergency-alerts/my' && method === 'get') {
    return ok(config, { data: data.alerts.filter((a) => a.recipient_id === profile.id) })
  }
  if (path === '/emergency-alerts' && method === 'post') {
    const alert: EmergencyAlert = {
      id: uid('demo-alert'),
      recipient_id: profile.id,
      food_name: String(body.food_name ?? 'Emergency food need'),
      food_category: String(body.food_category ?? 'prepared_food'),
      required_quantity: Number(body.required_quantity ?? 0) || 0,
      fulfilled_quantity: 0,
      unit: String(body.unit ?? 'meals'),
      people_to_feed: body.people_to_feed ? Number(body.people_to_feed) : null,
      required_by: (body.required_by as string) ?? hoursFromNow(12),
      emergency_location: (body.emergency_location as string) ?? null,
      area: (body.area as string) ?? null,
      city: String(body.city ?? profile.city ?? 'Chennai'),
      recipient_org_name: profile.organization,
      reason: String(body.reason ?? ''),
      additional_requirements: (body.additional_requirements as string) ?? null,
      image_path: null,
      status: 'open',
      cancelled_at: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    }
    data.alerts.unshift(alert)

    // Create notification for all users about the emergency alert
    const notification: NotificationItem = {
      id: uid('demo-notification'),
      user_id: 'broadcast',
      type: 'emergency_alert',
      title: '🚨 Emergency Food Alert',
      message: `Urgent: ${alert.food_name} needed (${alert.required_quantity} ${alert.unit}) – ${alert.reason}`,
      read: false,
      data: { alert_id: alert.id, food_name: alert.food_name, required_by: alert.required_by },
      created_at: nowIso(),
    }
    data.notifications.unshift(notification)

    persist(data)
    return ok(config, { data: alert }, 201)
  }
  const responsesMatch = path.match(/^\/emergency-alerts\/([^/]+)\/responses$/)
  if (responsesMatch) {
    const alertId = responsesMatch[1]
    const alert = data.alerts.find((a) => a.id === alertId)
    if (method === 'get') {
      return ok(config, { data: data.responses.filter((r) => r.alert_id === alertId) })
    }
    if (method === 'post') {
      if (!alert) fail(config, 404, 'Alert not found')
      const response: EmergencyResponse = {
        id: uid('demo-response'),
        alert_id: alertId,
        donor_id: profile.id,
        donation_id: (body.donation_id as string) ?? null,
        food_name: String(body.food_name ?? 'Offered food'),
        offered_quantity: Number(body.offered_quantity ?? 0) || 0,
        unit: String(body.unit ?? alert?.unit ?? 'meals'),
        availability_note: null,
        message: (body.message as string) ?? null,
        status: 'pending',
        decided_at: null,
        created_at: nowIso(),
        updated_at: nowIso(),
      }
      data.responses.unshift(response)

      // Create notification for the alert recipient
      const notification: NotificationItem = {
        id: uid('demo-notification'),
        user_id: alert.recipient_id,
        type: 'emergency_response',
        title: '✅ Donor Response to Emergency Alert',
        message: `${profile.organization || profile.full_name || 'A donor'} offered ${response.offered_quantity} ${response.unit} of ${response.food_name}`,
        read: false,
        data: { alert_id: alertId, response_id: response.id, food_name: response.food_name },
        created_at: nowIso(),
      }
      data.notifications.unshift(notification)

      persist(data)
      return ok(config, { data: response }, 201)
    }
  }
  const decisionMatch = path.match(/^\/emergency-alerts\/responses\/([^/]+)$/)
  if (decisionMatch && method === 'patch') {
    const response = data.responses.find((r) => r.id === decisionMatch[1])
    if (!response) fail(config, 404, 'Response not found')
    const action = String(body.action ?? '')
    const decision = action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'withdrawn'
    response.status = decision as EmergencyResponse['status']
    response.decided_at = nowIso()
    response.updated_at = nowIso()
    const alert = data.alerts.find((a) => a.id === response.alert_id)
    if (alert && decision === 'accepted') {
      alert.fulfilled_quantity += response.offered_quantity
      alert.status = alert.fulfilled_quantity >= alert.required_quantity ? 'fulfilled' : 'partially_fulfilled'
      alert.updated_at = nowIso()
    }
    persist(data)
    return ok(config, { data: response })
  }
  const alertCancelMatch = path.match(/^\/emergency-alerts\/([^/]+)\/cancel$/)
  if (alertCancelMatch && method === 'post') {
    const alert = data.alerts.find((a) => a.id === alertCancelMatch[1])
    if (!alert) fail(config, 404, 'Alert not found')
    alert.status = 'cancelled'
    alert.cancelled_at = nowIso()
    alert.updated_at = nowIso()
    persist(data)
    return ok(config, { success: true })
  }
  const alertMatch = path.match(/^\/emergency-alerts\/([^/]+)$/)
  if (alertMatch) {
    const alert = data.alerts.find((a) => a.id === alertMatch[1])
    if (!alert) fail(config, 404, 'Alert not found')
    if (method === 'get') {
      return ok(config, {
        data: alert,
        contact: { contact_name: 'Hope Night Shelter', contact_phone: '+91 442654 0001' },
        myResponse: data.responses.filter((r) => r.alert_id === alert.id && r.donor_id === profile.id),
      })
    }
    if (method === 'patch' || method === 'put') {
      Object.assign(alert, body, { updated_at: nowIso() })
      persist(data)
      return ok(config, { data: alert })
    }
  }

  // ── Pickups ──────────────────────────────────────────────────────────
  if (path === '/pickups/my' && method === 'get') {
    const mine = data.pickups.filter((p) => p.donor_id === profile.id || p.recipient_id === profile.id)
    return ok(config, { data: mine, total: mine.length })
  }
  if (path === '/pickups' && method === 'post') {
    const pickup: Pickup = {
      id: uid('demo-pickup'),
      allocation_id: (body.allocation_id as string) ?? null,
      donation_id: (body.donation_id as string) ?? null,
      response_id: (body.response_id as string) ?? null,
      donor_id: profile.id,
      recipient_id: (body.recipient_id as string) ?? DEMO_RECIPIENT_ID,
      quantity: Number(body.quantity ?? 0) || 0,
      unit: String(body.unit ?? 'kg'),
      scheduled_at: (body.scheduled_at as string) ?? hoursFromNow(24),
      pickup_address: (body.pickup_address as string) ?? profile.address,
      pickup_instructions: (body.pickup_instructions as string) ?? null,
      status: 'scheduled',
      completed_at: null,
      created_at: nowIso(),
      donation: null,
    }
    data.pickups.unshift(pickup)
    persist(data)
    return ok(config, { data: pickup }, 201)
  }
  const pickupStatusMatch = path.match(/^\/pickups\/([^/]+)\/status$/)
  if (pickupStatusMatch && method === 'patch') {
    const pickup = data.pickups.find((p) => p.id === pickupStatusMatch[1])
    if (!pickup) fail(config, 404, 'Pickup not found')
    pickup.status = String(body.status ?? pickup.status) as Pickup['status']
    if (pickup.status === 'collected' || pickup.status === 'completed') pickup.completed_at = nowIso()
    persist(data)
    return ok(config, { data: pickup })
  }
  const pickupMatch = path.match(/^\/pickups\/([^/]+)$/)
  if (pickupMatch && method === 'get') {
    const pickup = data.pickups.find((p) => p.id === pickupMatch[1])
    if (!pickup) fail(config, 404, 'Pickup not found')
    return ok(config, { data: pickup })
  }

  // ── Notifications ────────────────────────────────────────────────────
  if (path === '/notifications' && method === 'get') {
    const myNotifications = data.notifications.filter(
      (n) => n.user_id === profile.id || n.user_id === 'broadcast'
    )
    return ok(config, {
      data: myNotifications,
      unread: myNotifications.filter((n) => !n.read).length,
    })
  }
  if (path === '/notifications/read-all' && method === 'patch') {
    data.notifications.forEach((n) => {
      if (n.user_id === profile.id || n.user_id === 'broadcast') {
        n.read = true
      }
    })
    persist(data)
    return ok(config, { success: true })
  }
  const notificationReadMatch = path.match(/^\/notifications\/([^/]+)\/read$/)
  if (notificationReadMatch && method === 'patch') {
    const notification = data.notifications.find((n) => n.id === notificationReadMatch[1])
    if (notification) notification.read = true
    persist(data)
    return ok(config, { success: true })
  }

  // ── Dashboards ───────────────────────────────────────────────────────
  if (path === '/dashboard/donor' && method === 'get') {
    return ok(config, { data: donorStats() })
  }
  if (path === '/dashboard/recipient' && method === 'get') {
    return ok(config, { data: recipientStats() })
  }

  // ── Uploads ──────────────────────────────────────────────────────────
  if (path === '/uploads/food-image' && method === 'post') {
    return ok(config, { path: null, publicUrl: null })
  }

  fail(config, 404, `Demo API: no handler for ${method.toUpperCase()} ${path}`)
}