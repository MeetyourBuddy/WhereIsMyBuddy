import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { ApiResponse } from '../common/types/api-response.type';
import { PopulatedActivity } from './entities/activity.entities';
import { Activity } from './schemas/activity.schema';
import { GetUser } from '@/users/decorators/get-user.decorator';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @GetUser('userId') userId: string,
  ): Promise<ApiResponse<{ activity: PopulatedActivity }>> {
    const activity = await this.activityService.create(
      createActivityDto,
      userId,
    );

    return {
      success: true,
      message: 'Activity created successfully',
      data: { activity },
    };
  }

  @Get()
  async findAll(): Promise<Activity[]> {
    return await this.activityService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<{ activity: PopulatedActivity }>> {
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
    @GetUser('userId') userId: string,
  ): Promise<Activity> {
    return await this.activityService.update(id, updateActivityDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<void> {
    await this.activityService.delete(id, userId);
  }
}
