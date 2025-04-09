import axiosInstance from '../../axios-instance';
import { IUserData } from '@/types/user-types';
import { IServiceResponse } from '@/types';
import { IUser } from '@/types/auth-types';

class UserService {
  async getUser(): Promise<IServiceResponse<IUserData>> {
    const { data } = await axiosInstance.get<IUserData>('/auth/user');
    return {
      success: true,
      data,
      message: 'User fetched successfully'
    };
  }

  async updateUser(id: string, data: Partial<IUserData>): Promise<IServiceResponse<IUserData>> {
    const { data: responseData } = await axiosInstance.put<IUserData>(`/users/${id}`, data);
    return {
      success: true,
      data: responseData,
      message: 'User updated successfully'
    };
  }

  async getMe(): Promise<IServiceResponse<IUser>> {
    const { data } = await axiosInstance.get<IUser>('/users/my-profile');
    return {
      success: true,
      data,
      message: 'User fetched successfully'
    };
  }
}

export const userService = new UserService();
