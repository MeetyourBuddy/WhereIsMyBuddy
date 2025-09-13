import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoostMessageDocument = BoostMessage & Document;

@Schema({ timestamps: true })
export class BoostMessage {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipientId: Types.ObjectId;

  @Prop({ required: true })
  messageId: string;

  @Prop({ type: Types.ObjectId, ref: 'Activity', required: false })
  activityId?: Types.ObjectId;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: false })
  read: boolean;
}

export const BoostMessageSchema = SchemaFactory.createForClass(BoostMessage);
