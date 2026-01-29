import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto, UserSearchQueryDto } from './dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { ServiceResponse } from './interfaces/common.interface';
import { SanitizeUpdateDto } from './dto/sanitize-update.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(
    query: UserSearchQueryDto,
    currentUserId?: string,
  ): Promise<ServiceResponse<User[]>> {
    const { limit = 20, offset = 0, search, interests, country, city } = query;

    // Build search query
    const searchQuery: any = {};

    // Exclude current user
    if (currentUserId) {
      searchQuery._id = { $ne: currentUserId };
    }

    // Text search
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { interests: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Interest filter
    if (interests && interests.length > 0) {
      searchQuery.interests = { $in: interests };
    }

    // Location filters
    if (country) searchQuery.country = country;
    if (city) searchQuery.city = { $regex: city, $options: 'i' };

    const users = await this.userModel
      .find(searchQuery)
      .select('-password -refreshToken -email')
      .sort({ createdAt: -1 }) // Newest users first by default
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.userModel.countDocuments(searchQuery);

    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      metadata: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total,
      },
    };
  }

  async getUser(userId: string): Promise<ServiceResponse<User>> {
    // Clean the userId by removing any quotes and trimming whitespace
    const cleanUserId = userId.replace(/['"]+/g, '').trim();

    console.log('Original userId:', userId);
    console.log('Cleaned userId:', cleanUserId);
    console.log('Is valid ObjectId:', Types.ObjectId.isValid(cleanUserId));

    if (!Types.ObjectId.isValid(cleanUserId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const objectId = new Types.ObjectId(cleanUserId);
    console.log('Converted ObjectId:', objectId.toString());

    const user = await this.userModel
      .findById(objectId)
      .select('-password -refreshToken -email');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ServiceResponse<User>> {
    const sanitizedUpdate = SanitizeUpdateDto.sanitize(updateUserDto);

    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: sanitizedUpdate }, { new: true })
      .select('-password -refreshToken');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: user,
    };
  }

  async delete(userId: string): Promise<ServiceResponse<null>> {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User deleted successfully',
      data: null,
    };
  }

  async completeOnboarding(
    userId: string,
    onboardingDto: CompleteOnboardingDto[],
  ): Promise<ServiceResponse<User>> {
    // Clean the userId and validate
    const cleanUserId = userId.replace(/['"]+/g, '').trim();

    if (!Types.ObjectId.isValid(cleanUserId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const objectId = new Types.ObjectId(cleanUserId);
    const user = await this.userModel.findById(objectId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.hasCompletedOnboarding) {
      throw new BadRequestException('User has already completed onboarding');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        objectId,
        {
          $set: {
            ...onboardingDto,
            hasCompletedOnboarding: true,
          },
        },
        { new: true },
      )
      .select('-password -refreshToken');

    return {
      success: true,
      message: 'Onboarding completed successfully',
      data: updatedUser,
    };
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
