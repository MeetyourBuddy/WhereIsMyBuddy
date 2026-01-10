export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
  path?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}
