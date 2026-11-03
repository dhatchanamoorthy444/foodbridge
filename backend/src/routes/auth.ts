import { Router } from 'express'
import { profileRoutes } from './profile'

const router = Router()

router.get('/health-token', (_req, res) => {
  res.json({ ok: true, note: 'Registration and login happen through Supabase Auth' })
})

router.use('/', profileRoutes)

export { router as authRoutes }
