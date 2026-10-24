import 'dotenv/config'
import app from './app'
import { initializeDatabase } from './db/init'

const PORT = process.env.PORT || 3001

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase()
    console.log('✅ Database initialized successfully')

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 FoodBridge API Server running on port ${PORT}")
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health")
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully')
  process.exit(0)
})

startServer()