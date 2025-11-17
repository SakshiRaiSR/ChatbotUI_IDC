// src/components/login.js

import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();   // ✔ Hook placed inside component

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy login credentials
    const dummyEmail = "demo@email.com";
    const dummyPassword = "password123";

    // TODO: You can add real validation here later

    navigate("/chatbot");  // ✔ Redirect after login
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/idc-logo.jpg" alt="IDC Logo" className="navbar-logo" />
          <div className="navbar-text">
          <span className="navbar-title">IDC Technologies</span>
          <span className="navbar-subtitle">Digital Careers</span>
          </div>
        </div>
      </nav>

      {/* Login Box */}
      <div className="login-container">
        <div className="login-card">
          <img src="idc-logo.jpg" alt="IDC Logo" className="login-logo" />
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to your IDC account</p>

          {/* UPDATED: Add onSubmit handler */}
          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" required />

            <label>Password</label>
            <input type="password" placeholder="••••••••" required />

            <div className="login-options">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember"> Remember me</label>
              </div>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="continue-btn">
              Continue
            </button>

            <p className="signup-text">
              Don’t have an account? <a href="#">Sign up here</a>
            </p>
          </form>

          <hr />
          <p onClick={goHome} className="back-link" style={{ cursor: "pointer" }}>
            ← Back to Home</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <p>
          By signing in, you agree to our{" "}
          <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
      </footer>
    </div>
  );
}

export default LoginPage;