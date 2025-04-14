import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Chat } from '../types/common';

interface ChatContextType {
  chats: Chat[];
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updatedChat: Partial<Chat>) => void;
  getChat: (chatId: string) => Chat | null;
  removeChat?: (chatId: string) => void; // Optional, added for completeness
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Helper function for safe localStorage access
const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return defaultValue;
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(() => 
    getLocalStorageItem<Chat[]>('chats', [])
  );

  // Persist chats to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chats', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [chats]);

  const addChat = useCallback((chat: Chat) => {
    setChats(prev => [...prev, chat]);
  }, []);

  const updateChat = useCallback((chatId: string, updatedChat: Partial<Chat>) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, ...updatedChat } : chat
    ));
  }, []);

  const getChat = useCallback((chatId: string) => {
    return chats.find(chat => chat.id === chatId) ?? null;
  }, [chats]);

  // Optional: Add removeChat functionality if needed
  const removeChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
  }, []);

  const contextValue = useMemo(() => ({
    chats,
    addChat,
    updateChat,
    getChat,
    removeChat, // Only include if you need this functionality
  }), [chats, addChat, updateChat, getChat, removeChat]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};