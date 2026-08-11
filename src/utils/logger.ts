import { NODE_ENV } from '../config/env.js'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
}

const logWithColor = (level: LogLevel, message: string, data?: unknown) => {
  const timestamp = new Date().toISOString()
  const colorMap: Record<LogLevel, string> = {
    info: colors.blue,
    warn: colors.yellow,
    error: colors.red,
    debug: colors.gray,
  }

  const color = colorMap[level]
  const prefix = `${color}[${timestamp}] ${level.toUpperCase()}${colors.reset}`

  if (data) {
    console.log(`${prefix} ${message}`, data)
  } else {
    console.log(`${prefix} ${message}`)
  }
}

export const logger = {
  info: (message: string, data?: unknown) => logWithColor('info', message, data),
  warn: (message: string, data?: unknown) => logWithColor('warn', message, data),
  error: (message: string, data?: unknown) => logWithColor('error', message, data),
  debug: (message: string, data?: unknown) => {
    if (NODE_ENV === 'development') {
      logWithColor('debug', message, data)
    }
  },
}
