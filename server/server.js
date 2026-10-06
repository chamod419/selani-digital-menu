import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import menuItemRoutes from './routes/menuItemRoutes.js'
import imageRoutes from './routes/imageRoutes.js'

dotenv.config()

const app = express()

const PORT =
  process.env.PORT || 5000

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
)

app.use(
  express.json({
    limit: '10mb',
  })
)

app.use(
  express.urlencoded({
    extended: true,
  })
)

// ========================================
// API Routes
// ========================================

app.use(
  '/api/auth',
  authRoutes
)

app.use(
  '/api/categories',
  categoryRoutes
)

app.use(
  '/api/menu-items',
  menuItemRoutes
)

app.use(
  '/api/images',
  imageRoutes
)

// ========================================
// Health Check
// ========================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message:
      'Selani Digital Menu API is running',
  })
})

app.get(
  '/api/health',
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API healthy',
    })
  }
)

// ========================================
// Upload / General Error Handler
// ========================================

app.use(
  (err, req, res, next) => {
    console.error(err)

    if (
      err.code ===
      'LIMIT_FILE_SIZE'
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'Food photo must be less than 10MB',
        })
    }

    if (err) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            err.message ||
            'Request failed',
        })
    }

    next()
  }
)

// ========================================
// 404
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      'API route not found',
  })
})

// ========================================
// Start Server
// ========================================

const startServer =
  async () => {
    try {
      await connectDB()

      app.listen(
        PORT,
        '0.0.0.0',
        () => {
          console.log(
            `Selani API running on port ${PORT}`
          )
        }
      )
    } catch (error) {
      console.error(
        'Server startup error:',
        error.message
      )

      process.exit(1)
    }
  }

startServer()