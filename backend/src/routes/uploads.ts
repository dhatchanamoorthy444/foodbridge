import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware, requireDonor } from '../middleware/auth'
import { uploadFoodImage } from '../services/storageService'

const router = Router()
router.use(authMiddleware)

router.post(
  '/food-image',
  requireDonor,
  (req: Request, res: Response, next: NextFunction) => {
    uploadFoodImage(req, res, next)
  }
)

export { router as uploadsRoutes }
