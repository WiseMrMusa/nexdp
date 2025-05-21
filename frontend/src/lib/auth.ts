export const BASE_URL = 'http://localhost:8000';

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

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  const { user, token } = await response.json();
  localStorage.setItem('token', token);
  return { user, token };
};

export const signup = async (email: string, password: string, username: string, fullName: string): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      username,
      full_name: fullName,
      password
    })
  });

  if (!response.ok) {
    throw new Error('Failed to signup');
  }

  const { user, token } = await response.json();
  localStorage.setItem('token', token);
  return { user, token };
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
  return !!getToken();
};

export const getAuthHeader = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
};