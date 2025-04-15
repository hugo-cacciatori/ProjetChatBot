export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  lastMessage?: string;
  files: SharedFile[];
  messages: Message[];
}

export interface SharedFile {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size: string;
}