import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CheckInCommentService } from './checkin-comment.service';
import {
  CreateCheckInCommentDto,
  UpdateCheckInCommentDto,
  CheckInCommentResponseDto,
} from './dto/checkin-comment.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';

@Controller('checkin-comments')
@UseGuards(JwtAuthGuard)
export class CheckInCommentController {
  constructor(private readonly checkInCommentService: CheckInCommentService) {}

  @Post()
  async createComment(
    @Body() createCommentDto: CreateCheckInCommentDto,
    @GetUser('userId') userId: string,
  ): Promise<CheckInCommentResponseDto> {
    return this.checkInCommentService.createComment(createCommentDto, userId);
  }

  @Get('checkin/:checkInId')
  async getCommentsByCheckIn(
    @Param('checkInId') checkInId: string,
  ): Promise<CheckInCommentResponseDto[]> {
    return this.checkInCommentService.getCommentsByCheckIn(checkInId);
  }

  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCheckInCommentDto,
    @GetUser('userId') userId: string,
  ): Promise<CheckInCommentResponseDto> {
    return this.checkInCommentService.updateComment(
      commentId,
      updateCommentDto,
      userId,
    );
  }

  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @GetUser('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.checkInCommentService.deleteComment(commentId, userId);
  }

  @Get('checkin/:checkInId/count')
  async getCommentCount(
    @Param('checkInId') checkInId: string,
  ): Promise<{ count: number }> {
    const count = await this.checkInCommentService.getCommentCount(checkInId);
    return { count };
  }
}
