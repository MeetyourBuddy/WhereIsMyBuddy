import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserSettingsDocument = UserSettings & Document;

@Schema({ timestamps: true })
export class UserSettings {
  @Prop({ required: true, unique: true })
  userId: string;

  // App Experience Preferences
  @Prop({ default: 'detailed', enum: ['detailed', 'compact'] })
  dashboardLayout: string;

  @Prop({ default: 'cards', enum: ['cards', 'list'] })
  activityDisplay: string;

  @Prop({ default: 25, min: 5, max: 100 })
  buddyRadius: number;

  @Prop({ default: false })
  autoAcceptBuddies: boolean;

  // Notification Settings
  @Prop({ default: true })
  emailNotifications: boolean;

  @Prop({ default: true })
  pushNotifications: boolean;

  @Prop({ default: true })
  buddyRequestNotifications: boolean;

  @Prop({ default: true })
  activityReminderNotifications: boolean;

  @Prop({ default: true })
  milestoneNotifications: boolean;

  @Prop({ default: false })
  newsletterNotifications: boolean;

  @Prop({ default: false })
  quietHours: boolean;

  @Prop({ default: '22:00' })
  quietHoursStart: string;

  @Prop({ default: '08:00' })
  quietHoursEnd: string;

  // Privacy Settings
  @Prop({ default: true })
  publicProfile: boolean;

  @Prop({ default: true })
  showActivity: boolean;

  @Prop({ default: false })
  showLocation: boolean;

  @Prop({ default: true })
  showInterests: boolean;

  @Prop({ default: 'public', enum: ['public', 'friends', 'private'] })
  profileVisibility: string;

  @Prop({ default: 'city', enum: ['country', 'city', 'none'] })
  locationSharing: string;

  // Account Settings
  @Prop({ default: false })
  twoFactorAuth: boolean;

  @Prop({ default: true })
  loginNotifications: boolean;

  @Prop({ default: 30, min: 5, max: 1440 }) // minutes
  sessionTimeout: number;

  @Prop({
    default: 'indefinite',
    enum: ['30days', '90days', '1year', 'indefinite'],
  })
  dataRetention: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
