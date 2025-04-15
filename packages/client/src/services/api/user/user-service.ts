import axiosInstance from "../../axios-instance";
import { ApiResponse } from "@/types";
import { User } from "@/types/auth-types";
import { UserResponse } from "@/types/user-types";

class UserService {
  async getUser(): Promise<UserResponse> {
    const response = await axiosInstance.get<UserResponse>("/auth/user");

    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<UserResponse> {
    const response = await axiosInstance.put<UserResponse>(
      `/users/${id}`,
      data
    );

    return response.data;
  }

  async getMe(): Promise<UserResponse> {
    const response = await axiosInstance.get<UserResponse>("/users/my-profile");

    console.log("response data in get me", response.data);

    return response.data;
  }
}

export const userService = new UserService();
