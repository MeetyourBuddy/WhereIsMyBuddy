export interface IUserData {
  id: string;
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
