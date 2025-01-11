import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { ActivityServiceResponse } from './interfaces/common.interface';
import { IActivityResponse } from './interfaces/activity.interface';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
  ) {}

  async create(
    userId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<ActivityServiceResponse<IActivityResponse>> {
    const createdActivity = new this.activityModel({
      ...createActivityDto,
      admin: userId,
      currentSize: 1,
      participants: [userId],
    });

    const activity = await createdActivity.save();
    const responseData = plainToClass(ActivityResponseDto, activity.toJSON());

    return {
      success: true,
      message: 'Activity created successfully',
      data: responseData,
      metadata: {
        availableSeats: responseData.availableSeats,
        isJoinable: true,
      },
    };
  }

  async findOne(
    id: string,
  ): Promise<ActivityServiceResponse<IActivityResponse>> {
    const activity = await this.activityModel
      .findById(id)
      .populate('admin', 'name email profilePicture')
      .populate('participants', 'name email profilePicture')
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const responseData = plainToClass(ActivityResponseDto, activity.toJSON());

    return {
      success: true,
      message: 'Activity retrieved successfully',
      data: responseData,
      metadata: {
        availableSeats: responseData.availableSeats,
        isJoinable: responseData.currentSize < responseData.maxSize,
      },
    };
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityServiceResponse<IActivityResponse>> {
    const updatedActivity = await this.activityModel
      .findByIdAndUpdate(id, updateActivityDto, { new: true })
      .populate('admin', 'name email profilePicture')
      .populate('participants', 'name email profilePicture')
      .exec();

    if (!updatedActivity) {
      throw new NotFoundException('Activity not found');
    }

    const responseData = plainToClass(
      ActivityResponseDto,
      updatedActivity.toJSON(),
    );

    return {
      success: true,
      message: 'Activity updated successfully',
      data: responseData,
      metadata: {
        availableSeats: responseData.availableSeats,
        isJoinable: responseData.currentSize < responseData.maxSize,
      },
    };
  }
}
