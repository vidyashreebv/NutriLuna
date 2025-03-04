import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { PiUserFill, PiEnvelopeSimpleBold } from "react-icons/pi";
import { TbPasswordUser } from "react-icons/tb";
import "./LoginRegister.css";
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import axios from 'axios';

const LoginRegister = () => {
  const { currentUser } = useAuth();
  const { showLoader, hideLoader } = useLoading();
  const [action, setAction] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isRegisterDisabled, setIsRegisterDisabled] = useState(true);
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if all Register fields are filled & passwords match
  useEffect(() => {
    const { name, email, password, confirmPassword } = formData;
    setIsRegisterDisabled(!(name && email && password && confirmPassword && password === confirmPassword));
    setPasswordMismatch(password && confirmPassword && password !== confirmPassword);
  }, [formData]);

  // Check if all Login fields are filled
  useEffect(() => {
    const { email, password } = formData;
    setIsLoginDisabled(!(email && password));
  }, [formData]);

  // Add this effect to redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      // Clear any existing PIN verification on login
      localStorage.removeItem('pinVerified');
      localStorage.removeItem('intendedPath');
      navigate('/landing', { replace: true });
    }
  }, [currentUser, navigate]);

  // Register Function (With Firestore User Storage)
  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      showLoader();
      const { name, email, password } = formData;

      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: name,
        email: email,
        isNewUser: true
      });

      // Clear any existing PIN verification
      localStorage.removeItem('pinVerified');
      localStorage.removeItem('intendedPath');
      
      alert("Registration successful");
      navigate("/personaldetails");
    } catch (error) {
      alert(error.message);
    } finally {
      hideLoader();
    }
  };

  // Login Function
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      showLoader();
      const { email, password } = formData;

      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      // Clear any existing PIN verification
      localStorage.removeItem('pinVerified');
      localStorage.removeItem('intendedPath');

      // Check if user has set up PIN before
      try {
        const token = await user.getIdToken();
        const response = await axios.get('http://localhost:5001/api/pin/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (userData?.isNewUser || !response.data.isPinSet) {
          // New user or PIN not set - show PIN setup
          navigate('/landing', { state: { requirePinSetup: true } });
        } else {
          // Existing user - show PIN verification
          navigate('/landing');
        }
      } catch (error) {
        console.error('Error checking PIN status:', error);
        // If error in checking PIN status, just go to landing
        navigate('/landing');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="app-body">
      <div className={`Wrapper ${action}`}>
        {/* LOGIN FORM */}
        <div className="form-box-login">
          <form onSubmit={handleLogin}>
            <h1 className="log-hed">Login</h1>
            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <PiEnvelopeSimpleBold className="icon" />
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <TbPasswordUser className="icon" />
            </div>
            <button  className="register-button" type="submit" disabled={isLoginDisabled}>
              Login
            </button>
            <div className="new-register-link">
              <p>
                Don't have an account?
                <a href="#" onClick={() => setAction("activate")}> Register </a>
              </p>
            </div>
          </form>
        </div>

        {/* REGISTER FORM */}
        <div className="form-box-register">
          <form onSubmit={handleRegister}>
            <h1 className="log-hed">Register</h1>
            <div className="input-box">
              <input type="text" name="name" placeholder="Username" required onChange={handleChange} />
              <PiUserFill className="icon" />
            </div>
            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <PiEnvelopeSimpleBold className="icon" />
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <TbPasswordUser className="icon" />
            </div>
            <div className="input-box">
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
              <TbPasswordUser className="icon" />
            </div>
            {passwordMismatch && <p style={{ color: "white", fontSize: "12px", marginTop: "5px" }}>Passwords do not match</p>}
            <button className="register-button" type="submit" disabled={isRegisterDisabled}>
              Register
            </button>
            <div className="login-link">
              <p>
                Already have an account?
                <a href="#" onClick={() => setAction("")}> Login </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
