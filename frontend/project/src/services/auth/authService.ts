import { AUTH_API_URL } from '../../config/constants';
import { 
  AuthResponse, 
  LoginApiResponse, 
  RegisterApiResponse, 
  User 
} from '../../types/auth.types';

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get user profile
 */
export const getUserProfile = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_API_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const user: User = await handleApiResponse(response);
    return { token, user };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    });

    const loginApiData: LoginApiResponse = await handleApiResponse(response);
    const { token } = loginApiData;
    
    // After successful login and getting the token, fetch the user profile
    return getUserProfile(token);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register user
 */
export const registerUser = async (
  name: string, 
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: name, email, password }),
    });
    
    const registerApiData: RegisterApiResponse = await handleApiResponse(response);
    
    if (registerApiData.message !== "Registration successful") {
      throw new Error(registerApiData.message || 'Registration failed');
    }
    
    // After successful registration, automatically log the user in
    return loginUser(email, password);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });
    
    return handleApiResponse(response);
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${AUTH_API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });
    
    return handleApiResponse(response);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};