import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PartnerService } from './partner.service';
import { CreatePartnerInvitationDto } from './dto/create-partner-invitation.dto';
import { RespondToInvitationDto } from './dto/respond-to-invitation.dto';
import { SearchUsersDto } from './dto/search-users.dto';

@Controller('activities/:activityId/partners')
@UseGuards(JwtAuthGuard)
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  // Search users for partner invitations
  @Get('search-users')
  async searchUsers(
    @Param('activityId') activityId: string,
    @Query('q') query: string,
    @Request() req: any,
  ) {
    if (!query) {
      return {
        success: true,
        data: [],
        message: 'No search query provided',
      };
    }

    const users = await this.partnerService.searchUsers(
      { query },
      req.user.userId,
      activityId,
    );

    return {
      success: true,
      data: users,
      message: 'Users found successfully',
    };
  }

  // Get all partners for an activity
  @Get()
  async getPartners(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    const partners = await this.partnerService.getPartners(
      activityId,
      req.user.userId,
    );

    return {
      success: true,
      data: partners,
      message: 'Partners retrieved successfully',
    };
  }

  // Get pending invitations for an activity
  @Get('invitations')
  async getPendingInvitations(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    const invitations = await this.partnerService.getPendingInvitations(
      activityId,
      req.user.userId,
    );

    return {
      success: true,
      data: invitations,
      message: 'Invitations retrieved successfully',
    };
  }

  // Create partner invitation
  @Post('invite')
  @HttpCode(HttpStatus.CREATED)
  async createInvitation(
    @Param('activityId') activityId: string,
    @Request() req: any,
    @Body() createInvitationDto: CreatePartnerInvitationDto,
  ) {
    const invitation = await this.partnerService.createInvitation(
      activityId,
      req.user.userId,
      createInvitationDto,
    );

    return {
      success: true,
      data: invitation,
      message: 'Partner invitation sent successfully',
    };
  }

  // Respond to invitation
  @Put('invitations/:invitationId/respond')
  async respondToInvitation(
    @Param('activityId') activityId: string,
    @Param('invitationId') invitationId: string,
    @Request() req: any,
    @Body() respondDto: RespondToInvitationDto,
  ) {
    const invitation = await this.partnerService.respondToInvitation(
      invitationId,
      req.user.userId,
      respondDto,
    );

    return {
      success: true,
      data: invitation,
      message: `Invitation ${respondDto.action}ed successfully`,
    };
  }

  // Remove partner
  @Delete(':partnerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePartner(
    @Param('activityId') activityId: string,
    @Param('partnerId') partnerId: string,
    @Request() req: any,
  ) {
    await this.partnerService.removePartner(
      activityId,
      partnerId,
      req.user.userId,
    );

    return {
      success: true,
      message: 'Partner removed successfully',
    };
  }
}

// Separate controller for token-based invitations (no auth required)
@Controller('invite/partner')
export class PartnerInvitationController {
  constructor(private readonly partnerService: PartnerService) {}

  // Get invitation details by token
  @Get(':token')
  async getInvitationByToken(@Param('token') token: string) {
    const invitation = await this.partnerService.getInvitationByToken(token);

    return {
      success: true,
      data: invitation,
      message: 'Invitation details retrieved successfully',
    };
  }

  // Accept invitation by token (requires auth)
  @Post(':token/accept')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async acceptInvitationByToken(
    @Param('token') token: string,
    @Request() req: any,
  ) {
    const partner = await this.partnerService.acceptInvitationByToken(
      token,
      req.user.userId,
    );

    return {
      success: true,
      data: partner,
      message: 'Invitation accepted successfully',
    };
  }
}
