import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { SendBoostDto } from './send-boost.dto';

export class SendBoostBatchDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one boost must be sent' })
  @ValidateNested({ each: true })
  @Type(() => SendBoostDto)
  boosts: SendBoostDto[];
}

