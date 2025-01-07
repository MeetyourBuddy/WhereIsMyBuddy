import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto, PaginationQueryDto } from './dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { ServiceResponse } from './interfaces/common.interface';
import { SanitizeUpdateDto } from './dto/sanitize-update.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(query: PaginationQueryDto): Promise<ServiceResponse<User[]>> {
    const { limit = 10, offset = 0 } = query;
    const users = await this.userModel
      .find()
      .select('-password -refreshToken')
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.userModel.countDocuments();

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
    const user = await this.userModel
      .findById(userId)
      .select('-password -refreshToken');

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
    onboardingDto: CompleteOnboardingDto,
  ): Promise<ServiceResponse<User>> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.hasCompletedOnboarding) {
      throw new BadRequestException('User has already completed onboarding');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          dateOfBirth: onboardingDto.dateOfBirth,
          interestsCategories: onboardingDto.interestsCategories,
          country: onboardingDto.country,
          city: onboardingDto.city,
          hasCompletedOnboarding: true,
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
}
