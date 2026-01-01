import { AUTH_API_URL } from '../../config/constants';
import { 
  AuthResponse, 
  LoginApiResponse, 
  RegisterApiResponse, 
  User,
  OtpVerificationResponse,
  PasswordResetResponse 
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
      body: JSON.stringify({ email, password }),
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
export const requestPasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  try {
    const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    // Get the response as text first
    const responseText = await response.text();
    
    // If the response is not OK, handle the error
    if (!response.ok) {
      console.error('Password reset request failed with status:', response.status);
      
      // Try to parse as JSON, but if it fails, use the text as the error message
      try {
        const errorData = responseText ? JSON.parse(responseText) : {};
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (e) {
        // If we can't parse as JSON, use the raw text as the error message
        throw new Error(responseText || `HTTP error! status: ${response.status}`);
      }
    }
    
    // If we get here, the response is OK (status 200-299)
    try {
      // Try to parse as JSON
      const responseData = responseText ? JSON.parse(responseText) : {};
      return responseData;
    } catch (e) {
      // If we can't parse as JSON but the response is OK, return a success message
      console.log('Response is not JSON, using as message');
      return { message: responseText || 'Password reset email sent successfully' };
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    
    // Handle specific error cases
    let errorMessage = 'Failed to request password reset. Please try again.';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Clean up error message if it contains HTML or other unwanted content
      if (errorMessage.includes('<html>') || errorMessage.includes('<body>')) {
        errorMessage = 'Invalid response from server. Please try again.';
      }
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Verify OTP token
 */
// In authService.ts, update the verifyOtp function
export const verifyOtp = async (token: string): Promise<OtpVerificationResponse> => {
  const url = `${AUTH_API_URL}/verify-otp?token=${encodeURIComponent(token)}`;
  console.log('Verifying OTP with URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'omit',
      redirect: 'follow',
    });
    
    console.log('OTP verification response status:', response.status);
    
    // Handle redirects for OAuth
    const responseUrl = response.url || '';
    if (responseUrl.includes('accounts.google.com')) {
      sessionStorage.setItem('otpToken', token);
      window.location.href = responseUrl;
      return {
        message: 'Redirecting to OAuth provider...',
        requiresOAuth: true
      };
    }
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('OTP verification failed with status:', response.status);
      try {
        const errorData = responseText ? JSON.parse(responseText) : {};
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (e) {
        throw new Error(responseText || `HTTP error! status: ${response.status}`);
      }
    }
    
    // Parse the response
    try {
      const responseData = responseText ? JSON.parse(responseText) : {};
      const responseBody = responseData.body || responseData;
      
      console.log('OTP verification successful:', responseBody);
      
      // Check for resetToken in the response
      const resetToken = responseBody.resetToken || responseBody.token;
      if (!resetToken) {
        console.warn('No reset token found in response, using OTP as fallback');
        return {
          message: responseBody.message || 'OTP verified successfully',
          token: token, // Fallback to OTP if no token provided
        };
      }
      
      return {
        message: responseBody.message || 'OTP verified successfully',
        token: resetToken, // Use the reset token from the response
      };
    } catch (e) {
      console.warn('Failed to parse JSON response, using OTP as fallback');
      return {
        message: 'OTP verified successfully',
        token: token, // Fallback to OTP if response is not JSON
      };
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    let errorMessage = 'Failed to verify OTP. Please try again.';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (errorMessage.includes('<html>') || errorMessage.includes('<body>')) {
        errorMessage = 'Invalid response from server. Please try again.';
      }
    }
    throw new Error(errorMessage);
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<PasswordResetResponse> => {
  const url = `${AUTH_API_URL}/reset-password`;
  console.log('Resetting password with URL:', url);
  
  try {
    // Using URLSearchParams to format as form-urlencoded
    const formData = new URLSearchParams();
    formData.append('token', token);
    formData.append('newPassword', newPassword);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });
    
    console.log('Password reset response status:', response.status);
    
    // Get the response as text first
    const responseText = await response.text();
    
    // If the response is not OK, handle the error
    if (!response.ok) {
      console.error('Password reset failed with status:', response.status);
      
      // For 401 Unauthorized, provide a more specific error message
      if (response.status === 401) {
        throw new Error('The reset link has expired or is invalid. Please request a new password reset.');
      }
      
      // Try to parse as JSON, but if it fails, use the text as the error message
      try {
        const errorData = responseText ? JSON.parse(responseText) : {};
        throw new Error(errorData.message || `Failed to reset password. Status: ${response.status}`);
      } catch (e) {
        // If we can't parse as JSON, use the raw text as the error message
        throw new Error(responseText || `Failed to reset password. Status: ${response.status}`);
      }
    }
    
    // If we get here, the response is OK (status 200-299)
    try {
      // Try to parse as JSON
      const responseData = responseText ? JSON.parse(responseText) : {};
      const responseBody = responseData.body || responseData;
      
      console.log('Password reset successful:', responseBody);
      
      return {
        message: responseBody.message || 'Password has been reset successfully',
      };
    } catch (e) {
      // If we can't parse as JSON but the response is OK, return a success message
      console.log('Response is not JSON, using as message');
      return {
        message: responseText || 'Password has been reset successfully',
      };
    }
  } catch (error) {
    console.error('Password reset error:', error);
    
    // Handle specific error cases
    let errorMessage = 'Failed to reset password. Please try again.';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Clean up error message if it contains HTML or other unwanted content
      if (errorMessage.includes('<html>') || errorMessage.includes('<body>')) {
        errorMessage = 'Invalid response from server. Please try again.';
      }
    }
    
    throw new Error(errorMessage);
  }
};