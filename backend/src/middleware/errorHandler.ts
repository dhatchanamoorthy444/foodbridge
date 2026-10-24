import { Request, Response, NextFunction } from 'express'
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
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' })
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` })
  }

  // Custom errors
  if (err.message && (err.message.includes('already exists') || err.message.includes('not found'))) {
    const status = err.message.includes('not found') ? 404 : 409
    return res.status(status).json({ error: err.message })
  }

  // Default error
  const status = err.status || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}