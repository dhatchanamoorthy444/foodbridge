import { supabaseAdmin } from '../db/supabase'
import { DonationRow } from '../types/db'

export interface DonationQuery {
  donorId?: string
  search?: string
  category?: string
  city?: string
  sort?: 'expiry' | 'created'
  limit?: number
  offset?: number
  excludeExpired?: boolean
}

export const donationsService = {
  async list(q: DonationQuery): Promise<{ rows: DonationRow[]; total: number }> {
    let builder = supabaseAdmin
      .from('food_donations')
      .select('*', { count: 'exact' })
      .neq('status', 'cancelled')

    if (q.donorId) builder = builder.eq('donor_id', q.donorId)
    if (q.category && q.category !== 'all')
      builder = builder.eq('food_category', q.category)
    if (q.city) builder = builder.ilike('city', `%${q.city}%`)
    if (q.search)
      builder = builder.or(
        `food_name.ilike.%${q.search}%,description.ilike.%${q.search}%`
      )
    if (q.excludeExpired) {
      builder = builder.gt('expires_at', new Date().toISOString())
      builder = builder.gt('available_quantity', 0)
    }
    builder = builder.order(
      q.sort === 'created' ? 'created_at' : 'expires_at',
      { ascending: q.sort === 'created' }
    )
    builder = builder.range(q.offset ?? 0, (q.offset ?? 0) + (q.limit ?? 50) - 1)

    const { data, error, count } = await builder
    if (error) throw error
    return { rows: (data ?? []) as DonationRow[], total: count ?? 0 }
  },

  async byId(id: string): Promise<DonationRow | null> {
    const { data, error } = await supabaseAdmin
      .from('food_donations')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return data as DonationRow
  },

  async create(
    donor: { userId: string; profile: { full_name: string | null } },
    payload: Record<string, unknown>
  ): Promise<DonationRow> {
    const { data, error } = await supabaseAdmin
      .from('food_donations')
      .insert({
        ...payload,
        donor_id: donor.userId,
        available_quantity: payload.quantity,
        status: 'available',
      })
      .select('*')
      .single()
    if (error) throw error
    void donor
    return data as DonationRow
  },

  async update(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('food_donations')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error
    return data as DonationRow
  },

  async cancel(id: string, donorId: string): Promise<void> {
    // Release unclaimed stock back to nothing: mark cancelled only when the
    // caller owns the row. Any pending requests for it are auto-rejected.
    const { data: donation, error: dErr } = await supabaseAdmin
      .from('food_donations')
      .select('id, donor_id, status')
      .eq('id', id)
      .single()
    if (dErr || !donation) throw new Error('NOT_FOUND: donation')
    if (donation.donor_id !== donorId) throw new Error('FORBIDDEN')

    const { error } = await supabaseAdmin
      .from('food_donations')
      .update({ status: 'cancelled', available_quantity: 0 })
      .eq('id', id)
    if (error) throw error

    await supabaseAdmin
      .from('food_requests')
      .update({ status: 'rejected', decided_at: new Date().toISOString() })
      .eq('donation_id', id)
      .eq('status', 'pending')
  },

  async removeImage(path: string): Promise<void> {
    await supabaseAdmin.storage
      .from('food-donation-images')
      .remove([path])
  },
}
