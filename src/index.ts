import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { connectDB } from './config/db.js'
import { SERVER_CONFIG, APP_CONFIG } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logger } from './utils/logger.js'
import bookRoutes from './routes/books.js'

const app = new Hono().basePath(APP_CONFIG.apiBasePath)

// Middleware
app.use(errorHandler)

// Routes
app.route('/books', bookRoutes)

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Initialize
const startServer = async () => {
  try {
    logger.info('Connecting to database...')
    await connectDB()
    logger.info('Database connected successfully')

    serve(
      {
        fetch: app.fetch,
        port: SERVER_CONFIG.port,
        hostname: SERVER_CONFIG.host,
      },
      (info) => {
        logger.info(
          `Bookstore API running on http://${info.hostname}:${info.port}${APP_CONFIG.apiBasePath}`
        )
      }
    )
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()