import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { ExportService } from './export.service';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('activity/:activityId')
  async exportActivityReport(
    @GetUser() user: User,
    @Param('activityId') activityId: string,
  ): Promise<{
    success: boolean;
    data: any;
  }> {
    const data = await this.exportService.generateActivityReport(
      activityId,
      user._id.toString(),
    );
    return {
      success: true,
      data,
    };
  }

  @Get('user-progress')
  async exportUserProgressReport(@GetUser() user: User): Promise<{
    success: boolean;
    data: any;
  }> {
    const data = await this.exportService.generateUserProgressReport(
      user._id.toString(),
    );
    return {
      success: true,
      data,
    };
  }
}
