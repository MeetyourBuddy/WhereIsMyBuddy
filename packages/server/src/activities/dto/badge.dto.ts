import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';

export class BadgeCriteriaDto {
  @Expose()
  @IsString()
  type: 'checkins' | 'streak' | 'progress' | 'onTime' | 'activity_completion';

  @Expose()
  @IsNumber()
  value: number;

  @Expose()
  @IsOptional()
  @IsString()
  activityId?: string;

  @Expose()
  @IsString()
  description: string;
}

export class CreateBadgeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  icon: string;

  @IsString()
  color: string;

  @ValidateNested()
  @Type(() => BadgeCriteriaDto)
  criteria: BadgeCriteriaDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  rarity?: number;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}

export class BadgeResponseDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  icon: string;

  @Expose()
  color: string;

  @Expose()
  criteria: BadgeCriteriaDto;

  @Expose()
  isActive: boolean;

  @Expose()
  rarity: number;

  @Expose()
  tags: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class UserBadgeResponseDto {
  @Expose()
  _id: string;

  @Expose()
  user: string;

  @Expose()
  badge: BadgeResponseDto;

  @Expose()
  earnedAt: Date;

  @Expose()
  activity?: string;

  @Expose()
  isDisplayed: boolean;

  @Expose()
  isShared: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
