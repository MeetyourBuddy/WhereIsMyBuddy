import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginUserDto {
  /**
   * User's email address
   * @example "john@example.com"
   */
  @IsEmail({}, { message: 'Please provide a valid email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  /**
   * User's password
   * @example "Password123!"
   * @minLength 6
   */
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
