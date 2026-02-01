import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ActivityJoinRequest,
  ActivityJoinRequestDocument,
} from './schemas/activity-join-request.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityJoinRequestDto } from './dto/create-activity-join-request.dto';
import { NotificationManagerService } from './services/notification-manager.service';
import { NotificationType } from './schemas/notification.schema';

@Injectable()
export class ActivityJoinRequestService {
  constructor(
    @InjectModel(ActivityJoinRequest.name)
    private joinRequestModel: Model<ActivityJoinRequestDocument>,
    @InjectModel(Activity.name)
    private activityModel: Model<ActivityDocument>,
    private readonly notificationManagerService: NotificationManagerService,
  ) {}

  async createRequest(
    activityId: string,
    userId: string,
    dto: CreateActivityJoinRequestDto,
  ): Promise<ActivityJoinRequestDocument> {
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    if (activity.type !== 'private') {
      throw new BadRequestException(
        'Join requests are only for private activities',
      );
    }
    const adminId = activity.admin?._id?.toString() ?? activity.admin?.toString();
    if (adminId === userId) {
      throw new BadRequestException('Activity creator cannot request to join');
    }
    const isParticipant = activity.participants?.some(
      (p) => p.toString() === userId,
    );
    if (isParticipant) {
      throw new ConflictException('You are already a participant');
    }

    // Unique index is on (activityId, userId) – only one request doc per pair
    const existing = await this.joinRequestModel
      .findOne({
        activityId: new Types.ObjectId(activityId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (existing) {
      if (existing.status === 'accepted') {
        // If they quit, they're no longer a participant – allow re-request
        if (isParticipant) {
          throw new ConflictException(
            'Your request was already accepted. You are a participant.',
          );
        }
        existing.status = 'pending';
        existing.message = dto.message ?? existing.message;
        const saved = await existing.save();
        if (adminId) {
          try {
            await this.notificationManagerService.createNotification({
              recipientId: adminId,
              senderId: userId,
              type: NotificationType.ACTIVITY_JOIN_REQUEST,
              title: 'New join request',
              message: `Someone requested to join "${activity.title}"`,
              metadata: {
                activityId,
                activityTitle: activity.title,
                joinRequestId: saved._id.toString(),
              },
            });
          } catch {
            // Non-blocking
          }
        }
        return saved as ActivityJoinRequestDocument;
      }
      if (existing.status === 'pending') {
        throw new ConflictException('You already have a pending request');
      }
      // status === 'declined' – allow re-request by updating existing doc
      existing.status = 'pending';
      existing.message = dto.message ?? existing.message;
      const saved = await existing.save();

      if (adminId) {
        try {
          await this.notificationManagerService.createNotification({
            recipientId: adminId,
            senderId: userId,
            type: NotificationType.ACTIVITY_JOIN_REQUEST,
            title: 'New join request',
            message: `Someone requested to join "${activity.title}"`,
            metadata: {
              activityId,
              activityTitle: activity.title,
              joinRequestId: saved._id.toString(),
            },
          });
        } catch {
          // Non-blocking
        }
      }
      return saved as ActivityJoinRequestDocument;
    }

    const request = new this.joinRequestModel({
      activityId: new Types.ObjectId(activityId),
      userId: new Types.ObjectId(userId),
      message: dto.message,
      status: 'pending',
    });
    const saved = await request.save();

    // Notify activity creator
    if (adminId) {
      try {
        await this.notificationManagerService.createNotification({
          recipientId: adminId,
          senderId: userId,
          type: NotificationType.ACTIVITY_JOIN_REQUEST,
          title: 'New join request',
          message: `Someone requested to join "${activity.title}"`,
          metadata: {
            activityId,
            activityTitle: activity.title,
            joinRequestId: saved._id.toString(),
          },
        });
      } catch {
        // Non-blocking
      }
    }

    return saved;
  }

  async getRequestsForActivity(
    activityId: string,
    userId: string,
  ): Promise<ActivityJoinRequestDocument[]> {
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    const adminId = activity.admin?._id?.toString() ?? activity.admin?.toString();
    if (adminId !== userId) {
      throw new ForbiddenException('Only the activity creator can view requests');
    }
    return this.joinRequestModel
      .find({ activityId: new Types.ObjectId(activityId) })
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar email')
      .exec();
  }

  async acceptRequest(
    activityId: string,
    requestId: string,
    userId: string,
  ): Promise<ActivityJoinRequestDocument> {
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    const adminId = activity.admin?._id?.toString() ?? activity.admin?.toString();
    if (adminId !== userId) {
      throw new ForbiddenException('Only the activity creator can accept requests');
    }
    const request = await this.joinRequestModel
      .findOne({
        _id: new Types.ObjectId(requestId),
        activityId: new Types.ObjectId(activityId),
        status: 'pending',
      })
      .exec();
    if (!request) {
      throw new NotFoundException('Join request not found or already handled');
    }
    request.status = 'accepted';
    await request.save();

    const requesterId = request.userId.toString();
    const isAlreadyParticipant = activity.participants?.some(
      (p) => p.toString() === requesterId,
    );
    const isFull =
      (activity.participants?.length ?? 0) >= (activity.maxParticipants ?? 0);

    if (!isAlreadyParticipant && !isFull) {
      await this.activityModel.findByIdAndUpdate(activityId, {
        $push: { participants: new Types.ObjectId(requesterId) },
      });
    }

    // Notify requester
    try {
      await this.notificationManagerService.createNotification({
        recipientId: requesterId,
        senderId: userId,
        type: NotificationType.ACTIVITY_INVITE,
        title: 'Join request accepted',
        message: `Your request to join "${activity.title}" was accepted. You're now a participant.`,
        metadata: {
          activityId,
          activityTitle: activity.title,
          joinRequestId: requestId,
        },
      });
    } catch {
      // Non-blocking
    }

    return request;
  }

  async declineRequest(
    activityId: string,
    requestId: string,
    userId: string,
  ): Promise<ActivityJoinRequestDocument> {
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    const adminId = activity.admin?._id?.toString() ?? activity.admin?.toString();
    if (adminId !== userId) {
      throw new ForbiddenException('Only the activity creator can decline requests');
    }
    const request = await this.joinRequestModel
      .findOne({
        _id: new Types.ObjectId(requestId),
        activityId: new Types.ObjectId(activityId),
        status: 'pending',
      })
      .exec();
    if (!request) {
      throw new NotFoundException('Join request not found or already handled');
    }
    const requesterId = request.userId.toString();
    request.status = 'declined';
    await request.save();

    try {
      await this.notificationManagerService.createNotification({
        recipientId: requesterId,
        senderId: userId,
        type: NotificationType.ACTIVITY_JOIN_REQUEST_DECLINED,
        title: 'Join request declined',
        message: `Your request to join "${activity.title}" was declined.`,
        metadata: {
          activityId,
          activityTitle: activity.title,
          joinRequestId: requestId,
        },
      });
    } catch {
      // Non-blocking
    }

    return request;
  }

  async hasAcceptedJoinRequest(
    activityId: string,
    userId: string,
  ): Promise<boolean> {
    const doc = await this.joinRequestModel
      .findOne({
        activityId: new Types.ObjectId(activityId),
        userId: new Types.ObjectId(userId),
        status: 'accepted',
      })
      .exec();
    return !!doc;
  }

  async getMyPendingRequest(
    activityId: string,
    userId: string,
  ): Promise<ActivityJoinRequestDocument | null> {
    return this.joinRequestModel
      .findOne({
        activityId: new Types.ObjectId(activityId),
        userId: new Types.ObjectId(userId),
        status: 'pending',
      })
      .exec();
  }

  /** Join request status by activity for the user (pending or accepted; for list enrichment). */
  async getJoinRequestStatusByActivityForUser(
    userId: string,
  ): Promise<Map<string, 'pending' | 'accepted'>> {
    const docs = await this.joinRequestModel
      .find({
        userId: new Types.ObjectId(userId),
        status: { $in: ['pending', 'accepted'] },
      })
      .select('activityId status')
      .lean()
      .exec();
    const map = new Map<string, 'pending' | 'accepted'>();
    for (const d of docs) {
      const aid = (d.activityId as Types.ObjectId).toString();
      map.set(aid, d.status as 'pending' | 'accepted');
    }
    return map;
  }
}
