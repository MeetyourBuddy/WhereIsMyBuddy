import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { UserInterest, Country } from '../enums/user-options.enums';

class LocationDto {
  @ApiProperty({ 
    enum: Country,
    example: Country.USA,
    description: 'Select country from predefined list'
  })
  @IsEnum(Country, { message: 'Please select a valid country' })
  country: Country;

  @ApiProperty({ example: 'New York' })
  @IsNotEmpty()
  city: string;
}

export class CompleteOnboardingDto {
  @ApiProperty({ 
    type: [String],
    enum: UserInterest,
    isArray: true,
    example: [UserInterest.TECHNOLOGY, UserInterest.GAMING],
    description: 'Select at least one interest'
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Please select at least one interest' })
  @IsEnum(UserInterest, { each: true, message: 'Please select valid interests' })
  interests: UserInterest[];

  @ApiProperty({
    type: LocationDto,
    description: 'Select location from predefined options'
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}