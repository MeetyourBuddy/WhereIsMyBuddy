import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class BaseUserDto {
  /**
   * User's email address
   * @example john@example.com
   */
  @IsEmail({}, { message: 'Please provide a valid email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  /**
   * User's full name
   * @example John Doe
   * @minLength 2
   */
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;
}
