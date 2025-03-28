import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';

// Données de test pour simuler le backend
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  }
];

// Interface définissant la structure du contexte d'authentification
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Interface pour les props du AuthProvider
interface AuthProviderProps {
  children: React.ReactNode;
  onNavigate?: (path: string) => void;
}

// Création du contexte avec une valeur par défaut undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setError(null);
      
      if (onNavigate) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onNavigate('/login');
      }
    } catch (err) {
      setError('Erreur lors de la déconnexion');
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onNavigate]);

  const checkToken = useCallback(async () => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      await handleLogout();
      return false;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (storedToken.startsWith('mock-token-') || storedToken.startsWith('guest-token-')) {
        return true;
      }
      
      await handleLogout();
      return false;
    } catch (error) {
      await handleLogout();
      return false;
    }
  }, [handleLogout]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken) {
          const isValid = await checkToken();
          if (isValid) {
            setToken(storedToken);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const userData = MOCK_USERS.find(u => u.id === storedToken.split('-')[2]);
            if (userData) {
              setUser(userData);
            } else {
              await handleLogout();
            }
          }
        }
      } catch (err) {
        setError('Erreur lors de l\'initialisation de l\'authentification');
        console.error('Init auth error:', err);
        await handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkToken, handleLogout]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!userData) {
        throw new Error('Identifiants invalides');
      }

      const mockToken = `mock-token-${userData.id}-${Date.now()}`;
      
      localStorage.setItem('authToken', mockToken);
      setToken(mockToken);
      setUser(userData);

      if (onNavigate) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onNavigate('/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la connexion');
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const guestToken = `guest-token-${Date.now()}`;
      localStorage.setItem('authToken', guestToken);
      setToken(guestToken);
      setUser({
        id: 'guest',
        name: 'Guest User',
        email: 'guest@example.com',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      });

      if (onNavigate) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onNavigate('/dashboard');
      }
    } catch (error) {
      setError('Erreur lors de la connexion en tant qu\'invité');
      console.error('Guest login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await handleLogout();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      loginAsGuest, 
      logout,
      isAuthenticated: !!token,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('LE ERROOORRRRE');
  }
  return context;
};