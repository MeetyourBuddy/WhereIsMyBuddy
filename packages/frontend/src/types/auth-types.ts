export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  interestsCategories?: string[];
  interestsCommodities?: string[];
  preferredLanguage?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  hasCompletedOnboarding?: boolean;
  provider?: string;
  profileLink?: string;
  profileQR?: string;
  collaborationStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
}

export interface AuthResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      tokens: TokenPair;
      user: IUser;
    };
  };
  timestamp: string;
}

export interface LogoutResponse {
  message: string;
}
