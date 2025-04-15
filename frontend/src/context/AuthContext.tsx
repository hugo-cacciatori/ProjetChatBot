import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useRegisterUser } from '../hooks/userRegistrationHook';
import { loginUser } from '../api/AuthService';
import storage from '../features/auth/utils/storage';
import { parseJwt } from '../features/auth/utils/jwt';

// Define user returned by backend
interface User {
  id: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Auth context shape
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  // loginAsGuest: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider implementation
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Registration hook using React Query
  const { mutateAsync: registerMutation, isPending } = useRegisterUser();

  const register = useCallback(
    async (username: string, password: string) => {
      setError(null);
      try {
        const registeredUser = await registerMutation({ username, password });

        setUser({
          id: registeredUser.id,
          username: registeredUser.username,
          createdAt: registeredUser.createdAt
            ? new Date(registeredUser.createdAt)
            : undefined,
          updatedAt: registeredUser.updatedAt
            ? new Date(registeredUser.updatedAt)
            : undefined,
        });

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Registration failed');
        }
      }
    },
    [registerMutation]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      setError(null);
      try {
        const response = await loginUser({ username, password });
  
        if (!response.access_token) {
          throw new Error('No access token in response');
        }
  
        // ✅ Save token
        storage.setToken(response.access_token);
  
        const payload = parseJwt(response.access_token);
        setUser({
          id: payload.sub,
          username: payload.username,
        });

  
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Login failed');
        }
      }
    },
    []
  );
  
  

  // const loginAsGuest = useCallback(async () => {
  //   setUser({
  //     id: 'guest',
  //     username: 'guest',
  //   });
  //   setError(null);
  // }, []);

  const logout = useCallback(() => {
    storage.clearToken();
    setUser(null);
    setError(null);
  }, []);
  

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading: isPending,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [user, isPending, error, login, register, logout, clearError]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
