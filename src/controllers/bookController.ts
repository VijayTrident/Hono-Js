import type { Context } from 'hono'
import { BookModel } from '../models/book.js'
import type { CreateBookDto, UpdateBookDto } from '../types/book.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'
import { sendSuccess } from '../utils/response.js'
import { validateRequired, validateNumber, validateMin } from '../utils/validator.js'

export const getAllBooks = async (c: Context) => {
  try {
    const books = await BookModel.find()
    return sendSuccess(c, books, 'Books retrieved successfully')
  } catch (error) {
    throw new Error(`Failed to fetch books: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const getBookById = async (c: Context) => {
  try {
    const { id } = c.req.param()
    validateRequired(id, 'Book ID')

    const book = await BookModel.findById(id)
    if (!book) {
      throw new NotFoundError('Book', id)
    }

    return sendSuccess(c, book, 'Book retrieved successfully')
  } catch (error) {
    throw error
  }
}

export const createBook = async (c: Context) => {
  try {
    const body = await c.req.json<CreateBookDto>()
    const { title, author, price, genre } = body

    validateRequired(title, 'Title')
    validateRequired(author, 'Author')
    validateRequired(price, 'Price')
    validateRequired(genre, 'Genre')

    if (typeof price !== 'number') {
      validateNumber(price, 'Price')
    }
    validateMin(price as number, 0, 'Price')

    const book = await BookModel.create({ title, author, price, genre })
    return sendSuccess(c, book, 'Book created successfully', 201)
  } catch (error) {
    throw error
  }
}

export const replaceBook = async (c: Context) => {
  try {
    const { id } = c.req.param()
    const body = await c.req.json<CreateBookDto>()
    const { title, author, price, genre } = body

    validateRequired(id, 'Book ID')
    validateRequired(title, 'Title')
    validateRequired(author, 'Author')
    validateRequired(price, 'Price')
    validateRequired(genre, 'Genre')

    if (typeof price !== 'number') {
      validateNumber(price, 'Price')
    }
    validateMin(price as number, 0, 'Price')

    const book = await BookModel.findByIdAndUpdate(id, { title, author, price, genre }, { new: true, overwrite: true, runValidators: true })

    if (!book) {
      throw new NotFoundError('Book', id)
    }

    return sendSuccess(c, book, 'Book updated successfully')
  } catch (error) {
    throw error
  }
}

export const updateBook = async (c: Context) => {
  try {
    const { id } = c.req.param()
    const body = await c.req.json<UpdateBookDto>()

    validateRequired(id, 'Book ID')

    const book = await BookModel.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })

    if (!book) {
      throw new NotFoundError('Book', id)
    }

    return sendSuccess(c, book, 'Book partially updated successfully')
  } catch (error) {
    throw error
  }
}

export const deleteBook = async (c: Context) => {
  try {
    const { id } = c.req.param()
    validateRequired(id, 'Book ID')

    const book = await BookModel.findByIdAndDelete(id)
    if (!book) {
      throw new NotFoundError('Book', id)
    }

    return sendSuccess(c, { book }, 'Book deleted successfully')
  } catch (error) {
    throw error
  }
}
