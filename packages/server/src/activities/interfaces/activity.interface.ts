import { UserResponseDto } from '../../users/dto/user-response.dto';
import {
  ActivityType,
  JoinType,
  ContactFrequency,
} from '../schemas/activity.schema';

// Defines the structure of Activity data in API responses
export interface IActivityResponse {
  id: string;
  title: string;
  description: string;
  admin: UserResponseDto;
  proposedDuration: number;
  bannerImage?: string;
  contactFrequency: ContactFrequency;
  type: ActivityType;
  startDate?: Date;
  joinType: JoinType;
  maxSize: number;
  currentSize: number;
  tags: string[];
  rules: Array<{ rule: string; isDefault: boolean }>;
  participants: UserResponseDto[];
  isActive: boolean;
  availableSeats: number;
  createdAt: Date;
  updatedAt: Date;
}

// Query parameters interface for filtering activities
export interface IActivityQueryParams {
  type?: ActivityType;
  joinType?: JoinType;
  contactFrequency?: ContactFrequency;
  hasAvailableSeats?: boolean;
  tags?: string[];
  isActive?: boolean;
  adminId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
}

// Interface for activity statistics
export interface IActivityStats {
  totalParticipants: number;
  availableSeats: number;
  participationRate: number;
  isJoinable: boolean;
}
