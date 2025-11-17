import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";  
import "./ChatbotUI.css";
import { FaMicrophone, FaUserCircle, FaSun, FaMoon, FaHistory } from "react-icons/fa";

function ChatbotUI() {
  const [showWelcome, setShowWelcome] = useState(true);


  // ✅ Required for navigation (Logout)
  const navigate = useNavigate(); 

  // ✅ Logout function
  const handleLogout = () => {
    navigate("/login"); // go back to login page
  };

  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I’m Auralis. How can I assist you today?" },
  ]);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn’t support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      clearTimeout(silenceTimerRef.current);
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();

      // ⬅️ Hide welcome screen once user speaks
      setShowWelcome(false);

      // Add user message
      setMessages((prev) => [...prev, { sender: "user", text: transcript }]);

      // Simulated bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Got it! Let me think about that..." },
        ]);
      }, 800);

      // Restart silence timer
      silenceTimerRef.current = setTimeout(() => stopListening(), 5000);
    };

    recognition.onstart = () => {
      setListening(true);
      silenceTimerRef.current = setTimeout(() => stopListening(), 5000);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      clearTimeout(silenceTimerRef.current);
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className={`chatbot-page ${darkMode ? "dark" : ""}`}>
      
      {/* Navbar */}
      <header className="navbar" style={{ overflow: "visible" }}>
  <div className="navbar-left">
    <img src="idc-logo.jpg" alt="IDC Logo" className="logo" />
    <span className="company-name">IDC Technologies</span>
  </div>

  <div className="navbar-right">
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>

    {/* profile-menu wrapper: stops clicks from bubbling to document */}
    <div
      className="profile-menu"
      onClick={(e) => e.stopPropagation()}
      aria-hidden={false}
    >
      <FaUserCircle
        className="profile-icon"
        onClick={() => setDropdownOpen(prev => !prev)}
      />

      {dropdownOpen && (
        <div className="dropdown">
          <button onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}{" "}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button>
            <FaHistory /> Chat History
          </button>
        </div>
      )}
    </div>
  </div>
</header>

      {/* Chat Section */}
      <main className="chat-container">

  {/* ----------- WELCOME SCREEN ----------- */}
  {showWelcome && (
    <div className="welcome-screen">

      {/* Circular video */}
      <div className="welcome-video">
        <video
          src="/welcome-video.mp4"   // <-- Add your video in public folder
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Welcome Header */}
      <h1 className="welcome-title">Welcome, User! 👋</h1>

      {/* Subtitle */}
      <p className="welcome-subtitle">
        I'm your <strong>IDC AI Assistant.</strong> Click the microphone to start speaking!
      </p>

    </div>
  )}


  {/* ----------- CHAT SCREEN (only after speaking) ----------- */}
  {!showWelcome && (
    <div className="chatbox-wrapper">
      <div className="chatbox-header">Auralis</div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === "user" ? "user" : "bot"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  )}


  {/* Microphone stays always */}
  <div className="mic-container">
  {/* MIC START BUTTON */}
  <button
    className={`mic-btn ${listening ? "pulse" : ""}`}
    onClick={startListening}
    title={listening ? "Listening..." : "Click to speak"}
  >
    <FaMicrophone className="mic-icon" />
  </button>

  {/* STOP BUTTON – ONLY SHOW WHEN LISTENING */}
  {listening && (
    <button
      className="stop-btn"
      onClick={stopListening}
      title="Stop listening"
    >
      ✖
    </button>
  )}

  <p className="mic-tip">
    {listening
      ? "🎤 Listening... will stop automatically after 5s of silence or manually."
      : "💡 Tip: Click the mic button to speak your message"}
  </p>
</div>

</main>
    </div>
  );
}

export default ChatbotUI;