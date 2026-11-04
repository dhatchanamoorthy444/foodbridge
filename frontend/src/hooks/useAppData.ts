import { useQuery, useQueryClient, useMutation, UseMutationResult } from '@tanstack/react-query'
import { useEffect } from 'react'
import { notificationsService, donationsService, pickupsService } from '../services/api'
import { useRealtime } from './useRealtime'
import type { NotificationItem, Pickup } from '../types/api'

const NOTIFICATIONS_KEY = ['notifications'] as const
const NOTIF_TABLES = ['notifications']

export function useNotifications() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: async () => {
      const res = await notificationsService.list()
      return res
    },
    staleTime: 10_000,
  })

  const { connected } = useRealtime({
    tables: NOTIF_TABLES,
    onChange: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  })

  return { ...query, connected }
}

export function useMarkNotificationRead(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  })
}

export function useMarkAllNotificationsRead(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  })
}

/* ------------------------------------------------------------------ */
/*  Donations                                                           */
/* ------------------------------------------------------------------ */
const DONATIONS_TABLES = ['food_donations', 'food_requests', 'allocations']

export function useDonations(params: { search?: string; category?: string; city?: string; sort?: string }) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['donations', params],
    queryFn: () => donationsService.list(params),
  })

  const { connected } = useRealtime({
    tables: DONATIONS_TABLES,
    onChange: () => queryClient.invalidateQueries({ queryKey: ['donations'] }),
  })

  return { ...query, connected }
}

export function useMyDonations(enabled: boolean) {
  const query = useQuery({
    queryKey: ['my-donations'],
    queryFn: () => donationsService.my(),
    enabled,
    staleTime: 5_000,
  })
  return query
}

const MY_DONATIONS_TABLES = ['food_donations']

export function useMyDonationsLive(enabled: boolean) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['my-donations'],
    queryFn: () => donationsService.my(),
    enabled,
    staleTime: 5_000,
  })
  useRealtime({
    tables: MY_DONATIONS_TABLES,
    onChange: () => queryClient.invalidateQueries({ queryKey: ['my-donations'] }),
    enabled,
  })
  return query
}

/* ------------------------------------------------------------------ */
/*  Pickups                                                             */
/* ------------------------------------------------------------------ */
export function useMyPickups(enabled: boolean): { data?: Pickup[]; isLoading: boolean; refetch: () => void } {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['my-pickups'],
    queryFn: () => pickupsService.mine(),
    enabled,
    staleTime: 5_000,
  })

  useRealtime({
    tables: ['pickups'],
    onChange: () => queryClient.invalidateQueries({ queryKey: ['my-pickups'] }),
    enabled,
  })

  useEffect(() => {
    return () => {
      void 0
    }
  }, [])

  return {
    data: query.data?.data,
    isLoading: query.isLoading,
    refetch: () => query.refetch(),
  }
}

export function useUnreadCount(): number {
  const { data } = useNotifications()
  return data?.unread ?? 0
}

export type { NotificationItem }
