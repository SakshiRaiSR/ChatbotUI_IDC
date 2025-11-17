import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "Leading the charge in <strong>Digital Transformation</strong> and IT Staffing excellence.",
    "Your partner in building high-performing, <strong>future-ready technology teams</strong>.",
    "Connecting top-tier <strong>IT talent</strong> with global opportunities, seamlessly.",
    "Driving innovation through expertise in <strong>Cloud, AI, and Application Modernization</strong>.",
    "<strong>Empowering careers</strong> and accelerating business growth in the global tech marketplace."
  ];

  useEffect(() => {
    document.body.classList.add("loaded");
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (path) => {
    const page = document.querySelector(".landing-page");
    page.classList.remove("loaded");
    setTimeout(() => navigate(path), 400);
  };

  return (
    <div className="landing-page loaded">

      {/* ⭐ NAVBAR (same as login page) */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/idc-logo.jpg" alt="IDC Logo" className="navbar-logo" />

          <div className="navbar-text-group">
            <span className="navbar-title">IDC Technologies</span>
            <p className="navbar-subtitle">Digital Careers</p>
          </div>
        </div>

        <button
          className="login-btn"
          onClick={() => handleNavigate("/login")}
        >
          Login
        </button>
      </nav>

      <main className="hero-section">
        <div className="bg-element circle-left"></div>
        <div className="bg-element grid-right"></div>

        <div className="hero-content">
          <h1 className="hero-heading">
            Empowering <span className="text-blue">Digital Careers</span>
          </h1>

          <p className="hero-tagline">Built for a Growing Tech World</p>

          <p
            id="quote"
            dangerouslySetInnerHTML={{ __html: quotes[quoteIndex] }}
          ></p>

          <p className="hero-paragraph">
            Discover comprehensive digital career solutions designed to elevate
            your skills and propel your success in the modern tech landscape.
          </p>

          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={() => handleNavigate("/login")}
            >
              Get Started
            </button>
            <button className="btn btn-outline">Learn More</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;