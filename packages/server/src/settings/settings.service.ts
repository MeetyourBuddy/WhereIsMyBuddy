import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  UserSettings,
  UserSettingsDocument,
} from '../users/schemas/user-settings.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { UpdatePreferencesDto } from '../users/dto/update-preferences.dto';
import { UpdateNotificationsDto } from '../users/dto/update-notifications.dto';
import { UpdatePrivacyDto } from '../users/dto/update-privacy.dto';
import { UpdateAccountDto } from '../users/dto/update-account.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettingsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Initialize default settings for a user
  async initializeUserSettings(userId: string): Promise<UserSettingsDocument> {
    const existingSettings = await this.userSettingsModel.findOne({ userId });
    if (existingSettings) {
      return existingSettings;
    }

    const defaultSettings = new this.userSettingsModel({
      userId,
    });
    return defaultSettings.save();
  }

  // Get user settings
  async getUserSettings(userId: string): Promise<UserSettingsDocument> {
    const settings = await this.userSettingsModel.findOne({ userId });

    if (!settings) {
      return this.initializeUserSettings(userId);
    }

    return settings;
  }

  // Update profile information
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: updateProfileDto }, { new: true })
      .select('-password -refreshToken');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Update preferences
  async updatePreferences(
    userId: string,
    updatePreferencesDto: UpdatePreferencesDto,
  ): Promise<UserSettingsDocument> {
    const settings = await this.userSettingsModel.findOneAndUpdate(
      { userId },
      { $set: updatePreferencesDto },
      { new: true, upsert: true },
    );

    return settings;
  }

  // Update notification settings
  async updateNotifications(
    userId: string,
    updateNotificationsDto: UpdateNotificationsDto,
  ): Promise<UserSettingsDocument> {
    const settings = await this.userSettingsModel.findOneAndUpdate(
      { userId },
      { $set: updateNotificationsDto },
      { new: true, upsert: true },
    );

    return settings;
  }

  // Update privacy settings
  async updatePrivacy(
    userId: string,
    updatePrivacyDto: UpdatePrivacyDto,
  ): Promise<UserSettingsDocument> {
    const settings = await this.userSettingsModel.findOneAndUpdate(
      { userId },
      { $set: updatePrivacyDto },
      { new: true, upsert: true },
    );

    return settings;
  }

  // Update account settings
  async updateAccount(
    userId: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<UserSettingsDocument> {
    const settings = await this.userSettingsModel.findOneAndUpdate(
      { userId },
      { $set: updateAccountDto },
      { new: true, upsert: true },
    );

    return settings;
  }

  // Change password
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });

    return { message: 'Password changed successfully' };
  }

  // Get user profile with settings
  async getUserProfileWithSettings(userId: string): Promise<{
    profile: User;
    settings: UserSettingsDocument;
  }> {
    const [profile, settings] = await Promise.all([
      this.userModel.findById(userId).select('-password -refreshToken'),
      this.getUserSettings(userId),
    ]);

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return { profile, settings };
  }

  // Delete user account
  async deleteAccount(userId: string): Promise<{ message: string }> {
    await Promise.all([
      this.userModel.findByIdAndDelete(userId),
      this.userSettingsModel.findOneAndDelete({ userId }),
    ]);

    return { message: 'Account deleted successfully' };
  }

  // Export user data
  async exportUserData(userId: string): Promise<{
    profile: User;
    settings: UserSettingsDocument;
    exportDate: Date;
  }> {
    const { profile, settings } = await this.getUserProfileWithSettings(userId);

    return {
      profile,
      settings,
      exportDate: new Date(),
    };
  }
}
