import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware, requireDonor, requireRecipient, requireStaff } from '../middleware/auth'
import { dashboardService } from '../services/dashboardService'

const router = Router()
router.use(authMiddleware)

router.get(
  '/donor',
  requireDonor,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await dashboardService.donorStats(_req.user!.userId)
      res.json({ data: stats })
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  '/recipient',
  requireRecipient,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await dashboardService.recipientStats(_req.user!.userId)
      res.json({ data: stats })
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  '/staff',
  requireStaff,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ data: { message: 'staff dashboard not implemented yet' } })
    } catch (e) {
      next(e)
    }
  }
)

export { router as dashboardRoutes }
