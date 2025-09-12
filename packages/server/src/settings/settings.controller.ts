import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
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
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { SettingsService } from './settings.service';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { UpdatePreferencesDto } from '../users/dto/update-preferences.dto';
import { UpdateNotificationsDto } from '../users/dto/update-notifications.dto';
import { UpdatePrivacyDto } from '../users/dto/update-privacy.dto';
import { UpdateAccountDto } from '../users/dto/update-account.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('test')
  @Public()
  @ApiOperation({ summary: 'Test settings endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Settings endpoint is working',
  })
  async testSettings() {
    return { message: 'Settings endpoint is working!', timestamp: new Date() };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile and settings' })
  @ApiResponse({
    status: 200,
    description: 'User profile and settings retrieved successfully',
  })
  async getUserProfileWithSettings(@GetUser('userId') userId: string) {
    return this.settingsService.getUserProfileWithSettings(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile information' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiBody({ type: UpdateProfileDto })
  async updateProfile(
    @GetUser('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.settingsService.updateProfile(userId, updateProfileDto);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
  })
  @ApiBody({ type: UpdatePreferencesDto })
  async updatePreferences(
    @GetUser('userId') userId: string,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    return this.settingsService.updatePreferences(userId, updatePreferencesDto);
  }

  @Put('notifications')
  @ApiOperation({ summary: 'Update notification settings' })
  @ApiResponse({
    status: 200,
    description: 'Notification settings updated successfully',
  })
  @ApiBody({ type: UpdateNotificationsDto })
  async updateNotifications(
    @GetUser('userId') userId: string,
    @Body() updateNotificationsDto: UpdateNotificationsDto,
  ) {
    return this.settingsService.updateNotifications(
      userId,
      updateNotificationsDto,
    );
  }

  @Put('privacy')
  @ApiOperation({ summary: 'Update privacy settings' })
  @ApiResponse({
    status: 200,
    description: 'Privacy settings updated successfully',
  })
  @ApiBody({ type: UpdatePrivacyDto })
  async updatePrivacy(
    @GetUser('userId') userId: string,
    @Body() updatePrivacyDto: UpdatePrivacyDto,
  ) {
    return this.settingsService.updatePrivacy(userId, updatePrivacyDto);
  }

  @Put('account')
  @ApiOperation({ summary: 'Update account settings' })
  @ApiResponse({
    status: 200,
    description: 'Account settings updated successfully',
  })
  @ApiBody({ type: UpdateAccountDto })
  async updateAccount(
    @GetUser('userId') userId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.settingsService.updateAccount(userId, updateAccountDto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @GetUser('userId') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.settingsService.changePassword(userId, changePasswordDto);
  }

  @Get('export-data')
  @ApiOperation({ summary: 'Export user data' })
  @ApiResponse({
    status: 200,
    description: 'User data exported successfully',
  })
  async exportUserData(@GetUser('userId') userId: string) {
    return this.settingsService.exportUserData(userId);
  }

  @Delete('account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
  })
  async deleteAccount(@GetUser('userId') userId: string) {
    return this.settingsService.deleteAccount(userId);
  }
}
