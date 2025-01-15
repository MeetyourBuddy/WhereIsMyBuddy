import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCheckInDto } from './create-checkin.dto';

export class UpdateCheckInDto extends PartialType(
  OmitType(CreateCheckInDto, ['types']),
) {}
