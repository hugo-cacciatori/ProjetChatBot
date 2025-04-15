import React from 'react';

type EmptyStateProps = {
  onCreateNewChat: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNewChat }) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-xl font-medium text-gray-600">Select a chat or start a new one</h2>
      <button
        onClick={onCreateNewChat}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Create New Chat
      </button>
    </div>
  </div>
);

export default EmptyState;