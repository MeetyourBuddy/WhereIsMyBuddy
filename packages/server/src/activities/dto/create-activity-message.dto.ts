import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateActivityMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Message content cannot exceed 500 characters' })
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
