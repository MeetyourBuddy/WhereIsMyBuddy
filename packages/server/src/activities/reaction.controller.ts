import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ReactionService,
  ReactionStats,
  UserReaction,
} from './reaction.service';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';

@Controller('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('checkin/:checkInId')
  async addReaction(
    @Param('checkInId') checkInId: string,
    @GetUser('userId') userId: string,
    @Body('type') reactionType: string,
  ): Promise<ReactionStats> {
    return this.reactionService.addReaction(checkInId, userId, reactionType);
  }

  @Delete('checkin/:checkInId')
  async removeReaction(
    @Param('checkInId') checkInId: string,
    @GetUser('userId') userId: string,
  ): Promise<ReactionStats> {
    return this.reactionService.removeReaction(checkInId, userId);
  }

  @Get('checkin/:checkInId/stats')
  async getReactionStats(
    @Param('checkInId') checkInId: string,
    @GetUser('userId') userId: string,
  ): Promise<ReactionStats> {
    return this.reactionService.getReactionStats(checkInId, userId);
  }

  @Get('checkin/:checkInId/user')
  async getUserReaction(
    @Param('checkInId') checkInId: string,
    @GetUser('userId') userId: string,
  ): Promise<UserReaction | null> {
    return this.reactionService.getUserReaction(checkInId, userId);
  }

  @Get('checkin/:checkInId/list')
  async getReactionsForCheckIn(
    @Param('checkInId') checkInId: string,
  ): Promise<Array<{ type: string; user: { _id: string; name: string; avatar?: string } }>> {
    const reactions = await this.reactionService.getReactionsForCheckIn(checkInId);
    return reactions.map((r) => ({
      type: r.type,
      user: r.user && typeof r.user === 'object' && 'name' in r.user
        ? {
            _id: String((r.user as any)._id ?? (r.user as any).id),
            name: (r.user as any).name ?? 'Unknown',
            avatar: (r.user as any).avatar,
          }
        : { _id: String(r.user), name: 'Unknown', avatar: undefined },
    }));
  }
}
