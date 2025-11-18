import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";  
import "./ChatbotUI.css";
import { FaMicrophone, FaUserCircle, FaSun, FaMoon, FaHistory, FaTimes, FaRedo } from "react-icons/fa";

function ChatbotUI() {
  const [showWelcome, setShowWelcome] = useState(true);

  const [audioLevels, setAudioLevels] = useState(new Array(20).fill(0));

  // ✅ Required for navigation (Logout)
  const navigate = useNavigate(); 

  // ✅ Logout function
  const handleLogout = () => {
    navigate("/login"); // go back to login page
  };

  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I’m Auralis. How can I assist you today?" },
  ]);

  const handleResetChat = () => {
  setMessages([
    { sender: "bot", text: "Hello! I’m Auralis. How can I assist you today?" }
  ]);
  setShowWelcome(true);
};

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);


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
  if (!recognitionRef.current || listening) return;

  recognitionRef.current.start();

  // 🎤 Audio waveform analyzer
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);   // ← REQUIRED

    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);

      // Convert raw frequency data → simplified bar levels
      const levels = Array.from({ length: 20 }, (_, i) => {
        const slice = dataArray.slice(i * 5, i * 5 + 5);
        return Math.max(...slice) / 255; // normalize 0–1
      });

      setAudioLevels(levels);

      requestAnimationFrame(animate);
    };

    animate();

    // Stop waveform when listening stops
    recognitionRef.current.onend = () => {
      setListening(false);
      setAudioLevels(new Array(20).fill(0));
      stream.getTracks().forEach(track => track.stop());
    };
  });
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

          <button onClick={handleResetChat}>
            <FaRedo /> Reset Chat
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
<div className="language-switch">
  <button
    className={`lang-btn ${language === "en" ? "active" : ""}`}
    onClick={() => setLanguage("en")}
  >
    English
  </button>

  <button
    className={`lang-btn ${language === "ar" ? "active" : ""}`}
    onClick={() => setLanguage("ar")}
  >
    Arabic
  </button>
</div>
    </div>
  )}


  {/* ----------- CHAT SCREEN (only after speaking) ----------- */}

  
  {!showWelcome && (
    <div className="chatbox-wrapper">
      
      <div className="chatbox-header">Auralis</div>

      <div className="chat-messages" padding="30px 40px">
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
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-language-switch">
  <button
    className={`chat-lang-btn ${language === "en" ? "active" : ""}`}
    onClick={() => setLanguage("en")}
  >
    English
  </button>

  <button
    className={`chat-lang-btn ${language === "ar" ? "active" : ""}`}
    onClick={() => setLanguage("ar")}
  >
    Arabic
  </button>
</div>
    </div>
  )}


  {/* Microphone stays always */}
  <div className="mic-wrapper">
    <div className="waveform">
  {audioLevels.map((level, i) => (
    <div
      key={i}
      className="wave-bar"
      style={{ height: `${level === 0 ? 0 : level * 40}px` }} // Dynamic bar height
    ></div>
  ))}
</div>

  <div className="mic-row">
    {/* Mic Button */}
    <button
      className={`mic-btn ${listening ? "pulse" : ""}`}
      onClick={listening ? stopListening : startListening}
    >
      <FaMicrophone size={28} />
    </button>

    {/* Stop Button */}
    {listening && (
      <button className="stop-btn" onClick={stopListening}>
        <FaTimes size={22} />
      </button>
    )}
  </div>

  {/* Tip text */}
  {listening && (
    <div className={`mic-tip ${listening ? "visible" : "hidden"}`}>
  🎙️ Listening... will stop automatically after 5s of silence or manually.
  </div>
  )}
</div>
</main>
    </div>
  );
}

export default ChatbotUI;