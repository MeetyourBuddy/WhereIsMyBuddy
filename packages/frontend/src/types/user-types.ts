import { Country, InterestCategory, Language } from '@/lib/constants';

export interface IUserData {
  _id: string;
  email: string;
  name: string;
  interestsCategories?: string[];
  interestsCommodities?: string[];
  preferredLanguage?: string;
  isActive?: boolean;
  profileImage?: string;
  bannerImage?: string;
  profileQR?: string;
  collaborationStatus?: 'open' | 'occupied' | 'undecided';
  createdAt?: string;
  updatedAt?: string;
  phoneNumber?: string;
  portfolioUrl?: string;
  timezone?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
  bio?: string;
  goals?: string;
  city?: string;
  country?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface IUserResponse {
  _id: string;
  email: string;
  name: string;
  dateOfBirth?: Date;
  age?: number;
  profileImage?: string;
  bio?: string;
  phoneNumber?: string;
  country?: Country;
  city?: string;
  interestsCategories?: InterestCategory[];
  interestsCommodities?: string[];
  preferredLanguage?: Language;
  isActive: boolean;
  isEmailVerified: boolean;
  hasCompletedOnboarding: boolean;
  provider: 'local' | 'google';
  profileLink: string;
  profileQR: string;
  goals?: string;
  gender?: 'male' | 'female' | 'other';
  collaborationStatus: 'open' | 'occupied' | 'undecided';
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  instagramUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicture?: string;
  timezone?: string;
}
