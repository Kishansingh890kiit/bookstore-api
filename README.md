# Bookstore API

A RESTful API for managing a bookstore application built with Express.js, TypeScript, and MongoDB.

## Features

- User Authentication (JWT-based)
- CRUD operations for books
- Filtering and search functionality
- Pagination
- Error handling
- Input validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bookstore-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your-secret-key
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication

#### Signup
- **POST** `/api/auth/signup`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Books

All book endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### Create Book
- **POST** `/api/books`
- **Body**:
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "category": "Fiction",
    "price": 9.99,
    "rating": 4.5,
    "publishedDate": "1925-04-10"
  }
  ```

#### Get All Books
- **GET** `/api/books`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `author` (filter by author)
  - `category` (filter by category)
  - `rating` (filter by minimum rating)
  - `search` (search in title and author)
  - `sortBy` (field to sort by)
  - `sortOrder` (asc/desc)

#### Get Book by ID
- **GET** `/api/books/:id`

#### Update Book
- **PATCH** `/api/books/:id`
- **Body**:
  ```json
  {
    "price": 12.99,
    "rating": 4.8
  }
  ```

#### Delete Book
- **DELETE** `/api/books/:id`

## Sample Screenshots

### API Response Example
![API Response Example](https://ik.imagekit.io/ubweioxhb/WhatsApp%20Image%202025-04-09%20at%2023.37.09_cec289a4.jpg)


![Database Schema](https://ik.imagekit.io/ubweioxhb/WhatsApp%20Image%202025-04-09%20at%2023.36.22_bf7271a2.jpg)

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:
```json
{
  "status": "error",
  "message": "Error message"
}
```

## Development

To run the development server with hot-reload:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Testing

To run tests:
```bash
npm test
```

## License

MIT 