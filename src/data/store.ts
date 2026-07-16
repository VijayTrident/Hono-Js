import type { Book } from '../types/book.js'

export let books: Book[] = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, genre: 'Fiction' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 10.99, genre: 'Fiction' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', price: 35.00, genre: 'Technology' },
]

export let nextId = 4
