import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  checkToken: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  setToken: () => {},
  setUser: () => {},
  isAuthenticated: false,
  checkToken: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const checkToken = () => {
    if (!token) return false;
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 60000; // Convert to milliseconds 
      return Date.now() < expirationTime;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      const parsedToken = JSON.parse(storedToken);
      setToken(parsedToken);
      if (!checkToken()) {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value = {
    user,
    token,
    setToken,
    checkToken,
    setUser: (newUser: User | null) => {
      setUser(newUser);
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser))
        localStorage.setItem('token', JSON.stringify(token))
      } else {
        localStorage.removeItem('user'); 
        localStorage.removeItem('token');
      }
    },
    isAuthenticated: !!user && checkToken(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);