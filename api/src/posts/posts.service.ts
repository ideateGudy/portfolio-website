import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma, PostStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { readingTimeMinutes, slugifyTitle } from '../common/utils.js';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto.js';

const listSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverUrl: true,
  coverAlt: true,
  tags: true,
  status: true,
  publishedAt: true,
  readingTime: true,
  canonicalUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect;

/** Writable fields buildData() consumes (nullable DB values + optional DTO values). */
type PostWriteInput = {
  title: string;
  content?: string | null;
  excerpt?: string | null;
  coverUrl?: string | null;
  coverAlt?: string | null;
  tags?: string[];
  publish?: boolean;
  publishedAt?: string;
  canonicalUrl?: string | null;
};

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Published posts only, sorted by back-dated publishedAt (PRD §8). */
  async listPublished(params: { tag?: string; page?: number; limit?: number }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 20));
    const where: Prisma.PostWhereInput = {
      status: PostStatus.PUBLISHED,
      ...(params.tag ? { tags: { has: params.tag } } : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        select: listSelect,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { items, total, page, limit };
  }

  async getPublished(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  findAllAdmin() {
    return this.prisma.post.findMany({
      select: listSelect,
      orderBy: [{ updatedAt: 'desc' }],
    });
  }

  async findOneAdmin(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(dto: CreatePostDto) {
    const slug = dto.slug?.trim() || slugifyTitle(dto.title);
    await this.assertSlugFree(slug);
    return this.prisma.post.create({
      data: this.buildData(dto, slug, { status: PostStatus.DRAFT, publishedAt: null }),
    });
  }

  async update(id: string, dto: UpdatePostDto) {
    const existing = await this.findOneAdmin(id);
    const slug = dto.slug?.trim() || existing.slug;
    if (slug !== existing.slug) await this.assertSlugFree(slug);
    // Build a clean write-input with fallbacks; publish/back-date rules live in buildData().
    // NOTE: publishedAt passes only the newly requested value — buildData merges it
    // with existing.publishedAt internally (PRD §7).
    return this.prisma.post.update({
      where: { id },
      data: this.buildData(
        {
          title: dto.title ?? existing.title,
          content: dto.content ?? existing.content,
          excerpt: dto.excerpt ?? existing.excerpt,
          coverUrl: dto.coverUrl ?? existing.coverUrl,
          coverAlt: dto.coverAlt ?? existing.coverAlt,
          tags: dto.tags ?? existing.tags,
          canonicalUrl: dto.canonicalUrl ?? existing.canonicalUrl,
          publish: dto.publish,
          publishedAt: dto.publishedAt,
        },
        slug,
        existing,
      ),
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    await this.prisma.post.delete({ where: { id } });
    return { ok: true };
  }

  private async assertSlugFree(slug: string) {
    if (!slug) throw new BadRequestException('Slug cannot be empty');
    const found = await this.prisma.post.findUnique({ where: { slug } });
    if (found) throw new BadRequestException('Slug already in use');
  }

  /**
   * PRD §7 publishedAt rules: on publish, publishedAt = input ?? existing ?? now().
   * Drafts keep null. Future dates are rejected.
   */
  private buildData(
    dto: PostWriteInput,
    slug: string,
    existing: Pick<Post, 'status' | 'publishedAt'>,
  ): Prisma.PostUncheckedCreateInput {
    const content = dto.content ?? '';
    const publishing = dto.publish ?? existing.status === PostStatus.PUBLISHED;

    let publishedAt: Date | null = existing.publishedAt;
    if (publishing) {
      const requested = dto.publishedAt ? new Date(dto.publishedAt) : null;
      if (requested && requested.getTime() > Date.now()) {
        throw new BadRequestException('publishedAt cannot be in the future');
      }
      publishedAt = requested ?? existing.publishedAt ?? new Date();
    } else {
      publishedAt = null;
    }

    return {
      title: dto.title,
      slug,
      excerpt: dto.excerpt ?? '',
      content,
      coverUrl: dto.coverUrl ?? null,
      coverAlt: dto.coverAlt ?? null,
      tags: dto.tags ?? [],
      status: publishing ? PostStatus.PUBLISHED : PostStatus.DRAFT,
      publishedAt,
      canonicalUrl: dto.canonicalUrl || null,
      readingTime: readingTimeMinutes(content),
    } satisfies Prisma.PostUncheckedCreateInput;
  }
}
