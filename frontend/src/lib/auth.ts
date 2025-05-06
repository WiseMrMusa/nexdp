import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Mock user credentials
const MOCK_USER = {
  email: 'demo@nexdp.com',
  password: 'demo123',
  user: {
    id: '1',
    email: 'demo@nexdp.com',
    username: 'demo',
    fullName: 'Demo User'
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // Mock authentication
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    const mockToken = 'mock-jwt-token';
    localStorage.setItem('token', mockToken);
    return {
      user: MOCK_USER.user,
      token: mockToken
    };
  }

  throw new Error('Invalid email or password');
};

export const signup = async (email: string, password: string, username: string, fullName: string): Promise<AuthResponse> => {
  // For demo purposes, we'll just log in with the mock user
  return login(MOCK_USER.email, MOCK_USER.password);
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return true;
};

export const getAuthHeader = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
}; 