import { InterestCategory } from '../enums/interests.enum';
import { Country } from '../enums/location.enum';
import { Language } from '../enums/language.enum';

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  dateOfBirth?: Date;
  profilePicture?: string;
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
  collaborationStatus: 'open' | 'occupied' | 'undecided';
  linkedInUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
