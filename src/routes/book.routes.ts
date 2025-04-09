import express from 'express';
import { Book } from '../models/book.model';
import { auth } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Create a new book
router.post('/', async (req, res, next) => {
  try {
    const book = new Book(req.body);
    await book.save();
    
    res.status(201).json({
      status: 'success',
      data: { book }
    });
  } catch (error) {
    next(error);
  }
});

// Get all books with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      author,
      category,
      rating,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};

    // Apply filters
    if (author) query.author = new RegExp(author as string, 'i');
    if (category) query.category = new RegExp(category as string, 'i');
    if (rating) query.rating = { $gte: Number(rating) };
    if (search) {
      query.$or = [
        { title: new RegExp(search as string, 'i') },
        { author: new RegExp(search as string, 'i') }
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with sorting and pagination
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Book.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        books,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get book by ID
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    res.json({
      status: 'success',
      data: { book }
    });
  } catch (error) {
    next(error);
  }
});

// Update book by ID
router.patch('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      throw new AppError('Book not found', 404);
    }

    res.json({
      status: 'success',
      data: { book }
    });
  } catch (error) {
    next(error);
  }
});

// Delete book by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      throw new AppError('Book not found', 404);
    }

    res.json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

export const bookRoutes = router; 