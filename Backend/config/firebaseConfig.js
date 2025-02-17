const admin = require('firebase-admin');

// Load Firebase Admin SDK credentials
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://nutri-luna-default-rtdb.firebaseio.com', // Firestore Database URL
});

// Firestore Instance
const db = admin.firestore();

module.exports = { admin, db };
