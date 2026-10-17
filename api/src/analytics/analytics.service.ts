import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TrackActivityDto } from './dto/track-activity.dto.js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Track any user activity event (page view, button click, resume download, project link, etc.) */
  async track(dto: TrackActivityDto) {
    if (!dto.visitorId || !dto.type) return { ok: false };

    return this.prisma.activityEvent.create({
      data: {
        type: dto.type.toUpperCase().trim(),
        path: dto.path || '/',
        entityId: dto.entityId || null,
        metadata: (dto.metadata as Prisma.InputJsonValue) || Prisma.JsonNull,
        visitorId: dto.visitorId,
      },
    });
  }

  /**
   * Aggregates activity statistics for the dashboard analytics overview:
   * - Total events, total page views, unique visitors
   * - Daily activity over the last 30 days
   * - Top paths / pages visited
   * - Top event breakdown (clicks, downloads, views, likes)
   * - Recent live feed of visitor activities
   */
  async getOverview(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Run parallel metrics queries
    const [
      totalEvents,
      pageViewsCount,
      uniqueVisitorsGroup,
      resumeClicksCount,
      recentEvents,
      eventsByType,
      eventsByPath,
      rawDailyEvents,
    ] = await Promise.all([
      this.prisma.activityEvent.count(),
      this.prisma.activityEvent.count({ where: { type: 'PAGE_VIEW' } }),
      this.prisma.activityEvent.groupBy({
        by: ['visitorId'],
        _count: { id: true },
      }),
      this.prisma.activityEvent.count({
        where: { type: { in: ['RESUME_CLICK', 'RESUME_DOWNLOAD'] } },
      }),
      this.prisma.activityEvent.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activityEvent.groupBy({
        by: ['type'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      this.prisma.activityEvent.groupBy({
        by: ['path'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      this.prisma.activityEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, type: true, visitorId: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Group daily metrics for charting
    const dailyMap = new Map<string, { date: string; views: number; actions: number; uniqueVisitors: Set<string> }>();

    // Seed all days in range so chart is complete with no holes
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      dailyMap.set(dateKey, { date: dateKey, views: 0, actions: 0, uniqueVisitors: new Set() });
    }

    for (const item of rawDailyEvents) {
      const dateKey = item.createdAt.toISOString().split('T')[0];
      const entry = dailyMap.get(dateKey) || { date: dateKey, views: 0, actions: 0, uniqueVisitors: new Set() };
      if (item.type === 'PAGE_VIEW') {
        entry.views += 1;
      } else {
        entry.actions += 1;
      }
      entry.uniqueVisitors.add(item.visitorId);
      dailyMap.set(dateKey, entry);
    }

    const timeline = Array.from(dailyMap.values()).map((e) => ({
      date: e.date,
      views: e.views,
      actions: e.actions,
      visitors: e.uniqueVisitors.size,
    }));

    return {
      summary: {
        totalEvents,
        pageViews: pageViewsCount,
        uniqueVisitors: uniqueVisitorsGroup.length,
        resumeClicks: resumeClicksCount,
      },
      eventsByType: eventsByType.map((t) => ({ type: t.type, count: t._count.id })),
      eventsByPath: eventsByPath.map((p) => ({ path: p.path, count: p._count.id })),
      timeline,
      recentFeed: recentEvents.map((r) => ({
        id: r.id,
        type: r.type,
        path: r.path,
        entityId: r.entityId,
        metadata: r.metadata,
        visitorId: r.visitorId.slice(0, 8),
        createdAt: r.createdAt,
      })),
    };
  }
}

