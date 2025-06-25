// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:25546/api';
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:25546';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/local',
    REGISTER: '/auth/local/register',
    ME: '/users/me',
  },
  
  // Users
  USERS: '/users',
  
  // Driving
  DRIVING: '/drivings',
  
  // Exams
  EXAMS: '/exams',
  
  // Timetable
  TIMETABLE: '/timetables',
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  MEDIA_URL: MEDIA_BASE_URL,
  TIMEOUT: 10000,
};
