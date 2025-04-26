import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { ApiResponse } from '../common/types/api-response.type';
import { Activity } from './schemas/activity.schema';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @Request() req,
  ): Promise<ApiResponse<{ activity: Activity }>> {
    const activity = await this.activityService.create(
      createActivityDto,
      req.user,
    );

    return {
      success: true,
      message: 'Activity created successfully',
      data: { activity },
    };
  }

  @Get()
  async findAll(
    @Request() req,
  ): Promise<ApiResponse<{ activities: Activity[] }>> {
    const activities = await this.activityService.findAll(req.user);
    return {
      success: true,
      message: 'Activities fetched successfully',
      data: { activities },
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<{ activity: Activity }>> {
    const activity = await this.activityService.findOne(id, req.user);
    return {
      success: true,
      message: 'Activity fetched successfully',
      data: { activity },
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @Request() req,
  ): Promise<ApiResponse<{ activity: Activity }>> {
    const activity = await this.activityService.update(
      id,
      updateActivityDto,
      req.user,
    );
    return {
      success: true,
      message: 'Activity updated successfully',
      data: { activity },
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<void>> {
    await this.activityService.delete(id, req.user);
    return {
      success: true,
      message: 'Activity deleted successfully',
    };
  }
}
