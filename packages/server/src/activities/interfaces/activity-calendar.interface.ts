import { CheckInResponseDto } from '../dto/checkin/checkin-response.dto';
import { CheckinFrequencyUnit } from '../schemas/activity.schema';

export interface ActivityCalendarFrequency {
  unit: CheckinFrequencyUnit;
  days?: string[];
  datesOfMonth?: number[];
  dayOfWeek?: string[];
  weeksOfMonth?: number[];
}

export interface ActivityCalendarResponse {
  checkIns: Record<string, CheckInResponseDto[]>;
  allowedDates: Date[];
  frequency: ActivityCalendarFrequency;
}
