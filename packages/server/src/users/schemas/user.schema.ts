import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Country } from '../enums/location.enum';
import { InterestCategory } from '../enums/interests.enum';
import { Language } from '../enums/language.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    },
  },
})
export class User {
  // Basic Info
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;
  
  // Location
  @Prop({ type: String, enum: Object.values(Country) })
  country?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true })
  bio?: string;

  @Prop({ trim: true })
  profilePicture?: string;

  @Prop({ trim: true })
  phoneNumber?: string;

  // Interests
  @Prop({
    type: [String],
    enum: Object.values(InterestCategory),
    default: [],
  })
  interestsCategories: InterestCategory[];

  @Prop({ type: [String], default: [] })
  interestsCommodities: string[];

  // Language Settings
  @Prop({
    type: String,
    enum: Object.values(Language),
    default: Language.ENGLISH,
  })
  preferredLanguage: string;

  // Status & Settings
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  hasCompletedOnboarding: boolean;

  // Authentication
  @Prop()
  refreshToken?: string;

  @Prop()
  lastTokenRefresh?: Date;

  @Prop()
  googleId?: string;

  @Prop({ default: 'local', enum: ['local', 'google'] })
  provider: 'local' | 'google';

  // Profile & Social
  @Prop({ required: true, unique: true, trim: true })
  profileLink: string;

  @Prop({ required: true, unique: true })
  profileQR: string;

  @Prop({ trim: true })
  goals?: string;

  @Prop({ required: true })
  age?: number;

  @Prop({ 
    required: false,
    enum: ['male', 'female', 'other'],
   })
  gender?: 'male' | 'female' | 'other';

  @Prop({
    required: true,
    default: 'open',
    enum: ['open', 'occupied', 'undecided'],
  })
  collaborationStatus: 'open' | 'occupied' | 'undecided';

  @Prop({ trim: true })
  linkedInUrl?: string;

  @Prop({ trim: true })
  githubUrl?: string;

  @Prop({ trim: true })
  portfolioUrl?: string;

  @Prop({ trim: true })
  instagramUrl?: string;

  @Prop({ trim: true })
  timezone?: string;

  // Timestamps (added by schema options)
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
