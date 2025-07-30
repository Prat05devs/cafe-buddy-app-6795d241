import { apiRequest } from '@/lib/api/client';
import { LoginRequest, LoginResponse, RegisterRequest, ApiResponse } from '@shared/types/api.types';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiRequest<ApiResponse<LoginResponse>>('POST', '/auth/login', credentials);
    
    if (response.success && response.data) {
      // Store token in localStorage
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  }

  static async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiRequest<ApiResponse<LoginResponse>>('POST', '/auth/register', userData);
    
    if (response.success && response.data) {
      // Store token in localStorage
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    
    throw new Error(response.message || 'Registration failed');
  }

  static async logout(): Promise<void> {
    try {
      await apiRequest('POST', '/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  static async getProfile() {
    const response = await apiRequest<ApiResponse>('GET', '/auth/profile');
    return response.data;
  }

  static getCurrentUser() {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static getToken() {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('auth_token');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}