import type { Context, HonoRequest, MiddlewareHandler } from 'hono'
import type { AppError } from '../utils/errors.js'
import { isAppError, InternalServerError } from '../utils/errors.js'
import { logger } from '../utils/logger.js'

interface ErrorResponse {
  success: false
  error: {
    message: string
    statusCode: number
    details?: Record<string, unknown>
  }
  timestamp: string
  path?: string
  method?: string
}

export const errorHandler: MiddlewareHandler = async (c: Context, next) => {
  try {
    await next()

    // Handle 404s
    if (c.res.status === 404) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          message: 'Route not found',
          statusCode: 404,
        },
        timestamp: new Date().toISOString(),
        path: c.req.path,
        method: c.req.method,
      }

      logger.warn('Route not found', {
        path: c.req.path,
        method: c.req.method,
      })

      return c.json(errorResponse, 404)
    }
  } catch (error) {
    logger.error('Caught error in error handler middleware:', error)

    let statusCode = 500
    let message = 'Internal server error'
    let details: Record<string, unknown> | undefined

    if (isAppError(error)) {
      statusCode = error.statusCode
      message = error.message
      details = error.details

      if (statusCode >= 500) {
        logger.error(`Server error (${statusCode}):`, {
          message,
          details,
        })
      } else {
        logger.warn(`Client error (${statusCode}):`, {
          message,
          details,
        })
      }
    } else if (error instanceof Error) {
      message = error.message
      logger.error('Unhandled Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    } else {
      logger.error('Unknown error type:', error)
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message,
        statusCode,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
      path: c.req.path,
      method: c.req.method,
    }

    return c.json(errorResponse, statusCode)
  }
}
