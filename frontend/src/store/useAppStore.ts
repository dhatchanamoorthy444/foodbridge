import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserRole, Notification } from '../types'

interface AppState {
  // Auth state
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // UI state
  sidebarOpen: boolean
  theme: 'dark' | 'light'
  animationsEnabled: boolean

  // Notifications
  notifications: Notification[]
  unreadCount: number

  // Actions
  setUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'dark' | 'light') => void
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
      theme: 'dark',
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
      partialize: (state) => ({
        theme: state.theme,
        animationsEnabled: state.animationsEnabled,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

export default useAppStore