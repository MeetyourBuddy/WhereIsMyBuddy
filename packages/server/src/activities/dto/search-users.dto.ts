import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class SearchUsersDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  @IsString()
  activityId?: string;
}
