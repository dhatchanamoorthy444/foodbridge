import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise'

const DEMO_USERNAME = process.env.DEMO_USERNAME || 'user'
const DEMO_EMAIL = process.env.DEMO_EMAIL || 'user@foodbridge.local'
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'user'
const DEMO_DATA_FILE = path.resolve(process.cwd(), 'data', 'demo-users.json')

export interface DemoUserRecord {
  id: string
  username: string
  email: string
  password_hash: string
  full_name: string
  role: string
  organization: string | null
  phone: string | null
  city: string | null
  created_at: string
}

export interface DemoUserProfile {
  id: string
  email: string
  role: string
  full_name: string
  organization: string | null
  phone: string | null
  account_type: string
  address: string
  city: string
  postal_code: string
  beneficiary_count: null
  latitude: null
  longitude: null
  avatar_url: null
  created_at: string
}

let pool: Pool | null = null
let mysqlFailureAt = 0
let lastStorage: 'mysql' | 'file' = 'file'

const MYSQL_FAILURE_COOLDOWN_MS = 30_000

function mysqlEnabled(): boolean {
  if (process.env.DEMO_USE_MYSQL === 'false') return false
  return Boolean(process.env.MYSQL_HOST || process.env.MYSQL_DATABASE || process.env.MYSQL_USER)
}

function mysqlConfig() {
  return {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'foodbridge',
  }
}

function isoDate(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value)
}

function toProfile(user: DemoUserRecord): DemoUserProfile {
  return {
    id: user.id,
    email: user.email,
    role: user.role || 'donor',
    full_name: user.full_name,
    organization: user.organization,
    phone: user.phone,
    account_type: 'restaurant',
    address: '12 Demo Street, Anna Nagar',
    city: user.city || 'Chennai',
    postal_code: '600040',
    beneficiary_count: null,
    latitude: null,
    longitude: null,
    avatar_url: null,
    created_at: isoDate(user.created_at),
  }
}

function defaultRecord(): DemoUserRecord {
  return {
    id: 'demo-user-0001',
    username: DEMO_USERNAME,
    email: DEMO_EMAIL,
    password_hash: '',
    full_name: 'Demo Operator',
    role: 'donor',
    organization: 'FoodBridge Demo Kitchen',
    phone: '+91 90000 00000',
    city: 'Chennai',
    created_at: new Date().toISOString(),
  }
}

function readFileUsers(): DemoUserRecord[] {
  try {
    if (!fs.existsSync(DEMO_DATA_FILE)) return []
    const raw = fs.readFileSync(DEMO_DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as DemoUserRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeFileUsers(users: DemoUserRecord[]): void {
  try {
    fs.mkdirSync(path.dirname(DEMO_DATA_FILE), { recursive: true })
    fs.writeFileSync(DEMO_DATA_FILE, JSON.stringify(users, null, 2), 'utf8')
  } catch (err) {
    console.warn('[demoUsers] could not write local user file:', err)
  }
}

async function ensureFileStore(): Promise<void> {
  const existing = readFileUsers()
  if (existing.some((u) => u.username === DEMO_USERNAME || u.email === DEMO_EMAIL)) return
  const record = defaultRecord()
  record.password_hash = await bcrypt.hash(DEMO_PASSWORD, 10)
  writeFileUsers([...existing, record])
}

async function connectMysql(): Promise<Pool | null> {
  if (!mysqlEnabled()) return null
  if (pool) return pool
  if (mysqlFailureAt && Date.now() - mysqlFailureAt < MYSQL_FAILURE_COOLDOWN_MS) return null

  const { host, port, user, password, database } = mysqlConfig()
  const safeDb = database.replace(/`/g, '')

  try {
    const bootstrap = await mysql.createConnection({
      host,
      port,
      user,
      password,
      connectTimeout: 1500,
    })
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${safeDb}\``)
    await bootstrap.end()

    const created = mysql.createPool({
      host,
      port,
      user,
      password,
      database: safeDb,
      connectionLimit: 3,
      connectTimeout: 1500,
      waitForConnections: true,
    })

    await created.query(`
      CREATE TABLE IF NOT EXISTS demo_users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(64) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'donor',
        organization VARCHAR(255),
        phone VARCHAR(64),
        city VARCHAR(128),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    const [rows] = await created.query<RowDataPacket[]>(
      'SELECT id FROM demo_users WHERE username = ? OR email = ? LIMIT 1',
      [DEMO_USERNAME, DEMO_EMAIL]
    )
    if (rows.length === 0) {
      const record = defaultRecord()
      record.password_hash = await bcrypt.hash(DEMO_PASSWORD, 10)
      await created.query(
        `INSERT INTO demo_users (id, username, email, password_hash, full_name, role, organization, phone, city)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.username,
          record.email,
          record.password_hash,
          record.full_name,
          record.role,
          record.organization,
          record.phone,
          record.city,
        ]
      )
    }

    pool = created
    lastStorage = 'mysql'
    console.log(`✅ Demo users table ready in MySQL (${host}:${port}/${safeDb}).`)
    return pool
  } catch (err) {
    mysqlFailureAt = Date.now()
    console.warn(
      `⚠️  MySQL not available (${host}:${port}/${safeDb}) — using local JSON demo user store instead.`,
      err instanceof Error ? err.message : err
    )
    return null
  }
}

async function findUser(login: string): Promise<DemoUserRecord | null> {
  const normalized = login.trim().toLowerCase()

  const activePool = await connectMysql()
  if (activePool) {
    try {
      const [rows] = await activePool.query<RowDataPacket[]>(
        'SELECT * FROM demo_users WHERE LOWER(username) = ? OR LOWER(email) = ? LIMIT 1',
        [normalized, normalized]
      )
      if (rows.length > 0) {
        lastStorage = 'mysql'
        return rows[0] as unknown as DemoUserRecord
      }
    } catch (err) {
      console.warn('[demoUsers] MySQL lookup failed:', err instanceof Error ? err.message : err)
    }
  }

  await ensureFileStore()
  lastStorage = 'file'
  const users = readFileUsers()
  return users.find(
    (u) => u.username.toLowerCase() === normalized || u.email.toLowerCase() === normalized
  ) ?? null
}

export async function authenticateDemoUser(
  login: string,
  password: string
): Promise<DemoUserProfile | null> {
  const user = await findUser(login)
  if (!user) return null
  if (!user.password_hash) return null
  const matches = await bcrypt.compare(password, user.password_hash)
  if (!matches) return null
  return toProfile(user)
}

export async function initializeDemoUsers(): Promise<void> {
  await ensureFileStore()
  await connectMysql()
}

export function demoAuthStatus() {
  return {
    enabled: true,
    storage: lastStorage,
    mysqlEnabled: mysqlEnabled(),
    username: DEMO_USERNAME,
    email: DEMO_EMAIL,
  }
}
