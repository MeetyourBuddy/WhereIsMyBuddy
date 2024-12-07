import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Req,
  Res,
} from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/loginUserDto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
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
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetUser('userId') userId: string) {
    return this.userAuthService.getMe(userId);
  }

  @Get('users')
  @Public()
  @HttpCode(HttpStatus.OK)
  getUsers() {
    return this.userAuthService.getUsers();
  }

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      // The validated user from GoogleStrategy is in req.user
      const authResponse = await this.userAuthService.handleGoogleAuth({
        googleId: req.user.googleId,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        picture: req.user.picture,
      });

      // Construct a secure redirect URL with tokens
      const redirectUrl = new URL(`${process.env.FRONTEND_URL}/oauth`);
      redirectUrl.searchParams.append('accessToken', authResponse.accessToken);
      redirectUrl.searchParams.append(
        'refreshToken',
        authResponse.refreshToken,
      );

      return res.redirect(redirectUrl.toString());
    } catch (error) {
      // Handle errors by redirecting to login with an error flag
      console.log(error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=google_auth_failed`,
      );
    }
  }
}
