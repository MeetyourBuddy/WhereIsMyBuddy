import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';

import { UsersController } from './users/users.controller';
import { AuthController } from './users/auth/auth.controller';
import { UsersService } from './users/users.service';
import { AuthService } from './users/auth/auth.service';
import { User, UserSchema } from './users/schemas/user.schema';
import { JwtStrategy } from './users/auth/strategies/jwt.strategy';
import { RefreshTokenStrategy } from './users/auth/strategies/refresh-token.strategy';
import { GoogleStrategy } from './users/auth/strategies/google.strategy';
import { ValidationFilter } from './common/filters/validation.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.accessSecret'),
        signOptions: { 
          expiresIn: config.get('jwt.accessExpiresIn') 
        },
      }),
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
  ],
  exports: [UsersService, AuthService],
})
export class AppModule {}