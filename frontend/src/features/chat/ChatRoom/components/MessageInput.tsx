import React from 'react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  disabled 
}) => (
  <form onSubmit={onSubmit} className="bg-white p-4 border-t">
    <div className="flex space-x-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
        disabled={disabled}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        disabled={disabled || !value.trim()}
      >
        {disabled ? 'Sending...' : 'Send'}
      </button>
    </div>
  </form>
);

export default MessageInput;