import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { User } from './schemas/user-auth-schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/loginUserDto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RequestWithUser, AuthResponse } from './types';

@Controller('api/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  private readonly logger = new Logger(UserAuthController.name);

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthResponse> {
    const result = await this.userAuthService.registerUser(createUserDto);
    return {
      message: 'User registered successfully',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const result = await this.userAuthService.loginUser(loginUserDto);
    return {
      message: 'Login successful',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: RequestWithUser,
    @Body('refreshToken') refreshToken: string,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    const tokens = await this.userAuthService.refreshTokens(
      userId,
      refreshToken,
    );

    return {
      message: 'Tokens refreshed successfully',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: RequestWithUser): Promise<{ message: string }> {
    try {
      this.logger.log('Logout attempt initiated');

      if (!req.user) {
        this.logger.error('No user object found in request');
        throw new UnauthorizedException('User not authenticated');
      }

      const userId = req.user.sub;

      return this.userAuthService.logout(userId);
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }
}
