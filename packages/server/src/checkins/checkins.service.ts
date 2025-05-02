import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';

@Injectable()
export class CheckInsService {
  constructor(
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
  ) {}

  async create(userId: string, createCheckInDto: CreateCheckInDto): Promise<CheckIn> {
    const createdCheckIn = new this.checkInModel({
      userId,
      ...createCheckInDto,
    });
    return createdCheckIn.save();
  }

  async findByActivityId(activityId: string): Promise<CheckIn[]> {
    return this.checkInModel.find({ activityId }).exec();
  }

  async findByUserId(userId: string): Promise<CheckIn[]> {
    return this.checkInModel.find({ userId }).exec();
  }

  async listFiles(activityId: string, userId: string) {
    const uploadPath = path.join(process.cwd(), 'uploads', 'checkins', activityId, userId);
    
    try {
      const files = fs.readdirSync(uploadPath);
      return files.map(filename => ({
        filename,
        url: `/uploads/checkins/${activityId}/${userId}/${filename}`
      }));
    } catch (error) {
      return []; // Return empty array if directory doesn't exist
    }
  }

  static getUploadPath(activityId: string, userId: string) {
    return join(process.cwd(), 'uploads', 'checkins', activityId, userId);
  }

  static async cleanupOrphanedFiles(activityId: string, userId: string) {
    const uploadPath = CheckInsService.getUploadPath(activityId, userId);
    if (fs.existsSync(uploadPath)) {
      const files = fs.readdirSync(uploadPath);
      // TODO: Add logic to clean up files not referenced in check-ins
    }
  }
} 