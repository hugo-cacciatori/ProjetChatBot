import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chats } from '../../services/api';
import { Chat } from '../../types';
import { MessageSquarePlus, MessageSquare, AlertCircle } from 'lucide-react';

const ChatList: React.FC = () => {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setError(null);
      const response = await chats.list();
      setChatList(response);
    } catch (error) {
      console.error('Failed to load chats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load chats');
    }
  };

  const createNewChat = async () => {
    try {
      setError(null);
      const newChat = await chats.create();
      navigate(`/chats/${newChat.id}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
      setError(error instanceof Error ? error.message : 'Failed to create new chat');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Chats</h2>
        <button
          onClick={createNewChat}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <MessageSquarePlus className="w-5 h-5 mr-2" />
          New Chat
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {chatList.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chats/${chat.id}`)}
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
          >
            <MessageSquare className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">{chat.title || 'Untitled Chat'}</h3>
              <p className="text-sm text-gray-500">
                {new Date(chat.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        
        {!error && chatList.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No chats yet. Create a new chat to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;