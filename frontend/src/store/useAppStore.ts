import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { Profile, AppRole } from '../types/api'

export type AppTheme = 'harvest' | 'orchard' | 'market'

interface AppState {
  // Auth/session state (Supabase-backed; demo only when env unconfigured)
  user: Profile | null
  isAuthenticated: boolean
  isSessionReady: boolean
  isDemoSession: boolean

  // UI state
  sidebarOpen: boolean
  theme: AppTheme
  animationsEnabled: boolean

  // Actions
  setUser: (user: Profile | null) => void
  setSessionReady: (ready: boolean) => void
  setDemoSession: (demo: boolean) => void
  logoutLocal: () => void
  logout: () => Promise<void>
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: AppTheme) => void
  setAnimationsEnabled: (enabled: boolean) => void
  isRole: (roles: AppRole[]) => boolean
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isSessionReady: false,
      isDemoSession: false,

      sidebarOpen: true,
      theme: 'harvest',
      animationsEnabled: true,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isSessionReady: true }),
      setSessionReady: (ready) => set({ isSessionReady: ready }),
      setDemoSession: (demo) => set({ isDemoSession: demo }),
      logoutLocal: () =>
        set({ user: null, isAuthenticated: false, isDemoSession: false, isSessionReady: true }),
      logout: async () => {
        try {
          if (supabase) await supabase.auth.signOut()
        } catch {
          // Supabase sign-out may fail offline; clear local state regardless.
        }
        set({ user: null, isAuthenticated: false, isDemoSession: false, isSessionReady: true })
      },
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
      isRole: (roles) => {
        const role = get().user?.role
        return !!role && roles.includes(role)
      },
    }),
    {
      name: 'foodbridge-storage',
      version: 3,
      partialize: (state) => ({
        theme: state.theme,
        animationsEnabled: state.animationsEnabled,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

export { useAppStore }
export default useAppStore
