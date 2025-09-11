import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MilestoneService } from './milestone.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('milestones')
@UseGuards(JwtAuthGuard)
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Get('initialize')
  async initializeDefaultMilestones(): Promise<{ message: string }> {
    await this.milestoneService.initializeDefaultMilestones();
    return { message: 'Default milestones initialized successfully' };
  }

  @Get('user/:activityId?')
  async getUserMilestones(
    @GetUser() user: User,
    @Param('activityId') activityId?: string,
  ): Promise<{
    milestones: any[];
  }> {
    const milestones = await this.milestoneService.getUserMilestones(
      user._id.toString(),
      activityId,
    );
    return { milestones };
  }

  @Get('progress/:activityId?')
  async getUserMilestoneProgress(
    @GetUser() user: User,
    @Param('activityId') activityId?: string,
  ): Promise<{
    progress: any[];
  }> {
    const progress = await this.milestoneService.getUserMilestoneProgress(
      user._id.toString(),
      activityId,
    );
    return { progress };
  }

  @Post('check/:activityId?')
  async checkAndAwardMilestones(
    @GetUser() user: User,
    @Param('activityId') activityId?: string,
  ): Promise<{
    newMilestones: any[];
  }> {
    const newMilestones = await this.milestoneService.checkAndAwardMilestones(
      user._id.toString(),
      activityId,
    );
    return { newMilestones };
  }

  @Post('claim/:milestoneId')
  async claimMilestone(
    @GetUser() user: User,
    @Param('milestoneId') milestoneId: string,
  ): Promise<{ message: string }> {
    await this.milestoneService.claimMilestone(
      user._id.toString(),
      milestoneId,
    );
    return { message: 'Milestone claimed successfully' };
  }
}
