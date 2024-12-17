import { Profile as GoogleProfile } from 'passport-google-oauth20';

export interface ValidatedUser {
  userId: string;
  email: string;
}

export interface ValidatedGoogleUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  accessToken: string;
}

export type GoogleValidateResponse = Partial<GoogleProfile> & {
  emails: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
};
