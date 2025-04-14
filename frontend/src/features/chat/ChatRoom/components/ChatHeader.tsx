import React from 'react';

interface ChatHeaderProps {
  chatName: string;
  onBack: () => void;
  onUpload: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatName, onBack, onUpload }) => (
  <div className="bg-white p-4 flex justify-between items-center shadow">
    <button
      onClick={onBack}
      className="text-gray-600 hover:text-gray-800"
    >
      ← Back to Chats
    </button>
    <h1 className="text-xl font-bold">{chatName}</h1>
    <button
      onClick={onUpload}
      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
    >
      Upload Excel File
    </button>
  </div>
);

export default ChatHeader;