import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  BuddyConnection,
  BuddyConnectionDocument,
  ConnectionStatus,
} from '../schemas/buddy-connection.schema';
import { User, UserDocument } from '../schemas/user.schema';
import {
  CreateBuddyRequestDto,
  UpdateBuddyRequestDto,
  BuddyConnectionResponseDto,
  BuddyStatsDto,
  MutualConnectionDto,
} from '../dto/buddy-connection.dto';
import { NotificationManagerService } from '../../activities/services/notification-manager.service';

@Injectable()
export class BuddyConnectionService {
  constructor(
    @InjectModel(BuddyConnection.name)
    private buddyConnectionModel: Model<BuddyConnectionDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => NotificationManagerService))
    private notificationManagerService: NotificationManagerService,
  ) {}

  async sendBuddyRequest(
    requesterId: string,
    createBuddyRequestDto: CreateBuddyRequestDto,
  ): Promise<BuddyConnectionResponseDto> {
    const { recipientId, message } = createBuddyRequestDto;

    // Check if users exist
    const [requester, recipient] = await Promise.all([
      this.userModel.findById(requesterId),
      this.userModel.findById(recipientId),
    ]);

    if (!requester || !recipient) {
      throw new NotFoundException('User not found');
    }

    if (requesterId === recipientId) {
      throw new BadRequestException('Cannot send buddy request to yourself');
    }

    // Check if connection already exists
    const existingConnection = await this.buddyConnectionModel.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingConnection) {
      if (existingConnection.status === ConnectionStatus.ACCEPTED) {
        throw new BadRequestException('Users are already connected');
      }
      if (existingConnection.status === ConnectionStatus.PENDING) {
        throw new BadRequestException('Buddy request already exists');
      }
      if (existingConnection.status === ConnectionStatus.BLOCKED) {
        throw new ForbiddenException('Cannot send request to this user');
      }
    }

    // Create new buddy request
    const buddyRequest = new this.buddyConnectionModel({
      requester: requesterId,
      recipient: recipientId,
      status: ConnectionStatus.PENDING,
      message,
    });

    const savedRequest = await buddyRequest.save();

    // Create notification for recipient
    try {
      await this.notificationManagerService.createBuddyRequestNotification(
        recipientId,
        requesterId,
        savedRequest._id.toString(),
      );
    } catch (error) {
      // Log error but don't fail the request
      console.error('Failed to create buddy request notification:', error);
    }

    return this.formatBuddyConnectionResponse(savedRequest);
  }

  async respondToBuddyRequest(
    recipientId: string,
    requestId: string,
    updateDto: UpdateBuddyRequestDto,
  ): Promise<BuddyConnectionResponseDto> {
    const connection = await this.buddyConnectionModel.findById(requestId);

    if (!connection) {
      throw new NotFoundException('Buddy request not found');
    }

    if (connection.recipient.toString() !== recipientId) {
      throw new ForbiddenException(
        'You can only respond to requests sent to you',
      );
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestException('Request has already been responded to');
    }

    // Update connection status
    connection.status = updateDto.status;
    if (updateDto.status === ConnectionStatus.ACCEPTED) {
      connection.acceptedAt = new Date();
    } else if (updateDto.status === ConnectionStatus.DECLINED) {
      connection.declinedAt = new Date();
    }

    const updatedConnection = await connection.save();

    // Create notification for requester based on response
    try {
      if (updateDto.status === ConnectionStatus.ACCEPTED) {
        await this.notificationManagerService.createBuddyAcceptedNotification(
          connection.requester.toString(),
          recipientId,
        );
      } else if (updateDto.status === ConnectionStatus.DECLINED) {
        await this.notificationManagerService.createBuddyDeclinedNotification(
          connection.requester.toString(),
          recipientId,
        );
      }
    } catch (error) {
      // Log error but don't fail the response
      console.error('Failed to create buddy response notification:', error);
    }

    return this.formatBuddyConnectionResponse(updatedConnection);
  }

  async getBuddyConnections(
    userId: string,
    status?: ConnectionStatus,
  ): Promise<BuddyConnectionResponseDto[]> {
    const query: any = {
      $or: [{ requester: userId }, { recipient: userId }],
    };

    if (status) {
      query.status = status;
    }

    const connections = await this.buddyConnectionModel
      .find(query)
      .populate('requester', 'name profilePicture profileLink')
      .populate('recipient', 'name profilePicture profileLink')
      .sort({ createdAt: -1 });

    return connections.map((connection) =>
      this.formatBuddyConnectionResponse(connection),
    );
  }

  async getPendingRequests(
    userId: string,
  ): Promise<BuddyConnectionResponseDto[]> {
    return this.getBuddyConnections(userId, ConnectionStatus.PENDING);
  }

  async getReceivedRequests(
    userId: string,
  ): Promise<BuddyConnectionResponseDto[]> {
    const connections = await this.buddyConnectionModel
      .find({
        recipient: userId,
        status: ConnectionStatus.PENDING,
      })
      .populate('requester', 'name profilePicture profileLink')
      .populate('recipient', 'name profilePicture profileLink')
      .sort({ createdAt: -1 });

    return connections.map((connection) =>
      this.formatBuddyConnectionResponse(connection),
    );
  }

  async getBuddyStats(userId: string): Promise<BuddyStatsDto> {
    const [totalConnections, pendingRequests, receivedRequests] =
      await Promise.all([
        this.buddyConnectionModel.countDocuments({
          $or: [{ requester: userId }, { recipient: userId }],
          status: ConnectionStatus.ACCEPTED,
        }),
        this.buddyConnectionModel.countDocuments({
          requester: userId,
          status: ConnectionStatus.PENDING,
        }),
        this.buddyConnectionModel.countDocuments({
          recipient: userId,
          status: ConnectionStatus.PENDING,
        }),
      ]);

    return {
      totalConnections,
      pendingRequests,
      receivedRequests,
    };
  }

  async getMutualConnections(
    userId1: string,
    userId2: string,
  ): Promise<MutualConnectionDto[]> {
    // Get connections for both users
    const [user1Connections, user2Connections] = await Promise.all([
      this.buddyConnectionModel.find({
        $or: [{ requester: userId1 }, { recipient: userId1 }],
        status: ConnectionStatus.ACCEPTED,
      }),
      this.buddyConnectionModel.find({
        $or: [{ requester: userId2 }, { recipient: userId2 }],
        status: ConnectionStatus.ACCEPTED,
      }),
    ]);

    // Extract connected user IDs
    const user1ConnectedIds = new Set(
      user1Connections.map((conn) => {
        const connectedUserId =
          conn.requester.toString() === userId1
            ? conn.recipient.toString()
            : conn.requester.toString();
        return connectedUserId;
      }),
    );

    const user2ConnectedIds = new Set(
      user2Connections.map((conn) => {
        const connectedUserId =
          conn.requester.toString() === userId2
            ? conn.recipient.toString()
            : conn.requester.toString();
        return connectedUserId;
      }),
    );

    // Find mutual connections
    const mutualIds = [...user1ConnectedIds].filter((id) =>
      user2ConnectedIds.has(id),
    );

    if (mutualIds.length === 0) {
      return [];
    }

    // Get user details for mutual connections
    const mutualUsers = await this.userModel.find({
      _id: { $in: mutualIds },
    });

    return mutualUsers.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      avatar: user.profilePicture,
      profileLink: user.profileLink,
      connectedAt: new Date(), // This would need to be calculated from the actual connection date
    }));
  }

  async removeBuddyConnection(
    userId: string,
    connectionId: string,
  ): Promise<{ message: string }> {
    const connection = await this.buddyConnectionModel.findById(connectionId);

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    if (
      connection.requester.toString() !== userId &&
      connection.recipient.toString() !== userId
    ) {
      throw new ForbiddenException('You can only remove your own connections');
    }

    await this.buddyConnectionModel.findByIdAndDelete(connectionId);

    return { message: 'Buddy connection removed successfully' };
  }

  async checkConnectionStatus(
    userId1: string,
    userId2: string,
  ): Promise<{ status: ConnectionStatus | null; connectionId?: string }> {
    const connection = await this.buddyConnectionModel.findOne({
      $or: [
        { requester: userId1, recipient: userId2 },
        { requester: userId2, recipient: userId1 },
      ],
    });

    if (!connection) {
      return { status: null };
    }

    return {
      status: connection.status,
      connectionId: connection._id.toString(),
    };
  }

  private formatBuddyConnectionResponse(
    connection: BuddyConnectionDocument,
  ): BuddyConnectionResponseDto {
    const requester = connection.requester as any;
    const recipient = connection.recipient as any;

    return {
      id: connection._id.toString(),
      requester: {
        id: requester._id.toString(),
        name: requester.name,
        avatar: requester.profilePicture,
        profileLink: requester.profileLink,
      },
      recipient: {
        id: recipient._id.toString(),
        name: recipient.name,
        avatar: recipient.profilePicture,
        profileLink: recipient.profileLink,
      },
      status: connection.status,
      message: connection.message,
      acceptedAt: connection.acceptedAt,
      declinedAt: connection.declinedAt,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  }
}
