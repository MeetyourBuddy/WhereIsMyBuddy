import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ActivityInvitation,
  ActivityInvitationDocument,
} from './schemas/activity-invitation.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateActivityInvitationDto } from './dto/create-activity-invitation.dto';
import * as crypto from 'crypto';
import { NotificationManagerService } from './services/notification-manager.service';
import { NotificationType } from './schemas/notification.schema';

@Injectable()
export class ActivityInvitationService {
  constructor(
    @InjectModel(ActivityInvitation.name)
    private activityInvitationModel: Model<ActivityInvitationDocument>,
    @InjectModel(Activity.name)
    private activityModel: Model<ActivityDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => NotificationManagerService))
    private readonly notificationManagerService: NotificationManagerService,
  ) {}

  // Create activity invitation (only creator can invite)
  async createInvitation(
    activityId: string,
    fromUserId: string,
    createInvitationDto: CreateActivityInvitationDto,
  ): Promise<ActivityInvitationDocument | ActivityInvitationDocument[]> {
    // Verify activity exists and user is the creator
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const isAdmin = activity.admin?.toString() === fromUserId;
    if (!isAdmin) {
      throw new ForbiddenException(
        'Only the activity creator can invite members',
      );
    }

    // Check if activity is private
    if (activity.type !== 'private') {
      throw new BadRequestException(
        'Invitations can only be sent for private activities',
      );
    }

    const { toUserId, toEmail, message, emails } = createInvitationDto;

    // Handle bulk invitations
    if (emails && emails.length > 0) {
      const invitations: ActivityInvitationDocument[] = [];
      for (const email of emails) {
        try {
          const invitation = await this.createSingleInvitation(
            activityId,
            fromUserId,
            { toEmail: email, message },
            activity,
          );
          invitations.push(invitation);
        } catch (error) {
          // Skip duplicates and continue
          if (error instanceof ConflictException) {
            continue;
          }
          throw error;
        }
      }
      return invitations;
    }

    // Single invitation
    if (!toUserId && !toEmail) {
      throw new BadRequestException(
        'Either toUserId or toEmail must be provided',
      );
    }

    return this.createSingleInvitation(
      activityId,
      fromUserId,
      { toUserId, toEmail, message },
      activity,
    );
  }

  private async createSingleInvitation(
    activityId: string,
    fromUserId: string,
    invitationData: {
      toUserId?: string;
      toEmail?: string;
      message?: string;
    },
    activity: ActivityDocument,
  ): Promise<ActivityInvitationDocument> {
    const { toUserId, toEmail, message } = invitationData;

    // If inviting by userId, verify user exists
    if (toUserId) {
      // Prevent self-invitation
      if (toUserId === fromUserId) {
        throw new BadRequestException(
          'You cannot send an invitation to yourself',
        );
      }

      const targetUser = await this.userModel.findById(toUserId).exec();
      if (!targetUser) {
        throw new NotFoundException('Target user not found');
      }

      // Check if user is already a participant
      const isParticipant = activity.participants?.some(
        (p) => p.toString() === toUserId,
      );
      if (isParticipant) {
        throw new ConflictException(
          'User is already a participant in this activity',
        );
      }

      // Check if there's already a pending invitation
      const existingInvitation = await this.activityInvitationModel
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

    // If inviting by email, prevent self-invitation
    if (toEmail) {
      const currentUser = await this.userModel.findById(fromUserId).exec();
      if (
        currentUser &&
        currentUser.email &&
        currentUser.email.toLowerCase() === toEmail.toLowerCase()
      ) {
        throw new BadRequestException(
          'You cannot send an invitation to yourself',
        );
      }

      // Check if email is already a participant
      const userByEmail = await this.userModel
        .findOne({ email: toEmail.toLowerCase() })
        .exec();
      if (userByEmail) {
        const isParticipant = activity.participants?.some(
          (p) => p.toString() === userByEmail._id.toString(),
        );
        if (isParticipant) {
          throw new ConflictException(
            'User with this email is already a participant',
          );
        }
      }

      // Check if there's already a pending invitation for this email
      const existingInvitation = await this.activityInvitationModel
        .findOne({
          activityId: new Types.ObjectId(activityId),
          toEmail: toEmail.toLowerCase(),
          status: 'pending',
        })
        .exec();

      if (existingInvitation) {
        throw new ConflictException('Invitation already sent to this email');
      }
    }

    // Generate invitation token for email invitations
    const invitationToken = toEmail
      ? crypto.randomBytes(32).toString('hex')
      : undefined;

    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // If inviting by email, check if user exists and link toUserId
    let finalToUserId = toUserId ? new Types.ObjectId(toUserId) : undefined;
    if (toEmail && !finalToUserId) {
      const userByEmail = await this.userModel
        .findOne({ email: toEmail.toLowerCase() })
        .exec();
      if (userByEmail && userByEmail._id) {
        // Convert _id to string first, then to ObjectId
        const userIdString = userByEmail._id.toString();
        finalToUserId = new Types.ObjectId(userIdString);
      }
    }

    const invitation = new this.activityInvitationModel({
      activityId: new Types.ObjectId(activityId),
      fromUserId: new Types.ObjectId(fromUserId),
      toUserId: finalToUserId,
      toEmail: toEmail?.toLowerCase(),
      message,
      invitationToken,
      expiresAt,
    });

    const savedInvitation = await invitation.save();

    // Create notification if target user exists
    if (finalToUserId) {
      try {
        const fromUser = await this.userModel.findById(fromUserId).exec();
        await this.notificationManagerService.createNotification({
          recipientId: finalToUserId.toString(),
          senderId: fromUserId,
          type: NotificationType.ACTIVITY_INVITE,
          title: `You're invited to ${activity.title}!`,
          message: message || `${fromUser?.name || 'Someone'} has invited you to join their activity: "${activity.title}".`,
          activityId: activityId,
          metadata: {
            invitationId: savedInvitation._id.toString(),
            invitationToken: savedInvitation.invitationToken,
          },
        });
      } catch (error) {
        console.error('Failed to create activity invitation notification:', error);
        // Don't fail the invitation if notification fails
      }
    }

    return savedInvitation;
  }

  // Get all invitations for an activity (admin only)
  async getInvitations(
    activityId: string,
    userId: string,
  ): Promise<ActivityInvitationDocument[]> {
    // Verify activity exists and user is the creator
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const isAdmin = activity.admin?.toString() === userId;
    if (!isAdmin) {
      throw new ForbiddenException(
        'Only the activity creator can view invitations',
      );
    }

    return this.activityInvitationModel
      .find({
        activityId: new Types.ObjectId(activityId),
      })
      .populate('toUserId', 'name email avatar')
      .populate('fromUserId', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Get invitations for a user
  async getUserInvitations(
    userId: string,
  ): Promise<ActivityInvitationDocument[]> {
    return this.activityInvitationModel
      .find({
        $or: [
          { toUserId: new Types.ObjectId(userId) },
          { toEmail: (await this.userModel.findById(userId).exec())?.email },
        ],
        status: 'pending',
      })
      .populate('activityId', 'title description bannerImage category type')
      .populate('fromUserId', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Get invitation by token (for email links)
  async getInvitationByToken(
    token: string,
  ): Promise<ActivityInvitationDocument> {
    const invitation = await this.activityInvitationModel
      .findOne({
        invitationToken: token,
        status: 'pending',
      })
      .populate('activityId', 'title description bannerImage category type admin participants')
      .populate('fromUserId', 'name email avatar')
      .populate('toUserId', 'name email avatar')
      .exec();

    if (!invitation) {
      throw new NotFoundException('Invitation not found or expired');
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      throw new BadRequestException('Invitation has expired');
    }

    return invitation;
  }

  // Check if user/email is invited to activity
  async checkInvitation(
    activityId: string,
    userIdOrEmail: string,
  ): Promise<ActivityInvitationDocument | null> {
    // Check if it's an email or userId
    const isEmail = userIdOrEmail.includes('@');
    
    if (isEmail) {
      return this.activityInvitationModel
        .findOne({
          activityId: new Types.ObjectId(activityId),
          toEmail: userIdOrEmail.toLowerCase(),
          status: 'pending',
        })
        .exec();
    } else {
      return this.activityInvitationModel
        .findOne({
          activityId: new Types.ObjectId(activityId),
          toUserId: new Types.ObjectId(userIdOrEmail),
          status: 'pending',
        })
        .exec();
    }
  }

  // Accept invitation
  async acceptInvitation(
    invitationId: string,
    userId: string,
  ): Promise<ActivityInvitationDocument> {
    const invitation = await this.activityInvitationModel
      .findById(invitationId)
      .exec();

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Verify user matches invitation
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if invitation is for this user
    const isForUser =
      (invitation.toUserId &&
        invitation.toUserId.toString() === userId) ||
      (invitation.toEmail &&
        user.email &&
        user.email.toLowerCase() === invitation.toEmail.toLowerCase());

    if (!isForUser) {
      throw new ForbiddenException('This invitation is not for you');
    }

    // Check if invitation is still valid
    if (invitation.status !== 'pending') {
      throw new BadRequestException('Invitation is no longer valid');
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      throw new BadRequestException('Invitation has expired');
    }

    // Update invitation status
    invitation.status = 'accepted';
    invitation.toUserId = new Types.ObjectId(userId);
    if (!invitation.toEmail && user.email) {
      invitation.toEmail = user.email.toLowerCase();
    }

    return invitation.save();
  }

  // Accept invitation by token
  async acceptInvitationByToken(
    token: string,
    userId: string,
  ): Promise<ActivityInvitationDocument> {
    const invitation = await this.getInvitationByToken(token);

    // Verify user matches invitation (by email if toUserId not set)
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if invitation is for this user
    const isForUser =
      (invitation.toUserId &&
        invitation.toUserId.toString() === userId) ||
      (invitation.toEmail &&
        user.email &&
        user.email.toLowerCase() === invitation.toEmail.toLowerCase());

    if (!isForUser) {
      throw new ForbiddenException('This invitation is not for you');
    }

    // Update invitation status and link toUserId
    invitation.status = 'accepted';
    invitation.toUserId = new Types.ObjectId(userId);
    if (!invitation.toEmail && user.email) {
      invitation.toEmail = user.email.toLowerCase();
    }

    return invitation.save();
  }

  // Decline invitation
  async declineInvitation(
    invitationId: string,
    userId: string,
  ): Promise<ActivityInvitationDocument> {
    const invitation = await this.activityInvitationModel
      .findById(invitationId)
      .exec();

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Verify user matches invitation
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isForUser =
      (invitation.toUserId &&
        invitation.toUserId.toString() === userId) ||
      (invitation.toEmail &&
        user.email &&
        user.email.toLowerCase() === invitation.toEmail.toLowerCase());

    if (!isForUser) {
      throw new ForbiddenException('This invitation is not for you');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException('Invitation is no longer valid');
    }

    invitation.status = 'declined';
    return invitation.save();
  }

  // Delete invitation (admin only)
  async deleteInvitation(
    invitationId: string,
    userId: string,
  ): Promise<void> {
    const invitation = await this.activityInvitationModel
      .findById(invitationId)
      .populate('activityId', 'admin')
      .exec();

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    const activity = invitation.activityId as any;
    if (activity.admin?.toString() !== userId) {
      throw new ForbiddenException(
        'Only the activity creator can delete invitations',
      );
    }

    await this.activityInvitationModel.findByIdAndDelete(invitationId).exec();
  }
}

