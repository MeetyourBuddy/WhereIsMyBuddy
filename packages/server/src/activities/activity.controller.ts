import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { Activity } from './schemas/activity.schema';
import { GetUser } from '@/users/decorators/get-user.decorator';
import { ActivityResponseDto } from './dto/activity-response.dto';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @GetUser('userId') userId: string,
  ): Promise<ActivityResponseDto> {
    return await this.activityService.create(createActivityDto, userId);
  }

  @Get()
  async findAll(): Promise<Activity[]> {
    return await this.activityService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<ActivityResponseDto> {
    return await this.activityService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @GetUser('userId') userId: string,
  ): Promise<Activity> {
    console.log('updateActivityDto in controller', updateActivityDto);
    return await this.activityService.update(id, updateActivityDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<void> {
    await this.activityService.delete(id, userId);
  }

  @Post(':id/join')
  async joinActivity(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<ActivityResponseDto> {
    return await this.activityService.joinActivity(id, userId);
  }

  @Post(':id/quit')
  async quitActivity(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<ActivityResponseDto> {
    return await this.activityService.quitActivity(id, userId);
  }
}
