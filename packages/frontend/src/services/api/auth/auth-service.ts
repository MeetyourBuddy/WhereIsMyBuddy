import axiosInstance from '../axios-instance';
import { tokenService } from '@services/token/token-service';
import {
  AuthResponse,
  SignInCredentials,
  SignUpData,
  IUser,
  LogoutResponse
} from '@/types/auth-types';
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

  async googleLogin(credential: string): Promise<AxiosResponse<AuthResponse>> {
    const response = await axiosInstance.post<AuthResponse>('/auth/google/callback', {
      credential
    });

    const { accessToken, refreshToken } = response.data;

    if (accessToken) {
      tokenService.setTokens(accessToken, refreshToken);
    }

    return response;
  }

  async logout(): Promise<AxiosResponse<LogoutResponse>> {
    const response = await axiosInstance.post<LogoutResponse>('/auth/logout');

    if (response.status === 200) {
      tokenService.clearTokens();
    }

    return response;
  }

  getMe(): Promise<AxiosResponse<IUser>> {
    return axiosInstance.get<IUser>('/auth/me');
  }
}

export const authService = new AuthService();
