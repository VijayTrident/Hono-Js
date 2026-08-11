import { ValidationError } from '../utils/errors.js'

export interface ValidationRule {
  field: string
  value: unknown
  rules: Array<{
    condition: boolean
    message: string
  }>
}

export const validateField = (field: string, value: unknown, rules: Array<{ condition: boolean; message: string }>) => {
  const errors: string[] = []
  for (const rule of rules) {
    if (!rule.condition) {
      errors.push(rule.message)
    }
  }
  return errors
}

export const validate = (data: Record<string, unknown>, schema: Record<string, Array<{ condition: boolean; message: string }>>) => {
  const errors: Record<string, string[]> = {}

  for (const [field, rules] of Object.entries(schema)) {
    const fieldErrors = validateField(field, data[field], rules)
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', { errors })
  }
}

export const validateRequired = (value: unknown, fieldName: string) => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(`${fieldName} is required`)
  }
}

export const validateType = (value: unknown, type: string, fieldName: string) => {
  if (typeof value !== type) {
    throw new ValidationError(`${fieldName} must be a ${type}`)
  }
}

export const validateEmail = (email: string, fieldName = 'Email') => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError(`${fieldName} is invalid`)
  }
}

export const validateMinLength = (value: string, minLength: number, fieldName: string) => {
  if (value.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters`)
  }
}

export const validateMaxLength = (value: string, maxLength: number, fieldName: string) => {
  if (value.length > maxLength) {
    throw new ValidationError(`${fieldName} must not exceed ${maxLength} characters`)
  }
}

export const validateNumber = (value: unknown, fieldName: string) => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`)
  }
}

export const validateMin = (value: number, min: number, fieldName: string) => {
  if (value < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`)
  }
}

export const validateMax = (value: number, max: number, fieldName: string) => {
  if (value > max) {
    throw new ValidationError(`${fieldName} must not exceed ${max}`)
  }
}
