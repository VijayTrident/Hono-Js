import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { connectDB } from './config/db.js'
import bookRoutes from './routes/books.js'

const app = new Hono().basePath('/api');

app.route('/books', bookRoutes)

await connectDB();

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Bookstore API running on http://localhost:${info.port}`);
});