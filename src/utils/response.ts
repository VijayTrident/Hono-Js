import type { Context } from 'hono'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  statusCode: number
  timestamp: string
}

export const sendSuccess = <T>(c: Context, data: T, message?: string, statusCode = 200) => {
  return c.json(
    {
      success: true,
      data,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
    statusCode
  )
}

export const sendPaginatedSuccess = <T>(
  c: Context,
  data: T[],
  pagination: { page: number; limit: number; total: number },
  statusCode = 200
) => {
  return c.json(
    {
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit),
      },
      statusCode,
      timestamp: new Date().toISOString(),
    },
    statusCode
  )
}
