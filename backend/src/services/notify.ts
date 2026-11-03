import { supabaseAdmin } from '../db/supabase'

export interface NotifyInput {
  userId: string
  type: string
  title: string
  message: string
  eventKey?: string
  data?: Record<string, unknown>
}

/**
 * Idempotent notification insert. `eventKey` makes delivery effectively
 * one-shot thanks to the DB unique index on (user_id, md5(data->>'event_key')).
 */
export async function notify(input: NotifyInput): Promise<void> {
  const data = {
    ...(input.data ?? {}),
    ...(input.eventKey ? { event_key: input.eventKey } : {}),
  }
  const { error, code } = await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      data,
    })
    .then((r) => ({ error: r.error, code: r.error?.code }))

  if (error && code !== '23505') {
    console.error('[notify] insert failed', { code, message: error.message })
  }
}

export async function audit(
  actorId: string | null,
  action: string,
  entity: string,
  entityId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  const { error } = await supabaseAdmin.from('audit_logs').insert({
    actor_id: actorId,
    action,
    entity,
    entity_id: entityId ?? null,
    details: details ?? {},
  })
  if (error) console.error('[audit] insert failed', error.message)
}
