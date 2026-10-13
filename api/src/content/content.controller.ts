import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { IsObject } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ContentService } from './content.service.js';

export class UpdateContentDto {
  @IsObject()
  value!: Record<string, unknown>;
}

/** Public: all site content as one object (PRD §8). */
@Controller('content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get()
  all() {
    return this.content.getAll();
  }
}

/** Admin: replace one block — PUT /admin/content/:key (PRD §8). */
@Controller('admin/content')
@UseGuards(JwtAuthGuard)
export class AdminContentController {
  constructor(private readonly content: ContentService) {}

  @Put(':key')
  update(@Param('key') key: string, @Body() dto: UpdateContentDto) {
    return this.content.set(key, dto.value);
  }
}
