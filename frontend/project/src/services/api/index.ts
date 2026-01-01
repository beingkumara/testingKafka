import ApiClient from './apiClient';
import { API_BASE_URL, AUTH_API_URL } from '../../config/constants';

// Create API clients for different services
export const f1Api = new ApiClient(API_BASE_URL);
export const authApi = new ApiClient(AUTH_API_URL);

export default {
  f1Api,
  authApi,
};