import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { chats } from '../../services/api';
import { Chat, Message, File } from '../../types';
import { Send, Upload, Download } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [chat, setChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      loadChat();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const loadChat = async () => {
    if (!chatId) return;
    try {
      const response = await chats.get(chatId);
      setChat(response);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId || !message.trim()) return;

    setLoading(true);
    try {
      const response = await chats.sendMessage(chatId, message);
      setChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, response]
      } : null);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;

    setLoading(true);
    try {
      const response = await chats.uploadFile(chatId, file);
      setChat(prev => prev ? {
        ...prev,
        files: [...prev.files, response]
      } : null);
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownload = async (fileId: string) => {
    if (!chatId) return;
    try {
      const blob = await chats.downloadFile(chatId, fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = chat?.files.find(f => f.id === fileId)?.name || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat?.messages.map((msg: Message) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xl rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Files</h3>
            <div className="flex flex-wrap gap-2">
              {chat?.files.map((file: File) => (
                <div
                  key={file.id}
                  className="flex items-center bg-gray-100 rounded-md p-2"
                >
                  <span className="text-sm text-gray-600 mr-2">{file.name}</span>
                  <button
                    onClick={() => handleFileDownload(file.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-600 hover:text-gray-900"
              disabled={loading}
            >
              <Upload className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".xlsx,.xls"
            />
            
            <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading || !message.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;