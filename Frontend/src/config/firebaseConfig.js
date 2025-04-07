import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAr--QBGH8ed01xXD9VTKm7LGdve8JAIZw",
  authDomain: "nutri-luna.firebaseapp.com",
  projectId: "nutri-luna",
  storageBucket: "nutri-luna",
  messagingSenderId: "75642002726",
  appId: "1:75642002726:web:6b82ca7f749826d127f5e7",
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the existing app
}

const auth = getAuth(app);

// Log the current domain for debugging
console.log('Current domain:', window.location.hostname);

export { app, auth };