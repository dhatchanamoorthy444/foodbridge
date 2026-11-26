import { supabaseAdmin } from '../db/supabase'
import { notify, audit } from './notify'
import {
  EmergencyAlertRow,
  EmergencyResponseRow,
  AllocationRow,
} from '../types/db'

const ACTIVE_STATUSES = ['open', 'partially_fulfilled']

export const emergencyService = {
  async listAlerts(opts: {
    status?: string
    recipientId?: string
    city?: string
  }): Promise<EmergencyAlertRow[]> {
    let q = supabaseAdmin
      .from('emergency_food_alerts')
      .select('*')
      .order('created_at', { ascending: false })
    if (opts.recipientId) q = q.eq('recipient_id', opts.recipientId)
    if (opts.city) q = q.ilike('city', `%${opts.city}%`)
    if (opts.status && opts.status !== 'all') q = q.eq('status', opts.status)
    const { data, error } = await q
    if (error) throw error
    const rows = (data ?? []) as EmergencyAlertRow[]
    return rows
  },

  async activeForDonors(): Promise<EmergencyAlertRow[]> {
    // alerts that are open/partial and required_by in the future
    const { data, error } = await supabaseAdmin
      .from('emergency_food_alerts')
      .select('*')
      .in('status', ACTIVE_STATUSES)
      .gte('required_by', new Date().toISOString())
      .order('required_by', { ascending: true })
    if (error) throw error
    return (data ?? []) as EmergencyAlertRow[]
  },

  async byId(id: string): Promise<EmergencyAlertRow | null> {
    const { data, error } = await supabaseAdmin
      .from('emergency_food_alerts')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return data as EmergencyAlertRow
  },

  /** Private contact detail — readable only by the alert's owner (or staff). */
  async contacts(
    alertId: string,
    requesterId: string
  ): Promise<{ contact_name: string; contact_phone: string } | null> {
    const alert = await this.byId(alertId)
    if (!alert || alert.recipient_id !== requesterId) return null
    const { data } = await supabaseAdmin
      .from('emergency_alert_contacts')
      .select('contact_name, contact_phone')
      .eq('alert_id', alertId)
      .single()
    return (data as { contact_name: string; contact_phone: string }) ?? null
  },

  async create(
    userId: string,
    profileFullName: string,
    payload: Record<string, unknown>
  ): Promise<EmergencyAlertRow> {
    const { data: alert, error: aErr } = await supabaseAdmin
      .from('emergency_food_alerts')
      .insert({
        recipient_id: userId,
        food_name: payload.food_name,
        food_category: payload.food_category,
        required_quantity: payload.required_quantity,
        unit: payload.unit,
        people_to_feed: payload.people_to_feed ?? null,
        required_by: payload.required_by,
        emergency_location: payload.emergency_location,
        area: payload.area ?? null,
        city: payload.city,
        recipient_org_name: profileFullName,
        reason: payload.reason,
        additional_requirements: payload.additional_requirements ?? null,
        image_path: payload.image_path ?? null,
        status: 'open',
      })
      .select('*')
      .single()
    if (aErr) throw aErr

    const { error: cErr } = await supabaseAdmin
      .from('emergency_alert_contacts')
      .insert({
        alert_id: alert.id,
        contact_name: payload.contact_name,
        contact_phone: payload.contact_phone,
      })
    if (cErr) throw cErr

    await audit(userId, 'alert.create', 'emergency_food_alerts', alert.id)
    return alert as EmergencyAlertRow
  },

  async update(
    userId: string,
    alertId: string,
    payload: Record<string, unknown>
  ): Promise<EmergencyAlertRow> {
    const alert = await this.byId(alertId)
    if (!alert) throw new Error('NOT_FOUND: alert')
    if (alert.recipient_id !== userId) throw new Error('FORBIDDEN')
    const editable: Record<string, unknown> = {}
    if (payload.food_name) editable.food_name = payload.food_name
    if (payload.reason) editable.reason = payload.reason
    if (payload.city) editable.city = payload.city
    if (payload.emergency_location) {
      editable.emergency_location = payload.emergency_location
    }
    if (payload.required_by) editable.required_by = payload.required_by
    if (payload.additional_requirements !== undefined) {
      editable.additional_requirements = payload.additional_requirements
    }
    if (payload.image_path) editable.image_path = payload.image_path

    const { data, error } = await supabaseAdmin
      .from('emergency_food_alerts')
      .update(editable)
      .eq('id', alertId)
      .eq('recipient_id', userId)
      .select('*')
      .single()
    if (error) throw error
    return data as EmergencyAlertRow
  },

  async cancel(userId: string, alertId: string): Promise<void> {
    const alert = await this.byId(alertId)
    if (!alert) throw new Error('NOT_FOUND: alert')
    if (alert.recipient_id !== userId) throw new Error('FORBIDDEN')
    if (['fulfilled', 'cancelled', 'expired'].includes(alert.status)) {
      throw new Error(`ALERT_STATE: alert is ${alert.status}`)
    }
    const { error } = await supabaseAdmin
      .from('emergency_food_alerts')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', alertId)
      .eq('recipient_id', userId)
    if (error) throw error
    await audit(userId, 'alert.cancel', 'emergency_food_alerts', alertId)
    // decline all pending responses
    const { data: pend } = await supabaseAdmin
      .from('emergency_alert_responses')
      .select('id, donor_id')
      .eq('alert_id', alertId)
      .eq('status', 'pending')
    if (pend && pend.length > 0) {
      await supabaseAdmin
        .from('emergency_alert_responses')
        .update({ status: 'declined', decided_at: new Date().toISOString() })
        .eq('alert_id', alertId)
        .eq('status', 'pending')
      for (const p of pend) {
        await notify({
          userId: p.donor_id,
          type: 'system_alert',
          title: 'Alert cancelled',
          message: 'The emergency alert you responded to was cancelled.',
          eventKey: 'alert_cancelled:' + p.id,
        })
      }
    }
  },

  async respond(
    userId: string,
    alertId: string,
    payload: Record<string, unknown>
  ): Promise<EmergencyResponseRow> {
    const alert = await this.byId(alertId)
    if (!alert) throw new Error('NOT_FOUND: alert')
    if (alert.recipient_id === userId) {
      throw new Error('FORBIDDEN: cannot respond to own alert')
    }
    if (!ACTIVE_STATUSES.includes(alert.status)) {
      throw new Error(`ALERT_STATE: alert is ${alert.status}`)
    }
    if (new Date(alert.required_by).getTime() < Date.now()) {
      throw new Error('ALERT_STATE: alert required-by date has passed')
    }

    const offered = Number(payload.offered_quantity)
    if (!Number.isFinite(offered) || offered <= 0) {
      throw new Error('QUANTITY_INVALID')
    }
    const alertRemaining = Number(alert.required_quantity) - Number(alert.fulfilled_quantity)
    if (offered > alertRemaining) {
      throw new Error(
        `QUANTITY_EXCEEDS: only ${alertRemaining} ${alert.unit} still needed`
      )
    }

    // donation offer must be owned by this donor and active
    if (payload.donation_id) {
      const { data: donation } = await supabaseAdmin
        .from('food_donations')
        .select('id, donor_id, available_quantity, status')
        .eq('id', String(payload.donation_id))
        .single()
      if (!donation) throw new Error('NOT_FOUND: donation')
      if (donation.donor_id !== userId) throw new Error('FORBIDDEN: donation')
      if (Number(donation.available_quantity) < offered) {
        throw new Error(
          `QUANTITY_EXCEEDS: donate only ${donation.available_quantity} available`
        )
      }
    }

    const { data: resp, error: rErr } = await supabaseAdmin
      .from('emergency_alert_responses')
      .insert({
        alert_id: alert.id,
        donor_id: userId,
        donation_id: payload.donation_id ?? null,
        food_name: payload.food_name,
        offered_quantity: offered,
        unit: payload.unit,
        availability_note: payload.availability_note ?? null,
        message: payload.message ?? null,
        status: 'pending',
      })
      .select('*')
      .single()
    if (rErr) throw rErr

    await notify({
      userId: alert.recipient_id,
      type: 'match_found',
      title: 'Donor responded to your alert',
      message: `A donor offered ${offered} ${payload.unit} of "${String(payload.food_name)}".`,
      eventKey: 'alert_resp:' + resp.id,
      data: { alert_id: alert.id, response_id: resp.id },
    })
    await audit(userId, 'alert.respond', 'emergency_alert_responses', resp.id)
    return resp as EmergencyResponseRow
  },

  async responsesForAlert(
    alertId: string,
    requesterId?: string
  ): Promise<EmergencyResponseRow[]> {
    const alert = await this.byId(alertId)
    if (!alert) throw new Error('NOT_FOUND: alert')
    if (requesterId) {
      if (requesterId === alert.recipient_id) {
        const { data, error } = await supabaseAdmin
          .from('emergency_alert_responses')
          .select('*')
          .eq('alert_id', alertId)
          .order('created_at', { ascending: false })
        if (error) throw error
        return (data ?? []) as EmergencyResponseRow[]
      }
    }
    // donors: only their own responses
    const { data, error } = await supabaseAdmin
      .from('emergency_alert_responses')
      .select('*')
      .eq('alert_id', alertId)
      .eq('donor_id', requesterId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as EmergencyResponseRow[]
  },

  async myResponses(userId: string): Promise<EmergencyResponseRow[]> {
    const { data, error } = await supabaseAdmin
      .from('emergency_alert_responses')
      .select('*')
      .eq('donor_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as EmergencyResponseRow[]
  },

  /**
   * Accept path is atomic via accept_emergency_response() RPC. Never
   * mutates quantities from JS — PostgreSQL owns the arithmetic.
   */
  async acceptResponse(userId: string, responseId: string): Promise<AllocationRow> {
    const { data: resp } = await supabaseAdmin
      .from('emergency_alert_responses')
      .select('id, alert_id')
      .eq('id', responseId)
      .single()
    if (!resp) throw new Error('NOT_FOUND: response')
    const alert = await this.byId(resp.alert_id)
    if (!alert) throw new Error('NOT_FOUND: alert')
    if (alert.recipient_id !== userId) throw new Error('FORBIDDEN')

    const { data: allocation, error: rpcError } = await supabaseAdmin
      .rpc('accept_emergency_response', { p_response_id: responseId })
    if (rpcError) throw new Error(rpcError.message)
    await audit(userId, 'alert.accept', 'emergency_alert_responses', responseId)
    return (allocation ?? null) as AllocationRow
  },

  async declineResponse(userId: string, responseId: string): Promise<void> {
    const { data: resp } = await supabaseAdmin
      .from('emergency_alert_responses')
      .select('id, alert_id')
      .eq('id', responseId)
      .single()
    if (!resp) throw new Error('NOT_FOUND: response')
    const alert = await this.byId(resp.alert_id)
    if (!alert) throw new Error('NOT_FOUND: alert')
    if (alert.recipient_id !== userId) throw new Error('FORBIDDEN')

    const { error } = await supabaseAdmin
      .from('emergency_alert_responses')
      .update({ status: 'declined', decided_at: new Date().toISOString() })
      .eq('id', responseId)
      .eq('status', 'pending')
    if (error) throw error

    const { data: respRow } = await supabaseAdmin
      .from('emergency_alert_responses')
      .select('donor_id')
      .eq('id', responseId)
      .single()
    if (respRow) {
      await notify({
        userId: respRow.donor_id,
        type: 'system_alert',
        title: 'Response declined',
        message: 'Your emergency alert response was declined.',
        eventKey: 'alert_declined:' + responseId,
      })
    }
    await audit(userId, 'alert.decline', 'emergency_alert_responses', responseId)
  },

  async withdrawResponse(userId: string, responseId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('emergency_alert_responses')
      .update({ status: 'withdrawn', decided_at: new Date().toISOString() })
      .eq('id', responseId)
      .eq('donor_id', userId)
      .eq('status', 'pending')
    if (error) throw error
  },
}
