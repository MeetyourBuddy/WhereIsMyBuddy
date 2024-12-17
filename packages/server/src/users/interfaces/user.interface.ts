export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  interests?: string[];
  location?: {
    city: string;
    country: string;
  };
  hasCompletedOnboarding: boolean;
}
