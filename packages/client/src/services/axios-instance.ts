import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_CONFIG } from "@/services/api/config";
import { tokenService } from "@/services/token/token-service";
import { AuthResponse } from "@/types/auth-types";

const axiosInstance: AxiosInstance = axios.create({
  ...API_CONFIG,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const tokens = response.data?.data?.tokens;
    console.log("tokens", tokens);
    if (tokens?.accessToken) {
      console.log("setting tokens");
      tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Create a new instance for refresh token request to avoid interceptors
        const refreshResponse = await axios.post<AuthResponse>(
          `${API_CONFIG.baseURL}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data.tokens;
        tokenService.setTokens(accessToken, newRefreshToken);

        // Update the original request with new token
        originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        tokenService.clearTokens();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
