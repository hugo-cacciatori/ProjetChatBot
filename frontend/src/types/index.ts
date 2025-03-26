export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
  files: File[];
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface File {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  type: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}