import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase"; // Import Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { PiUserFill, PiEnvelopeSimpleBold } from "react-icons/pi";
import { TbPasswordUser } from "react-icons/tb";
import "./LoginRegister.css";
=======
import axios from "axios"; // Import axios for API requests
import "./LoginRegister.css";
import { PiUserFill, PiEnvelopeSimpleBold } from "react-icons/pi";
import { TbPasswordUser } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

>>>>>>> 3fb4a77a1ce0c373e7b74e428103a548387b2af5

const LoginRegister = () => {
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
<<<<<<< HEAD
  const navigate = useNavigate();
=======
  const navigate = useNavigate(); // Initialize navigation

>>>>>>> 3fb4a77a1ce0c373e7b74e428103a548387b2af5

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Check if all Register fields are filled & passwords match
  useEffect(() => {
    const { name, email, password, confirmPassword } = formData;
    setIsRegisterDisabled(!(name && email && password && confirmPassword && password === confirmPassword));
    setPasswordMismatch(password && confirmPassword && password !== confirmPassword);
  }, [formData]);

  // ✅ Check if all Login fields are filled
  useEffect(() => {
<<<<<<< HEAD
    const { email, password } = formData;
    setIsLoginDisabled(!(email && password));
  }, [formData]);

  // 🔹 Register Function (With Firestore User Storage)
=======
    const { name, email, password } = formData;
    setIsLoginDisabled(!(name && email && password));
  }, [formData]);

  // 🔹 Register Function
>>>>>>> 3fb4a77a1ce0c373e7b74e428103a548387b2af5
  const handleRegister = async (event) => {
    event.preventDefault();
    const { name, email, password } = formData;

<<<<<<< HEAD
    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: name,
        email: email,
      });

      alert("Registration successful");
      navigate("/personaldetails"); // Redirect after login
       // Switch back to login form
    } catch (error) {
      alert(error.message);
=======
    if (passwordMismatch) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful');
        console.log(data);
        navigate('/personaldetails'); // Redirect to next page 
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Error registering user');
>>>>>>> 3fb4a77a1ce0c373e7b74e428103a548387b2af5
    }
  };

  // 🔹 Login Function
  const handleLogin = async (event) => {
    event.preventDefault();
<<<<<<< HEAD
    const { email, password } = formData;

    try {
      // Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      navigate("/dashboard"); // Navigate only after successful submission
      
    } catch (error) {
      alert(error.message);
=======
    const { name, email, password } = formData;

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login successful');
        console.log(data);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Error logging in');
>>>>>>> 3fb4a77a1ce0c373e7b74e428103a548387b2af5
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
<<<<<<< HEAD
=======
              <input type="text" name="name" placeholder="Username" required onChange={handleChange} />
              <PiUserFill className="icon" />
            </div>
            <div className="input-box">
>>>>>>> 3fb4a77a1ce0c373e7b74e428103a548387b2af5
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <PiEnvelopeSimpleBold className="icon" />
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <TbPasswordUser className="icon" />
            </div>
<<<<<<< HEAD
            <button type="submit" disabled={isLoginDisabled}>
=======
            <button
              type="submit"
              disabled={isLoginDisabled}
              style={{
                backgroundColor: isLoginDisabled ? "white" : "white",
                textDecoration: isLoginDisabled ? "line-through" : "none"
              }}
            >
>>>>>>> 3fb4a77a1ce0c373e7b74e428103a548387b2af5
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
<<<<<<< HEAD
            <button type="submit" disabled={isRegisterDisabled}>
=======
            <button
              type="submit"
              disabled={isRegisterDisabled}
              style={{
                backgroundColor: isRegisterDisabled ? "white" : "white",
                textDecoration: isRegisterDisabled ? "line-through" : "none"
              }}
            >
>>>>>>> 3fb4a77a1ce0c373e7b74e428103a548387b2af5
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
