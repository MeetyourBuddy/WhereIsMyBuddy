import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../dto/user-response.dto';

export class TokensResponseDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token for obtaining new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class AuthResponseDto extends TokensResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Successfully authenticated',
  })
  message: string;

  @ApiProperty({
    description: 'Authenticated user information',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Operation success status',
    example: true,
  })
  success: boolean;
}
