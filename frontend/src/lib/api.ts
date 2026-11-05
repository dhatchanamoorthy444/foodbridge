import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from './supabase'
import { normalizeApiBaseUrl } from './apiBase'
import useAppStore from '../store/useAppStore'

export const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,
})

/* ------------------------------------------------------------------ */
/*  Supabase Bearer-token management                                  */
/* ------------------------------------------------------------------ */

/**
 * Returns a valid access token, refreshing the Supabase session when the
 * cached access token is missing or expired. Returns null only when no
 * refreshable session exists (e.g. logged out / invalid refresh token).
 */
async function getValidAccessToken(): Promise<string | null> {
  if (!supabase) return null

  const { data, error } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (token && !error) return token

  // Access token missing or expired - attempt a refresh using the refresh token.
  try {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession()
    if (refreshed.session?.access_token && !refreshError) {
      return refreshed.session.access_token
    }
  } catch (e) {
    console.warn('[api interceptor] refreshSession error', e)
  }
  return null
}

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshTokenOnce(): Promise<string | null> {
  if (!supabase) return null
  if (refreshPromise) return refreshPromise
  if (isRefreshing) return null

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession()
      if (refreshed.session?.access_token && !refreshError) {
        return refreshed.session.access_token
      }
    } catch (e) {
      console.warn('[api interceptor] refreshSession error', e)
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
    return null
  })()
  return refreshPromise
}

/* ------------------------------------------------------------------ */
/*  Request interceptor - attach a valid Bearer token to every call   */
/* ------------------------------------------------------------------ */

api.interceptors.request.use(async (config) => {
  if (!supabase) {
    config.headers.Authorization = undefined
    return config
  }

  const token = await getValidAccessToken()
  config.headers.Authorization = token ? `Bearer ${token}` : undefined
  return config
})

/* ------------------------------------------------------------------ */
/*  Response interceptor - handle 401 with refresh + single retry     */
/* ------------------------------------------------------------------ */

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Only act on 401s and only retry once per request.
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }
    originalRequest._retry = true

    // Attempt to refresh the Supabase session and retry the original request.
    const newToken = await refreshTokenOnce()
    if (newToken) {
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest)
    }

    // Refresh failed - the session is genuinely dead. Clear client-side state
    // so protected routes redirect to login, but do NOT suppress the error:
    // the component layer can still surface a meaningful message.
    const store = useAppStore.getState()
    if (store.user) {
      store.logoutLocal()
    }

    return Promise.reject(error)
  }
)

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
