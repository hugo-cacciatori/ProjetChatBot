import React from 'react';
import { Chat } from '../../../types/common';

type ChatListItemProps = {
  chat: Chat;
  onClick: () => void;
};

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 hover:bg-gray-100 cursor-pointer"
  >
    <h3 className="font-medium">{chat.name}</h3>
    <p className="text-sm text-gray-600 truncate">{chat.lastMessage || 'No messages yet'}</p>
  </div>
);

export default ChatListItem;