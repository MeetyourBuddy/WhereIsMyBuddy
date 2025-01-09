import axiosInstance from '../axios-instance';
import { tokenService } from '@services/token/token-service';
import { AuthResponse, SignInCredentials, SignUpData, LogoutResponse } from '@/types/auth-types';
import { AxiosResponse } from 'axios';

class AuthService {
  async login(credentials: SignInCredentials): Promise<AxiosResponse<AuthResponse>> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);

    return response;
  }

  async register(userData: SignUpData): Promise<AxiosResponse<AuthResponse>> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);

    return response;
  }

  async googleLogin(credential: string): Promise<AxiosResponse<AuthResponse>> {
    const response = await axiosInstance.post<AuthResponse>('/auth/google/callback', {
      credential
    });

    return response;
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
