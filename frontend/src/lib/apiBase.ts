const CLOUD_API_BASE = 'https://foodbridge-backend-wu2b.onrender.com/api'
const LOCAL_API_BASE = 'http://localhost:3001/api'

function runningOnLocalhost(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname.toLowerCase()
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]'
}

export function normalizeApiBaseUrl(raw?: string): string {
  // On localhost, prefer the local API server so a demo never depends on the
  // deployed Render backend. Production keeps the cloud fallback.
  const fallback = runningOnLocalhost() ? LOCAL_API_BASE : CLOUD_API_BASE
  const base = (raw?.trim() || fallback).replace(/\/+$/, '')
  return /\/api(?:\/|$)/i.test(base) ? base : `${base}/api`
}
