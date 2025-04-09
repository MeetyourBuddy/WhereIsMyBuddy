import axiosInstance from "@/services/axios-instance";
import { tokenService } from "@/services/token/token-service";
import {
  SignInCredentials,
  SignUpData,
  LogoutResponse,
} from "@/types/auth-types";
import { ApiResponse } from "@/types";
import { User } from "@/types/auth-types";

class AuthService {
  async login(credentials: SignInCredentials): Promise<ApiResponse<User>> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      "/auth/login",
      credentials
    );
    return response.data;
  }

  async register(userData: SignUpData): Promise<ApiResponse<User>> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      "/auth/register",
      userData
    );
    return response.data;
  }

  async googleLogin(credential: string): Promise<ApiResponse<User>> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      "/auth/google/callback",
      {
        credential,
      }
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
