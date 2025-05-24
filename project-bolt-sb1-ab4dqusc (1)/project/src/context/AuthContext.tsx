import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, getUserProfile } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      getUserProfile(token)
        .then(data => {
          setUser(data.user);
        })
        .catch(() => {
          // If token is invalid, clear it
          localStorage.removeItem('auth_token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await registerUser(name, email, password);
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};