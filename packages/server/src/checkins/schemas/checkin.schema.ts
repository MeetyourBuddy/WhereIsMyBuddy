import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CheckInDocument = CheckIn & Document;

@Schema({ timestamps: true })
export class CheckIn {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  activityId: string;

  @Prop({ required: true, enum: ['text', 'image'] })
  type: 'text' | 'image';

  @Prop({ required: true })
  content: string;

  @Prop()
  mediaUrl?: string;

  @Prop({ default: [] })
  likes: string[]; // Array of userIds who liked this check-in

  @Prop({ default: 0 })
  commentCount: number;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);

// Add indexes
CheckInSchema.index({ activityId: 1, createdAt: -1 });
CheckInSchema.index({ userId: 1, createdAt: -1 }); 