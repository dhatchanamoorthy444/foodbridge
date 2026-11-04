import { supabaseAdmin } from '../db/supabase'
import { notify, audit } from './notify'
import { AllocationRow, PickupRow } from '../types/db'

export const allocationsService = {
  async listMine(userId: string): Promise<AllocationRow[]> {
    const { data, error } = await supabaseAdmin
      .from('allocations')
      .select('*')
      .or(`donor_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as AllocationRow[]
  },
}

export const pickupsService = {
  async listMine(userId: string): Promise<PickupRow[]> {
    const { data, error } = await supabaseAdmin
      .from('pickups')
      .select(
        '*, allocation:allocations(quantity, unit), donation:food_donations(food_name)'
      )
      .or(`donor_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('scheduled_at', { ascending: true })
    if (error) throw error
    return (data ?? []) as PickupRow[]
  },

  async byId(id: string): Promise<PickupRow | null> {
    const { data, error } = await supabaseAdmin
      .from('pickups')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return data as PickupRow
  },

  async assertParticipant(pickup: PickupRow, userId: string): Promise<void> {
    if (pickup.donor_id !== userId && pickup.recipient_id !== userId) {
      throw new Error('FORBIDDEN: not a pickup participant')
    }
  },

  async schedule(userId: string, payload: Record<string, unknown>) {
    const allocId = String(payload.allocation_id)
    const { data: alloc, error: aErr } = await supabaseAdmin
      .from('allocations')
      .select('*')
      .eq('id', allocId)
      .single()
    if (aErr || !alloc) throw new Error('NOT_FOUND: allocation')
    if (alloc.donor_id !== userId && alloc.recipient_id !== userId) {
      throw new Error('FORBIDDEN: not an allocation participant')
    }

    // one active pickup per allocation
    const { data: existing } = await supabaseAdmin
      .from('pickups')
      .select('id')
      .eq('allocation_id', allocId)
      .neq('status', 'cancelled')
      .maybeSingle()
    if (existing) throw new Error('DUPLICATE: pickup already scheduled')

    const { data: pickup, error } = await supabaseAdmin
      .from('pickups')
      .insert({
        allocation_id: allocId,
        donation_id: alloc.donation_id,
        response_id: alloc.response_id,
        donor_id: alloc.donor_id,
        recipient_id: alloc.recipient_id,
        scheduled_at: payload.scheduled_at,
        pickup_address: payload.pickup_address ?? null,
        pickup_instructions: payload.pickup_instructions ?? null,
        status: 'scheduled',
      })
      .select('*')
      .single()
    if (error) throw error

    await notify({
      userId: alloc.recipient_id,
      type: 'pickup_scheduled',
      title: 'Pickup scheduled',
      message: 'A pickup was scheduled for your allocated food.',
      eventKey: `pickup_new:${pickup.id}`,
      data: { pickup_id: pickup.id },
    })
    await notify({
      userId: alloc.donor_id,
      type: 'pickup_scheduled',
      title: 'Pickup scheduled',
      message: 'The recipient scheduled a pickup for your donation.',
      eventKey: `pickup_new_donor:${pickup.id}`,
      data: { pickup_id: pickup.id },
    })
    await audit(userId, 'pickup.create', 'pickups', pickup.id)
    return pickup as PickupRow
  },

  async updateStatus(
    actorId: string,
    pickupId: string,
    status: PickupRow['status']
  ): Promise<PickupRow> {
    const pickup = await this.byId(pickupId)
    if (!pickup) throw new Error('NOT_FOUND: pickup')
    await this.assertParticipant(pickup, actorId)

    if (pickup.status === 'completed') {
      throw new Error('STATE: completed pickups cannot change')
    }
    if (pickup.status === 'cancelled') {
      throw new Error('STATE: cancelled pickups cannot change')
    }

    const { data: updated, error } = await supabaseAdmin
      .from('pickups')
      .update({
        status,
        ...(status === 'delivered' || status === 'collected'
          ? { completed_at: new Date().toISOString() }
          : {}),
      })
      .eq('id', pickupId)
      .select('*')
      .single()
    if (error) throw error

    const completion: PickupRow['status'][] = ['delivered', 'collected']
    if (completion.includes(status)) {
      if (pickup.allocation_id) {
        await supabaseAdmin
          .from('allocations')
          .update({ status: 'completed' })
          .eq('id', pickup.allocation_id)
      }
      await notify({
        userId: pickup.donor_id,
        type: 'pickup_confirmed',
        title: 'Pickup completed',
        message: 'The food handover was completed.',
        eventKey: 'pickup_done_don:' + pickup.id,
      })
      await notify({
        userId: pickup.recipient_id,
        type: 'pickup_confirmed',
        title: 'Pickup completed',
        message: 'The food handover was completed.',
        eventKey: 'pickup_done_rec:' + pickup.id,
      })
      await audit(actorId, 'pickup.complete', 'pickups', pickup.id)
    }
    return updated as PickupRow
  },
}
