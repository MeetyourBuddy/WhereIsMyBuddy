import axiosInstance from "@/services/axios-instance";
import { tokenService } from "@/services/token/token-service";
import {
  SignInCredentials,
  SignUpData,
  LogoutResponse,
  AuthResponse,
} from "@/types/auth-types";
import { ApiResponse } from "@/types";

class AuthService {
  async login(
    credentials: SignInCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    return response.data;
  }

  async register(userData: SignUpData): Promise<ApiResponse<AuthResponse>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      userData
    );
    return response.data;
  }

  async logout(): Promise<ApiResponse<LogoutResponse>> {
    try {
      const response =
        await axiosInstance.post<ApiResponse<LogoutResponse>>("/auth/logout");
      tokenService.clearTokens();
      return response.data;
    } catch (error) {
      tokenService.clearTokens();
      throw error;
    }
  }
}

export const authService = new AuthService();
