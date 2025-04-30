import { Country, Language } from "@/lib/constants";
import { InterestCategory } from "./interest-categories.enum";
import { User } from "./auth-types";

export interface UserData {
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
  collaborationStatus?: "open" | "occupied" | "undecided";
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
  gender?: "male" | "female" | "other";
}

export interface IUserResponse {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
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
  provider: "local" | "google";
  profileLink: string;
  profileQR: string;
  goals?: string;
  gender?: "male" | "female" | "other";
  collaborationStatus: "open" | "occupied" | "undecided";
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  instagramUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicture?: string;
  timezone?: string;
}

export interface UserResponse {
  data: User;
  message: string;
  success: boolean;
  timestamp: string;
}
