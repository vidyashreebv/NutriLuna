const express = require('express');
const bodyParser = require('body-parser');
const { admin, db } = require('./config/firebaseConfig'); // Import Firebase config
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST'], // Specify allowed methods
    allowedHeaders: ['Authorization', 'Content-Type'], // Specify allowed headers
}));
app.use(bodyParser.json());

// Routes
const userRoutes = require('./pages/user');
app.use('/api/user', userRoutes);

const personalDetailsRoutes = require('./pages/personalDetails'); // Import personal details route
app.use('/api/personalDetails', personalDetailsRoutes); // Use personal details route

const periodTrackRoutes = require('./pages/periodtrack'); // Import period tracking route
app.use('/api/period', periodTrackRoutes); // Use period tracking route

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