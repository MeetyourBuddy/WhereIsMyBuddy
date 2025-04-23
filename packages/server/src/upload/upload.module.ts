import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema }
    ]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {} 