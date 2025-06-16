require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');  // A logging library
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const routes = require('./routes');

// Middleware for parsing JSON requests
app.use(express.json());


// Middleware for handling CORS
const allowedOrigins = [
  'https://advikaadmin.vercel.app',
  'https://advikafront.vercel.app'
];

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Use morgan for logging HTTP requests (this is very useful in production)
app.use(morgan('combined'));

// Serve static files (e.g., CSS, JS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Define API routes
app.use('/api', routes);

// Global error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
