const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { admin, db } = require('./config/firebaseConfig'); // Import Firebase config
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const userRoutes = require('./pages/user');
<<<<<<< HEAD
app.use('/api/user', userRoutes);

const personalDetailsRoutes = require('./routes/personalDetails'); // Import new route
app.use('/api/personalDetails', personalDetailsRoutes); // Use personal details route
=======
const periodRoutes = require('./pages/periodtrack');
app.use('/api/user', userRoutes);
app.use("/api/period", periodRoutes);

>>>>>>> 3fb4a77a1ce0c373e7b74e428103a548387b2af5

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
