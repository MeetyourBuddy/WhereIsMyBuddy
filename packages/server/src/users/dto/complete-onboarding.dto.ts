import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  ArrayMinSize,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Categories, Interests } from '../enums/interest-categories.enum';
import { CountryCode } from '../enums/country.enum';

export class CompleteOnboardingDto {
  @ApiProperty({
    type: String,
    example: '1234567890',
    description: 'User ID',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

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
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;

  /**
   * User's areas of categories of interest
   * @example ["Fitness", "Personal Growth", "Lifestyle", "Technology", "Arts & Culture", "Outdoor Activities"]
   * @minimum 1
   */
  @ApiProperty({
    type: [String],
    enum: Categories,
    example: [
      'Fitness',
      'Personal Growth',
      'Lifestyle',
      'Technology',
      'Arts & Culture',
      'Outdoor Activities',
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Please select at least one category' })
  @IsEnum(Categories, {
    each: true,
    message: 'Please select valid categories',
  })
  interestsCategories: Categories[];

  /**
   * User's areas of interest
   * @example ["Running", "Yoga", "Weight Training", "Cycling", "Swimming", "HIIT", "Pilates", "Tennis", "CrossFit", "Rock Climbing", "Martial Arts", "Dance", "Basketball", "Soccer"]
   * @minimum 1
   */
  @ApiProperty({
    type: [String],
    enum: Interests,
    example: [
      'Running',
      'Yoga',
      'Weight Training',
      'Cycling',
      'Swimming',
      'HIIT',
      'Pilates',
      'Tennis',
      'CrossFit',
      'Rock Climbing',
      'Martial Arts',
      'Dance',
      'Basketball',
      'Soccer',
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Please select at least one interest category' })
  @IsEnum(Interests, {
    each: true,
    message: 'Please select valid interest categories',
  })
  interestsCommodities: Interests[];

  /**
   * User's country of residence
   * @example "United States"
   */
  @ApiProperty({
    enum: CountryCode,
    example: 'United States',
    description: "User's country of residence",
  })
  @IsEnum(CountryCode, {
    message: 'Please select a valid country from the provided options',
  })
  country: CountryCode;

  /**
   * User's city of residence
   * @example "New York"
   */
  @ApiProperty({ example: 'New York' })
  @IsNotEmpty({ message: 'City cannot be empty' })
  @IsString()
  city: string;

  /**
   * User's avatar
   * @example "https://picsum.photos/id/237/200/300"
   */
  @ApiProperty({ example: 'https://picsum.photos/id/237/200/300' })
  @IsNotEmpty({ message: 'Avatar is required' })
  @IsString()
  avatar: string;

  /**
   * User's bio
   * @example "I am a software engineer"
   */
  @ApiProperty({ example: 'I am a software engineer' })
  @IsString()
  @IsOptional()
  bio: string;

  // Calculate age from date of birth
  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
