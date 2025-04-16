import { Categories } from '../enums/interest-categories.enum';
import { CountryCode } from '../enums/country.enum';
import { Language } from '../enums/language.enum';

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  dateOfBirth?: Date;
  age?: number;
  profileImage?: string;
  bio?: string;
  phoneNumber?: string;
  country?: CountryCode;
  city?: string;
  interestsCategories?: Categories[];
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
  avatar: string;
}
