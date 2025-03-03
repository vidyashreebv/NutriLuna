const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { admin, db } = require('./config/firebaseConfig'); // Import Firebase config
const app = express();
const PORT = process.env.PORT || 5001;

// Enhanced error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const userRoutes = require('./pages/user');
const consultationRoutes = require('./pages/consultation');
const dashboardRoutes = require('./pages/dashboardRoutes');
const dietTrackerRoutes = require('./pages/diettracker');

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Use routes
app.use('/api/user', userRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/diettracker', dietTrackerRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server with error handling
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});