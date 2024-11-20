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

      const result = await this.userModel.updateOne(
        { _id: userId },
        { refreshToken: null },
      );

      if (result.matchedCount === 0) {
        throw new NotFoundException('User not found');
      }

      this.logger.log(`Logout service completed for user ${userId}`);

      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`);
      throw new Error('An error occurred during logout');
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new UnauthorizedException('Invalid user ID format');
      }

      const user = await this.userModel.findById(userId);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      return tokens;
    } catch (error) {
      this.logger.error(`Token refresh error: ${error.message}`);
      throw new UnauthorizedException('Error refreshing tokens');
    }
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.updateOne(
      { _id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }

  private async getTokens(userId: string, email: string): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
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
}
