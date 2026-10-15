import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export const CONTENT_KEYS = [
  'hero',
  'about',
  'services',
  'experience',
  'education',
  'projects',
  'techStack',
  'contact',
  'profile',
  'socials',
  'resumeUrl',
  'footer',
  'seo',
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  /** All SiteContent rows flattened to one object: { hero: {...}, resumeUrl: "..." }. */
  async getAll(): Promise<Record<string, unknown>> {
    const rows = await this.prisma.siteContent.findMany();
    const out: Record<string, unknown> = {};
    for (const row of rows) {
      out[row.key] = row.value;
    }
    return out;
  }

  set(key: string, value: unknown) {
    if (!(CONTENT_KEYS as readonly string[]).includes(key)) {
      throw new BadRequestException(`Unknown content key: ${key}`);
    }
    return this.prisma.siteContent.upsert({
      where: { key },
      create: { key, value: value as Prisma.InputJsonValue },
      update: { value: value as Prisma.InputJsonValue },
    });
  }
}
