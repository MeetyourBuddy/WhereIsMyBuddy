import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityInvitationDocument = ActivityInvitation & Document;

@Schema({ timestamps: true })
export class ActivityInvitation {
  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  activityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  fromUserId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  toUserId?: Types.ObjectId;

  @Prop({ type: String, required: false })
  toEmail?: string;

  @Prop({ type: String, required: false, maxlength: 500 })
  message?: string;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'declined' | 'expired';

  @Prop({ type: String, required: false, unique: true, sparse: true })
  invitationToken?: string;

  @Prop({ type: Date, default: Date.now })
  expiresAt: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ActivityInvitationSchema =
  SchemaFactory.createForClass(ActivityInvitation);

// Add indexes for better performance
ActivityInvitationSchema.index({ activityId: 1, fromUserId: 1 });
ActivityInvitationSchema.index({ toUserId: 1, status: 1 });
ActivityInvitationSchema.index({ toEmail: 1, status: 1 });
ActivityInvitationSchema.index({ invitationToken: 1 });
ActivityInvitationSchema.index({ activityId: 1, toEmail: 1 });
// TTL index for automatic expiration
ActivityInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

