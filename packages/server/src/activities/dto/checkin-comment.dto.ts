import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsMongoId,
} from 'class-validator';

export class CreateCheckInCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  checkInId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Comment cannot exceed 500 characters' })
  content: string;

  @IsMongoId()
  @IsOptional()
  parentCommentId?: string;
}

export class UpdateCheckInCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Comment cannot exceed 500 characters' })
  content: string;
}

export class CheckInCommentResponseDto {
  _id: string;
  checkIn: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  parentComment?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  replies?: CheckInCommentResponseDto[];
}
