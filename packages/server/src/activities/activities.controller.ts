import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { ActivityServiceResponse } from './interfaces/common.interface';
import { IActivityResponse } from './interfaces/activity.interface';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({ 
    status: 201, 
    description: 'Activity created successfully',
    type: ActivityResponseDto 
  })
  async createActivity(
    @Request() req,
    @Body() createActivityDto: CreateActivityDto
  ): Promise<ActivityServiceResponse<IActivityResponse>> {
    return this.activitiesService.create(req.user.id, createActivityDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the activity',
    type: ActivityResponseDto 
  })
  async getActivity(
    @Param('id') id: string
  ): Promise<ActivityServiceResponse<IActivityResponse>> {
    return this.activitiesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update activity by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Activity updated successfully',
    type: ActivityResponseDto 
  })
  async updateActivity(
    @Request() req,
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityServiceResponse<IActivityResponse>> {
    const activity = await this.activitiesService.findOne(id);
    
    if (!activity.data.admin.id.toString() !== req.user.id) {
      throw new ForbiddenException('You are not authorized to update this activity');
    }

    return this.activitiesService.update(id, updateActivityDto);
  }
}
