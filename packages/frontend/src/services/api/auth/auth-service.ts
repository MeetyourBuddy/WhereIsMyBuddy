import axiosInstance from '@services/axios-instance';
import { tokenService } from '@services/token/token-service';
import { AuthResponse, SignInCredentials, SignUpData, LogoutResponse } from '@/types/auth-types';
import { AxiosResponse } from 'axios';

class AuthService {
  async login(credentials: SignInCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(userData: SignUpData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }

  async googleLogin(credential: string): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/google/callback', {
      credential
    });
    return response.data;
  }

  async logout(): Promise<AxiosResponse<LogoutResponse>> {
    try {
      const response = await axiosInstance.post<LogoutResponse>('/auth/logout');
      tokenService.clearTokens();
      return response;
    } catch (error) {
      tokenService.clearTokens();
      throw error;
    }
  }
}

export const authService = new AuthService();
