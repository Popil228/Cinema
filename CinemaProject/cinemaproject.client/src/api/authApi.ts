import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { HttpError } from '../errors/httpErrors';
import { handleHttpStatus } from '../utilities/apiUtils';

const API_BASE_URL = '/api';

export const authApi = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Handle common auth related statuses
    handleHttpStatus(response);

    if (!response.ok) {
      const body = await response.json();
      throw new HttpError(response.status, body.message ?? 'Помилка входу');
    }

    return response.json();
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Handle common auth related statuses
    handleHttpStatus(response);

    if (!response.ok) {
      const body = await response.json();
      throw new HttpError(response.status, body.message ?? 'Помилка реєстрації');
    }

    return response.json();
  },
};

//Функції для роботи з токеном
export const tokenStorage = {
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  getUser(): import('../types/auth').UserDto | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: import('../types/auth').UserDto): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem('user');
  },

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // exp is in seconds
      const now = Date.now();
      return now >= exp;
    } catch {
      return true;
    }
  },

  // Returns token expiration timestamp in ms or null
  getTokenExpiry(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.exp * 1000) as number;
    } catch {
      return null;
    }
  },
};
