import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ConnectionStatus } from '../schemas/buddy-connection.schema';

export class CreateBuddyRequestDto {
  @IsString()
  recipientId: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  message?: string;
}

export class UpdateBuddyRequestDto {
  @IsEnum(ConnectionStatus)
  status: ConnectionStatus;
}

export class BuddyConnectionResponseDto {
  id: string;
  requester: {
    id: string;
    name: string;
    avatar?: string;
    profileLink: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar?: string;
    profileLink: string;
  };
  status: ConnectionStatus;
  message?: string;
  acceptedAt?: Date;
  declinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class BuddyStatsDto {
  totalConnections: number;
  pendingRequests: number;
  receivedRequests: number;
  mutualConnections?: number;
}

export class MutualConnectionDto {
  id: string;
  name: string;
  avatar?: string;
  profileLink: string;
  connectedAt: Date;
}
