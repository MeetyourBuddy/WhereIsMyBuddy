import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import {
  UpdateUserDto,
  PaginationQueryDto,
  CompleteOnboardingDto,
  UserResponseDto,
} from './dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user profile',
    type: UserResponseDto,
  })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get('my-profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user profile',
    type: UserResponseDto,
  })
  getProfile(@GetUser('userId') userId: string) {
    return this.usersService.getUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  updateProfile(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Ensure users can only update their own profile
    if (id !== userId) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Put(':id/onboarding')
  @ApiOperation({ summary: 'Complete user onboarding' })
  completeOnboarding(
    @Param('id') id: string,
    @Body() onboardingDto: CompleteOnboardingDto,
  ) {
    return this.usersService.completeOnboarding(id, onboardingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
