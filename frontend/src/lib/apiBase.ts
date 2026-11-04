const API_BASE_FALLBACK = 'https://foodbridge-backend-wu2b.onrender.com/api'

export function normalizeApiBaseUrl(raw?: string): string {
  const base = (raw?.trim() || API_BASE_FALLBACK).replace(/\/+$/, '')
  return /\/api(?:\/|$)/i.test(base) ? base : `${base}/api`
}
