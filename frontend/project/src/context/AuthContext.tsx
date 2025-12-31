import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser } from '../services';
import { fetchUserProfile, updateUserProfile, getCurrentUser } from '../services/auth/profileService';
import { User, AuthContextType, ProfileUpdateRequest } from '../types/auth.types';
import { STORAGE_KEYS } from '../config/constants';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useLocalStorage<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch profile if we have a token but no user data
    if (token && !user) {
      getCurrentUser()
        .then(data => {
          setUser(data);
        })
        .catch((err) => {
          console.error("Failed to restore session:", err);
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token, setToken, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);
      setToken(data.token);
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
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: ProfileUpdateRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user?.email) {
        throw new Error('User email required');
      }
      if (!token) {
        throw new Error('Authentication required');
      }
      console.log("user", user);
      data.email = user.email; // Ensure email is set from the current user
      console.log("data", data);
      const response = await updateUserProfile(token, data);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
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
        updateProfile,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Use function declaration for better Fast Refresh support
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
