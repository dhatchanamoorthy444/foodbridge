import { Request, Response, NextFunction } from 'express'
import { MulterError } from 'multer'
import { ZodError } from 'zod'

export interface ApiError extends Error {
  status?: number
  errors?: Record<string, any>
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' })
  }

  // Multer errors
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' })
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` })
  }

  // Custom domain errors raised by services/RPCs ("CODE: human text")
  const domainMatch = /^\s*([A-Z_]+):\s*(.+)$/.exec(err.message ?? '')
  if (domainMatch) {
    const statusByCode: Record<string, number> = {
      NOT_FOUND: 404,
      FORBIDDEN: 403,
      DUPLICATE: 409,
      MISMATCH: 409,
      QUANTITY_EXCEEDS: 409,
      QUANTITY_INVALID: 400,
      DONATION_STATE: 409,
      DONATION_EXPIRED: 409,
      REQUEST_STATE: 409,
      RESPONSE_STATE: 409,
      ALERT_STATE: 409,
      OVERFLOW: 409,
      STATE: 409,
    }
    const status = statusByCode[domainMatch[1]] ?? 400
    return res.status(status).json({ error: domainMatch[2] })
  }

  // Default error
  const status = err.status || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}