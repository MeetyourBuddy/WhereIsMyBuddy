import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CheckInComment,
  CheckInCommentDocument,
} from './schemas/checkin-comment.schema';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';
import {
  CreateCheckInCommentDto,
  UpdateCheckInCommentDto,
  CheckInCommentResponseDto,
} from './dto/checkin-comment.dto';

@Injectable()
export class CheckInCommentService {
  constructor(
    @InjectModel(CheckInComment.name)
    private checkInCommentModel: Model<CheckInCommentDocument>,
    @InjectModel(CheckIn.name)
    private checkInModel: Model<CheckInDocument>,
  ) {}

  async createComment(
    createCommentDto: CreateCheckInCommentDto,
    userId: string,
  ): Promise<CheckInCommentResponseDto> {
    const { checkInId, content, parentCommentId } = createCommentDto;

    // Validate check-in exists and user has access
    const checkIn = await this.checkInModel
      .findById(checkInId)
      .populate('activity', 'participants admin')
      .exec();

    if (!checkIn || checkIn.isDeleted) {
      throw new NotFoundException('Check-in not found');
    }

    // Check if user is a participant of the activity
    const activity = checkIn.activity as any;
    const isParticipant =
      activity.participants?.some(
        (participant: any) => participant.toString() === userId,
      ) || activity.admin?.toString() === userId;

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant of this activity',
      );
    }

    // Validate parent comment if provided
    if (parentCommentId) {
      const parentComment = await this.checkInCommentModel
        .findOne({
          _id: parentCommentId,
          checkIn: checkInId,
          isDeleted: false,
        })
        .exec();

      if (!parentComment) {
        throw new BadRequestException('Parent comment not found or invalid');
      }
    }

    // Create comment
    const comment = new this.checkInCommentModel({
      checkIn: checkInId,
      user: userId,
      content: content.trim(),
      parentComment: parentCommentId || undefined,
    });

    const savedComment = await comment.save();
    return this.formatCommentResponse(savedComment);
  }

  async getCommentsByCheckIn(
    checkInId: string,
  ): Promise<CheckInCommentResponseDto[]> {
    if (!Types.ObjectId.isValid(checkInId)) {
      throw new BadRequestException('Invalid check-in ID');
    }

    const comments = await this.checkInCommentModel
      .find({
        checkIn: checkInId,
        isDeleted: false,
        parentComment: { $exists: false }, // Only top-level comments
      })
      .populate('user', 'name email avatar')
      .sort({ createdAt: 1 })
      .exec();

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this.checkInCommentModel
          .find({
            parentComment: comment._id,
            isDeleted: false,
          })
          .populate('user', 'name email avatar')
          .sort({ createdAt: 1 })
          .exec();

        const formattedComment = this.formatCommentResponse(comment);
        formattedComment.replies = replies.map((reply) =>
          this.formatCommentResponse(reply),
        );
        return formattedComment;
      }),
    );

    return commentsWithReplies;
  }

  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCheckInCommentDto,
    userId: string,
  ): Promise<CheckInCommentResponseDto> {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.checkInCommentModel
      .findOne({
        _id: commentId,
        user: userId,
        isDeleted: false,
      })
      .exec();

    if (!comment) {
      throw new NotFoundException(
        'Comment not found or you do not have permission to edit it',
      );
    }

    comment.content = updateCommentDto.content.trim();
    const updatedComment = await comment.save();
    return this.formatCommentResponse(updatedComment);
  }

  async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.checkInCommentModel
      .findOne({
        _id: commentId,
        user: userId,
        isDeleted: false,
      })
      .exec();

    if (!comment) {
      throw new NotFoundException(
        'Comment not found or you do not have permission to delete it',
      );
    }

    // Soft delete the comment
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    await comment.save();

    return { message: 'Comment deleted successfully' };
  }

  async getCommentCount(checkInId: string): Promise<number> {
    if (!Types.ObjectId.isValid(checkInId)) {
      return 0;
    }

    return this.checkInCommentModel
      .countDocuments({
        checkIn: checkInId,
        isDeleted: false,
      })
      .exec();
  }

  private formatCommentResponse(
    comment: CheckInCommentDocument,
  ): CheckInCommentResponseDto {
    return {
      _id: comment._id.toString(),
      checkIn: comment.checkIn.toString(),
      user: {
        _id: (comment.user as any)._id?.toString() || comment.user.toString(),
        name: (comment.user as any).name || 'Unknown User',
        email: (comment.user as any).email || '',
        avatar: (comment.user as any).avatar || '',
      },
      content: comment.content,
      parentComment: comment.parentComment?.toString(),
      isDeleted: comment.isDeleted,
      deletedAt: comment.deletedAt,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
