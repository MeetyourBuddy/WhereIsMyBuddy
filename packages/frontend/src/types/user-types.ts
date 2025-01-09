export interface IUserData {
  name: string;
  country: string;
  email: string;
  city: string;
  bio?: string;
  profileLink?: string;
  collaborationStatus: 'open' | 'closed' | 'undecided';
  portfolio?: string;
  github?: string;
  linkedin?: string;
  preferredLanguage: string;
  interestsCategories: string[];
  interestsCommodities: string[];
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  goals?: string;
}
