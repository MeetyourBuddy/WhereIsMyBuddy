import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { InterestCategory } from '../enums/interests.enum';
import { Country } from '../enums/location.enum';

export class CompleteOnboardingDto {
  /**
   * User's date of birth
   * @example "1990-01-01"
   */
  @ApiProperty({
    type: Date,
    example: '1990-01-01',
    description: "User's date of birth",
  })
  @Type(() => Date)
  @IsDate({ message: 'Please provide a valid date' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: Date;

  /**
   * User's areas of interest
   * @example ["TECHNOLOGY", "GAMING"]
   * @minimum 1
   */
  @ApiProperty({
    type: [String],
    enum: InterestCategory,
    example: ['TECHNOLOGY', 'GAMING'],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Please select at least one interest category' })
  @IsEnum(InterestCategory, {
    each: true,
    message: 'Please select valid interest categories',
  })
  interestsCategories: InterestCategory[];

  /**
   * User's country of residence
   * @example "USA"
   */
  @ApiProperty({ enum: Country, example: 'USA' })
  @IsEnum(Country, { message: 'Please select a valid country' })
  country: Country;

  /**
   * User's city of residence
   * @example "New York"
   */
  @ApiProperty({ example: 'New York' })
  @IsNotEmpty({ message: 'City cannot be empty' })
  @IsString()
  city: string;
}
