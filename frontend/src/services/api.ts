import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      console.error('Network Error - Backend server might be down');
      return Promise.reject(new Error('Unable to connect to the server. Please check your connection or try again later.'));
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
      throw error;
    }
  },
  register: async (email: string, password: string, name: string) => {
    try {
      const response = await api.post('/auth/register', { email, password, name });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const chats = {
  create: async () => {
    try {
      const response = await api.post('/chats');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create chat.');
      }
      throw error;
    }
  },
  list: async () => {
    try {
      const response = await api.get('/chats');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to load chats.');
      }
      throw error;
    }
  },
  get: async (id: string) => {
    try {
      const response = await api.get(`/chats/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to load chat.');
      }
      throw error;
    }
  },
  sendMessage: async (chatId: string, content: string) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, { content });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to send message.');
      }
      throw error;
    }
  },
  uploadFile: async (chatId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(`/chats/${chatId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to upload file.');
      }
      throw error;
    }
  },
  downloadFile: async (chatId: string, fileId: string) => {
    try {
      const response = await api.get(`/chats/${chatId}/files/${fileId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to download file.');
      }
      throw error;
    }
  },
};

export default api;