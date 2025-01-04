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
  id: string;

  /**
   * User's email address
   * @example "john@example.com"
   */
  @Expose()
  email: string;

  /**
   * User's username
   * @example "john_doe"
   */
  @Expose()
  username: string;

  /**
   * URL to user's profile picture
   * @example "https://example.com/profile.jpg"
   */
  @Expose()
  profilePicture?: string;

  /**
   * User's bio or description
   * @example "Software developer passionate about technology"
   */
  @Expose()
  bio?: string;

  /**
   * User's phone number
   * @example "+1 555-555-5555"
   */
  @Expose()
  phoneNumber?: string;

  /**
   * User's country
   * @example "USA"
   */
  @Expose()
  country?: Country;

  /**
   * User's city
   * @example "New York"
   */
  @Expose()
  city?: string;

  /**
   * User's interests categories
   * @example ["Technology", "Travel"]
   */
  @Expose()
  interestsCategories?: InterestCategory[];

  /**
   * User's interests commodities
   * @example ["Apple", "Google"]
   */
  @Expose()
  interestsCommodities?: string[];

  /**
   * User's preferred language
   * @example "English"
   */
  @Expose()
  preferredLanguage?: Language;

  /**
   * User's active status
   * @example true
   */
  @Expose()
  isActive: boolean;

  /**
   * User's email verification status
   * @example true
   */
  @Expose()
  isEmailVerified: boolean;

  /**
   * User's onboarding completion status
   * @example true
   */
  @Expose()
  hasCompletedOnboarding: boolean;

  /**
   * User's authentication provider
   * @example "local"
   */
  @Expose()
  provider: 'local' | 'google';

  /**
   * User's profile link
   * @example "https://example.com/profile"
   */
  @Expose()
  profileLink: string;

  /**
   * User's profile QR code
   * @example "https://example.com/profile.qr"
   */
  @Expose()
  profileQR: string;

  /**
   * User's collaboration status
   * @example "open"
   */
  @Expose()
  collaborationStatus: 'open' | 'occupied' | 'undecided';

  /**
   * User's LinkedIn URL
   * @example "https://www.linkedin.com/in/john-doe"
   */
  @Expose()
  linkedInUrl?: string;

  /**
   * User's Twitter URL
   * @example "https://www.twitter.com/john-doe"
   */
  @Expose()
  twitterUrl?: string;

  /**
   * User's Instagram URL
   * @example "https://www.instagram.com/john-doe"
   */
  @Expose()
  instagramUrl?: string;

  /**
   * Timestamp when the user was created
   * @example "2024-03-17T10:00:00Z"
   */
  @Expose()
  createdAt: Date;

  /**
   * Timestamp when the user was last updated
   * @example "2024-03-17T10:00:00Z"
   */
  @Expose()
  updatedAt: Date;
}
