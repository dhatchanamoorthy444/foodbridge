import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

const required = [
  !supabaseUrl && 'SUPABASE_URL',
  !supabaseServiceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY',
].filter((name): name is string => Boolean(name))

if (required.length > 0) {
  throw new Error(
    `Missing Supabase environment variables: ${required.join(', ')}. ` +
      'Set them in the backend environment before starting the server.'
  )
}

export const supabaseAdmin = createClient(supabaseUrl as string, supabaseServiceRoleKey as string, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export const supabase: SupabaseClient | null = supabaseAnonKey
  ? createClient(supabaseUrl as string, supabaseAnonKey)
  : null
