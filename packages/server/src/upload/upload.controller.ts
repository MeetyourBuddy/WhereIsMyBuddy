import { Controller, Get, Param, Res } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Response } from 'express';

@Controller('uploads')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get(':id')
  async serveFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadService.getFile(id);

    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    res.send(file.data);
  }
}
