import React from "react";
import Chat from "../components/chat.tsx";

const ChatPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>ChatGPT Chatbot</h2>
      <Chat />
    </div>
  );
};

export default ChatPage;
