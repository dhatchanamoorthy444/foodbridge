import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware, requireDonor, requireRecipient } from '../middleware/auth'
import { foodRequestsService } from '../services/foodRequestsService'
import { foodRequestCreateSchema, foodRequestDecisionSchema } from '../validation/schemas'

const router = Router()
router.use(authMiddleware)

router.get(
  '/my',
  requireRecipient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = typeof req.query.status === 'string' ? req.query.status : undefined
      const { rows, total } = await foodRequestsService.list({
        recipientId: req.user!.userId,
        status,
      })
      const limit = Math.min(Number(req.query.limit ?? 50), 100)
      const offset = Math.max(Number(req.query.offset ?? 0), 0)
      res.json({
        data: rows.slice(offset, offset + limit),
        total,
        limit,
        offset,
      })
    } catch (e) {
      next(e)
    }
  }
)

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const row = await foodRequestsService.byId(req.params.id)
    if (!row) return res.status(404).json({ error: 'Request not found' })
    const isOwner = row.recipient_id === req.user!.userId
    let isDonor = false
    if (!isOwner) {
      const donation = await foodRequestsService.getDonation(row.donation_id)
      isDonor = donation?.donor_id === req.user!.userId
    }
    if (!isOwner && !isDonor) {
      return res.status(403).json({ error: 'Not authorized to view this request' })
    }
    return res.json({ data: row })
  } catch (e) {
    next(e)
  }
})

router.get(
  '/donation/:donationId',
  requireDonor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donation = await foodRequestsService.getDonation(req.params.donationId)
      if (!donation) return res.status(404).json({ error: 'Donation not found' })
      if (donation.donor_id !== req.user!.userId) {
        return res
          .status(403)
          .json({ error: 'You can only view requests for your own donations' })
      }
      const { rows } = await foodRequestsService.list({
        donationId: req.params.donationId,
      })
      res.json({ data: rows })
    } catch (e) {
      next(e)
    }
  }
)

router.post(
  '/',
  requireRecipient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = foodRequestCreateSchema.safeParse(req.body)
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: parsed.error.flatten() })
      }
      const row = await foodRequestsService.create(
        req.user!.userId,
        parsed.data as unknown as Record<string, unknown>
      )
      return res.status(201).json({ data: row })
    } catch (e) {
      next(e)
    }
  }
)

router.patch(
  '/:id/status',
  requireDonor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = foodRequestDecisionSchema.safeParse(req.body)
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: parsed.error.flatten() })
      }
      await foodRequestsService.decide(req.params.id, req.user!.userId, parsed.data.action)
      return res.json({ ok: true })
    } catch (e) {
      next(e)
    }
  }
)

router.post(
  '/:id/cancel',
  requireRecipient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await foodRequestsService.cancel(req.params.id, req.user!.userId)
      return res.json({ ok: true })
    } catch (e) {
      next(e)
    }
  }
)

export { router as foodRequestsRoutes }
