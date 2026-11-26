import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { isDemoMode } from '../lib/demoMode'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

const demoMode = isDemoMode()

if ((!supabaseUrl || !supabaseServiceRoleKey) && !demoMode) {
  const missing = [
    !supabaseUrl && 'SUPABASE_URL',
    !supabaseServiceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY',
  ]
    .filter((v): v is string => Boolean(v))
    .join(', ')
  console.error(
    `❌ Missing Supabase environment variables: ${missing}\n` +
      '   Set them in Render → Environment before deploying, or set DEMO_MODE=true for local demos.'
  )
  process.exit(1)
}

// In demo mode Supabase is never called; a placeholder client keeps the
// existing route modules type-safe without requiring cloud credentials.
const resolvedUrl = supabaseUrl || 'http://127.0.0.1:54321'
const resolvedServiceRoleKey = supabaseServiceRoleKey || 'local-demo-service-role-key'

export const supabaseAdmin = createClient(resolvedUrl, resolvedServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export const supabase: SupabaseClient | null =
  supabaseAnonKey && !demoMode ? createClient(resolvedUrl, supabaseAnonKey) : null
