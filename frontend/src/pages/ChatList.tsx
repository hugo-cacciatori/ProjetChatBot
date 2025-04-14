import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import ChatSidebar from '../components/chat/ChatSideBar';
import { Chat as ChatType } from '../types/common';
import EmptyState from '../components/chat/EmptyState';
import Header from '../components/chat/Header';

const ChatList: React.FC = () => {
  const { user, logout } = useAuth();
  const { chats, addChat } = useChat();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const createNewChat = useCallback(() => {
    const newChat: ChatType = {
      id: Date.now().toString(),
      name: `Chat ${chats.length + 1}`,
      files: [],
      messages: [],
      lastMessage: 'New conversation started'
    };
    addChat(newChat);
    navigate(`/chat/${newChat.id}`);
  }, [chats.length, addChat, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const toggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  const navigateToChat = useCallback((chatId: string) => {
    navigate(`/chat/${chatId}`);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <ChatSidebar 
        chats={chats} 
        onCreateNewChat={createNewChat} 
        onChatClick={navigateToChat} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          user={user} 
          showMenu={showMenu} 
          onToggleMenu={toggleMenu} 
          onLogout={handleLogout} 
        />
        
        <EmptyState onCreateNewChat={createNewChat} />
      </div>
    </div>
  );
};

export default ChatList;