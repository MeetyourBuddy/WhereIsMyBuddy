import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class BaseUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;
}
