import 'dotenv/config'
import app from './app'
import { initializeDatabase } from './db/init'

const PORT = parseInt(process.env.PORT || '3001', 10) || 3001

async function start() {
  try {
    // Initialize database
    await initializeDatabase()
    console.log('✅ Database initialized successfully')

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 FoodBridge API Server running on port ${PORT}`)
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

start()