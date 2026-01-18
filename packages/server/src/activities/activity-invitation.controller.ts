import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { ActivityInvitationService } from './activity-invitation.service';
import { CreateActivityInvitationDto } from './dto/create-activity-invitation.dto';

@Controller('activities/:activityId/invitations')
@UseGuards(JwtAuthGuard)
export class ActivityInvitationController {
  constructor(
    private readonly activityInvitationService: ActivityInvitationService,
  ) {}

  // Create invitation (admin only)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInvitation(
    @Param('activityId') activityId: string,
    @Request() req: any,
    @Body() createInvitationDto: CreateActivityInvitationDto,
  ) {
    const invitation = await this.activityInvitationService.createInvitation(
      activityId,
      req.user.userId,
      createInvitationDto,
    );

    return {
      success: true,
      data: Array.isArray(invitation) ? invitation : [invitation],
      message: 'Invitation(s) created successfully',
    };
  }

  // Get all invitations for an activity (admin only)
  @Get()
  async getInvitations(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    const invitations = await this.activityInvitationService.getInvitations(
      activityId,
      req.user.userId,
    );

    return {
      success: true,
      data: invitations,
      message: 'Invitations retrieved successfully',
    };
  }

  // Delete invitation (admin only)
  @Delete(':invitationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInvitation(
    @Param('activityId') activityId: string,
    @Param('invitationId') invitationId: string,
    @Request() req: any,
  ) {
    await this.activityInvitationService.deleteInvitation(
      invitationId,
      req.user.userId,
    );

    return {
      success: true,
      message: 'Invitation deleted successfully',
    };
  }
}

// Separate controller for user-facing invitation endpoints
@Controller('activities/invitations')
@UseGuards(JwtAuthGuard)
export class ActivityInvitationUserController {
  constructor(
    private readonly activityInvitationService: ActivityInvitationService,
  ) {}

  // Get user's invitations
  @Get('my')
  async getUserInvitations(@Request() req: any) {
    const invitations =
      await this.activityInvitationService.getUserInvitations(
        req.user.userId,
      );

    return {
      success: true,
      data: invitations,
      message: 'Invitations retrieved successfully',
    };
  }

  // Accept invitation
  @Post(':invitationId/accept')
  async acceptInvitation(
    @Param('invitationId') invitationId: string,
    @Request() req: any,
  ) {
    const invitation = await this.activityInvitationService.acceptInvitation(
      invitationId,
      req.user.userId,
    );

    return {
      success: true,
      data: invitation,
      message: 'Invitation accepted successfully',
    };
  }

  // Decline invitation
  @Post(':invitationId/decline')
  async declineInvitation(
    @Param('invitationId') invitationId: string,
    @Request() req: any,
  ) {
    const invitation = await this.activityInvitationService.declineInvitation(
      invitationId,
      req.user.userId,
    );

    return {
      success: true,
      data: invitation,
      message: 'Invitation declined successfully',
    };
  }
}

// Public controller for token-based invitation access
@Controller('invite/activity')
export class ActivityInvitePublicController {
  constructor(
    private readonly activityInvitationService: ActivityInvitationService,
  ) {}

  // Get invitation by token (public, no auth required)
  @Get(':token')
  async getInvitationByToken(@Param('token') token: string) {
    const invitation =
      await this.activityInvitationService.getInvitationByToken(token);

    return {
      success: true,
      data: invitation,
      message: 'Invitation retrieved successfully',
    };
  }

  // Accept invitation by token (requires auth after signup)
  @Post(':token/accept')
  @UseGuards(JwtAuthGuard)
  async acceptInvitationByToken(
    @Param('token') token: string,
    @Request() req: any,
  ) {
    const invitation =
      await this.activityInvitationService.acceptInvitationByToken(
        token,
        req.user.userId,
      );

    return {
      success: true,
      data: invitation,
      message: 'Invitation accepted successfully',
    };
  }
}

