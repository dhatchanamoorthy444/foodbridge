import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserRole, Notification } from '../types'

export type AppTheme = 'harvest' | 'orchard' | 'market'

interface AppState {
  // Auth state
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // UI state
  sidebarOpen: boolean
  theme: AppTheme
  animationsEnabled: boolean

  // Notifications
  notifications: Notification[]
  unreadCount: number

  // Actions
  setUser: (user: User | null) => void
  login: (user: User) => void
  updateUser: (updates: Partial<User>) => Promise<User | null>
  logout: () => void
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: AppTheme) => void
  setAnimationsEnabled: (enabled: boolean) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      sidebarOpen: true,
      theme: 'harvest',
      animationsEnabled: true,
      notifications: [],
      unreadCount: 0,

      // Auth actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: (user) => {
        set({ user, isAuthenticated: true })
        // Add welcome notification
        get().addNotification({
          userId: user.id,
          type: 'welcome',
          title: 'Welcome to FoodBridge!',
          message: `Hello ${user.fullName}! You're now logged in as ${user.role}.`,
          read: false,
        })
      },
      updateUser: async (updates) => {
        const current = get().user
        if (!current) return null
        const updated = { ...current, ...updates }
        set({ user: updated })
        return updated
      },
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          notifications: [],
          unreadCount: 0,
        }),
      setLoading: (loading) => set({ isLoading: loading }),

      // UI actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),

      // Notification actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'foodbridge-storage',
      version: 2,
      migrate: (persisted: unknown) => {
        const state = (persisted ?? {}) as Record<string, unknown>
        if (state.theme === 'light') state.theme = 'orchard'
        else if (state.theme === 'dark' || !state.theme) state.theme = 'harvest'
        return state
      },
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