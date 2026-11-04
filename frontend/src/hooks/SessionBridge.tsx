import { useEffect } from 'react'
import useAppStore from '../store/useAppStore'
import { supabase } from '../lib/supabase'
import { authService } from '../services/api'
import type { Profile } from '../types/api'

async function authSessionProfile(): Promise<Profile | null> {
  try {
    return await authService.fetchProfile()
  } catch (err) {
    console.error('Failed to fetch profile during auth sync:', err)
    return null
  }
}

/**
 * Boots the Supabase session once and streams auth state changes into the
 * Zustand store with robust lifecycle handling.
 */
export function SessionBridge({ children }: { children?: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)
  const setSessionReady = useAppStore((s) => s.setSessionReady)
  const setDemoSession = useAppStore((s) => s.setDemoSession)

  useEffect(() => {
    if (!supabase) {
      setSessionReady(true)
      return
    }

    let active = true

    function apply(profile: Profile | null) {
      if (!active) return
      if (profile) {
        setDemoSession(false)
        setUser(profile)
      } else {
        setUser(null)
      }
      setSessionReady(true)
    }

    // 1. Initial Session Check directly from Supabase client
    void supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (!active) return
      if (error || !session) {
        apply(null)
        return
      }
      const profile = await authSessionProfile()
      apply(profile)
    })

    // 2. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return
      if (event === 'TOKEN_REFRESHED') return

      if (event === 'SIGNED_OUT' || !session) {
        apply(null)
        return
      }

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
        const profile = await authSessionProfile()
        apply(profile)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [setUser, setSessionReady, setDemoSession])

  return <>{children}</>
}
