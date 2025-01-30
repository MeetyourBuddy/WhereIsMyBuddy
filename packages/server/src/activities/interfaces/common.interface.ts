export interface ActivityMetadata {
  availableSeats?: number;
  isJoinable?: boolean;
  durationInDays?: number;
  remainingDays?: number;
  total?: number;
  proposedEndDate?: Date;
}

export interface ActivityServiceResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
