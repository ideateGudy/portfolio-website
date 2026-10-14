import {
  BadRequestException,
  Controller,
  Logger,
  OnModuleInit,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const ALLOWED_FOLDERS = new Set(['portfolio/profile', 'portfolio/projects', 'portfolio/posts']);

function uploadBuffer(buffer: Buffer, folder: string, filename: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename.replace(/\.[^.]+$/, ''),
        overwrite: false,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error('Cloudinary upload failed'));
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

/** POST /admin/uploads — multipart image → Cloudinary (PRD §8). */
@Controller('admin/uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController implements OnModuleInit {
  private readonly logger = new Logger(UploadsController.name);

  constructor(private readonly config: ConfigService) {}

  // Configure Cloudinary AFTER env is loaded (ConfigModule.forRoot). Doing this
  // at module scope reads undefined values because .env isn't populated yet.
  onModuleInit() {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
    if (!this.config.get<string>('CLOUDINARY_API_KEY')) {
      this.logger.warn('CLOUDINARY_API_KEY is not set — image uploads will fail.');
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async upload(
    @Req() req: Request & { body: { folder?: string } },
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{ url: string; publicId: string; width: number; height: number }> {
    if (!file) throw new BadRequestException('No file provided');
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Only jpeg, png, webp, gif or avif images are allowed');
    }

    // The `folder` text field must precede the file part in the multipart body.
    const folder = req.body?.folder ?? 'portfolio/posts';
    if (!ALLOWED_FOLDERS.has(folder)) {
      throw new BadRequestException('Invalid folder');
    }

    const result = await uploadBuffer(file.buffer, folder, file.originalname || randomUUID());
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  }
}
