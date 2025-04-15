import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

// Define more comprehensive user type
interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  isGuest?: boolean;
  lastLogin?: Date;
}

// Enhanced auth context type with loading and error states
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create context with strict typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication service (could be replaced with real API calls)
const mockAuthService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    return {
      id: '1',
      name: 'John Doe',
      email,
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      lastLogin: new Date(),
    };
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authenticatedUser = await mockAuthService.login(email, password);
      setUser(authenticatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsGuest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUser({
        id: 'guest',
        name: 'Guest User',
        email: 'guest@example.com',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        isGuest: true,
        lastLogin: new Date(),
      });
    } catch (err) {
      setError('Failed to login as guest');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    error,
    login,
    loginAsGuest,
    logout,
    clearError,
  }), [user, isLoading, error, login, loginAsGuest, logout, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with proper type checking
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};