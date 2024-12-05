import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/loginUserDto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/get-user.decorator';

@Controller('api/auth')
export class UserAuthController {
  constructor(private userAuthService: UserAuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userAuthService.registerUser(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userAuthService.loginUser(loginUserDto);
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetUser('sub') userId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.userAuthService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser('userId') userId: string) {
    return this.userAuthService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetUser('userId') userId: string) {
    return this.userAuthService.getProfile(userId);
  }

  @Get('users')
  @Public()
  @HttpCode(HttpStatus.OK)
  getUsers() {
    return this.userAuthService.getUsers();
  }
}
