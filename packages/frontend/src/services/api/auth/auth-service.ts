import axiosInstance from '../axios-instance';
import { tokenService } from '@services/token/token-service';
import { AuthResponse, SignInCredentials, SignUpData, User } from '@/types/auth-types';
import { AxiosResponse } from 'axios';

class AuthService {
  async login(credentials: SignInCredentials): Promise<AxiosResponse<AuthResponse>> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    const { accessToken, refreshToken } = response.data;

    if (accessToken) {
      tokenService.setTokens(accessToken, refreshToken);
    }

    return response;
  }

  async register(userData: SignUpData): Promise<AxiosResponse<AuthResponse>> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
    const { accessToken, refreshToken } = response.data;

    if (accessToken) {
      tokenService.setTokens(accessToken, refreshToken);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      tokenService.clearTokens();
    }
  }

  getCurrentUser(): Promise<AxiosResponse<User>> {
    return axiosInstance.get<User>('/auth/me');
  }
}

export const authService = new AuthService();
