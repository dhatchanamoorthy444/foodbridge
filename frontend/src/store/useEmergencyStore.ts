import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Donation, EmergencyAlert } from '../types/api'

export interface EmergencyNotification {
  id: string
  foodId: string
  foodName: string
  quantity: number
  unit: string
  donorName: string
  location: string
  expiresAt: string
  createdAt: string
  read: boolean
  type: 'emergency_food' | 'emergency_alert'
}

interface EmergencyFoodState {
  // Emergency food listings (synced across roles)
  emergencyFoods: Donation[]

  // Emergency notifications
  notifications: EmergencyNotification[]

  // Active view mode (persisted for seamless switching)
  activeMode: 'donor' | 'recipient'

  // Actions
  addEmergencyFood: (food: Donation) => void
  removeEmergencyFood: (foodId: string) => void
  updateEmergencyFood: (foodId: string, updates: Partial<Donation>) => void
  claimEmergencyFood: (foodId: string, userName?: string) => void
  collectEmergencyFood: (foodId: string) => void

  addNotification: (notification: Omit<EmergencyNotification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void

  setActiveMode: (mode: 'donor' | 'recipient') => void

  getUnreadCount: () => number
  getEmergencyFoodById: (foodId: string) => Donation | undefined
}

const useEmergencyStore = create<EmergencyFoodState>()(
  persist(
    (set, get) => ({
      emergencyFoods: [],
      notifications: [],
      activeMode: 'donor',

      addEmergencyFood: (food) => {
        set((state) => {
          const exists = state.emergencyFoods.some((f) => f.id === food.id)
          if (exists) return state

          const emergencyFood: Donation = {
            ...food,
            status: food.status || 'available',
            isEmergency: food.isEmergency ?? true,
          }

          const notification: EmergencyNotification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            foodId: food.id,
            foodName: food.food_name,
            quantity: food.quantity,
            unit: food.unit,
            donorName: food.donor_business_name || 'Unknown Donor',
            location: food.pickup_address || food.city || 'Unknown Location',
            expiresAt: food.expires_at || '',
            createdAt: new Date().toISOString(),
            read: false,
            type: 'emergency_food',
          }

          return {
            emergencyFoods: [emergencyFood, ...state.emergencyFoods],
            notifications: [notification, ...state.notifications],
          }
        })
      },

      removeEmergencyFood: (foodId) => {
        set((state) => ({
          emergencyFoods: state.emergencyFoods.filter((f) => f.id !== foodId),
        }))
      },

      updateEmergencyFood: (foodId, updates) => {
        set((state) => ({
          emergencyFoods: state.emergencyFoods.map((f) =>
            f.id === foodId ? { ...f, ...updates } : f
          ),
        }))
      },

      claimEmergencyFood: (foodId, userName = 'Community Shelter') => {
        set((state) => {
          const food = state.emergencyFoods.find((f) => f.id === foodId)
          if (!food) return state
          return {
            emergencyFoods: state.emergencyFoods.map((f) =>
              f.id === foodId
                ? {
                    ...f,
                    status: 'claimed' as const,
                    // Store claim metadata for display in Pickups
                    claimedAt: new Date().toISOString(),
                    claimedBy: userName || 'Community Shelter',
                    pickupCode: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
                  }
                : f
            ),
          }
        })
      },

      collectEmergencyFood: (foodId) => {
        set((state) => ({
          emergencyFoods: state.emergencyFoods.map((f) =>
            f.id === foodId
              ? {
                  ...f,
                  status: 'completed' as const,
                }
              : f
          ),
        }))
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        }))
      },

      markNotificationRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        }))
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      setActiveMode: (mode) => {
        set({ activeMode: mode })
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length
      },

      getEmergencyFoodById: (foodId) => {
        return get().emergencyFoods.find((f) => f.id === foodId)
      },
    }),
    {
      name: 'foodbridge-emergency-storage',
      version: 2,
    }
  )
)

export { useEmergencyStore }
export default useEmergencyStore
