import axios from 'axios';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000' });

export async function generateRoadmap(courseName: string) {
  const res = await api.post('/api/roadmap/generate', { courseName });
  return res.data;
}

export async function searchVideos(topic: string) {
  const res = await api.get('/api/videos/search', { params: { topic } });
  return res.data;
}

export async function getProgress(courseId: string) {
  const res = await api.get('/api/progress', { params: { courseId } });
  return res.data;
}

export async function updateProgress(courseId: string, topicId: string, completed: boolean) {
  const res = await api.post('/api/progress', { courseId, topicId, completed });
  return res.data;
}

/**
 * Profile API Functions
 */

/**
 * Save or update user profile
 * @param profileData - User profile information
 * @returns Promise with API response
 */
export async function saveProfile(profileData: {
  email: string;
  fullName: string;
  username: string;
  phone?: string;
  country?: string;
  profileImage?: string;
}) {
  const res = await api.post('/api/profile', profileData);
  return res.data;
}

/**
 * Fetch user profile by email
 * @param email - User's email address
 * @returns Promise with user profile data
 */
export async function getProfile(email: string) {
  const res = await api.get(`/api/profile/${email}`);
  return res.data;
}

/**
 * Authentication API Functions
 */

/**
 * Register a new user
 * @param credentials - User registration data
 * @returns Promise with user data and token
 */
export async function register(credentials: {
  email: string;
  password: string;
  fullName: string;
  username: string;
}) {
  const res = await api.post('/api/auth/register', credentials);
  return res.data.data || res.data;
}

/**
 * Login existing user
 * @param credentials - User login credentials
 * @returns Promise with user data and token
 */
export async function login(credentials: {
  email: string;
  password: string;
}) {
  const res = await api.post('/api/auth/login', credentials);
  return res.data.data || res.data;
}

/**
 * Get current authenticated user
 * @param token - JWT token
 * @returns Promise with user data
 */
export async function getCurrentUser(token: string) {
  const res = await api.get('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data || res.data;
}

/**
 * Set auth token for all requests
 * @param token - JWT token
 */
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

