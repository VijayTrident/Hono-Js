import { Hono } from 'hono'
import {
  getAllBooks,
  getBookById,
  createBook,
  replaceBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js'

const bookRoutes = new Hono()

bookRoutes.get('/', getAllBooks)
bookRoutes.get('/:id', getBookById)
bookRoutes.post('/', createBook)
bookRoutes.put('/:id', replaceBook)
bookRoutes.patch('/:id', updateBook)
bookRoutes.delete('/:id', deleteBook)

export default bookRoutes
