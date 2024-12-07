import { Request } from 'express';
import { Model } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  refreshToken: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  lastLogout: Date | null;
  lastTokenRefresh: Date | null;
  createdAt: Date;
  updatedAt: Date;
  googleId?: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
}

export interface UserDocument extends IUser {
  toJSON(): Omit<IUser, 'password' | 'refreshToken'>;
}

export interface UserModel extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
}

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

export interface JwtUser {
  sub: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: JwtUser;
}

export interface PublicUser {
  _id: string;
  name?: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user: PublicUser;
}
