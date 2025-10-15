import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BadgeDocument = Badge & Document;

@Schema({ timestamps: true, _id: false })
export class BadgeCriteria {
  @Prop({
    required: true,
    enum: ['checkins', 'streak', 'progress', 'onTime', 'activity_completion'],
  })
  type: 'checkins' | 'streak' | 'progress' | 'onTime' | 'activity_completion';

  @Prop({ required: true })
  value: number;

  @Prop({ type: Types.ObjectId, ref: 'Activity' })
  activityId?: Types.ObjectId;

  @Prop({ required: true })
  description: string;
}

const BadgeCriteriaSchema = SchemaFactory.createForClass(BadgeCriteria);

@Schema({ timestamps: true })
export class Badge {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: BadgeCriteriaSchema, required: true })
  criteria: BadgeCriteria;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 1 })
  rarity: number; // 1-5, where 5 is most rare

  @Prop([String])
  tags: string[];

  // Virtual fields
  createdAt: Date;
  updatedAt: Date;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
