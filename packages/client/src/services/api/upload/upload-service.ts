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

    return apiMethods.post<UploadResponse>("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getImageUrl: (fileId: string): string => {
    return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/uploads/${fileId}`;
  },
};
