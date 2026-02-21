import { apiMethods } from "@/services/api-methods";
import { API_CONFIG } from "@/services/api/config";

export interface UploadResponse {
  success: boolean;
  fileId: string;
  message: string;
}

export const UploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiMethods.post<UploadResponse>("/uploads", formData);
    return (response as unknown as UploadResponse);
  },

  getImageUrl: (fileId: string): string => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || API_CONFIG.baseURL;
    const cleanBaseUrl = baseUrl.endsWith("/api")
      ? baseUrl.slice(0, -4)
      : baseUrl;
    return `${cleanBaseUrl}/api/uploads/${fileId}`;
  },
};
