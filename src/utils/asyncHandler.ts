import type { Context, Handler } from 'hono'
import { AppError, InternalServerError, isAppError } from './errors.js'
import { logger } from './logger.js'

export type AsyncHandler = (c: Context) => Promise<Response>

export const asyncHandler = (handler: AsyncHandler): Handler => {
  return async (c: Context) => {
    try {
      return await handler(c)
    } catch (error) {
      logger.error('Unhandled error in route handler:', error)

      if (isAppError(error)) {
        return c.json(
          {
            success: false,
            error: {
              message: error.message,
              statusCode: error.statusCode,
              ...(error.details && { details: error.details }),
            },
          },
          error.statusCode
        )
      }

      if (error instanceof Error) {
        const internalError = new InternalServerError(
          'An unexpected error occurred',
          { originalError: error.message }
        )
        return c.json(
          {
            success: false,
            error: {
              message: internalError.message,
              statusCode: internalError.statusCode,
            },
          },
          500
        )
      }

      return c.json(
        {
          success: false,
          error: {
            message: 'An unexpected error occurred',
            statusCode: 500,
          },
        },
        500
      )
    }
  }
}
