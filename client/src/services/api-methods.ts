import axiosInstance from "./axios-instance";
import { ApiResponse } from "../types";

export const apiMethods = {
  get: async <T>(url: string, config?: { params?: any }) => {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  // post: async <T>(url: string, data?: unknown) => {
  //   const response = await api.post<ApiResponse<T>>(url, data);
  //   return response.data;
  // },
  post: async <T>(
    url: string,
    data?: FormData | unknown,
    headers?: Record<string, string>
  ) => {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, {
      headers,
    }); // Passing headers to api.post
    return response.data;
  },

  put: async <T>(url: string, data: unknown) => {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data);
    return response.data;
  },

  patch: async <T>(url: string, data: unknown) => {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data);
    return response.data;
  },

  delete: async <T>(url: string) => {
    const response = await axiosInstance.delete<ApiResponse<T>>(url);
    return response.data;
  },
};
