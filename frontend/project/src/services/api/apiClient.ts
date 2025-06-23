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
  private logRequest(method: string, url: string, headers: HeadersInit, data?: any) {
    console.group('API Request');
    console.log(`%c${method} ${url}`, 'color: #4CAF50; font-weight: bold');
    console.log('Headers:', headers);
    if (data) {
      console.log('Request Data:', data);
    }
    console.groupEnd();
  }

  private logResponse(response: Response, data: any) {
    console.group('API Response');
    console.log(`%c${response.status} ${response.statusText}`, 
      `color: ${response.ok ? '#4CAF50' : '#F44336'}; font-weight: bold`);
    console.log('Response Data:', data);
    console.groupEnd();
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
    this.logRequest('GET', url, headers);
    
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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const url = `${this.baseUrl}${endpoint}`;
    this.logRequest('POST', url, headers, data);
    
    const response = await fetch(url, {
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

    const url = `${this.baseUrl}${endpoint}`;
    this.logRequest('PUT', url, headers, data);
    
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
    this.logRequest('DELETE', url, headers);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }
}

export default ApiClient;