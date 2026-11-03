import { supabaseAdmin } from './supabase'

/**
 * Read-only schema verification.
 *
 * The previous implementation called PostgREST RPCs such as
 * `public.create_users_table()` that do not exist in this Supabase project
 * (error PGRST202 at startup). This module now only VERIFIES the existing
 * tables — it never attempts DDL, RPC calls or schema changes.
 */
const REQUIRED_TABLES = [
  'profiles',
  'recipient_preferences',
  'food_donations',
  'food_requests',
  'allocations',
  'pickups',
  'notifications',
  'audit_logs',
] as const

export interface TableStatus {
  table: string
  ok: boolean
  rows?: number
  error?: { code?: string; message: string }
}

export interface DbHealth {
  ok: boolean
  checkedAt: string
  tables: TableStatus[]
}

let dbHealth: DbHealth = { ok: false, checkedAt: new Date().toISOString(), tables: [] }

export function getDbHealth(): DbHealth {
  return dbHealth
}

async function verifyTable(table: (typeof REQUIRED_TABLES)[number]): Promise<TableStatus> {
  try {
    // GET with count: 'exact' and no rows (limit 0). Using `head: true` here
    // is unreliable: supabase-js returns { error: null, count: null } for
    // PostgREST errors on HEAD requests, so a missing table would silently
    // pass. A plain GET surfaces { code: 'PGRST205', ... } correctly.
    const { count, error } = await supabaseAdmin
      .from(table)
      .select('*', { count: 'exact' })
      .limit(0)

    if (error) {
      return {
        table,
        ok: false,
        error: { code: error.code, message: error.message },
      }
    }
    return { table, ok: true, rows: count ?? 0 }
  } catch (err) {
    return {
      table,
      ok: false,
      error: { code: 'UNEXPECTED', message: err instanceof Error ? err.message : String(err) },
    }
  }
}

export async function verifySchema(): Promise<DbHealth> {
  const tables = await Promise.all(REQUIRED_TABLES.map(verifyTable))
  const okCount = tables.filter((t) => t.ok).length
  return {
    ok: okCount === tables.length,
    checkedAt: new Date().toISOString(),
    tables,
  }
}

export async function initializeDatabase(): Promise<void> {
  console.log('🔍 Verifying Supabase schema (read-only check, no DDL)...')

  dbHealth = await verifySchema()

  const lines: string[] = []
  for (const status of dbHealth.tables) {
    if (status.ok) {
      lines.push(`  ✅ ${status.table} (${status.rows ?? 0} rows)`)
    } else {
      const code = status.error?.code ? `[${status.error.code}] ` : ''
      lines.push(`  ❌ ${status.table} — ${code}${status.error?.message ?? 'unknown error'}`)
    }
  }

  if (dbHealth.ok) {
    console.log(`✅ Database initialized successfully — all ${dbHealth.tables.length} tables reachable:`)
    console.log(lines.join('\n'))
    return
  }

  const okCount = dbHealth.tables.filter((t) => t.ok).length
  if (okCount === 0) {
    console.error('❌ Database unreachable — no required Supabase table could be queried:')
    console.error(lines.join('\n'))
    throw new Error('Supabase schema verification failed: database unreachable (all checks failed).')
  }

  // Partial failure: do NOT crash-loop. The server still starts, the failure
  // is reported here and again via /api/health, and the affected table's
  // endpoints will surface the same PostgREST error per request.
  console.error(`⚠️ Database initialized with ${okCount}/${dbHealth.tables.length} tables reachable:`)
  console.error(lines.join('\n'))
  console.error('⚠️ Starting server in degraded mode — affected endpoints will return PostgREST errors until the missing tables are restored.')
}
