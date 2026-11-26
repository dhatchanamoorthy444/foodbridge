import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../middleware/auth'
import { supabaseAdmin } from '../db/supabase'
import { profileUpdateSchema } from '../validation/schemas'

const router = Router()
router.use(authMiddleware)

/**
 * Identity comes from the verified Supabase session. Role can never be
 * changed through this endpoint — it is owned by the signup trigger.
 */
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ data: { user: req.user } })
  } catch (e) {
    next(e)
  }
})

router.patch('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = profileUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: parsed.error.flatten() })
    }
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(parsed.data)
      .eq('id', req.user!.userId)
      .select('id, email, role, full_name, organization, phone, account_type, address, city, postal_code, beneficiary_count')
      .single()
    if (error) throw error
    return res.json({ data })
  } catch (e) {
    next(e)
  }
})

export { router as profileRoutes }
