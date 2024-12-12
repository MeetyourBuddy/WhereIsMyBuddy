import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { ServiceResponse } from './interfaces/common.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getUserProfile(userId: string): Promise<ServiceResponse<User>> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    };
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ServiceResponse<User>> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateUserDto },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: user,
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

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        interests: onboardingDto.interests,
        location: onboardingDto.location,
        hasCompletedOnboarding: true,
      },
      { new: true },
    );

    return {
      success: true,
      message: 'Onboarding completed successfully',
      data: updatedUser,
    };
  }

  async checkOnboardingStatus(userId: string): Promise<ServiceResponse<{ hasCompletedOnboarding: boolean }>> {
    const user = await this.userModel.findById(userId).select('hasCompletedOnboarding');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'Onboarding status retrieved',
      data: { hasCompletedOnboarding: user.hasCompletedOnboarding },
    };
  }
}