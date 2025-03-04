const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { admin, db } = require('./config/firebaseConfig'); // Import Firebase config
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const userRoutes = require('./pages/user');
const dashboardRoutes = require('./pages/dashboardRoutes');
const dietTrackerRoutes = require('./pages/diettracker');
const periodRoutes = require('./pages/periodtrack');
const recipeSuggestionRoutes = require('./pages/recipesuggestion');

// Use routes
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/diettracker', dietTrackerRoutes);
app.use('/api/period', periodRoutes);
app.use('/api/recipesuggestion', recipeSuggestionRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});