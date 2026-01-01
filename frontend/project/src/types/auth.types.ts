/**
 * Authentication related types
 */

export interface User {
  id: string;
  username: string;
  password?: string;
  email: string;
  favoriteDriver?: string;
  favoriteTeam?: string;
  profilePicture?: string;
  coverPhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginApiResponse {
  token: string;
  message: string;
}

export interface RegisterApiResponse {
  message: string;
}

export interface OtpVerificationResponse {
  message: string;
  token?: string; // In case the OTP verification returns a token for the next step
  requiresOAuth?: boolean; // Indicates if OAuth flow is required
}

export interface PasswordResetResponse {
  message: string;
}

export interface ProfileUpdateRequest {
  username?: string;
  email?: string;
  favoriteDriver?: string;
  favoriteTeam?: string;
  profilePicture?: string | File;
  coverPhoto?: string | File;
}

export interface ProfileUpdateResponse {
  user: User;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>;
  error: string | null;
}