import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user-auth-schema';
import { UserAuthService } from './user-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthController } from './user-auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(
          process.env.JWT_ACCESS_SECRET || 'jwt-secret-key',
        ),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserAuthService, JwtAuthGuard, RefreshTokenGuard],
  exports: [UserAuthService],
  controllers: [UserAuthController],
})
export class UserAuthModule {}
