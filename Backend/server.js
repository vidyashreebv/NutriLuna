const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json'); // Adjust path as necessary

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://nutri-luna-default-rtdb.firebaseio.com',
});

console.log('Firebase Admin Initialized');

// Example: Access Firestore
const db = admin.firestore();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API endpoint to add a new user
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    console.log('Successfully created user:', userRecord.uid);

    // Store additional user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export admin and db for use in other modules if needed
module.exports = { admin, db, app };
