import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { BoostService } from './boost.service';
import { SendBoostDto } from './dto/send-boost.dto';
import { SendBoostBatchDto } from './dto/send-boost-batch.dto';

@Controller('boost')
@UseGuards(JwtAuthGuard)
export class BoostController {
  constructor(private readonly boostService: BoostService) {}

  @Post('send')
  async sendBoost(@Request() req, @Body() sendBoostDto: SendBoostDto) {
    const result = await this.boostService.sendBoost(req.user.userId, sendBoostDto);
    return {
      success: true,
      data: result,
      message: 'Boost sent successfully',
    };
  }

  @Post('send-batch')
  async sendBoostBatch(
    @Request() req,
    @Body() batchDto: SendBoostBatchDto,
  ) {
    const result = await this.boostService.sendBoostBatch(
      req.user.userId,
      batchDto.boosts,
    );
    return {
      success: true,
      data: result,
      message: `Successfully sent ${result.successful} boost(s). ${result.failed > 0 ? `${result.failed} boost(s) failed due to limit.` : ''}`,
    };
  }

  @Get('received')
  async getReceivedBoosts(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.boostService.getReceivedBoosts(req.user.userId, page, limit);
  }

  @Get('sent')
  async getSentBoosts(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.boostService.getSentBoosts(req.user.userId, page, limit);
  }

  @Get('stats')
  async getBoostStats(@Request() req) {
    return this.boostService.getBoostStats(req.user.userId);
  }

  @Get('badges')
  async getBoostBadges(@Request() req) {
    return this.boostService.getBoostBadges(req.user.userId);
  }

  @Get('leaderboard')
  async getBoostLeaderboard(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.boostService.getBoostLeaderboard(limit);
  }

  @Post('mark-read/:boostId')
  async markBoostAsRead(@Request() req, @Param('boostId') boostId: string) {
    await this.boostService.markBoostAsRead(boostId, req.user.userId);
    return { message: 'Boost marked as read' };
  }
}
