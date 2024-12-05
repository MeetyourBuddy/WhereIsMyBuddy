import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '../types';

@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.password;
      delete ret.refreshToken;
      delete ret.__v;
      return ret;
    },
  },
})
export class User implements Omit<IUser, '_id'> {
  @Prop({
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  })
  name: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email address',
    ],
  })
  email: string;

  @Prop({
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  })
  password: string;

  @Prop({
    default: null,
    type: String,
  })
  refreshToken: string | null;

  @Prop({
    default: true,
    type: Boolean,
  })
  isActive: boolean;

  @Prop({
    default: null,
    type: Date,
  })
  lastLogin: Date | null;

  @Prop({
    default: null,
    type: Date,
  })
  lastLogout: Date | null;

  @Prop({
    default: null,
    type: Date,
  })
  lastTokenRefresh: Date | null;

  @Prop({
    default: Date.now,
    type: Date,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
    type: Date,
  })
  updatedAt: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ refreshToken: 1 }, { sparse: true });

// Add instance methods
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.__v;
  return user;
};

// Add static methods
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Add pre-save middleware
UserSchema.pre('save', function (next) {
  if (!this.isModified('email')) {
    return next();
  }
  this.email = this.email.toLowerCase();
  next();
});
