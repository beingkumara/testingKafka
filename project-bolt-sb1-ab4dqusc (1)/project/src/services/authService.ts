// Mock authentication service with JWT

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate JWT token generation (this is just for mock purposes)
const generateToken = (userId: string): string => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Mock user database
const mockUsers: Record<string, User> = {
  'user1': {
    id: 'user1',
    name: 'Max Verstappen',
    email: 'max@example.com',
    avatar: 'https://images.pexels.com/photos/12041877/pexels-photo-12041877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate API delay
  await delay(1000);
  
  // For demo purposes, accept any credentials with minimal validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // Check if we have a mock user with this email
  const user = Object.values(mockUsers).find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    // Existing user login
    return {
      token: generateToken(user.id),
      user
    };
  }
  
  // For demo purposes, create a new user if not found
  const newUserId = `user${Object.keys(mockUsers).length + 1}`;
  const newUser: User = {
    id: newUserId,
    name: email.split('@')[0],
    email: email,
  };
  
  mockUsers[newUserId] = newUser;
  
  return {
    token: generateToken(newUserId),
    user: newUser
  };
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // Simulate API delay
  await delay(1000);
  
  // Basic validation
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }
  
  // Check if email is already in use
  const existingUser = Object.values(mockUsers).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Create a new user
  const newUserId = `user${Object.keys(mockUsers).length + 1}`;
  const newUser: User = {
    id: newUserId,
    name,
    email,
  };
  
  mockUsers[newUserId] = newUser;
  
  return {
    token: generateToken(newUserId),
    user: newUser
  };
};

export const getUserProfile = async (token: string): Promise<AuthResponse> => {
  // Simulate API delay
  await delay(500);
  
  // Extract user ID from token (in a real app, you'd decode the JWT)
  const userId = token.split('-')[1];
  
  if (!userId || !mockUsers[userId]) {
    throw new Error('Invalid token');
  }
  
  return {
    token,
    user: mockUsers[userId]
  };
};