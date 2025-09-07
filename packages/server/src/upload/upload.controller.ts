import {
  Controller,
  Get,
  Param,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';

@Controller('uploads')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileId = await this.uploadService.uploadFile(file);
    return {
      success: true,
      fileId,
      message: 'File uploaded successfully',
    };
  }

  @Get(':id')
  async serveFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadService.getFile(id);

    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    res.send(file.data);
  }
}
