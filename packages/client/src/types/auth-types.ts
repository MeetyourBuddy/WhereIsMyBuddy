export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  username: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  phoneNumber?: string;
  profileImage?: string;
  preferredLanguage?: Language;
  country?: Country;
  city?: string;
  interestsCategories?: InterestCategory[];
  interestsCommodities?: string[];
  collaborationStatus?: "open" | "occupied" | "undecided";
  linkedInUrl?: string;
  instagramUrl?: string;
  isActive?: boolean;
  goals?: string;
  gender?: "male" | "female" | "other";
  githubUrl?: string;
  portfolioUrl?: string;
  timezone?: string;
  isEmailVerified?: boolean;
  hasCompletedOnboarding?: boolean;
  provider?: string;
  profileLink?: string;
  profileQR?: string;
  createdAt?: string;
  updatedAt?: string;
  bannerImage?: string;
  avatar: string;
}

export interface AuthResponse {
  tokens: TokenPair;
  user: User;
}

export enum Language {}
// Add language enum values

export enum Country {}
// Add country enum values

export enum InterestCategory {}
// Add interest category enum values

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    tokens: TokenPair;
    user: User;
  };
  timestamp: string;
}

export interface LogoutResponse {
  message: string;
}
