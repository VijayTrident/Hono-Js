import { Schema, model } from 'mongoose'

const bookSchema = new Schema(
  {
    title:  { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price:  { type: Number, required: true, min: 0 },
    genre:  { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

export const BookModel = model('Book', bookSchema)
