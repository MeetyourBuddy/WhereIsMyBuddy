import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Partner, PartnerDocument } from './schemas/partner.schema';
import {
  PartnerInvitation,
  PartnerInvitationDocument,
} from './schemas/partner-invitation.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreatePartnerInvitationDto } from './dto/create-partner-invitation.dto';
import { RespondToInvitationDto } from './dto/respond-to-invitation.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import * as crypto from 'crypto';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name)
    private partnerModel: Model<PartnerDocument>,
    @InjectModel(PartnerInvitation.name)
    private partnerInvitationModel: Model<PartnerInvitationDocument>,
    @InjectModel(Activity.name)
    private activityModel: Model<ActivityDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // Search users for partner invitations
  async searchUsers(
    searchDto: SearchUsersDto,
    currentUserId: string,
    activityId?: string,
  ): Promise<any[]> {
    const { query } = searchDto;

    // Search users by name or email
    const users = await this.userModel
      .find({
        $and: [
          { _id: { $ne: new Types.ObjectId(currentUserId) } }, // Exclude current user
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } },
            ],
          },
        ],
      })
      .select('_id name email avatar')
      .limit(20)
      .exec();

    // If activityId is provided, check existing partnerships and invitations
    if (activityId) {
      const [existingPartners, existingInvitations] = await Promise.all([
        this.partnerModel
          .find({
            activityId: new Types.ObjectId(activityId),
            userId: { $in: users.map((u) => u._id) },
          })
          .select('userId status')
          .exec(),
        this.partnerInvitationModel
          .find({
            activityId: new Types.ObjectId(activityId),
            toUserId: { $in: users.map((u) => u._id) },
            status: 'pending',
          })
          .select('toUserId status')
          .exec(),
      ]);

      // Add partnership status to users
      return users.map((user) => {
        const isPartner = existingPartners.some(
          (p) => p.userId.toString() === user._id.toString(),
        );
        const isPending = existingInvitations.some(
          (i) => i.toUserId?.toString() === user._id.toString(),
        );

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isPartner,
          isPending,
        };
      });
    }

    return users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPartner: false,
      isPending: false,
    }));
  }

  // Create partner invitation
  async createInvitation(
    activityId: string,
    fromUserId: string,
    createInvitationDto: CreatePartnerInvitationDto,
  ): Promise<PartnerInvitationDocument> {
    // Verify activity exists and user is a participant
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const isParticipant = activity.participants?.some(
      (p) => p.toString() === fromUserId,
    );
    const isAdmin = activity.admin?.toString() === fromUserId;

    if (!isParticipant && !isAdmin) {
      throw new ForbiddenException(
        'You must be a participant to invite partners',
      );
    }

    const { toUserId, toEmail, message, isLinkInvitation } =
      createInvitationDto;

    // Validate that either toUserId, toEmail, or isLinkInvitation is provided
    if (!toUserId && !toEmail && !isLinkInvitation) {
      throw new BadRequestException(
        'Either toUserId, toEmail, or isLinkInvitation must be provided',
      );
    }

    // If inviting by userId, verify user exists
    if (toUserId) {
      const targetUser = await this.userModel.findById(toUserId).exec();
      if (!targetUser) {
        throw new NotFoundException('Target user not found');
      }

      // Check if user is already a partner
      const existingPartner = await this.partnerModel
        .findOne({
          activityId: new Types.ObjectId(activityId),
          userId: new Types.ObjectId(toUserId),
        })
        .exec();

      if (existingPartner) {
        throw new ConflictException(
          'User is already a partner in this activity',
        );
      }

      // Check if there's already a pending invitation
      const existingInvitation = await this.partnerInvitationModel
        .findOne({
          activityId: new Types.ObjectId(activityId),
          toUserId: new Types.ObjectId(toUserId),
          status: 'pending',
        })
        .exec();

      if (existingInvitation) {
        throw new ConflictException('Invitation already sent to this user');
      }
    }

    // Generate invitation token for email or link invitations
    const invitationToken =
      toEmail || isLinkInvitation
        ? crypto.randomBytes(32).toString('hex')
        : undefined;

    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = new this.partnerInvitationModel({
      activityId: new Types.ObjectId(activityId),
      fromUserId: new Types.ObjectId(fromUserId),
      toUserId: toUserId ? new Types.ObjectId(toUserId) : undefined,
      toEmail,
      message,
      invitationToken,
      expiresAt,
    });

    return invitation.save();
  }

  // Get partners for an activity
  async getPartners(activityId: string, userId: string): Promise<any[]> {
    // Verify activity exists and user is a participant
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const isParticipant = activity.participants?.some(
      (p) => p.toString() === userId,
    );
    const isAdmin = activity.admin?.toString() === userId;

    if (!isParticipant && !isAdmin) {
      throw new ForbiddenException(
        'You must be a participant to view partners',
      );
    }

    const partners = await this.partnerModel
      .find({
        activityId: new Types.ObjectId(activityId),
      })
      .populate('userId', 'name email avatar')
      .populate('invitedBy', 'name')
      .sort({ joinedAt: -1 })
      .exec();

    // Get partner statistics (mock data for now - can be enhanced with real stats)
    return partners.map((partner) => ({
      id: partner._id.toString(),
      userId: partner.userId._id.toString(),
      name: partner.userId.name,
      email: partner.userId.email,
      avatar: partner.userId.avatar,
      status: partner.partnerStatus,
      joinedAt: partner.joinedAt,
      invitedBy: partner.invitedBy.name,
      // Mock statistics - replace with real data from check-ins
      streak: Math.floor(Math.random() * 30),
      progress: Math.floor(Math.random() * 100),
      lastCheckIn: partner.joinedAt.toISOString(),
      activities: 1,
      totalCheckIns: Math.floor(Math.random() * 50),
    }));
  }

  // Get pending invitations for an activity
  async getPendingInvitations(
    activityId: string,
    userId: string,
  ): Promise<any[]> {
    // Verify activity exists and user is a participant
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const isParticipant = activity.participants?.some(
      (p) => p.toString() === userId,
    );
    const isAdmin = activity.admin?.toString() === userId;

    if (!isParticipant && !isAdmin) {
      throw new ForbiddenException(
        'You must be a participant to view invitations',
      );
    }

    const invitations = await this.partnerInvitationModel
      .find({
        activityId: new Types.ObjectId(activityId),
        status: 'pending',
        $or: [
          { toUserId: new Types.ObjectId(userId) },
          { fromUserId: new Types.ObjectId(userId) },
        ],
      })
      .populate('fromUserId', 'name email avatar')
      .populate('toUserId', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();

    return invitations.map((invitation) => ({
      id: invitation._id.toString(),
      fromUser: {
        id: invitation.fromUserId._id.toString(),
        name: invitation.fromUserId.name,
        email: invitation.fromUserId.email,
        avatar: invitation.fromUserId.avatar,
      },
      toUser: invitation.toUserId
        ? {
            id: invitation.toUserId._id.toString(),
            name: invitation.toUserId.name,
            email: invitation.toUserId.email,
            avatar: invitation.toUserId.avatar,
          }
        : null,
      toEmail: invitation.toEmail,
      message: invitation.message,
      status: invitation.status,
      createdAt: invitation.createdAt,
      expiresAt: invitation.expiresAt,
    }));
  }

  // Respond to invitation
  async respondToInvitation(
    invitationId: string,
    userId: string,
    respondDto: RespondToInvitationDto,
  ): Promise<PartnerInvitationDocument> {
    const invitation = await this.partnerInvitationModel
      .findById(invitationId)
      .populate('activityId')
      .exec();

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Check if invitation is expired
    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      await invitation.save();
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user is the recipient
    if (invitation.toUserId?.toString() !== userId) {
      throw new ForbiddenException(
        'You can only respond to invitations sent to you',
      );
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      throw new BadRequestException('Invitation has already been responded to');
    }

    const { action } = respondDto;

    if (action === 'accept') {
      // Create partnership
      const partner = new this.partnerModel({
        activityId: invitation.activityId,
        userId: invitation.toUserId,
        invitedBy: invitation.fromUserId,
        partnerStatus: 'active',
        joinedAt: new Date(),
      });

      await partner.save();

      // Update invitation status
      invitation.status = 'accepted';
    } else {
      // Decline invitation
      invitation.status = 'declined';
    }

    return invitation.save();
  }

  // Remove partner
  async removePartner(
    activityId: string,
    partnerId: string,
    userId: string,
  ): Promise<void> {
    // Verify activity exists and user is a participant
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const isParticipant = activity.participants?.some(
      (p) => p.toString() === userId,
    );
    const isAdmin = activity.admin?.toString() === userId;

    if (!isParticipant && !isAdmin) {
      throw new ForbiddenException(
        'You must be a participant to remove partners',
      );
    }

    const partner = await this.partnerModel
      .findOne({
        _id: new Types.ObjectId(partnerId),
        activityId: new Types.ObjectId(activityId),
      })
      .exec();

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    // Check if user is removing themselves or is admin
    if (partner.userId.toString() !== userId && !isAdmin) {
      throw new ForbiddenException('You can only remove yourself as a partner');
    }

    await this.partnerModel.findByIdAndDelete(partnerId).exec();
  }

  // Get invitation by token (for email/link invitations)
  async getInvitationByToken(token: string): Promise<any> {
    const invitation = await this.partnerInvitationModel
      .findOne({
        invitationToken: token,
        status: 'pending',
        expiresAt: { $gt: new Date() },
      })
      .populate('activityId', 'title description')
      .populate('fromUserId', 'name email avatar')
      .exec();

    if (!invitation) {
      throw new NotFoundException('Invalid or expired invitation');
    }

    return {
      id: invitation._id.toString(),
      activity: {
        id: invitation.activityId._id.toString(),
        title: invitation.activityId.title,
        description: invitation.activityId.description,
      },
      fromUser: {
        id: invitation.fromUserId._id.toString(),
        name: invitation.fromUserId.name,
        email: invitation.fromUserId.email,
        avatar: invitation.fromUserId.avatar,
      },
      message: invitation.message,
      expiresAt: invitation.expiresAt,
    };
  }

  // Accept invitation by token (for email/link invitations)
  async acceptInvitationByToken(
    token: string,
    userId: string,
  ): Promise<PartnerDocument> {
    const invitation = await this.partnerInvitationModel
      .findOne({
        invitationToken: token,
        status: 'pending',
        expiresAt: { $gt: new Date() },
      })
      .exec();

    if (!invitation) {
      throw new NotFoundException('Invalid or expired invitation');
    }

    // Check if user is already a partner
    const existingPartner = await this.partnerModel
      .findOne({
        activityId: invitation.activityId,
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (existingPartner) {
      throw new ConflictException('You are already a partner in this activity');
    }

    // Create partnership
    const partner = new this.partnerModel({
      activityId: invitation.activityId,
      userId: new Types.ObjectId(userId),
      invitedBy: invitation.fromUserId,
      partnerStatus: 'active',
      joinedAt: new Date(),
    });

    await partner.save();

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    return partner;
  }
}
