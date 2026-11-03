import { useEffect } from 'react'
import useAppStore from '../store/useAppStore'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { authService } from '../services/api'
import type { Profile } from '../types/api'

async function authSessionProfile(): Promise<Profile | null> {
  try {
    return await authService.fetchProfile()
  } catch {
    return null
  }
}

/**
 * Boots the Supabase session once and streams auth state changes into the
 * Zustand store. Demo sessions (env unconfigured) are owned by Login.tsx.
 */
export function SessionBridge({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)
  const setSessionReady = useAppStore((s) => s.setSessionReady)
  const setDemoSession = useAppStore((s) => s.setDemoSession)

  useEffect(() => {
    let active = true

    function apply(profile: Profile | null) {
      if (!active) return
      if (profile) {
        setDemoSession(false)
        setUser(profile)
      } else {
        setUser(null)
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      setSessionReady(true)
      return
    }

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') return
      if (event === 'SIGNED_OUT' || !session) {
        apply(null)
        return
      }
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const profile = await authSessionProfile()
        apply(profile)
        if (!profile) {
          // profile fetch failed (likely transient) — force re-apply on next poll
          setSessionReady(true)
        }
      }
    })

    void supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return
      if (!session) {
        setSessionReady(true)
        return
      }
      const profile = await authSessionProfile()
      apply(profile)
      setSessionReady(true)
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [setUser, setSessionReady, setDemoSession])

  return <>{children}</>
}
