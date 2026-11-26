import { Router } from 'express'
import { authenticateDemoUser, demoAuthStatus } from '../db/demoUsers'
import { isDemoMode } from '../lib/demoMode'

const router = Router()

/**
 * Local-only demo sign-in. Verifies the account against MySQL when available
 * (table `demo_users`) and falls back to a JSON file otherwise.
 */
router.post('/demo-login', async (req, res) => {
  if (!isDemoMode()) {
    return res.status(404).json({ error: 'Demo login is disabled outside demo mode' })
  }

  const body = (req.body ?? {}) as { username?: string; email?: string; password?: string }
  const login = (body.username || body.email || '').trim()
  const password = body.password || ''

  if (!login || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  try {
    const user = await authenticateDemoUser(login, password)
    if (!user) {
      return res.status(401).json({ error: 'Invalid demo credentials' })
    }
    return res.json({
      token: 'local-demo-session',
      user,
      storage: demoAuthStatus().storage,
    })
  } catch (err) {
    console.error('[demoAuth] login failed:', err)
    return res.status(500).json({ error: 'Demo login failed' })
  }
})

router.get('/demo-status', (_req, res) => {
  res.json(demoAuthStatus())
})

export { router as demoAuthRoutes }
