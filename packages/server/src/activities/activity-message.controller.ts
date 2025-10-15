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
import { ActivityMessageService } from './activity-message.service';
import { CreateActivityMessageDto } from './dto/create-activity-message.dto';
import { UpdateActivityMessageDto } from './dto/update-activity-message.dto';

@Controller('activities/:activityId/messages')
@UseGuards(JwtAuthGuard)
export class ActivityMessageController {
  constructor(private readonly messageService: ActivityMessageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMessage(
    @Param('activityId') activityId: string,
    @Request() req: any,
    @Body() createMessageDto: CreateActivityMessageDto,
  ) {
    const message = await this.messageService.createMessage(
      activityId,
      req.user.userId,
      createMessageDto,
    );

    return {
      success: true,
      data: message,
      message: 'Message created successfully',
    };
  }

  @Get()
  async getMessages(
    @Param('activityId') activityId: string,
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
    @Query('pinnedOnly') pinnedOnly?: string,
  ) {
    const options = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      tag,
      pinnedOnly: pinnedOnly === 'true',
    };

    const result = await this.messageService.getMessages(
      activityId,
      req.user.userId,
      options,
    );

    return {
      success: true,
      data: result,
    };
  }

  @Post(':messageId/like')
  @HttpCode(HttpStatus.OK)
  async toggleLike(
    @Param('activityId') activityId: string,
    @Param('messageId') messageId: string,
    @Request() req: any,
  ) {
    const message = await this.messageService.toggleLike(
      messageId,
      req.user.userId,
    );

    return {
      success: true,
      data: message,
      message: 'Like toggled successfully',
    };
  }

  @Post(':messageId/pin')
  @HttpCode(HttpStatus.OK)
  async togglePin(
    @Param('activityId') activityId: string,
    @Param('messageId') messageId: string,
    @Request() req: any,
  ) {
    const message = await this.messageService.togglePin(
      messageId,
      req.user.userId,
    );

    return {
      success: true,
      data: message,
      message: 'Pin status updated successfully',
    };
  }

  @Put(':messageId')
  async updateMessage(
    @Param('activityId') activityId: string,
    @Param('messageId') messageId: string,
    @Request() req: any,
    @Body() updateMessageDto: UpdateActivityMessageDto,
  ) {
    const message = await this.messageService.updateMessage(
      messageId,
      req.user.userId,
      updateMessageDto,
    );

    return {
      success: true,
      data: message,
      message: 'Message updated successfully',
    };
  }

  @Delete(':messageId')
  @HttpCode(HttpStatus.OK)
  async deleteMessage(
    @Param('activityId') activityId: string,
    @Param('messageId') messageId: string,
    @Request() req: any,
  ) {
    const result = await this.messageService.deleteMessage(
      messageId,
      req.user.userId,
    );

    return {
      success: true,
      data: result,
    };
  }

  @Get('stats')
  async getMessageStats(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    const stats = await this.messageService.getMessageStats(activityId);

    return {
      success: true,
      data: stats,
    };
  }
}
