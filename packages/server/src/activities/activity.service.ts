import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { User } from '../users/schemas/user.schema';
import { PopulatedActivity } from './entities/activity.entities';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    userId: string,
  ): Promise<PopulatedActivity> {
    try {
      const activity = new this.activityModel({
        ...createActivityDto,
        admin: userId,
        participants: [userId],
      });

      const savedActivity = await activity.save();

      if (!savedActivity?._id) {
        throw new BadRequestException('Failed to create activity');
      }

      return await this.findOne(savedActivity._id.toString(), userId);
    } catch (error) {
      console.error('Error in create:', error);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Failed to create activity');
    }
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
        .populate({
          path: 'admin',
          model: 'User',
        })
        .populate({
          path: 'participants',
          model: 'User',
        })
        .exec();
      return await this.activityModel
        .find({
          $or: [
            { type: 'public' },
            { participants: user._id },
            { admin: user._id },
          ],
        })
        .populate({
          path: 'admin',
          model: 'User',
        })
        .populate({
          path: 'participants',
          model: 'User',
        })
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

  async findOne(id: string, userId: string): Promise<PopulatedActivity> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid activity ID');
    }

    try {
      const activity = await this.activityModel
        .findById(id)
        .populate({
          path: 'admin',
          select:
            '_id name email avatar country preferredLanguage profileLink profileQR',
        })
        .populate({
          path: 'participants',
          select:
            '_id name email avatar country preferredLanguage profileLink profileQR',
        })
        .lean<PopulatedActivity>()
        .exec();

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      const isOwner = activity.admin?._id?.toString() === userId.toString();
      const isParticipant = activity.participants?.some(
        (p) => p._id?.toString() === userId.toString(),
      );

      const canAccess = activity.type === 'public' || isOwner || isParticipant;

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
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch activity');
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
