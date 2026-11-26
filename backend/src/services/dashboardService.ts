import { supabaseAdmin } from '../db/supabase'

async function countFrom(
  table: string,
  match: Record<string, unknown> | null
): Promise<number> {
  let q = supabaseAdmin
    .from(table)
    .select('*', { count: 'exact', head: true })
  for (const [col, val] of Object.entries(match ?? {})) {
    if (val === null || val === undefined) continue
    q = q.eq(col, val as never)
  }
  const { count, error } = await q
  if (error) throw error
  return count ?? 0
}

export const dashboardService = {
  async donorStats(userId: string) {
    const [myDonations, completedDonations] = await Promise.all([
      countFrom('food_donations', { donor_id: userId }),
      countFrom('food_donations', { donor_id: userId, status: 'completed' }),
    ])

    // available quantity of my non-cancelled, non-expired donations
    const { data: availRows, error: availErr } = await supabaseAdmin
      .from('food_donations')
      .select('available_quantity, expires_at')
      .eq('donor_id', userId)
      .neq('status', 'cancelled')
    if (availErr) throw availErr
    const nowMs = Date.now()
    const availableQuantity = (availRows ?? [])
      .filter(
        (row) =>
          !row.expires_at || new Date(row.expires_at).getTime() > nowMs
      )
      .reduce((sum, row) => sum + Number(row.available_quantity ?? 0), 0)

    // pending requests on my donations
    const { data: myDonationIds } = await supabaseAdmin
      .from('food_donations')
      .select('id')
      .eq('donor_id', userId)
    const ids = (myDonationIds ?? []).map((r: { id: string }) => r.id)
    let pendingRequests = 0
    if (ids.length > 0) {
      pendingRequests = await countFrom('food_requests', null)
      const { count, error } = await supabaseAdmin
        .from('food_requests')
        .select('*', { count: 'exact', head: true })
        .in('donation_id', ids)
        .eq('status', 'pending')
      if (error) throw error
      pendingRequests = count ?? 0
    }

    const [confirmedAllocations, upcomingPickups] = await Promise.all([
      countFrom('allocations', { donor_id: userId, status: 'confirmed' }),
      countFrom('pickups', { donor_id: userId, status: 'scheduled' }),
    ])

    const { count: openAlerts, error: alertErr } = await supabaseAdmin
      .from('emergency_food_alerts')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'partially_fulfilled'])
    if (alertErr) throw alertErr

    return {
      myDonations,
      availableQuantity,
      pendingRequests,
      confirmedAllocations,
      upcomingPickups,
      completedDonations,
      openEmergencyAlerts: openAlerts ?? 0,
    }
  },

  async recipientStats(userId: string) {
    const [availableDonations, myRequestsTotal, myAllocations, upcomingPickups] =
      await Promise.all([
        countFrom('food_donations', null),
        countFrom('food_requests', { recipient_id: userId }),
        countFrom('allocations', { recipient_id: userId }),
        countFrom('pickups', { recipient_id: userId, status: 'scheduled' }),
      ])

    const { data: reqRows, error: reqErr } = await supabaseAdmin
      .from('food_requests')
      .select('status')
      .eq('recipient_id', userId)
    if (reqErr) throw reqErr
    const byStatus: Record<string, number> = {}
    for (const r of reqRows ?? []) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1
    }

    const { data: alertRows, error: alertErr } = await supabaseAdmin
      .from('emergency_food_alerts')
      .select('required_quantity, fulfilled_quantity, status')
      .eq('recipient_id', userId)
    if (alertErr) throw alertErr
    const activeAlerts = (alertRows ?? []).filter(
      (a) => a.status === 'open' || a.status === 'partially_fulfilled'
    )
    const remainingOnAlerts = activeAlerts.reduce(
      (sum, a) =>
        sum + Math.max(0, Number(a.required_quantity) - Number(a.fulfilled_quantity)),
      0
    )

    // refine available donations: only non-expired
    const nowMs = Date.now()
    const notExpired = (await supabaseAdmin
      .from('food_donations')
      .select('id, expires_at, status')
      .eq('status', 'available')
      .gt('quantity', 0)) as { data: { id: string; expires_at: string | null }[] | null }
    const activeListings = (notExpired.data ?? []).filter(
      (d: { expires_at: string | null }) =>
        !d.expires_at || new Date(d.expires_at).getTime() > nowMs
    ).length

    return {
      availableDonations: availableDonations > 0 ? activeListings : 0,
      myRequestsTotal,
      pendingRequests: byStatus['pending'] ?? 0,
      approvedRequests: byStatus['approved'] ?? 0,
      rejectedRequests: byStatus['rejected'] ?? 0,
      myAllocations,
      upcomingPickups,
      myOpenAlerts: activeAlerts.length,
      remainingOnAlerts,
    }
  },
}
