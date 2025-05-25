import { STORAGE_KEYS } from '../../config/constants';

/**
 * API Client with interceptors for handling requests and responses
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the authorization header if a token exists
   */
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: response.statusText 
      }));
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, requiresAuth = true): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, requiresAuth = true): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any, requiresAuth = true): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }
}

export default ApiClient;