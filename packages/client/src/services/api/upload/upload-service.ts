import { apiMethods } from "@/services/api-methods";

export interface UploadResponse {
  success: boolean;
  fileId: string;
  message: string;
}

export const UploadService = {
  uploadImage: (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    // Don't set Content-Type header - let the browser set it with proper boundary
    return apiMethods.post<UploadResponse>("/uploads", formData);
  },

  getImageUrl: (fileId: string): string => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    // Ensure we don't double the /api path
    const cleanBaseUrl = baseUrl.endsWith("/api")
      ? baseUrl.slice(0, -4)
      : baseUrl;
    return `${cleanBaseUrl}/api/uploads/${fileId}`;
  },
};
