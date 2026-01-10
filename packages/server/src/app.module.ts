import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ActivityModule } from './activities/activity.module';
import { AuthModule } from './users/auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { BoostModule } from './boost/boost.module';

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
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_ACCESS_EXPIRES_IN') || '3600s',
        },
      }),
    }),
    ActivityModule,
    AuthModule,
    UploadModule,
    UsersModule,
    SettingsModule,
    BoostModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
