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
    if (!token) return {};
    const cleanToken = token.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes if they exist
    return { 'Authorization': `Bearer ${cleanToken}` };
  }


  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // First check if there's content to parse
      const text = await response.text();
      let errorData;
      
      try {
        // Only try to parse as JSON if there's content
        errorData = text ? JSON.parse(text) : { message: response.statusText };
      } catch (e) {
        // If parsing fails, use the raw text or status text
        errorData = { 
          message: text || response.statusText 
        };
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // For successful responses, first get the text content
    const text = await response.text();
    
    // If there's no content, return an empty object
    if (!text) {
      return {} as T;
    }
    
    // Otherwise parse the JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Failed to parse response as JSON: ${e.message}`);
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, requiresAuth = true): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, requiresAuth = true): Promise<T> {
    const headers: HeadersInit = requiresAuth ? this.getAuthHeader() : {};
    let body: BodyInit;

    if (data instanceof FormData) {
      // Let the browser set the 'Content-Type' to 'multipart/form-data' with the correct boundary
      body = data;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
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

    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
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

    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }
}

export default ApiClient;