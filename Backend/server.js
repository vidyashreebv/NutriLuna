const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { admin, db } = require('./config/firebaseConfig'); // Import Firebase config
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const userRoutes = require('./pages/user');
app.use('/api/user', userRoutes);

const personalDetailsRoutes = require('./pages/personalDetails');
app.use('/api/personalDetails', personalDetailsRoutes);

const dietTrackerRoutes = require("./pages/diettracker");
app.use("/api/diettracker", dietTrackerRoutes);

const periodRoutes = require('./pages/periodtrack');
app.use("/api/period", periodRoutes);

// Add the new dashboard stats route
const dashboardStatRoutes = require('./pages/dashboardstat');
app.use("/api/dashboardstat", dashboardStatRoutes);

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