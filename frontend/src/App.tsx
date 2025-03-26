import React from "react";
import { Link } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to the ChatGPT Chatbot</h1>
      <Link to="/chat">
        <button style={{ padding: "10px 20px", cursor: "pointer" }}>Go to Chat</button>
      </Link>
    </div>
  );
};

export default App;
