import { Request } from 'express';
import { IUserResponse } from '../../interfaces/user.interface';
import { ServiceResponse } from '../../interfaces/common.interface';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    tokens: Tokens;
    user: IUserResponse;
  };
}

export interface GoogleUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  accessToken?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  tokenType: 'access' | 'refresh';
}

export interface GoogleAuthRequest extends Request {
  user: GoogleUser;
}

export type { IUserResponse, ServiceResponse };
