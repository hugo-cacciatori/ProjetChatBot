import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from '../../../context/ChatContext';
import { MESSAGE_SENDER } from './constants';
import { createMessage, generateAutoReply } from './utils/messageUtils';
import { handleFileUpload } from './utils/fileUtils';
import FileHistorySidebar from './components/FileHistorySidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

const ChatRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getChat, updateChat } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const chat = getChat(id!);

  useEffect(() => {
    if (!chat) {
      navigate('/');
    }
  }, [chat, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      
      if (!newMessage.trim() || !chat || !id) return;
  
      const userMessage = createMessage(newMessage, MESSAGE_SENDER.USER);
  
      const updatedChat = {
        ...chat,
        messages: [...chat.messages, userMessage],
        lastMessage: newMessage,
      };
      
      updateChat(id, updatedChat);
      setNewMessage('');
      
      setIsProcessing(true);
      await generateAutoReply(newMessage, updatedChat.messages, id, updateChat);
      setIsProcessing(false);
    },
    [newMessage, chat, id, updateChat]
  );

  const onFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!chat) return;
      handleFileUpload(event, chat, id, updateChat);
    },
    [chat, id, updateChat]
  );

  if (!chat) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <FileHistorySidebar files={chat.files} />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          chatName={chat.name} 
          onBack={() => navigate('/')}
          onUpload={() => fileInputRef.current?.click()}
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileUpload}
          accept=".xlsx,.xls"
          className="hidden"
        />
        
        <MessageList messages={chat.messages} messagesEndRef={messagesEndRef} />
        
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSendMessage}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default ChatRoom;