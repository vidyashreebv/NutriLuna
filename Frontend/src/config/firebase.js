import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr--QBGH8ed01xXD9VTKm7LGdve8JAIZw",
  authDomain: "nutri-luna.firebaseapp.com",
  projectId: "nutri-luna",
  storageBucket: "nutri-luna.firebasestorage.app",
  messagingSenderId: "75642002726",
  appId: "1:75642002726:web:6b82ca7f749826d127f5e7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


