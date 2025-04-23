/**
 * Service for uploading files to the server.
 * Used to upload images for activities.
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { Multer } from 'multer';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>
  ) {}

  async uploadFile(file: any): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type. Only images are allowed.');
      }

      // Create new file document
      const newFile = new this.fileModel({
        filename: file.originalname,
        contentType: file.mimetype,
        size: file.size,
        data: file.buffer
      });

      // Save to database
      const savedFile = await newFile.save();

      // Return the ID that can be used to retrieve the file
      return savedFile._id.toString();
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async getFile(fileId: string): Promise<FileDocument> {
    const file = await this.fileModel.findById(fileId);
    if (!file) {
      throw new BadRequestException('File not found');
    }
    return file;
  }
} 