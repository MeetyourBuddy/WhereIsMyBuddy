import { User } from '../schemas/user.schema';
import { UpdateUserDto } from './update-user.dto';

export class SanitizeUpdateDto {
  private static readonly EXCLUDED_FIELDS = [
    'password',
    'refreshToken',
    'email',
    'isEmailVerified',
    'provider',
    'googleId',
  ] as const;

  static sanitize(updateDto: UpdateUserDto): Partial<User> {
    const safeUpdate = { ...updateDto };
    this.EXCLUDED_FIELDS.forEach((field) => delete safeUpdate[field]);
    return safeUpdate;
  }
}
