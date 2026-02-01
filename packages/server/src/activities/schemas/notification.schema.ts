import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  BUDDY_REQUEST = 'buddy_request',
  BUDDY_ACCEPTED = 'buddy_accepted',
  BUDDY_DECLINED = 'buddy_declined',
  ACTIVITY_INVITE = 'activity_invite',
  ACTIVITY_JOIN_REQUEST = 'activity_join_request',
  ACTIVITY_JOIN_REQUEST_DECLINED = 'activity_join_request_declined',
  ACTIVITY_COMMENT = 'activity_comment',
  CHECKIN_COMMENT = 'checkin_comment',
  MILESTONE_ACHIEVED = 'milestone_achieved',
  STREAK_MILESTONE = 'streak_milestone',
  ACTIVITY_REMINDER = 'activity_reminder',
  GOAL_REMINDER = 'goal_reminder',
  SYSTEM_WELCOME = 'system_welcome',
  ACTIVITY_CREATED = 'activity_created',
  BOOST = 'boost',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Notification {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender?: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(NotificationType) })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    enum: Object.values(NotificationPriority),
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Date })
  readAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Activity' })
  activityId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CheckIn' })
  checkInId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'BuddyConnection' })
  buddyConnectionId?: Types.ObjectId;

  @Prop({ type: Object })
  metadata?: any;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes for better performance
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ type: 1 });
