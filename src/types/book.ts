export type Book = {
  id: number
  title: string
  author: string
  price: number
  genre: string
}

export type CreateBookDto = Omit<Book, 'id'>
export type UpdateBookDto = Partial<CreateBookDto>
