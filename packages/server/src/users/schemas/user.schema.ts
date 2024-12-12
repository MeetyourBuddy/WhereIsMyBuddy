import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profilePicture?: string;

  @Prop()
  bio?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  refreshToken?: string;

  @Prop()
  lastTokenRefresh?: Date;

  @Prop()
  googleId?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: 'local', enum: ['local', 'google'] })
  provider: 'local' | 'google';

  createdAt: Date;
  updatedAt: Date;
  @Prop({ type: [String], default: [] })
  interests?: string[];

  @Prop({
    type: {
      city: String,
      country: String,
    },
  })
  location?: {
    city: string;
    country: string;
  };

  @Prop({ default: false })
  hasCompletedOnboarding: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
