import { Hono } from 'hono'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getAllBooks,
  getBookById,
  createBook,
  replaceBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js'

const bookRoutes = new Hono()

bookRoutes.get('/', asyncHandler(getAllBooks))
bookRoutes.get('/:id', asyncHandler(getBookById))
bookRoutes.post('/', asyncHandler(createBook))
bookRoutes.put('/:id', asyncHandler(replaceBook))
bookRoutes.patch('/:id', asyncHandler(updateBook))
bookRoutes.delete('/:id', asyncHandler(deleteBook))

export default bookRoutes
