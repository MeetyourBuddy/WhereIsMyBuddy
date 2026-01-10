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
} from '@nestjs/common';
import { BuddyConnectionService } from '../services/buddy-connection.service';
import {
  CreateBuddyRequestDto,
  UpdateBuddyRequestDto,
  BuddyConnectionResponseDto,
  BuddyStatsDto,
  MutualConnectionDto,
} from '../dto/buddy-connection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { ConnectionStatus } from '../schemas/buddy-connection.schema';

@Controller('buddy-connections')
@UseGuards(JwtAuthGuard)
export class BuddyConnectionController {
  constructor(
    private readonly buddyConnectionService: BuddyConnectionService,
  ) {}

  @Post('request')
  async sendBuddyRequest(
    @GetUser('userId') userId: string,
    @Body() createBuddyRequestDto: CreateBuddyRequestDto,
  ): Promise<BuddyConnectionResponseDto> {
    return this.buddyConnectionService.sendBuddyRequest(
      userId,
      createBuddyRequestDto,
    );
  }

  @Put('request/:requestId/respond')
  async respondToBuddyRequest(
    @GetUser('userId') userId: string,
    @Param('requestId') requestId: string,
    @Body() updateDto: UpdateBuddyRequestDto,
  ): Promise<BuddyConnectionResponseDto> {
    return this.buddyConnectionService.respondToBuddyRequest(
      userId,
      requestId,
      updateDto,
    );
  }

  @Get()
  async getBuddyConnections(
    @GetUser('userId') userId: string,
    @Query('status') status?: ConnectionStatus,
  ): Promise<BuddyConnectionResponseDto[]> {
    return this.buddyConnectionService.getBuddyConnections(userId, status);
  }

  @Get('pending')
  async getPendingRequests(
    @GetUser('userId') userId: string,
  ): Promise<BuddyConnectionResponseDto[]> {
    return this.buddyConnectionService.getPendingRequests(userId);
  }

  @Get('received')
  async getReceivedRequests(
    @GetUser('userId') userId: string,
  ): Promise<BuddyConnectionResponseDto[]> {
    return this.buddyConnectionService.getReceivedRequests(userId);
  }

  @Get('stats')
  async getBuddyStats(
    @GetUser('userId') userId: string,
  ): Promise<BuddyStatsDto> {
    return this.buddyConnectionService.getBuddyStats(userId);
  }

  @Get('mutual/:otherUserId')
  async getMutualConnections(
    @GetUser('userId') userId: string,
    @Param('otherUserId') otherUserId: string,
  ): Promise<MutualConnectionDto[]> {
    return this.buddyConnectionService.getMutualConnections(
      userId,
      otherUserId,
    );
  }

  @Get('status/:otherUserId')
  async checkConnectionStatus(
    @GetUser('userId') userId: string,
    @Param('otherUserId') otherUserId: string,
  ): Promise<{ status: ConnectionStatus | null; connectionId?: string }> {
    return this.buddyConnectionService.checkConnectionStatus(
      userId,
      otherUserId,
    );
  }

  @Delete(':connectionId')
  async removeBuddyConnection(
    @GetUser('userId') userId: string,
    @Param('connectionId') connectionId: string,
  ): Promise<{ message: string }> {
    return this.buddyConnectionService.removeBuddyConnection(
      userId,
      connectionId,
    );
  }
}
