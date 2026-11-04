import { supabaseAdmin } from '../db/supabase'
import { notify, audit } from './notify'
import { FoodRequestRow, DonationRow } from '../types/db'

export interface RequestQuery {
  recipientId?: string
  donationId?: string
  status?: string
}

export const foodRequestsService = {
  async list(q: RequestQuery): Promise<{ rows: FoodRequestRow[]; total: number }> {
    let builder = supabaseAdmin
      .from('food_requests')
      .select('*, donation:food_donations(id, food_name, unit)', { count: 'exact' })
    if (q.recipientId) builder = builder.eq('recipient_id', q.recipientId)
    if (q.donationId) builder = builder.eq('donation_id', q.donationId)
    if (q.status && q.status !== 'all') builder = builder.eq('status', q.status)
    builder = builder.order('created_at', { ascending: false })
    const { data, error, count } = await builder
    if (error) throw error
    return { rows: (data ?? []) as FoodRequestRow[], total: count ?? 0 }
  },

  async byId(id: string): Promise<FoodRequestRow | null> {
    const { data, error } = await supabaseAdmin
      .from('food_requests')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return data as FoodRequestRow
  },

  /**
   * Owner checks for donor actions: the request must belong to a donation
   * owned by `donorId`.
   */
  async ownedByDonor(requestId: string, donorId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
      .from('food_requests')
      .select('id, donation:food_donations!inner(donor_id)')
      .eq('id', requestId)
      .single()
    if (!data) return false
    const donation = data.donation as unknown as
      | { donor_id: string }
      | { donor_id: string }[]
      | null
    if (Array.isArray(donation)) {
      return donation[0]?.donor_id === donorId
    }
    return donation?.donor_id === donorId
  },

  getDonation: async (donationId: string): Promise<DonationRow | null> => {
    const { data } = await supabaseAdmin
      .from('food_donations')
      .select('*')
      .eq('id', donationId)
      .single()
    if (!data) return null
    return data as DonationRow
  },

  async create(
    userId: string,
    payload: Record<string, unknown>
  ): Promise<FoodRequestRow> {
    const donation = await this.getDonation(String(payload.donation_id))
    if (!donation) throw new Error('NOT_FOUND: donation')
    if (donation.status !== 'available' && donation.status !== 'partially_fulfilled') {
      throw new Error('DONATION_STATE: not available')
    }
    if (
      donation.expires_at &&
      new Date(donation.expires_at).getTime() < Date.now()
    ) {
      throw new Error('DONATION_EXPIRED')
    }
    const requested = Number(payload.requested_quantity)
    if (!Number.isFinite(requested) || requested <= 0) {
      throw new Error('QUANTITY_INVALID')
    }
    if (requested > donation.available_quantity) {
      throw new Error(
        `QUANTITY_EXCEEDS: only ${donation.available_quantity} ${donation.unit} available`
      )
    }

    const { data, error } = await supabaseAdmin
      .from('food_requests')
      .insert({ ...payload, recipient_id: userId, status: 'pending' })
      .select('*')
      .single()
    if (error) throw error

    await notify({
      userId: donation.donor_id,
      type: 'match_found',
      title: 'New food request',
      message: `A recipient requested ${requested} ${donation.unit} of "${donation.food_name}".`,
      eventKey: `fr_new:${data.id}`,
    })
    await notify({
      userId,
      type: 'system_alert',
      title: 'Request submitted',
      message: `Your request for "${donation.food_name}" was sent to the donor.`,
      eventKey: `fr_me:${data.id}`,
    })
    await audit(userId, 'food_request.create', 'food_requests', data.id, {
      donation_id: donation.id,
      requested_quantity: requested,
    })
    return data as FoodRequestRow
  },

  async decide(
    requestId: string,
    donorId: string,
    action: 'approve' | 'reject'
  ): Promise<void> {
    const allowed = await this.ownedByDonor(requestId, donorId)
    if (!allowed) throw new Error('FORBIDDEN')

    const row = await this.byId(requestId)
    if (!row) throw new Error('NOT_FOUND: request')
    if (row.status !== 'pending') {
      throw new Error(`REQUEST_STATE: request is ${row.status}`)
    }

    if (action === 'reject') {
      const { error } = await supabaseAdmin
        .from('food_requests')
        .update({
          status: 'rejected',
          decided_by: donorId,
          decided_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .eq('status', 'pending')
      if (error) throw new Error(error.message)
      const donation = await this.getDonation(row.donation_id)
      if (donation) {
        await notify({
          userId: row.recipient_id,
          type: 'system_alert',
          title: 'Request declined',
          message: `Your request for "${donation.food_name}" was declined by the donor`,
          eventKey: 'fr_denied:' + requestId,
        })
      }
      await audit(donorId, 'food_request.reject', 'food_requests', requestId)
      return
    }

    // Approval goes through the atomic PostgreSQL RPC — it recomputes the
    // donation stock under a row lock, so two approvals can never over-sell.
    const { error: rpcError } = await supabaseAdmin.rpc('create_allocation', {
      p_donation_id: row.donation_id,
      p_request_id: requestId,
      p_quantity: row.requested_quantity,
    })

    if (rpcError) throw new Error(rpcError.message)
    const donation = await this.getDonation(row.donation_id)
    if (donation) {
      await notify({
        userId: row.recipient_id,
        type: 'match_found',
        title: 'Food request approved',
        message: `${row.requested_quantity} ${row.unit} of "${donation.food_name}" was allocated to you`,
        eventKey: 'fr_approved:' + requestId,
      })
    }
    await audit(donorId, 'food_request.approve', 'food_requests', requestId)
  },
}
