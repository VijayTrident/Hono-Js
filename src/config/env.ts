// Environment variables configuration
// Load from .env file in development

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key]
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value || defaultValue || ''
}

export const NODE_ENV = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test'

export const SERVER_CONFIG = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
}

export const DATABASE_CONFIG = {
  mongoUri: getEnvVariable('MONGO_URI', 'mongodb://localhost:27017/bookstore'),
}

export const APP_CONFIG = {
  apiBasePath: process.env.API_BASE_PATH || '/api',
  environment: NODE_ENV,
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
}

export const LOGGING_CONFIG = {
  level: process.env.LOG_LEVEL || (APP_CONFIG.isDevelopment ? 'debug' : 'info'),
}
