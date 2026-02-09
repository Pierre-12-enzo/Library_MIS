const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log('\n=== NEW REQUEST ===');
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use(express.json());

// Simple test route
app.get('/api/test', (req, res) => {
  console.log('Test route called');
  res.json({ message: 'Backend is working!' });
});

// Test registration route (without database)
app.post('/api/test-register', (req, res) => {
  console.log('Test registration called with:', req.body);
  res.json({ 
    success: true, 
    message: 'Test registration successful',
    data: req.body 
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/books.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n=== ERROR ===');
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n=== Server started ===`);
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});