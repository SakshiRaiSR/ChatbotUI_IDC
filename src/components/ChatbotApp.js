// ChatbotApp.js
import React from "react";
import ChatbotUI from "./ChatbotUI";
import { useNavigate } from "react-router-dom";

export default function ChatbotApp() {
  
  
  const navigate = useNavigate();

  
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div>
      {/* chatbot UI */}
      <ChatbotUI />

      {/* logout button 
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button> */}
    </div>
  );
}