import { CheckInType } from '../schemas/checkin.schema';

export interface IParticipantStats {
  userId: string;
  name: string;
  checkInCount: number;
  completionRate: number;
  streak: number;
  lastCheckIn?: Date;
  averageCompletionTime?: number;
}

export interface IActivityStats {
  totalCheckIns: number;
  completionRate: number;
  participantStats: IParticipantStats[];
  checkInsByType: Record<CheckInType, number>;
  averageCompletionTime: number;
  mostActiveDay?: string;
  mostPopularCheckInType?: CheckInType;
  longestStreak: number;
  totalDurationInDays: number;
  averageDurationInDays: number;
}

export interface IStatsQueryParams {
  startDate?: Date;
  endDate?: Date;
  participantId?: string;
  checkInType?: CheckInType;
  isCompleted?: boolean;
  sortBy?: 'checkInCount' | 'completionRate' | 'streak';
  sortOrder?: 'asc' | 'desc';
}
