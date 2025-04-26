import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    user: User,
  ): Promise<Activity> {
    console.log('User object:', user);

  async create(
    createActivityDto: CreateActivityDto,
    user: User,
  ): Promise<Activity> {
    console.log('Creating activity for user:', user);

    const activity = new this.activityModel({
      ...createActivityDto,
      admin: new Types.ObjectId(user.id),
      participants: [new Types.ObjectId(user.id)],
      currentSize: 1,
      isActive: true,
    });

    return activity.save();
  }

  async findAll(user: User): Promise<Activity[]> {
    try {
      return await this.activityModel
        .find({
          $or: [
            { type: 'public' },
            { participants: user._id },
            { admin: user._id },
          ],
        })
        .populate('admin', 'name email avatar')
        .populate('participants', 'name email avatar')
        .exec();
      return await this.activityModel
        .find({
          $or: [
            { type: 'public' },
            { participants: user._id },
            { admin: user._id },
          ],
        })
        .populate('admin', 'name email avatar')
        .populate('participants', 'name email avatar')
        .exec();
    } catch (error) {
      throw new BadRequestException(
        'Failed to fetch activities: ' + error.message,
      );
      throw new BadRequestException(
        'Failed to fetch activities: ' + error.message,
      );
    }
  }

  async findOne(id: string, user: User): Promise<Activity> {
    try {
      const activity = await this.activityModel
        .findOne({
          _id: id,
          $or: [
            { type: 'public' },
            { participants: user._id },
            { admin: user._id },
          ],
        })
        .populate('admin', 'name email avatar')
        .populate('participants', 'name email avatar')
        .exec();
      const activity = await this.activityModel
        .findById(id)
        .populate('admin')
        .populate('participants')
        .exec();

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      const canAccess = 
        activity.type === 'public' ||
        activity.admin?.id === user.id ||
        activity.participants?.some(p => p.id === user.id);

      if (!canAccess) {
        throw new NotFoundException('Activity not found or unauthorized');
      }

      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to fetch activity: ' + error.message,
      );
      console.error('Error in findOne:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
    user: User,
  ): Promise<Activity> {
  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
    user: User,
  ): Promise<Activity> {
    try {
      const activity = await this.activityModel.findOne({
        _id: id,
        admin: user._id, // Only admin can update
        admin: user._id, // Only admin can update
      });

      if (!activity) {
        throw new NotFoundException('Activity not found or unauthorized');
      }

      Object.assign(activity, updateActivityDto);
      return await activity.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to update activity: ' + error.message,
      );
      throw new BadRequestException(
        'Failed to update activity: ' + error.message,
      );
    }
  }

  async delete(id: string, user: User): Promise<void> {
    try {
      const result = await this.activityModel.deleteOne({
        _id: id,
        admin: user._id, // Only admin can delete
        admin: user._id, // Only admin can delete
      });

      if (result.deletedCount === 0) {
        throw new NotFoundException('Activity not found or unauthorized');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to delete activity: ' + error.message,
      );
      throw new BadRequestException(
        'Failed to delete activity: ' + error.message,
      );
    }
  }
}

}
