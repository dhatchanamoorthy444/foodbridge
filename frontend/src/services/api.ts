import { supabase } from '../lib/supabase'
import { api, toastApiError } from '../lib/api'
import type {
  Profile, AppRole, Donation, FoodRequest, EmergencyAlert, EmergencyResponse,
  Pickup, NotificationItem, DonorStats, RecipientStats,
} from '../types/api'

type Envelope<T> = { data: T; [key: string]: unknown }

export { toastApiError }

/* ------------------------------------------------------------------ */
/*  Auth — handled by Supabase, profiles stay in sync via DB trigger   */
/* ------------------------------------------------------------------ */
export interface SignUpPayload {
  email: string
  password: string
  role: AppRole
  full_name: string
  organization: string
  phone: string
  account_type: string
  address: string
  city: string
  postal_code: string
  beneficiary_count?: number | null
}

export const authService = {
  async signUp(payload: SignUpPayload): Promise<{ needsEmailConfirm: boolean; profile: Profile | null }> {
    if (!supabase) throw new Error('Authentication is not configured')
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          role: payload.role,
          full_name: payload.full_name,
          organization: payload.organization,
          phone: payload.phone,
          account_type: payload.account_type,
          address: payload.address,
          city: payload.city,
          postal_code: payload.postal_code,
          beneficiary_count:
            payload.beneficiary_count === null || payload.beneficiary_count === undefined
              ? undefined
              : String(payload.beneficiary_count),
        },
      },
    })
    if (error) throw error
    let profile: Profile | null = null
    if (data.session) {
      profile = await this.fetchProfile()
      if (!profile) profile = await this.ensureProfile(data.session.user)
    }
    return { needsEmailConfirm: !data.session, profile }
  },

  async signIn(email: string, password: string): Promise<Profile | null> {
    if (!supabase) throw new Error('Authentication is not configured')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    let profile = await this.fetchProfile()
    if (!profile) {
      const { data } = await supabase.auth.getSession()
      profile = await this.ensureProfile(data.session?.user ?? { id: '', email: undefined, user_metadata: undefined })
    }
    return profile
  },

  async signOut(): Promise<void> {
    if (supabase) await supabase.auth.signOut()
  },

  async requestPasswordReset(email: string): Promise<void> {
    if (!supabase) throw new Error('Authentication is not configured')
    // supabase.auth.resetPasswordForEmail only accepts the absolute redirect URL
    // that the user will land on after clicking the magic link in their inbox.
    const redirectTo = `${window.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) throw error
  },

  async updatePassword(newPassword: string): Promise<void> {
    if (!supabase) throw new Error('Authentication is not configured')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  },


  async fetchProfile(): Promise<Profile | null> {
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    const session = data.session
    if (!session) return null
    const { data: row, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (error) return null
    return row as Profile
  },

  /**
   * Ensures a profiles row exists for the authenticated Supabase user.
   * Some sign-up flows (email confirmation, missing DB trigger) leave the
   * profiles table empty even though the auth session is valid. This inserts
   * the missing row from the session's user metadata so the backend
   * authentication middleware can resolve the donor role and allow API access.
   */
  async ensureProfile(sessionUser: {
    id: string
    email?: string | null
    user_metadata?: Record<string, unknown> | null
  }): Promise<Profile | null> {
    if (!supabase) return null

    // If profile already exists, return it.
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', sessionUser.id)
      .single()
    if (existing) return existing as Profile

    const meta = sessionUser.user_metadata ?? {}
    const payload: Record<string, unknown> = {
      id: sessionUser.id,
      email: sessionUser.email ?? null,
      role: (meta.role as AppRole) ?? 'recipient',
      full_name: meta.full_name ?? null,
      organization: meta.organization ?? null,
      phone: meta.phone ?? null,
      account_type: meta.account_type ?? null,
      city: meta.city ?? null,
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert(payload)
      .select()
      .single()
    if (error) {
      console.error('[authService.ensureProfile] insert failed', error)
      return null
    }
    return data as Profile
  },

  async updateProfile(patch: Record<string, unknown>): Promise<Profile | null> {
    if (!supabase) throw new Error('Authentication is not configured')
    const { data: sessionData } = await supabase.auth.getSession()
    const uid = sessionData.session?.user.id
    if (!uid) throw new Error('Not signed in')
    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', uid)
      .select()
      .single()
    if (error) throw error
    return data as Profile
  },
}

export const profileService = {
  async me(): Promise<{ user: { id: string; email: string; role: string; profile: Record<string, unknown> | null } }> {
    const res = await api.get<Envelope<{ user: { id: string; email: string; role: string; profile: Record<string, unknown> | null } }>>('/auth/me')
    return res.data.data
  },
  async update(patch: Record<string, unknown>): Promise<Profile> {
    const res = await api.patch<Envelope<Profile>>('/auth/me', patch)
    return res.data.data
  },
}

/* ------------------------------------------------------------------ */
/*  Donations                                                          */
/* ------------------------------------------------------------------ */
export const donationsService = {
  async list(params: { search?: string; category?: string; city?: string; sort?: string; limit?: number; offset?: number } = {}): Promise<{ data: Donation[]; total: number }> {
    const res = await api.get<{ data: Donation[]; total: number }>('/donations', { params })
    return { data: res.data.data ?? [], total: res.data.total ?? 0 }
  },

  async my(): Promise<{ data: Donation[]; total: number }> {
    const res = await api.get<{ data: Donation[]; total: number }>('/donations/my')
    return { data: res.data.data ?? [], total: res.data.total ?? 0 }
  },

  async byId(id: string): Promise<Donation> {
    const res = await api.get<Envelope<Donation>>(`/donations/${id}`)
    return res.data.data
  },

  async create(payload: Record<string, unknown>): Promise<Donation> {
    const res = await api.post<Envelope<Donation>>('/donations', payload)
    return res.data.data
  },

  async update(id: string, payload: Record<string, unknown>): Promise<Donation> {
    const res = await api.patch<Envelope<Donation>>(`/donations/${id}`, payload)
    return res.data.data
  },

  async cancel(id: string): Promise<void> {
    await api.post(`/donations/${id}/cancel`)
  },
}

/* ------------------------------------------------------------------ */
/*  Food requests                                                      */
/* ------------------------------------------------------------------ */
export const requestsService = {
  async mine(): Promise<FoodRequest[]> {
    const res = await api.get<{ data: FoodRequest[]; total?: number }>('/food-requests/my')
    return res.data.data ?? []
  },

  async byId(id: string): Promise<FoodRequest> {
    const res = await api.get<Envelope<FoodRequest>>(`/food-requests/${id}`)
    return res.data.data
  },

  async forDonation(donationId: string): Promise<FoodRequest[]> {
    const res = await api.get<Envelope<FoodRequest[]>>(`/food-requests/donation/${donationId}`)
    return res.data.data ?? []
  },

  async create(payload: Record<string, unknown>): Promise<FoodRequest> {
    const res = await api.post<Envelope<FoodRequest>>('/food-requests', payload)
    return res.data.data
  },
}

/* ------------------------------------------------------------------ */
/*  Emergency alerts                                                   */
/* ------------------------------------------------------------------ */
export const alertsService = {
  async list(): Promise<EmergencyAlert[]> {
    const res = await api.get<Envelope<EmergencyAlert[]>>('/emergency-alerts')
    return res.data.data ?? []
  },

  async mine(): Promise<EmergencyAlert[]> {
    const res = await api.get<Envelope<EmergencyAlert[]>>('/emergency-alerts/my')
    return res.data.data ?? []
  },

  async byId(id: string): Promise<{
    alert: EmergencyAlert
    responses: EmergencyResponse[]
    contacts: { contact_phone: string; contact_name: string | null } | null
    my_response?: EmergencyResponse | null
  }> {
    const [detail, responses] = await Promise.all([
      api.get<Envelope<EmergencyAlert> & { contact?: { contact_phone: string; contact_name: string | null } | null; myResponse?: EmergencyResponse | null }>(`/emergency-alerts/${id}`),
      api.get<Envelope<EmergencyResponse[]>>(`/emergency-alerts/${id}/responses`)
        .catch(() => ({ data: { data: [] as EmergencyResponse[] } })),
    ])
    return {
      alert: detail.data.data as unknown as EmergencyAlert,
      responses: (responses.data as { data?: { data?: EmergencyResponse[] } }).data?.data ?? [],
      contacts: detail.data.contact ?? null,
      my_response: detail.data.myResponse ?? null,
    }
  },

  async create(payload: Record<string, unknown>): Promise<EmergencyAlert> {
    const res = await api.post<Envelope<EmergencyAlert>>('/emergency-alerts', payload)
    return res.data.data
  },

  async update(id: string, payload: Record<string, unknown>): Promise<EmergencyAlert> {
    const res = await api.patch<Envelope<EmergencyAlert>>(`/emergency-alerts/${id}`, payload)
    return res.data.data
  },

  async cancel(id: string): Promise<void> {
    await api.post(`/emergency-alerts/${id}/cancel`)
  },

  async respond(payload: { alert_id: string; food_name: string; offered_quantity: number; unit?: string; donation_id?: string; message?: string }): Promise<EmergencyResponse> {
    const res = await api.post<Envelope<EmergencyResponse>>(
      `/emergency-alerts/${payload.alert_id}/responses`,
      {
        food_name: payload.food_name,
        offered_quantity: payload.offered_quantity,
        unit: payload.unit,
        donation_id: payload.donation_id,
        message: payload.message,
      }
    )
    return res.data.data
  },

  async decideResponse(id: string, action: 'accept' | 'decline'): Promise<void> {
    await api.patch(`/emergency-alerts/responses/${id}`, { action })
  },

  async withdraw(id: string): Promise<void> {
    await api.patch(`/emergency-alerts/responses/${id}`, { action: 'withdraw' })
  },
}

/* ------------------------------------------------------------------ */
/*  Pickups                                                            */
/* ------------------------------------------------------------------ */
export const pickupsService = {
  async mine(): Promise<Pickup[]> {
    const res = await api.get<Envelope<Pickup[]>>('/pickups/my')
    return res.data.data ?? []
  },

  async byId(id: string): Promise<Pickup> {
    const res = await api.get<Envelope<Pickup>>(`/pickups/${id}`)
    return res.data.data
  },

  async schedule(allocationId: string, payload: { scheduled_at: string }): Promise<Pickup> {
    const res = await api.post<Envelope<Pickup>>('/pickups', { allocation_id: allocationId, ...payload })
    return res.data.data
  },

  async updateStatus(id: string, payload: { status: Pickup['status'] }): Promise<Pickup> {
    const res = await api.patch<Envelope<Pickup>>(`/pickups/${id}/status`, payload)
    return res.data.data
  },
}

/* ------------------------------------------------------------------ */
/*  Notifications                                                      */
/* ------------------------------------------------------------------ */
export const notificationsService = {
  async list(): Promise<{ data: NotificationItem[]; unread: number }> {
    const res = await api.get<{ data: NotificationItem[]; unread?: number }>('/notifications')
    return { data: res.data.data ?? [], unread: res.data.unread ?? 0 }
  },

  async markRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`)
  },

  async markAllRead(): Promise<void> {
    await api.patch('/notifications/read-all')
  },
}

/* ------------------------------------------------------------------ */
/*  Dashboards                                                         */
/* ------------------------------------------------------------------ */
export const dashboardService = {
  async donor(): Promise<DonorStats> {
    const res = await api.get<Envelope<DonorStats>>('/dashboard/donor')
    return res.data.data
  },

  async recipient(): Promise<RecipientStats> {
    const res = await api.get<Envelope<RecipientStats>>('/dashboard/recipient')
    return res.data.data
  },
}

/* ------------------------------------------------------------------ */
/*  Uploads                                                            */
/* ------------------------------------------------------------------ */
export const uploadsService = {
  async foodImage(file: File): Promise<{ path: string; publicUrl: string }> {
    const form = new FormData()
    form.append('image', file)
    const res = await api.post<{ path: string; publicUrl: string }>(
      '/uploads/food-image',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data
  },
}
