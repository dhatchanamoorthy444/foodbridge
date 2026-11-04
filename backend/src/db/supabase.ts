import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  const missing = [
    !supabaseUrl && 'SUPABASE_URL',
    !supabaseServiceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY',
  ]
    .filter((v): v is string => Boolean(v))
    .join(', ')
  console.error(
    `❌ Missing Supabase environment variables: ${missing}\n` +
      '   Set them in Render → Environment before deploying.'
  )
  process.exit(1)
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export const supabase: SupabaseClient | null = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
