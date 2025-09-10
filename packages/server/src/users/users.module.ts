import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import {
  BuddyConnection,
  BuddyConnectionSchema,
} from './schemas/buddy-connection.schema';
import { BuddyConnectionController } from './controllers/buddy-connection.controller';
import { BuddyConnectionService } from './services/buddy-connection.service';

// Auth imports
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { RefreshTokenStrategy } from './auth/strategies/refresh-token.strategy';
import { GoogleStrategy } from './auth/strategies/google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BuddyConnection.name, schema: BuddyConnectionSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController, AuthController, BuddyConnectionController],
  providers: [
    UsersService,
    AuthService,
    BuddyConnectionService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
  ],
  exports: [UsersService, AuthService, BuddyConnectionService],
})
export class UsersModule {}
