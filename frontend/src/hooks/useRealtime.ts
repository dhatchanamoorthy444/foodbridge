import { useEffect, useRef, useCallback, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeTables {
  tables: string[]
  onChange: () => void
  enabled?: boolean
}

/**
 * Subscribes to PostgreSQL changes for the specified tables and calls
 * `onChange` after deduplicating event storms (250ms) so one UI refresh
 * covers a burst of related inserts.
 *
 * - Single channel shared across tables (no duplicate subscriptions)
 * - Reconnects are handled by supabase-js; we refetch after (RE)SUBSCRIBED
 * - Cleanup removes the channel from the client
 */
export function useRealtime({ tables, onChange, enabled = true }: UseRealtimeTables): { connected: boolean } {
  const cbRef = useRef(onChange)
  const [connected, setConnected] = useState(false)
  cbRef.current = onChange

  const key = tables.join('|')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fire = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => cbRef.current(), 250)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !enabled || tables.length === 0) {
      return
    }
    const client = supabase
    const channel: RealtimeChannel = client.channel(`fb-realtime-${key}`)
    for (const table of tables) {
      channel.on(
        'postgres_changes' as never,
        { event: '*', schema: 'public', table },
        () => fire()
      )
    }
    let disposed = false
    channel
      .subscribe((status) => {
        if (disposed) return
        if (status === 'SUBSCRIBED') {
          setConnected(true)
          cbRef.current()
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setConnected(false)
        } else if (status === 'CLOSED') {
          setConnected(false)
        }
      })
    return () => {
      disposed = true
      if (debounceRef.current) clearTimeout(debounceRef.current)
      client.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, fire])

  return { connected }
}
