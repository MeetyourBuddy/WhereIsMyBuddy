import {
  Injectable,
  NotFoundException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user-auth-schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from './dto';
import { Tokens, JwtPayload, UserDocument, AuthResponse } from './types';
import * as crypto from 'crypto';

interface GoogleUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

@Injectable()
export class UserAuthService {
  private readonly logger = new Logger(UserAuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      const hash = await bcrypt.hash(createUserDto.password, 10);

      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      const newUser = await this.userModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hash,
        refreshToken: null,
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
        message: 'User registered successfully',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          name: newUser.name,
          email: newUser.email,
          _id: newUser._id,
        },
      };
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw new Error('An error occurred while registering the user');
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    try {
      const user = await this.userModel.findOne({ email: loginUserDto.email });
      if (!user) throw new NotFoundException('User not found');

      const passwordMatch = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!passwordMatch)
        throw new UnauthorizedException('Invalid login credentials');

      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      return {
        message: 'Login successful',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw new UnauthorizedException('An error occurred while logging in');
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new UnauthorizedException('Invalid user ID format');
      }

      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userModel.updateOne(
        { _id: userId },
        {
          refreshToken: null,
          lastLogout: new Date(),
        },
      );

      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error(`Logout error for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new UnauthorizedException('Invalid user ID format');
      }

      const user = await this.userModel.findById(userId);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException(
          'Access Denied - No refresh token found',
        );
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        // If refresh token doesn't match, clear it from the database
        await this.userModel.updateOne({ _id: userId }, { refreshToken: null });
        throw new UnauthorizedException(
          'Access Denied - Invalid refresh token',
        );
      }

      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      return tokens;
    } catch (error) {
      this.logger.error(
        `Token refresh error for user ${userId}: ${error.message}`,
      );
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error refreshing tokens');
    }
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      const result = await this.userModel.updateOne(
        { _id: userId },
        {
          refreshToken: hashedRefreshToken,
          lastTokenRefresh: new Date(),
        },
      );

      if (result.matchedCount === 0) {
        throw new NotFoundException(
          'User not found while updating refresh token',
        );
      }
    } catch (error) {
      this.logger.error(
        `Error updating refresh token for user ${userId}: ${error.message}`,
      );
      throw new UnauthorizedException('Error updating refresh token');
    }
  }

  private async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        }),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(`Token generation error: ${error.message}`);
      throw new UnauthorizedException('Error generating tokens');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      return this.userModel.find({});
    } catch (error) {
      this.logger.error(
        `An error occurred while retrieving users: ${error.message}`,
      );
      throw new Error('An error occurred while retrieving users');
    }
  }

  async getMe(userId: string): Promise<User> {
    return this.userModel.findById(userId);
  }

  async handleGoogleAuth(googleUser: GoogleUser): Promise<AuthResponse> {
    let data: AuthResponse;
    try {
      const existingUser = await this.userModel.findOne({
        email: googleUser.email,
      });

      if (existingUser) {
        const tokens = await this.getTokens(
          existingUser._id.toString(),
          existingUser.email,
        );
        await this.updateRefreshToken(
          existingUser._id.toString(),
          tokens.refreshToken,
        );

        data = {
          message: 'Google authentication successful 1',
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: {
            name: existingUser.name,
            email: existingUser.email,
            _id: existingUser._id,
          },
        };

        return data;
      } else {
        const fullName = `${googleUser.firstName} ${googleUser.lastName}`;

        const newUser = await this.userModel.create({
          email: googleUser.email,
          name: fullName,
          password: crypto.randomBytes(32).toString('hex'),
          picture: googleUser.picture || null,
          provider: 'google',
          googleId: googleUser.googleId,
          refreshToken: null,
        });

        const tokens = await this.getTokens(
          newUser._id.toString(),
          newUser.email,
        );
        await this.updateRefreshToken(
          newUser._id.toString(),
          tokens.refreshToken,
        );

        data = {
          message: 'Google authentication successful 2',
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: {
            name: newUser.name,
            email: newUser.email,
            _id: newUser._id,
          },
        };

        return data;
      }
    } catch (error) {
      this.logger.error(`Google authentication error: ${error.message}`);
      throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }
}
