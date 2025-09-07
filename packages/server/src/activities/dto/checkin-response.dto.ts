import { Expose, Type } from 'class-transformer';

export class UserCheckInDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  avatar?: string;

  @Expose()
  profileImage?: string;
}

export class CheckInResponseDto {
  @Expose()
  _id: string;

  @Expose()
  activity: string;

  @Expose()
  @Type(() => UserCheckInDto)
  user: UserCheckInDto;

  @Expose()
  type: 'text' | 'image';

  @Expose()
  content: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  fileId?: string;

  @Expose()
  scheduledDate: Date;

  @Expose()
  checkInDate: Date;

  @Expose()
  isOnTime: boolean;

  @Expose()
  likes: number;

  @Expose()
  likedBy: string[];

  @Expose()
  hasUserLiked: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class CheckInStatsDto {
  @Expose()
  totalCheckIns: number;

  @Expose()
  currentStreak: number;

  @Expose()
  longestStreak: number;

  @Expose()
  onTimePercentage: number;

  @Expose()
  lastCheckInDate?: Date;

  @Expose()
  nextScheduledDate?: Date;
}
