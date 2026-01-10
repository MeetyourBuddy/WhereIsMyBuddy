import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BuddyConnectionDocument = BuddyConnection & Document;

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked',
}

@Schema({ timestamps: true })
export class BuddyConnection {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requester: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(ConnectionStatus),
    default: ConnectionStatus.PENDING,
  })
  status: ConnectionStatus;

  @Prop({ type: Date })
  acceptedAt?: Date;

  @Prop({ type: Date })
  declinedAt?: Date;

  @Prop({ type: String, trim: true })
  message?: string; // Optional message with the request

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const BuddyConnectionSchema =
  SchemaFactory.createForClass(BuddyConnection);

// Compound index to ensure unique connections between users
BuddyConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Index for efficient queries
BuddyConnectionSchema.index({ requester: 1, status: 1 });
BuddyConnectionSchema.index({ recipient: 1, status: 1 });
