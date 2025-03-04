const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { admin, db } = require('./config/firebaseConfig'); // Import Firebase config
const app = express();
const PORT = process.env.PORT || 5001;

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(bodyParser.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
const userRoutes = require('./pages/user');
app.use('/api/user', userRoutes);

const personalDetailsRoutes = require('./pages/personalDetails');
app.use('/api/personalDetails', personalDetailsRoutes);

const dietTrackerRoutes = require("./pages/diettracker");
app.use("/api/diettracker", dietTrackerRoutes);

const periodRoutes = require('./pages/periodtrack');  
app.use("/api/period", periodRoutes);

// Add the dashboard routes
const dashboardRoutes = require('./pages/dashboardRoutes');
const dietTrackerRoutes = require('./pages/diettracker');

// Use routes
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/diettracker', dietTrackerRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to Nutri-Luna Backend API!');
});

// 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ error: 'Route Not Found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});