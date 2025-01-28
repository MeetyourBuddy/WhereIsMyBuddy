import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class RuleDto {
  @ApiProperty({
    description: 'The rule text',
    example: 'Complete weekly assignments',
  })
  @IsString()
  rule: string;

  @ApiProperty({
    description: 'Whether this is a default rule',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
