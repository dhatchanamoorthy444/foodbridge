import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from './supabase'
import { normalizeApiBaseUrl } from './apiBase'

export const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,
})

api.interceptors.request.use(async (config) => {
  // Always try to attach a valid Supabase token if the client is available
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        // No active session - remove any stale auth header
        config.headers.Authorization = undefined
      }
    } catch (e) {
      console.warn('[api interceptor] auth.getSession error', e)
      // Keep existing config if we can't check session
    }
  }
  return config
})

export interface ApiEnvelope<T> {
  data: T
  total?: number
  limit?: number
  offset?: number
  unread?: number
  error?: string
  details?: unknown
}

export function apiErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const resp = err.response?.data as { error?: string; message?: string } | undefined
    return resp?.error ?? resp?.message ?? err.message
  }
  if (err instanceof Error) return err.message
  return 'Unexpected error'
}

export function toastApiError(err: unknown, fallback?: string): void {
  toast.error(fallback ? `${fallback}: ${apiErrorMessage(err)}` : apiErrorMessage(err))
}

export async function isBackendHealthy(): Promise<boolean> {
  const base = api.defaults.baseURL as string
  try {
    const res = await axios.get(base.replace(/\/$/, '') + '/health', { timeout: 20_000 })
    return res.status === 200
  } catch {
    return false
  }
}
