import axiosInstance from '../axios-instance';
import { tokenService } from '@services/token/token-service';
import { AuthResponse, SignInCredentials, SignUpData, LogoutResponse } from '@/types/auth-types';
import { AxiosResponse } from 'axios';

class AuthService {
  async login(credentials: SignInCredentials): Promise<AxiosResponse<AuthResponse>> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);

    console.log('response here', response.data.data.data.tokens);

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
    const response = await axiosInstance.post<LogoutResponse>('/auth/logout');

    if (response.status === 200) {
      tokenService.clearTokens();
    }

    return response;
  }
}

export const authService = new AuthService();
