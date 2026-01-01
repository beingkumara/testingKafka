/**
 * Error handling utilities
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
};

/**
 * Log error to console with additional context
 */
export const logError = (error: unknown, context?: string): void => {
  const errorMessage = formatErrorMessage(error);
  const contextMessage = context ? ` [${context}]` : '';
  
  console.error(`Error${contextMessage}: ${errorMessage}`, error);
};