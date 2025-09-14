import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PartnerDocument = Partner & Document;

@Schema({ timestamps: true })
export class Partner {
  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  activityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  invitedBy: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  })
  partnerStatus: 'active' | 'inactive';

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);

// Add indexes for better performance
PartnerSchema.index({ activityId: 1, userId: 1 }, { unique: true });
PartnerSchema.index({ userId: 1, status: 1 });
PartnerSchema.index({ activityId: 1, status: 1 });
