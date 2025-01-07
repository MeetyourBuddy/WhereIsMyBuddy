export interface UserData {
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
  categories: string[];
  interests: string[];
  age?: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  goals?: string;
}
