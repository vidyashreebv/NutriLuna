import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API requests
import "./LoginRegister.css";
import { PiUserFill, PiEnvelopeSimpleBold } from "react-icons/pi";
import { TbPasswordUser } from "react-icons/tb";

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
    const { name, email, password } = formData;
    setIsLoginDisabled(!(name && email && password));
  }, [formData]);

  // 🔹 Register Function
  const handleRegister = async (event) => {
    event.preventDefault();
    const { name, email, password } = formData;

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
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Error registering user');
    }
  };

  // 🔹 Login Function
  const handleLogin = async (event) => {
    event.preventDefault();
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
            <button 
              type="submit" 
              disabled={isLoginDisabled} 
              style={{ 
                backgroundColor: isLoginDisabled ? "white" : "white", 
                textDecoration: isLoginDisabled ? "line-through" : "none"
              }}
            >
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
            <button 
              type="submit" 
              disabled={isRegisterDisabled} 
              style={{ 
                backgroundColor: isRegisterDisabled ? "white" : "white", 
                textDecoration: isRegisterDisabled ? "line-through" : "none"
              }}
            >
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
