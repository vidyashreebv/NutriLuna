const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json'); // Adjust path as necessary

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com' // Replace with your database URL
});

console.log('Firebase Admin Initialized');

// Example: Access Firestore
const db = admin.firestore();

module.exports = { admin, db };
