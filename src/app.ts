import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { authRoutes } from './routes/auth.routes';
import { bookRoutes } from './routes/book.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const MAX_RETRIES = 5;  // Maximum number of retry attempts
let retryCount = 0;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection with retry logic
const connectWithRetry = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Try to connect to MongoDB Atlas first
    const mongoUri = process.env.MONGODB_URI || '';
    
    if (mongoUri.includes('mongodb+srv')) {
      console.log('Trying MongoDB Atlas connection...');
      console.log('Connection string:', mongoUri.replace(/:[^:@]*@/, ':****@')); // Hide password in logs
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      console.log('Connected to MongoDB Atlas successfully!');
    } 
    // Fallback to local MongoDB
    else if (mongoUri === '') {
      console.log('MONGODB_URI is missing. Trying local MongoDB connection...');
      const localUri = 'mongodb://localhost:27017/bookstore'; // Use your local connection string here
      console.log('Connection string:', localUri);
      
      await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      console.log('Connected to local MongoDB successfully!');
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.codeName) console.error('Error code name:', error.codeName);
    
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying connection... (${retryCount}/${MAX_RETRIES})`);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Max retry attempts reached. Exiting...');
      process.exit(1);  // Exit the application after max retries
    }
  }
};

// Initial connection attempt
connectWithRetry();

export default app;
