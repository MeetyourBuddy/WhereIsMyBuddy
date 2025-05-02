import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  UseInterceptors, 
  UploadedFile,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CheckInsService } from './checkins.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { AuthUser } from '../users/auth/decorators/auth-user.decorator';
import { GetUser } from '../users/decorators/get-user.decorator';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { memoryStorage } from 'multer';

@Controller('checkins')
@AuthUser()
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (!file || !file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
          return callback(null, true);
        }
        callback(null, true);
      },
      storage: memoryStorage(), // Store in memory first, not disk
    }),
  )
  async create(
    @GetUser('userId') userId: string,
    @Body() createCheckInDto: CreateCheckInDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      let mediaUrl: string | undefined;
      
      if (file) {
        // Generate unique filename using content hash
        const hash = crypto.createHash('md5').update(file.buffer).digest('hex');
        const filename = `${hash}${extname(file.originalname)}`;
        const uploadPath = CheckInsService.getUploadPath(createCheckInDto.activityId, userId);
        const filepath = join(uploadPath, filename);

        // Only save if file doesn't exist
        if (!fs.existsSync(filepath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
          fs.writeFileSync(filepath, file.buffer);
        }
        
        mediaUrl = `/uploads/checkins/${createCheckInDto.activityId}/${userId}/${filename}`;
      }

      // Create check-in with media URL if file was uploaded
      const checkIn = await this.checkInsService.create(userId, {
        ...createCheckInDto,
        mediaUrl,
      });

      return checkIn;
    } catch (error) {
      // If check-in fails and we saved a file, clean it up
      if (file && createCheckInDto.mediaUrl) {
        const filepath = join(process.cwd(), createCheckInDto.mediaUrl);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      }
      throw error;
    }
  }

  @Get('activity/:activityId')
  async findByActivityId(@Param('activityId') activityId: string) {
    return this.checkInsService.findByActivityId(activityId);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.checkInsService.findByUserId(userId);
  }

  @Get('files/:activityId')
  async getFiles(
    @Param('activityId') activityId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.checkInsService.listFiles(activityId, userId);
  }
} 