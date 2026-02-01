import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateActivityJoinRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Message cannot exceed 500 characters' })
  message?: string;
}
