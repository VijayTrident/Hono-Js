# Hono.js Bookstore API

A production-ready REST API built with **Hono.js** and **MongoDB** for managing a bookstore. Features comprehensive error handling, input validation, environment-based configuration, and structured logging.

## ✨ Features

- **Error Handling** - Custom error classes with consistent formatting
- **Input Validation** - Built-in field validators for all types
- **Environment Configuration** - Type-safe environment variable management
- **Logging System** - Colored console logging with severity levels
- **Standardized Responses** - Consistent success and error response formats
- **Global Error Middleware** - Catches all unhandled errors
- **Type-Safe** - Built with TypeScript for type safety
- **Async Handlers** - Try-catch wrapper for all route handlers
- **Health Check** - Built-in health check endpoint

## 📁 Project Structure

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

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or remote)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd "Hono Js"

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

## 📚 API Endpoints

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

**Create Book:**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "price": 12.99,
    "genre": "Fantasy"
  }'
```

**Update Book (Partial):**
```bash
curl -X PATCH http://localhost:3000/api/books/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{ "price": 14.99 }'
```

**Delete Book:**
```bash
curl -X DELETE http://localhost:3000/api/books/507f1f77bcf86cd799439011
```

## 🔍 Response Format

### Success Response (200, 201)

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "price": 12.99,
    "genre": "Fantasy"
  },
  "message": "Book retrieved successfully",
  "statusCode": 200,
  "timestamp": "2026-08-11T12:00:00Z"
}
```

### Error Response (400, 404, 500)

```json
{
  "success": false,
  "error": {
    "message": "Book not found",
    "statusCode": 404,
    "details": { "id": "507f1f77bcf86cd799439011" }
  },
  "timestamp": "2026-08-11T12:00:00Z",
  "path": "/api/books/507f1f77bcf86cd799439011",
  "method": "GET"
}
```

## 🛡️ Error Handling

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

## ✅ Input Validation

The project includes built-in validators for common scenarios:

```typescript
import { 
  validateRequired, 
  validateEmail, 
  validateNumber, 
  validateMin 
} from '../utils/validator.js'

// Required field
validateRequired(title, 'Title')

// Email format
validateEmail(email, 'Email')

// Numeric value
validateNumber(price, 'Price')

// Minimum value
validateMin(price, 0, 'Price')

// Length constraints
validateMinLength(description, 10, 'Description')
validateMaxLength(description, 500, 'Description')
```

## 📝 Logging

The logger provides colored output with different severity levels:

```typescript
import { logger } from '../utils/logger.js'

logger.info('User created', { userId: '123' })
logger.warn('Cache miss', { key: 'books' })
logger.error('Database error', error)
logger.debug('Debug info') // Only in development
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `HOST` | localhost | Server hostname |
| `MONGO_URI` | mongodb://localhost:27017/bookstore | MongoDB connection URL |
| `NODE_ENV` | development | Environment (development, production, test) |
| `API_BASE_PATH` | /api | API base path |
| `LOG_LEVEL` | debug | Logging level (debug, info, warn, error) |

## 📖 Documentation

For detailed information, see:

- **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** - Comprehensive error handling guide
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick lookup and common patterns
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical architecture and design
- **[CHANGELOG.md](./CHANGELOG.md)** - Complete list of changes

## 🧪 Testing

### Test Health Check
```bash
curl http://localhost:3000/api/health
```

### Test Error Handling (400)
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{ "title": "Book" }'
# Missing required fields
```

### Test Not Found (404)
```bash
curl http://localhost:3000/api/books/invalid-id
```

### Test Success (200)
```bash
curl http://localhost:3000/api/books
```

## 🛠️ Development

### File Structure
- Controllers contain business logic
- Routes define endpoints
- Middleware handles cross-cutting concerns
- Utils provide shared functionality

### Adding New Endpoints

1. Create controller method:
```typescript
export const newEndpoint = async (c: Context) => {
  // Validation
  validateRequired(input, 'Field')
  
  // Business logic
  const result = await Model.findOne()
  
  // Error handling
  if (!result) {
    throw new NotFoundError('Resource')
  }
  
  // Success response
  return sendSuccess(c, result)
}
```

2. Add route:
```typescript
routes.get('/endpoint', asyncHandler(newEndpoint))
```

## 📊 Project Stats

- **Files:** 14 TypeScript files
- **Error Classes:** 7
- **Validators:** 8
- **Logger Levels:** 4
- **Middleware:** 1 global error handler
- **Documentation:** 4 guides

## 🔐 Security Features

- Input validation on all endpoints
- Type-safe configuration
- Secure error messages (no stack traces in production)
- Request context logging
- Error tracking and reporting

## 🚀 Production Deployment

Before deploying to production:

1. Set `NODE_ENV=production`
2. Update `LOG_LEVEL` to `info`
3. Configure `MONGO_URI` for production database
4. Ensure all required environment variables are set
5. Run tests and verify all endpoints
6. Review security settings

## 📞 Support

For issues or questions:

1. Check documentation files in project root
2. Review error messages and stack traces
3. Check `QUICK_REFERENCE.md` for common patterns
4. See `ERROR_HANDLING.md` for detailed information

## 📝 License

This project is part of the Vijay Projects collection.
