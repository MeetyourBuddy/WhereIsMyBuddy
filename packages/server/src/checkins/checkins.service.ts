import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.checkInModel
      .find({ activityId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUserId(userId: string): Promise<CheckIn[]> {
    return this.checkInModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async toggleLike(checkInId: string, userId: string): Promise<CheckIn> {
    const checkIn = await this.checkInModel.findById(checkInId);
    if (!checkIn) {
      throw new NotFoundException('Check-in not found');
    }

    const hasLiked = checkIn.likes.includes(userId);
    if (hasLiked) {
      checkIn.likes = checkIn.likes.filter(id => id !== userId);
    } else {
      checkIn.likes.push(userId);
    }

    return checkIn.save();
  }

  async delete(checkInId: string, userId: string): Promise<void> {
    const checkIn = await this.checkInModel.findOne({ _id: checkInId, userId });
    if (!checkIn) {
      throw new NotFoundException('Check-in not found');
    }

    // Delete associated media if exists
    if (checkIn.mediaUrl) {
      const filepath = join(process.cwd(), checkIn.mediaUrl);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await checkIn.deleteOne();
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

  async cleanupOrphanedFiles(activityId: string, userId: string) {
    const uploadPath = CheckInsService.getUploadPath(activityId, userId);
    if (!fs.existsSync(uploadPath)) return;

    const files = fs.readdirSync(uploadPath);
    const checkIns = await this.checkInModel.find({ 
      activityId, 
      userId,
      mediaUrl: { $exists: true } 
    });

    const usedFiles = checkIns.map(checkIn => {
      const url = checkIn.mediaUrl || '';
      return url.split('/').pop() || '';
    });

    files.forEach(file => {
      if (!usedFiles.includes(file)) {
        fs.unlinkSync(join(uploadPath, file));
      }
    });
  }
} 