import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/index';
import { LoginUserDto } from './dto/login-user.dto';
import {
  AuthResponse,
  Tokens,
  GoogleUser,
  JwtPayload,
  IUserResponse,
} from './interfaces/auth.interface';
import { Country } from '../enums/location.enum';
import { InterestCategory } from '../enums/interests.enum';
import { Language } from '../enums/language.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email.toLowerCase(),
      });

      if (existingUser) {
        throw new BadRequestException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const profileLink = `user-${crypto.randomBytes(4).toString('hex')}`;
      const profileQR = `qr-${crypto.randomBytes(8).toString('hex')}`;

      const newUser = await this.userModel.create({
        ...createUserDto,
        email: createUserDto.email.toLowerCase(),
        password: hashedPassword,
        provider: 'local',
        profileLink,
        profileQR,
        name: createUserDto.username,
        collaborationStatus: 'open',
      });

      const tokens = await this.getTokens(
        newUser._id.toString(),
        newUser.email,
      );
      await this.updateRefreshToken(
        newUser._id.toString(),
        tokens.refreshToken,
      );

      return {
        success: true,
        message: 'Registration successful',
        data: {
          tokens,
          user: this.formatUserResponse(newUser),
        },
      };
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    try {
      const user = await this.userModel.findOne({
        email: loginUserDto.email.toLowerCase(),
      });

      if (!user || user.provider !== 'local') {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      return {
        success: true,
        message: 'Login successful',
        data: {
          tokens,
          user: this.formatUserResponse(user),
        },
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      return tokens;
    } catch (error) {
      this.logger.error(`Token refresh error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async handleGoogleAuth(googleUser: GoogleUser, res: Response): Promise<void> {
    try {
      let user = await this.userModel.findOne({ email: googleUser.email });

      if (!user) {
        const profileLink = `user-${crypto.randomBytes(4).toString('hex')}`;
        const profileQR = `qr-${crypto.randomBytes(8).toString('hex')}`;

        user = await this.userModel.create({
          email: googleUser.email,
          name: `${googleUser.firstName} ${googleUser.lastName}`,
          googleId: googleUser.googleId,
          profilePicture: googleUser.picture,
          isEmailVerified: true,
          provider: 'google',
          profileLink,
          profileQR,
          collaborationStatus: 'open',
          password: await bcrypt.hash(
            crypto.randomBytes(32).toString('hex'),
            10,
          ),
        });
      }

      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      const redirectUrl = new URL(
        `${this.configService.get('FRONTEND_URL')}/oauth`,
      );
      redirectUrl.searchParams.append('accessToken', tokens.accessToken);
      redirectUrl.searchParams.append('refreshToken', tokens.refreshToken);

      res.redirect(redirectUrl.toString());
    } catch (error) {
      this.logger.error(`Google auth error: ${error.message}`, error.stack);
      res.redirect(
        `${this.configService.get('FRONTEND_URL')}/login?error=google_auth_failed`,
      );
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    try {
      await this.userModel.findByIdAndUpdate(userId, {
        refreshToken: null,
        lastTokenRefresh: null,
      });

      return {
        message: 'Logout successful',
      };
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
      lastTokenRefresh: new Date(),
    });
  }

  private formatUserResponse(user: UserDocument): IUserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      age: user.age,
      profilePicture: user.profilePicture,
      bio: user.bio,
      phoneNumber: user.phoneNumber,
      country: user.country as Country,
      city: user.city,
      interestsCategories: user.interestsCategories as InterestCategory[],
      interestsCommodities: user.interestsCommodities,
      preferredLanguage: user.preferredLanguage as Language,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      provider: user.provider,
      profileLink: user.profileLink,
      profileQR: user.profileQR,
      goals: user.goals,
      gender: user.gender,
      collaborationStatus: user.collaborationStatus,
      linkedInUrl: user.linkedInUrl,
      githubUrl: user.githubUrl,
      portfolioUrl: user.portfolioUrl,
      instagramUrl: user.instagramUrl,
      timezone: user.timezone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
