import type { Profile } from '../types/api'
import { normalizeApiBaseUrl } from './apiBase'

export const DEMO_USERNAME = 'user'
export const DEMO_EMAIL = 'user@foodbridge.local'
export const DEMO_PASSWORD = 'user'

const DEMO_SESSION_KEY = 'foodbridge-demo-session'

export function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname.toLowerCase()
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]'
}

export function isDemoLogin(login: string, password: string): boolean {
  const normalized = login.trim().toLowerCase()
  return (
    password === DEMO_PASSWORD &&
    (normalized === DEMO_USERNAME || normalized === DEMO_EMAIL)
  )
}

export function demoProfile(): Profile {
  return {
    id: 'demo-user-0001',
    email: DEMO_EMAIL,
    role: 'donor',
    full_name: 'Demo Operator',
    organization: 'FoodBridge Demo Kitchen',
    phone: '+91 90000 00000',
    account_type: 'restaurant',
    address: '12 Demo Street, Anna Nagar',
    city: 'Chennai',
    postal_code: '600040',
    beneficiary_count: null,
    latitude: null,
    longitude: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
  }
}

export function loadDemoSession(): Profile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Profile
    if (!parsed || typeof parsed !== 'object' || !parsed.id) return null
    return parsed
  } catch {
    return null
  }
}

export function saveDemoSession(profile: Profile): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(profile))
  } catch {
    // localStorage may be unavailable (private mode) — demo still works in-memory.
  }
}

export function clearDemoSession(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(DEMO_SESSION_KEY)
  } catch {
    // ignore
  }
}

function localDemoApiBase(): string | null {
  if (!isLocalhost()) return null
  const configured = import.meta.env.VITE_API_URL as string | undefined
  const base = configured?.trim()
    ? normalizeApiBaseUrl(configured)
    : 'http://localhost:3001/api'
  try {
    const host = new URL(base).hostname.toLowerCase()
    const local = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]'
    return local ? base : null
  } catch {
    return null
  }
}

/**
 * Verifies the demo user against the local backend when it is running on this
 * machine. Never contacts a remote/cloud API: when the local backend is down
 * the built-in account is used, so the presentation stays fully offline.
 */
export async function demoSignIn(login: string, password: string): Promise<Profile> {
  if (!isDemoLogin(login, password)) {
    throw new Error('Invalid demo credentials. Use user / user.')
  }

  let profile = demoProfile()
  const base = localDemoApiBase()

  if (base) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 2500)
      const res = await fetch(`${base}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login.trim(), password }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (res.ok) {
        const payload = (await res.json()) as { user?: Partial<Profile> }
        if (payload?.user?.id) profile = { ...profile, ...payload.user }
      }
    } catch {
      // Local backend/MySQL not running — the built-in demo account still works.
    }
  }

  saveDemoSession(profile)
  return profile
}
