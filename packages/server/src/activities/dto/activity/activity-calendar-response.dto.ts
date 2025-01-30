import { ApiProperty } from '@nestjs/swagger';
import { CheckInResponseDto } from '../checkin/checkin-response.dto';
import { CheckinFrequencyUnit } from '../../schemas/activity.schema';

export class ActivityCalendarFrequencyDto {
  @ApiProperty({ enum: CheckinFrequencyUnit })
  unit: CheckinFrequencyUnit;

  @ApiProperty({ type: [String], required: false })
  days?: string[];

  @ApiProperty({ type: [Number], required: false })
  datesOfMonth?: number[];

  @ApiProperty({ type: [String], required: false })
  dayOfWeek?: string[];

  @ApiProperty({ type: [Number], required: false })
  weeksOfMonth?: number[];
}

export class ActivityCalendarResponseDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { $ref: '#/components/schemas/CheckInResponseDto' },
    },
    description: 'Check-ins grouped by date (YYYY-MM-DD)',
  })
  checkIns: Record<string, CheckInResponseDto[]>;

  @ApiProperty({
    type: [Date],
    description: 'Dates when check-ins are allowed based on activity settings',
  })
  allowedDates: Date[];

  @ApiProperty({
    type: ActivityCalendarFrequencyDto,
    description: 'Activity check-in frequency configuration',
  })
  frequency: ActivityCalendarFrequencyDto;
}
