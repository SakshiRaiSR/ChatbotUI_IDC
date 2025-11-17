

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/login";

// ⭐ ADDED: Chatbot Components
import ChatbotApp from "./components/ChatbotApp";

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* ⭐ Chatbot App */}
        <Route path="/chatbot" element={<ChatbotApp />} />

      </Routes>
    </Router>
  );
}

export default App;