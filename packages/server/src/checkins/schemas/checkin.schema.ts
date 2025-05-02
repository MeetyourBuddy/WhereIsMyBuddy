import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CheckInDocument = CheckIn & Document;

@Schema({ timestamps: true })
export class CheckIn {
  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  activityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['text', 'image'],
    required: true 
  })
  type: 'text' | 'image' ;

  @Prop({ type: String, required: true })
  content: string;

  // For media uploads (optional)
  @Prop({ type: String })
  mediaUrl?: string;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn); 