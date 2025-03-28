import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { SharedFile, Message } from '../types';
import { useChat } from '../context/ChatContext';

const ChatRoom = () => {
  const { id } = useParams();
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

  const generateAutoReply = async (userMessage: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    let reply = "I understand you said: " + userMessage;
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      reply = "Hello! How can I help you today?";
    } else if (userMessage.toLowerCase().includes('thank')) {
      reply = "You're welcome! Is there anything else you need help with?";
    } else if (userMessage.toLowerCase().includes('bye')) {
      reply = "Goodbye! Have a great day!";
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: reply,
      sender: 'assistant',
      timestamp: new Date().toISOString()
    };

    updateChat(id!, {
      messages: [...(chat?.messages || []), newMessage],
      lastMessage: reply
    });
    setIsProcessing(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    updateChat(id!, {
      messages: [...chat.messages, userMessage],
      lastMessage: newMessage
    });
    setNewMessage('');
    await generateAutoReply(newMessage);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !chat) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const url = URL.createObjectURL(file);
        
        const newFile: SharedFile = {
          id: Date.now().toString(),
          name: file.name,
          url,
          uploadedAt: new Date().toISOString()
        };

        const systemMessage: Message = {
          id: Date.now().toString(),
          content: `File uploaded: ${file.name}`,
          sender: 'assistant',
          timestamp: new Date().toISOString()
        };

        updateChat(id!, {
          files: [...chat.files, newFile],
          messages: [...chat.messages, systemMessage],
          lastMessage: `File uploaded: ${file.name}`
        });
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('Error processing Excel file. Please try again.');
      }
    };
    reader.readAsBinaryString(file);
  };

  if (!chat) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* File History Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="font-bold mb-4">Shared Files</h2>
          <div className="space-y-2">
            {chat.files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                <span className="truncate flex-1">{file.name}</span>
                <a
                  href={file.url}
                  download={file.name}
                  className="ml-2 text-blue-500 hover:text-blue-600"
                >
                  ↓
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 flex justify-between items-center shadow">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Chats
          </button>
          <h1 className="text-xl font-bold">{chat.name}</h1>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Upload Excel File
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
              disabled={isProcessing}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isProcessing || !newMessage.trim()}
            >
              {isProcessing ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;