import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReactionDocument = Reaction & Document;

@Schema({ timestamps: true })
export class Reaction {
  @Prop({ type: Types.ObjectId, ref: 'CheckIn', required: true })
  checkIn: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['like', 'love', 'fire', 'rock', 'celebrate', 'support'],
    required: true,
  })
  type: 'like' | 'love' | 'fire' | 'rock' | 'celebrate' | 'support';

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);

// Create compound index to ensure one reaction per user per check-in
ReactionSchema.index({ checkIn: 1, user: 1 }, { unique: true });
