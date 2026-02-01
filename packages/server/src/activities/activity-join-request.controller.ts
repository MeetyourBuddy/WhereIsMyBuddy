import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { ActivityJoinRequestService } from './activity-join-request.service';
import { CreateActivityJoinRequestDto } from './dto/create-activity-join-request.dto';

@Controller('activities/:activityId/requests')
@UseGuards(JwtAuthGuard)
export class ActivityJoinRequestController {
  constructor(
    private readonly joinRequestService: ActivityJoinRequestService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRequest(
    @Param('activityId') activityId: string,
    @Request() req: any,
    @Body() dto: CreateActivityJoinRequestDto,
  ) {
    const request = await this.joinRequestService.createRequest(
      activityId,
      req.user.userId,
      dto,
    );
    return {
      success: true,
      data: request,
      message: 'Join request sent successfully',
    };
  }

  @Get('my')
  async getMyRequest(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    const request = await this.joinRequestService.getMyPendingRequest(
      activityId,
      req.user.userId,
    );
    return {
      success: true,
      data: request,
      message: request ? 'Pending request found' : 'No pending request',
    };
  }

  @Get()
  async getRequests(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    const requests = await this.joinRequestService.getRequestsForActivity(
      activityId,
      req.user.userId,
    );
    return {
      success: true,
      data: requests,
      message: 'Join requests retrieved successfully',
    };
  }

  @Post(':requestId/accept')
  async acceptRequest(
    @Param('activityId') activityId: string,
    @Param('requestId') requestId: string,
    @Request() req: any,
  ) {
    const request = await this.joinRequestService.acceptRequest(
      activityId,
      requestId,
      req.user.userId,
    );
    return {
      success: true,
      data: request,
      message: 'Join request accepted',
    };
  }

  @Post(':requestId/decline')
  async declineRequest(
    @Param('activityId') activityId: string,
    @Param('requestId') requestId: string,
    @Request() req: any,
  ) {
    const request = await this.joinRequestService.declineRequest(
      activityId,
      requestId,
      req.user.userId,
    );
    return {
      success: true,
      data: request,
      message: 'Join request declined',
    };
  }
}
