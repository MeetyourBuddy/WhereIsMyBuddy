import { InterestCategory } from '@/lib/constants/category-interests-constants';

export interface IActivityRule {
  rule: string;
  isDefault: boolean;
}

export interface IActivityResponse {
  id: string;
  title: string;
  description?: string;
  proposedDuration: number;
  bannerImage?: string;
  type: 'public' | 'private';
  startDate: Date;
  joinType?: 'fixed' | 'flexible';
  categories?: string[];
  goals?: string[];
  tags?: string[];
  rules?: IActivityRule[];
  checkinFrequency: number;
  checkinFrequencyUnit: 'daily' | 'weekly' | 'monthly';
  checkinDays?: string[];
  checkinDatesOfMonth?: number[];
  checkinWeeksOfMonth?: number[];
  allowedCheckInTypes: string[];
  maxParticipants: number;
  category: InterestCategory;
}

export interface IActivity {
  id?: string;
  title: string;
  description?: string;
  proposedDuration: number;
  bannerImage?: string;
  type: 'public' | 'private';
  startDate: Date;
  joinType?: 'fixed' | 'flexible';
  categories?: string[];
  goals?: string[];
  tags?: string[];
  rules?: IActivityRule[];
  checkinFrequency: number;
  checkinFrequencyUnit: 'daily' | 'weekly' | 'monthly';
  checkinDays?: string[];
  checkinDatesOfMonth?: number[];
  checkinWeeksOfMonth?: number[];
  allowedCheckInTypes: string[];
  maxParticipants: number;
  category: InterestCategory;
}
