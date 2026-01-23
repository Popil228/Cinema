import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

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
};
