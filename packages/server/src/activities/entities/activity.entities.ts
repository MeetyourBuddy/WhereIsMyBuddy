import { ActivityResponseDto } from '@/activities/dto/activity-response.dto';
import { User } from '@/users/schemas/user.schema';

export interface PopulatedActivity
  extends Omit<ActivityResponseDto, 'admin' | 'participants'> {
  admin: User;
  participants: User[];
}
