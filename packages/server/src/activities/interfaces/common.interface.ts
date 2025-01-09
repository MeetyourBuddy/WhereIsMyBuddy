export interface ActivityServiceResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    total?: number;
    offset?: number;
    limit?: number;
    availableSeats?: number;
    isJoinable?: boolean;
  };
} 