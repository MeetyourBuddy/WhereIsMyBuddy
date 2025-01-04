import { User } from '../schemas/user.schema';
import { UpdateUserDto } from './update-user.dto';

export class SanitizeUpdateDto {
  static sanitize(updateDto: UpdateUserDto): Partial<User> {
    // Remove sensitive and non-updatable fields
    const {
      password,
      refreshToken,
      email,
      isEmailVerified,
      provider,
      googleId,
      ...safeUpdate
    } = updateDto as any;

    return safeUpdate;
  }
} 