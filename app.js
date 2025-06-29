require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');  // A logging library
const path = require('path');
const helmet = require('helmet');


const app = express();
const PORT = process.env.PORT || 5000;

//import error handler
const errorHandler = require('./middlewares/errorHandler/errorHandler');


// Import routes
const routes = require('./routes');

// Middleware for parsing JSON requests
app.use(express.json());


// Middleware for handling CORS
app.use(cors({
    origin: true
}))

app.use(
  helmet({
    contentSecurityPolicy: false, // If you're loading scripts from CDNs or external sources
    crossOriginEmbedderPolicy: false, // Useful when dealing with cross-origin resources
  })
);




// Use morgan for logging HTTP requests (this is very useful in production)
app.use(morgan('combined'));

// Serve static files (e.g., CSS, JS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Define API routes
app.use('/api', routes);


// Global error handling middleware (optional but recommended)
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
