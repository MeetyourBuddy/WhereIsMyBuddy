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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const tokens = response.data?.data?.tokens;
    console.log("Response interceptor tokens:", tokens);
    if (tokens?.accessToken) {
      console.log("Setting tokens in response interceptor");
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

        console.log("Attempting to refresh token");
        // Create a new instance for refresh token request to avoid interceptors
        const refreshResponse = await axios.post<AuthResponse>(
          `${API_CONFIG.baseURL}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data.tokens;

        console.log("Token refresh successful, setting new tokens");
        tokenService.setTokens(accessToken, newRefreshToken);

        // Update the original request with new token
        originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        tokenService.clearTokens();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Add a request interceptor to ensure token is set on each request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenService.getAccessToken();
    console.log("Request interceptor - token:", token ? "Found" : "Not found");

    if (token) {
      console.log("Setting Authorization header from tokenService");
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      console.log("No token available for request");
    }

    // Don't override Content-Type for FormData - let the browser set it with proper boundary
    if (config.data instanceof FormData) {
      console.log(
        "FormData detected, removing Content-Type header to let browser set it"
      );
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default axiosInstance;
