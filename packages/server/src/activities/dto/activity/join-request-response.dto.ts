import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestResponseDto {
  @ApiProperty({
    description: 'ID of the user who requested to join',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  userName: string;

  @ApiProperty({
    description: 'User profile picture URL',
    required: false,
    example: 'https://example.com/profile.jpg',
  })
  userProfilePicture?: string;

  @ApiProperty({
    description: 'When the request was made',
    type: Date,
    example: '2024-01-30T10:30:00Z',
  })
  requestedAt: Date;
} 