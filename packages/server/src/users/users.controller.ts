import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { GetUser } from './auth/decorators/get-user.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { ServiceResponse } from './interfaces/common.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user profile',
    type: User,
  })
  async getProfile(
    @GetUser('userId') userId: string,
  ): Promise<ServiceResponse<User>> {
    return this.usersService.getUserProfile(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: User,
  })
  async updateProfile(
    @GetUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ServiceResponse<User>> {
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Put('onboarding')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete user onboarding' })
  @ApiResponse({
    status: 200,
    description: 'Onboarding completed successfully',
    type: User,
  })
  async completeOnboarding(
    @GetUser('userId') userId: string,
    @Body() onboardingDto: CompleteOnboardingDto,
  ): Promise<ServiceResponse<User>> {
    return this.usersService.completeOnboarding(userId, onboardingDto);
  }

  @Get('onboarding/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check onboarding status' })
  @ApiResponse({
    status: 200,
    description: 'Returns onboarding status',
    type: Boolean,
  })
  async checkOnboardingStatus(
    @GetUser('userId') userId: string,
  ): Promise<ServiceResponse<{ hasCompletedOnboarding: boolean }>> {
    return this.usersService.checkOnboardingStatus(userId);
  }
}
