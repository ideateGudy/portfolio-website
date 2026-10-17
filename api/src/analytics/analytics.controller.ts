import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { TrackActivityDto } from './dto/track-activity.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  /** Public beacon endpoint to log activity events without blocking UI */
  @Post('track')
  track(@Body() dto: TrackActivityDto) {
    return this.analytics.track(dto);
  }

  /** Admin endpoint to retrieve aggregated metrics, charts & recent visitor feed */
  @Get('overview')
  @UseGuards(JwtAuthGuard)
  getOverview(@Query('days') days?: string) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.analytics.getOverview(isNaN(parsedDays) ? 30 : parsedDays);
  }
}

