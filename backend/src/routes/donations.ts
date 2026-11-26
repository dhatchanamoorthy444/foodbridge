import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware, requireDonor } from '../middleware/auth'
import { donationsService } from '../services/donationsService'
import { notify, audit } from '../services/notify'
import { donationCreateSchema, donationUpdateSchema } from '../validation/schemas'
import { supabaseAdmin } from '../db/supabase'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mine = req.query.mine === '1'
    const limit = Math.min(Number(req.query.limit ?? 60), 100)
    const offset = Math.max(Number(req.query.offset ?? 0), 0)
    const { rows, total } = await donationsService.list({
      donorId: mine ? req.user!.userId : undefined,
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
      category: typeof req.query.category === 'string' ? req.query.category : undefined,
      city: typeof req.query.city === 'string' ? req.query.city : undefined,
      sort: req.query.sort === 'created' ? 'created' : 'expiry',
      limit,
      offset,
      excludeExpired: !mine,
    })
    res.json({ data: rows, total, limit, offset })
  } catch (e) {
    next(e)
  }
})

router.get('/my', requireDonor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 60), 100)
    const offset = Math.max(Number(req.query.offset ?? 0), 0)
    const { rows, total } = await donationsService.list({
      donorId: req.user!.userId,
      sort: 'created',
      limit,
      offset,
    })
    res.json({ data: rows, total, limit, offset })
  } catch (e) {
    next(e)
  }
})

router.post(
  '/',
  requireDonor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = donationCreateSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.flatten(),
        })
      }

      const row = await donationsService.create(
        { userId: req.user!.userId, profile: req.user!.profile },
        parsed.data as unknown as Record<string, unknown>
      )

      await notify({
        userId: req.user!.userId,
        type: 'system_alert',
        title: 'Donation published',
        message: `"${row.food_name}" is now visible to eligible recipients.`,
        eventKey: 'don_new:' + row.id,
      })
      await audit(req.user!.userId, 'donation.create', 'food_donations', row.id, {
        food_name: row.food_name,
      })
      return res.status(201).json({ data: row })
    } catch (e) {
      next(e)
    }
  }
)

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const row = await donationsService.byId(req.params.id)
    if (!row) {
      return res.status(404).json({ error: 'Donation not found' })
    }
    return res.json({ data: row })
  } catch (e) {
    next(e)
  }
})

router.patch(
  '/:id',
  requireDonor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = await donationsService.byId(req.params.id)
      if (!existing) return res.status(404).json({ error: 'Donation not found' })
      if (existing.donor_id !== req.user!.userId) {
        return res
          .status(403)
          .json({ error: 'You can only edit your own donations' })
      }
      if (existing.status === 'completed' || existing.status === 'cancelled') {
        return res
          .status(409)
          .json({ error: `Cannot edit a ${existing.status} donation` })
      }

      const parsed = donationUpdateSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.flatten(),
        })
      }
      const payload = parsed.data as Record<string, unknown>
      const allocated = Number(existing.quantity) - Number(existing.available_quantity)
      if (
        payload.quantity !== undefined &&
        Number(payload.quantity) < allocated
      ) {
        return res.status(409).json({
          error: `${allocated} already allocated — quantity cannot drop below that`,
        })
      }
      if (payload.quantity !== undefined) {
        payload.available_quantity =
          Number(payload.quantity) - allocated
      }

      const { data: updated, error: upErr } = await supabaseAdmin
        .from('food_donations')
        .update(payload)
        .eq('id', req.params.id)
        .eq('donor_id', req.user!.userId)
        .select('*')
        .single()
      if (upErr) throw upErr
      await audit(req.user!.userId, 'donation.update', 'food_donations', existing.id)
      return res.json({ data: updated })
    } catch (e) {
      next(e)
    }
  }
)

router.post(
  '/:id/cancel',
  requireDonor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await donationsService.cancel(req.params.id, req.user!.userId)
      await notify({
        userId: req.user!.userId,
        type: 'system_alert',
        title: 'Donation cancelled',
        message: `Donation ${req.params.id.slice(0, 8)} was cancelled`,
        eventKey: 'don_cancel:' + req.params.id,
      })
      await audit(req.user!.userId, 'donation.cancel', 'food_donations', req.params.id)
      return res.json({ ok: true })
    } catch (e) {
      next(e)
    }
  }
)

export { router as donationsRoutes }
