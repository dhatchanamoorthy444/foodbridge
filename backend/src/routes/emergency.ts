import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware, requireDonor, requireRecipient, requireStaff } from '../middleware/auth'
import { emergencyService } from '../services/emergencyService'
import { supabaseAdmin } from '../db/supabase'
import {
  emergencyAlertCreateSchema,
  emergencyResponseCreateSchema,
  emergencyResponseDecisionSchema,
} from '../validation/schemas'

const router = Router()
router.use(authMiddleware)

// ---- Alerts --------------------------------------------------------------
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role === 'recipient') {
        const mine = req.query.mine === '1'
        const rows = await emergencyService.listAlerts({
          status: typeof req.query.status === 'string' ? req.query.status : undefined,
          recipientId: mine ? req.user!.userId : undefined,
          city: typeof req.query.city === 'string' ? req.query.city : undefined,
        })
        return res.json({ data: rows })
      }
      // donors (and admins): only active alerts are published
      const rows = await emergencyService.activeForDonors()
      return res.json({ data: rows })
    } catch (e) {
      next(e)
    }
  }
)

router.get('/my', requireRecipient, async (req, res, next) => {
  try {
    const rows = await emergencyService.listAlerts({ recipientId: req.user!.userId })
    res.json({ data: rows })
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const alert = await emergencyService.byId(req.params.id)
    if (!alert) return res.status(404).json({ error: 'Alert not found' })
    const includeContacts = alert.recipient_id === req.user!.userId
    const myResponse =
      req.user!.role === 'donor'
        ? (
            await supabaseAdmin
              .from('emergency_alert_responses')
              .select('*')
              .eq('alert_id', req.params.id)
              .eq('donor_id', req.user!.userId)
              .order('created_at', { ascending: false })
          ).data
        : null
    const contact = includeContacts
      ? await emergencyService.contacts(req.params.id, req.user!.userId)
      : null
    return res.json({ data: alert, contact, myResponse })
  } catch (e) {
    next(e)
  }
})

router.post(
  '/',
  requireRecipient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = emergencyAlertCreateSchema.safeParse(req.body)
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: parsed.error.flatten() })
      }
      const row = await emergencyService.create(
        req.user!.userId,
        req.user!.profile.organization ?? req.user!.profile.full_name ?? 'Recipient',
        parsed.data as unknown as Record<string, unknown>
      )
      return res.status(201).json({ data: row })
    } catch (e) {
      next(e)
    }
  }
)

router.patch(
  '/:id',
  requireRecipient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const row = await emergencyService.update(
        req.user!.userId,
        req.params.id,
        req.body as Record<string, unknown>
      )
      return res.json({ data: row })
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
      await emergencyService.cancel(req.user!.userId, req.params.id)
      return res.json({ ok: true })
    } catch (e) {
      next(e)
    }
  }
)

// ---- Responses -----------------------------------------------------------
router.post(
  '/:id/responses',
  requireDonor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = emergencyResponseCreateSchema.safeParse(req.body)
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: parsed.error.flatten() })
      }
      const row = await emergencyService.respond(
        req.user!.userId,
        req.params.id,
        parsed.data as unknown as Record<string, unknown>
      )
      return res.status(201).json({ data: row })
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  '/:id/responses',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rows = await emergencyService.responsesForAlert(
        req.params.id,
        req.user!.userId
      )
      return res.json({ data: rows })
    } catch (e) {
      next(e)
    }
  }
)

router.get('/responses/mine', requireDonor, async (req, res, next) => {
  try {
    const rows = await emergencyService.myResponses(req.user!.userId)
    res.json({ data: rows })
  } catch (e) {
    next(e)
  }
})

router.patch(
  '/responses/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = emergencyResponseDecisionSchema.safeParse(req.body)
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: parsed.error.flatten() })
      }
      if (req.user!.role === 'recipient') {
        if (parsed.data.action === 'accept') {
          const allocation = await emergencyService.acceptResponse(
            req.user!.userId,
            req.params.id
          )
          return res.status(201).json({ data: allocation })
        }
        await emergencyService.declineResponse(req.user!.userId, req.params.id)
        return res.json({ ok: true })
      }
      // donor withdraw (validated at runtime — schema allows accept|decline only
      // but the route keeps withdraw for API-compat with the donate flow)
      const withdrawRequested =
        typeof req.body?.action === 'string' && req.body.action === 'withdraw'
      if (req.user!.role === 'donor') {
        if (withdrawRequested) {
          await emergencyService.withdrawResponse(req.user!.userId, req.params.id)
          return res.json({ ok: true })
        }
      }
      return res.status(403).json({ error: 'Not allowed' })
    } catch (e) {
      next(e)
    }
  }
)

export { router as emergencyRoutes }
