import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class UpdateActivityMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Message content cannot exceed 500 characters' })
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
