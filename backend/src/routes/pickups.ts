import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware, requireDonor, requireRecipient } from '../middleware/auth'
import { pickupsService } from '../services/allocationsService'
import { pickupScheduleSchema, pickupStatusSchema } from '../validation/schemas'

const router = Router()
router.use(authMiddleware)

router.get(
  '/my',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rows = await pickupsService.listMine(req.user!.userId)
      res.json({ data: rows })
    } catch (e) {
      next(e)
    }
  }
)

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const row = await pickupsService.byId(req.params.id)
    if (!row) return res.status(404).json({ error: 'Pickup not found' })
    await pickupsService.assertParticipant(row, req.user!.userId)
    return res.json({ data: row })
  } catch (e) {
    next(e)
  }
})

router.post(
  '/',
  requireRecipient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = pickupScheduleSchema.safeParse(req.body)
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: parsed.error.flatten() })
      }
      const row = await pickupsService.schedule(
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
      const parsed = pickupStatusSchema.safeParse(req.body)
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: parsed.error.flatten() })
      }
      const row = await pickupsService.updateStatus(
        req.user!.userId,
        req.params.id,
        parsed.data.status
      )
      return res.json({ data: row })
    } catch (e) {
      next(e)
    }
  }
)

export { router as pickupRoutes }
