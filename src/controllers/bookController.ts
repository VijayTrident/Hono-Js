import type { Context } from 'hono'
import { BookModel } from '../models/book.js'
import type { CreateBookDto, UpdateBookDto } from '../types/book.js'

export const getAllBooks = async (c: Context) => {
  const books = await BookModel.find()
  return c.json(books)
}

export const getBookById = async (c: Context) => {
  const { id } = c.req.param()
  const book = await BookModel.findById(id)
  if (!book) {
    return c.json({ message: 'Book not found' }, 404)
  }
  return c.json(book)
}

export const createBook = async (c: Context) => {
  const body = await c.req.json<CreateBookDto>()
  const { title, author, price, genre } = body

  if (!title || !author || price == null || !genre) {
    return c.json({ message: 'title, author, price, and genre are required' }, 400)
  }

  const book = await BookModel.create({ title, author, price, genre })
  return c.json(book, 201)
}

export const replaceBook = async (c: Context) => {
  const { id } = c.req.param()
  const body = await c.req.json<CreateBookDto>()
  const { title, author, price, genre } = body

  if (!title || !author || price == null || !genre) {
    return c.json({ message: 'title, author, price, and genre are required' }, 400)
  }

  const book = await BookModel.findByIdAndUpdate(
    id,
    { title, author, price, genre },
    { new: true, overwrite: true, runValidators: true }
  )
  if (!book) {
    return c.json({ message: 'Book not found' }, 404)
  }
  return c.json(book)
}

export const updateBook = async (c: Context) => {
  const { id } = c.req.param()
  const body = await c.req.json<UpdateBookDto>()

  const book = await BookModel.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true }
  )
  if (!book) {
    return c.json({ message: 'Book not found' }, 404)
  }
  return c.json(book)
}

export const deleteBook = async (c: Context) => {
  const { id } = c.req.param()
  const book = await BookModel.findByIdAndDelete(id)
  if (!book) {
    return c.json({ message: 'Book not found' }, 404)
  }
  return c.json({ message: 'Book deleted', book })
}
