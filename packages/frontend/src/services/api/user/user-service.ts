import axiosInstance from '../axios-instance';
import { AxiosResponse } from 'axios';
import { IUser } from '@/types/auth-types';

class UserService {
  async getUser(): Promise<AxiosResponse<IUser>> {
    const response = await axiosInstance.get<IUser>('/auth/user');
    return response;
  }

  async updateUser(data: IUser): Promise<AxiosResponse<IUser>> {
    const response = await axiosInstance.put<IUser>('/auth/user', data);
    return response;
  }
}

export const userService = new UserService();
