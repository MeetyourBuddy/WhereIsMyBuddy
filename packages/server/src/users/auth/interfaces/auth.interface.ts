export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: IUserResponse;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  googleId: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Import IUserResponse from users interfaces
import { IUserResponse } from '../../interfaces/user.interface';
export { IUserResponse };