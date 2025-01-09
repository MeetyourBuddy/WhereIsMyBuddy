import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@services/api/config';
import { tokenService } from '@services/token/token-service';
import { AuthResponse } from '@/types/auth-types';

const axiosInstance: AxiosInstance = axios.create({
  ...API_CONFIG
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const tokens = response.data.data.data.tokens;

    if (tokens) {
      tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
    }

    return response;
  },
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (refreshToken) {
          const response = await axiosInstance.post<AuthResponse>('/auth/refresh', {
            refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data.data.tokens;

          tokenService.setTokens(accessToken, newRefreshToken);
          originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);

          return axiosInstance(originalRequest);
        }
      } catch (error) {
        tokenService.clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
