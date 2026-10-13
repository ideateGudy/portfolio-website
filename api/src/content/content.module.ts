import { Module } from '@nestjs/common';
import { ContentController, AdminContentController } from './content.controller.js';
import { ContentService } from './content.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ContentController, AdminContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
