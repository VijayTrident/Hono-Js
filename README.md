# Hono.js Bookstore API

A production-ready REST API built with **Hono.js** and **MongoDB** for managing a bookstore.

## Features

- **Error Handling** - Custom error classes with consistent formatting
- **Input Validation** - Built-in field validators for all types
- **Environment Configuration** - Type-safe environment variable management
- **Logging System** - Colored console logging with severity levels
- **Standardized Responses** - Consistent success and error response formats
- **Global Error Middleware** - Catches all unhandled errors
- **Type-Safe** - Built with TypeScript for type safety
- **Async Handlers** - Try-catch wrapper for all route handlers
- **Health Check** - Built-in health check endpoint

## Project Structure

```
src/
├── config/
│   ├── db.ts              # Database configuration
│   └── env.ts             # Environment variables
├── controllers/
│   └── bookController.ts  # Business logic
├── middleware/
│   └── errorHandler.ts    # Global error handling
├── models/
│   └── book.ts            # Data models
├── routes/
│   └── books.ts           # API routes
├── types/
│   └── book.ts            # TypeScript types
├── utils/
│   ├── asyncHandler.ts    # Async route wrapper
│   ├── errors.ts          # Custom error classes
│   ├── logger.ts          # Logging utility
│   ├── response.ts        # Response formatters
│   └── validator.ts       # Validation utilities
└── index.ts               # Application entry point
```

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### Configure Environment

Edit `.env` file:

```env
PORT=3000
HOST=localhost
MONGO_URI=mongodb://localhost:27017/bookstore
NODE_ENV=development
API_BASE_PATH=/api
LOG_LEVEL=debug
```

### Running the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server runs on: `http://localhost:3000/api`

### Health Check

```bash
curl http://localhost:3000/api/health
# Response: { "status": "ok", "timestamp": "2026-08-11T12:00:00Z" }
```

## API Endpoints

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get book by ID |
| POST | `/api/books` | Create new book |
| PUT | `/api/books/:id` | Replace book |
| PATCH | `/api/books/:id` | Partial update |
| DELETE | `/api/books/:id` | Delete book |

### Examples

**Get All Books:**
```bash
curl http://localhost:3000/api/books
```

**Get Book by ID:**
```bash
curl http://localhost:3000/api/books/507f1f77bcf86cd799439011
```
## Error Handling

All errors are handled consistently and return appropriate HTTP status codes:

| Status | Error Class | Scenario |
|--------|-------------|----------|
| 400 | `ValidationError` | Invalid input data |
| 401 | `UnauthorizedError` | Authentication required |
| 403 | `ForbiddenError` | Permission denied |
| 404 | `NotFoundError` | Resource not found |
| 409 | `ConflictError` | Resource conflict |
| 500 | `InternalServerError` | Server error |

Example error handling in controller:

```typescript
import { asyncHandler } from '../utils/asyncHandler.js'
import { NotFoundError } from '../utils/errors.js'
import { sendSuccess } from '../utils/response.js'

export const getBookById = async (c: Context) => {
  const { id } = c.req.param()
  
  // Validate input
  validateRequired(id, 'Book ID')
  
  // Fetch from database
  const book = await BookModel.findById(id)
  
  // Throw error if not found
  if (!book) {
    throw new NotFoundError('Book', id)
  }
  
  // Return success response
  return sendSuccess(c, book, 'Book retrieved successfully')
}

// Register route with async handler
bookRoutes.get('/:id', asyncHandler(getBookById))
```