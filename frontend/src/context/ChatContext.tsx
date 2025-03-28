import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chat } from '../types';

interface ChatContextType {
  chats: Chat[];
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updatedChat: Partial<Chat>) => void;
  getChat: (chatId: string) => Chat | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : [];
  });

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const addChat = (chat: Chat) => {
    setChats(prev => [...prev, chat]);
  };

  const updateChat = (chatId: string, updatedChat: Partial<Chat>) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, ...updatedChat } : chat
    ));
  };

  const getChat = (chatId: string) => {
    return chats.find(chat => chat.id === chatId);
  };

  return (
    <ChatContext.Provider value={{ chats, addChat, updateChat, getChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};