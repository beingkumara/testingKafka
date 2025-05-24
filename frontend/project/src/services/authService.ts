// Base URL for your Java authentication API
const API_BASE_URL = 'http://localhost:8080/api/f1nity/v1/auth';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthResponse {
  token: string;
  user: User; // User details will now be fetched separately after login/registration
}

interface LoginApiResponse {
  token: string;
  message: string; // "Login Success"
}

interface RegisterApiResponse {
  message: string; // "Registration successful" or "User already exists"
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getUserProfile = async (token: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const user: User = await handleApiResponse(response);
  // The API is expected to return the User object directly
  // We wrap it in AuthResponse format for consistency with AuthContext
  return { token, user };
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }), // Assuming 'username' is the email for login
  });

  const loginApiData: LoginApiResponse = await handleApiResponse(response);
  const { token } = loginApiData;

  // After successful login and getting the token, fetch the user profile
  return getUserProfile(token);
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const registerResponse = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: name, email, password }), // Assuming frontend 'name' maps to backend 'username'
  });

  // Check if registration was successful before attempting to log in
  const registerApiData: RegisterApiResponse = await handleApiResponse(registerResponse);
  if (registerApiData.message !== "Registration successful") {
    // Handle cases like "User already exists" or other registration errors
    throw new Error(registerApiData.message || 'Registration failed');
  }

  // After successful registration, automatically log the user in to get a token and user details
  // This assumes your backend allows immediate login after registration with the same credentials.
  return loginUser(email, password);
};