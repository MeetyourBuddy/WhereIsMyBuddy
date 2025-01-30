import { CheckInType } from './checkin-type.interface';

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
  mostActiveDay: string;
  mostPopularCheckInType: CheckInType | null;
  longestStreak: number;
  totalDurationInDays: number;
  averageDurationInDays: number;
  availableSeats: number;
  isJoinable: boolean;
}

export interface IStatsQueryParams {
  startDate?: string;
  endDate?: string;
  participantId?: string;
  checkInType?: CheckInType;
  sortBy?: keyof IParticipantStats;
  sortOrder?: 'asc' | 'desc';
}
