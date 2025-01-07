export interface IServiceResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
