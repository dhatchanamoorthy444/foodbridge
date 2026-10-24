import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'
import { authRoutes } from './routes/auth'
import { inventoryRoutes } from './routes/inventory'
import { matchingRoutes } from './routes/matching'
import { pickupRoutes } from './routes/pickups'
import { analyticsRoutes } from './routes/analytics'
import { notificationRoutes } from './routes/notifications'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/inventory', authMiddleware, inventoryRoutes)
app.use('/api/matching', authMiddleware, matchingRoutes)
app.use('/api/pickups', authMiddleware, pickupRoutes)
app.use('/api/analytics', authMiddleware, analyticsRoutes)
app.use('/api/notifications', authMiddleware, notificationRoutes)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

export default app