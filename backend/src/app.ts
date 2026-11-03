import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'
import { authRoutes } from './routes/auth'
import { donationsRoutes } from './routes/donations'
import { foodRequestsRoutes } from './routes/foodRequests'
import { emergencyRoutes } from './routes/emergency'
import { pickupRoutes } from './routes/pickups'
import { uploadsRoutes } from './routes/uploads'
import { notificationRoutes } from './routes/notifications'
import { dashboardRoutes } from './routes/dashboard'
import { getDbHealth } from './db/init'

const app = express()

// CORS origins: deployed frontend (FRONTEND_URL) plus optional extra origin (CORS_ORIGIN)
const corsOrigins = [process.env.FRONTEND_URL, process.env.CORS_ORIGIN, 'https://foodbridge-frontend-wu2b.vercel.app']
  .filter((origin): origin is string => Boolean(origin))
  .filter((origin, i, arr) => arr.indexOf(origin) === i)
if (corsOrigins.length === 0) {
  corsOrigins.push('http://localhost:5173')
}

// Middleware
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (corsOrigins.some((o) => origin.includes(o.replace(/^https?:\/\//, '')))) {
      return callback(null, true)
    }
    return callback(null, true) // relay-style; tighten when domain list is final
  },
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/health', (req, res) => {
  const db = getDbHealth()
  res.status(200).json({
    status: 'success',
    message: 'FoodBridge backend is running',
    database: {
      ok: db.ok,
      checkedAt: db.checkedAt,
      tables: db.tables.map(({ table, ok, error, rows }) => ({
        table,
        ok,
        ...(rows !== undefined ? { rows } : {}),
        ...(error ? { error } : {}),
      })),
    },
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/donations', authMiddleware, donationsRoutes)
app.use('/api/food-requests', authMiddleware, foodRequestsRoutes)
app.use('/api/emergency-alerts', authMiddleware, emergencyRoutes)
app.use('/api/pickups', authMiddleware, pickupRoutes)
app.use('/api/uploads', authMiddleware, uploadsRoutes)
app.use('/api/notifications', authMiddleware, notificationRoutes)
app.use('/api/dashboard', authMiddleware, dashboardRoutes)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.path}` })
})

export default app
