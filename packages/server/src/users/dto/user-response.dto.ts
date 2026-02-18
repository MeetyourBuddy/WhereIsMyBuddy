import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Country } from '../enums/location.enum';
import { InterestCategory } from '../enums/interests.enum';
import { Language } from '../enums/language.enum';

@Exclude()
export class UserResponseDto {
  /**
   * Unique identifier for the user
   * @example "507f1f77bcf86cd799439011"
   */
  @Expose()
  @ApiProperty()
  id: string;

  /**
   * User's email address
   * @example "john@example.com"
   */
  @Expose()
  @ApiProperty()
  email: string;

  /**
   * User's name
   * @example "John Doe"
   */
  @Expose()
  @ApiProperty()
  name: string;

  /**
   * User's date of birth
   * @example "1990-01-01T00:00:00Z"
   */
  @Expose()
  @ApiPropertyOptional({ type: Date })
  dateOfBirth?: Date;

  /**
   * User's age calculated from date of birth
   * @example 33
   */
  @Expose()
  @ApiPropertyOptional()
  age?: number;

  /**
   * URL to user's profile picture
   * @example "https://example.com/profile.jpg"
   */
  @Expose()
  @ApiPropertyOptional()
  profilePicture?: string;

  /**
   * User's bio or description
   * @example "Software developer passionate about technology"
   */
  @Expose()
  @ApiPropertyOptional()
  bio?: string;

  /**
   * User's phone number
   * @example "+1 555-555-5555"
   */
  @Expose()
  @ApiPropertyOptional()
  phoneNumber?: string;

  /**
   * User's country
   * @example "USA"
   */
  @Expose()
  @ApiPropertyOptional({ enum: Country })
  country?: Country;

  /**
   * User's city
   * @example "New York"
   */
  @Expose()
  @ApiPropertyOptional()
  city?: string;

  /**
   * User's interests categories
   * @example ["TECHNOLOGY", "GAMING"]
   */
  @Expose()
  @ApiPropertyOptional({ type: [String], enum: InterestCategory })
  interestsCategories?: InterestCategory[];

  /**
   * User's specific interests within categories
   * @example ["Web Development", "Mobile Apps"]
   */
  @Expose()
  @ApiPropertyOptional({ type: [String] })
  interestsCommodities?: string[];

  /**
   * User's preferred language
   * @example "ENGLISH"
   */
  @Expose()
  @ApiPropertyOptional({ enum: Language })
  preferredLanguage?: Language;

  /**
   * User's active status
   * @example true
   */
  @Expose()
  @ApiProperty()
  isActive: boolean;

  /**
   * User's email verification status
   * @example true
   */
  @Expose()
  @ApiProperty()
  isEmailVerified: boolean;

  /**
   * User's onboarding completion status
   * @example true
   */
  @Expose()
  @ApiProperty()
  hasCompletedOnboarding: boolean;

  /**
   * User's authentication provider
   * @example "local"
   */
  @Expose()
  @ApiProperty({ enum: ['local', 'google'] })
  provider: 'local' | 'google';

  /**
   * User's unique profile link
   * @example "user-abc123"
   */
  @Expose()
  @ApiProperty()
  profileLink: string;

  /**
   * User's unique QR code identifier
   * @example "qr-xyz789"
   */
  @Expose()
  @ApiProperty()
  profileQR: string;

  /**
   * User's goals and aspirations
   * @example "Looking to collaborate on open source projects"
   */
  @Expose()
  @ApiPropertyOptional()
  goals?: string;

  /**
   * User's gender
   * @example "male"
   */
  @Expose()
  @ApiPropertyOptional({ enum: ['male', 'female', 'other'] })
  gender?: 'male' | 'female' | 'other';

  /**
   * User's collaboration status
   * @example "open"
   */
  @Expose()
  @ApiProperty({ enum: ['open', 'occupied', 'undecided'] })
  collaborationStatus: 'open' | 'occupied' | 'undecided';

  /**
   * User's LinkedIn profile URL
   * @example "https://linkedin.com/in/john-doe"
   */
  @Expose()
  @ApiPropertyOptional()
  linkedInUrl?: string;

  /**
   * User's GitHub profile URL
   * @example "https://github.com/john-doe"
   */
  @Expose()
  @ApiPropertyOptional()
  githubUrl?: string;

  /**
   * User's portfolio website URL
   * @example "https://johndoe.dev"
   */
  @Expose()
  @ApiPropertyOptional()
  portfolioUrl?: string;

  /**
   * User's Instagram profile URL
   * @example "https://instagram.com/john.doe"
   */
  @Expose()
  @ApiPropertyOptional()
  instagramUrl?: string;

  /**
   * User's timezone
   * @example "America/New_York"
   */
  @Expose()
  @ApiPropertyOptional()
  timezone?: string;

  /**
   * Timestamp when the user was created
   * @example "2024-01-01T00:00:00Z"
   */
  @Expose()
  @ApiProperty()
  createdAt: Date;

  /**
   * Timestamp when the user was last updated
   * @example "2024-01-01T00:00:00Z"
   */
  @Expose()
  @ApiProperty()
  updatedAt: Date;

  /**
   * User's avatar
   * @example "https://picsum.photos/id/237/200/300"
   */
  @Expose()
  @ApiPropertyOptional()
  avatar?: string;
}
