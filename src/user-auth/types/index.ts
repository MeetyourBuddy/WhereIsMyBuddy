import { Request } from 'express';
import { Model, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  refreshToken?: string | null;
  isActive?: boolean;
  lastLogin?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user: IUser;
}
