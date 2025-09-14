import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ActivityMessage,
  ActivityMessageDocument,
} from './schemas/activity-message.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityMessageDto } from './dto/create-activity-message.dto';
import { UpdateActivityMessageDto } from './dto/update-activity-message.dto';

@Injectable()
export class ActivityMessageService {
  constructor(
    @InjectModel(ActivityMessage.name)
    private activityMessageModel: Model<ActivityMessageDocument>,
    @InjectModel(Activity.name)
    private activityModel: Model<ActivityDocument>,
  ) {}

  // Create a new message
  async createMessage(
    activityId: string,
    userId: string,
    createMessageDto: CreateActivityMessageDto,
  ): Promise<ActivityMessageDocument> {
    // Verify activity exists and user is a participant
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check if user is a participant or admin
    const isParticipant = activity.participants?.some(
      (p) => p.toString() === userId,
    );
    const isAdmin = activity.admin?.toString() === userId;

    if (!isParticipant && !isAdmin) {
      throw new ForbiddenException(
        'You must be a participant to send messages',
      );
    }

    const message = new this.activityMessageModel({
      activityId: new Types.ObjectId(activityId),
      userId: new Types.ObjectId(userId),
      content: createMessageDto.content,
      tags: createMessageDto.tags || [],
    });

    return message.save();
  }

  // Get messages for an activity
  async getMessages(
    activityId: string,
    userId: string,
    options: {
      page?: number;
      limit?: number;
      search?: string;
      tag?: string;
      pinnedOnly?: boolean;
    } = {},
  ): Promise<{
    messages: ActivityMessageDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 20, search, tag, pinnedOnly } = options;

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
        'You must be a participant to view messages',
      );
    }

    // Build query
    const query: any = { activityId: new Types.ObjectId(activityId) };

    if (search) {
      query.content = { $regex: search, $options: 'i' };
    }

    if (tag) {
      query.tags = tag;
    }

    if (pinnedOnly) {
      query.isPinned = true;
    }

    // Get total count
    const total = await this.activityMessageModel.countDocuments(query);

    // Get messages with pagination
    const messages = await this.activityMessageModel
      .find(query)
      .populate('userId', 'name avatar')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Toggle like on a message
  async toggleLike(
    messageId: string,
    userId: string,
  ): Promise<ActivityMessageDocument> {
    const message = await this.activityMessageModel
      .findById(messageId)
      .populate('activityId')
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify user is a participant
    const activity = message.activityId as any;
    const isParticipant = activity.participants?.some(
      (p) => p.toString() === userId,
    );
    const isAdmin = activity.admin?.toString() === userId;

    if (!isParticipant && !isAdmin) {
      throw new ForbiddenException(
        'You must be a participant to like messages',
      );
    }

    const userIdObj = new Types.ObjectId(userId);
    const hasLiked = message.likedBy.some((id) => id.toString() === userId);

    if (hasLiked) {
      // Remove like
      message.likedBy = message.likedBy.filter(
        (id) => id.toString() !== userId,
      );
      message.likes = Math.max(0, message.likes - 1);
    } else {
      // Add like
      message.likedBy.push(userIdObj);
      message.likes += 1;
    }

    return message.save();
  }

  // Toggle pin on a message (admin only)
  async togglePin(
    messageId: string,
    userId: string,
  ): Promise<ActivityMessageDocument> {
    const message = await this.activityMessageModel
      .findById(messageId)
      .populate('activityId')
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify user is admin
    const activity = message.activityId as any;
    const isAdmin = activity.admin?.toString() === userId;

    if (!isAdmin) {
      throw new ForbiddenException('Only activity admins can pin messages');
    }

    message.isPinned = !message.isPinned;
    return message.save();
  }

  // Update a message
  async updateMessage(
    messageId: string,
    userId: string,
    updateMessageDto: UpdateActivityMessageDto,
  ): Promise<ActivityMessageDocument> {
    const message = await this.activityMessageModel
      .findById(messageId)
      .populate('activityId')
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify user is the message author or admin
    const isAuthor = message.userId.toString() === userId;
    const activity = message.activityId as any;
    const isAdmin = activity.admin?.toString() === userId;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(
        'You can only edit your own messages or be an admin',
      );
    }

    // Only allow content and tags updates for non-admins
    if (!isAdmin && updateMessageDto.isPinned !== undefined) {
      throw new ForbiddenException('Only admins can pin/unpin messages');
    }

    Object.assign(message, updateMessageDto);
    return message.save();
  }

  // Delete a message
  async deleteMessage(
    messageId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const message = await this.activityMessageModel
      .findById(messageId)
      .populate('activityId')
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify user is the message author or admin
    const isAuthor = message.userId.toString() === userId;
    const activity = message.activityId as any;
    const isAdmin = activity.admin?.toString() === userId;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(
        'You can only delete your own messages or be an admin',
      );
    }

    await this.activityMessageModel.findByIdAndDelete(messageId).exec();

    return { message: 'Message deleted successfully' };
  }

  // Get message statistics
  async getMessageStats(activityId: string): Promise<{
    totalMessages: number;
    pinnedMessages: number;
    totalLikes: number;
    mostActiveUsers: Array<{
      userId: string;
      name: string;
      avatar?: string;
      messageCount: number;
    }>;
  }> {
    const totalMessages = await this.activityMessageModel.countDocuments({
      activityId: new Types.ObjectId(activityId),
    });

    const pinnedMessages = await this.activityMessageModel.countDocuments({
      activityId: new Types.ObjectId(activityId),
      isPinned: true,
    });

    const totalLikesResult = await this.activityMessageModel.aggregate([
      { $match: { activityId: new Types.ObjectId(activityId) } },
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } },
    ]);

    const totalLikes = totalLikesResult[0]?.totalLikes || 0;

    const mostActiveUsers = await this.activityMessageModel.aggregate([
      { $match: { activityId: new Types.ObjectId(activityId) } },
      {
        $group: {
          _id: '$userId',
          messageCount: { $sum: 1 },
        },
      },
      { $sort: { messageCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          userId: '$_id',
          name: { $arrayElemAt: ['$user.name', 0] },
          avatar: { $arrayElemAt: ['$user.avatar', 0] },
          messageCount: 1,
        },
      },
    ]);

    return {
      totalMessages,
      pinnedMessages,
      totalLikes,
      mostActiveUsers,
    };
  }
}
