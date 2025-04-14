import React from 'react';
import ChatListItem from './ChatListItem.tsx';
import { Chat } from '../../../types/common.ts';

type ChatSidebarProps = {
  chats: Chat[];
  onCreateNewChat: () => void;
  onChatClick: (chatId: string) => void;
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chats, onCreateNewChat, onChatClick }) => (
  <div className="w-64 bg-white border-r">
    <div className="p-4">
      <button
        onClick={onCreateNewChat}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        New Chat
      </button>
    </div>
    <div className="overflow-y-auto">
      {chats.map((chat) => (
        <ChatListItem 
          key={chat.id} 
          chat={chat} 
          onClick={() => onChatClick(chat.id)} 
        />
      ))}
    </div>
  </div>
);

export default ChatSidebar;