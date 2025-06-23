/**
 * Application constants
 */

// API URLs
export const API_BASE_URL = 'http://localhost:8080/api/v1';
export const AUTH_API_URL = 'http://localhost:8085/api/f1nity/v1/auth';

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
};

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  DASHBOARD: '/dashboard',
  DRIVERS: '/drivers',
  DRIVER_DETAILS: '/drivers/:id',
  RACES: '/races',
  RACE_DETAILS: '/races/:id',
  STANDINGS: '/standings',
  RACE_RESULTS: '/race-results',
  NEWS: '/news',
};

// App settings
export const APP_SETTINGS = {
  APP_NAME: 'F1nity',
  APP_DESCRIPTION: 'Formula 1 Analytics Platform',
};