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

  async findAllAdmin() {
    const posts = await this.prisma.post.findMany({
      select: {
        ...listSelect,
        _count: {
          select: {
            views: true,
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: [{ updatedAt: 'desc' }],
    });

    const pendingCounts = await this.prisma.comment.groupBy({
      by: ['postId'],
      where: { status: 'PENDING' },
      _count: { _all: true },
    });
    const pendingMap = new Map(pendingCounts.map((c) => [c.postId, c._count._all]));

    return posts.map((p) => ({
      ...p,
      uniqueViews: p._count.views,
      likesCount: p._count.likes,
      commentsCount: p._count.comments,
      pendingCommentsCount: pendingMap.get(p.id) ?? 0,
    }));
  }

  async recordView(slug: string, visitorId: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (visitorId) {
      await this.prisma.postView
        .upsert({
          where: {
            postId_visitorId: {
              postId: post.id,
              visitorId,
            },
          },
          create: {
            postId: post.id,
            visitorId,
          },
          update: {},
        })
        .catch(() => undefined);
    }

    const uniqueViews = await this.prisma.postView.count({
      where: { postId: post.id },
    });
    return { uniqueViews };
  }

  async togglePostLike(slug: string, visitorId: string) {
    if (!visitorId) throw new BadRequestException('visitorId required');
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.postLike.findUnique({
      where: {
        postId_visitorId: {
          postId: post.id,
          visitorId,
        },
      },
    });

    let liked = false;
    if (existing) {
      await this.prisma.postLike.delete({
        where: { id: existing.id },
      });
      liked = false;
    } else {
      await this.prisma.postLike.create({
        data: {
          postId: post.id,
          visitorId,
        },
      });
      liked = true;
    }

    const likesCount = await this.prisma.postLike.count({
      where: { postId: post.id },
    });

    return { liked, likesCount };
  }

  async getPostInteractions(slug: string, visitorId?: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const [viewsCount, likesCount, userLiked] = await Promise.all([
      this.prisma.postView.count({ where: { postId: post.id } }),
      this.prisma.postLike.count({ where: { postId: post.id } }),
      visitorId
        ? this.prisma.postLike.findUnique({
            where: {
              postId_visitorId: {
                postId: post.id,
                visitorId,
              },
            },
          })
        : null,
    ]);

    return {
      viewsCount,
      likesCount,
      hasLiked: !!userLiked,
    };
  }

  async listApprovedComments(slug: string, visitorId?: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const comments = await this.prisma.comment.findMany({
      where: {
        postId: post.id,
        status: 'APPROVED',
      },
      include: {
        _count: {
          select: { likes: true, replies: { where: { status: 'APPROVED' } } },
        },
        likes: visitorId
          ? {
              where: { visitorId },
              select: { id: true },
            }
          : false,
      },
      orderBy: { createdAt: 'asc' },
    });

    return comments.map((c) => ({
      id: c.id,
      parentId: c.parentId,
      authorName: c.authorName || 'Anonymous',
      content: c.content,
      createdAt: c.createdAt,
      likesCount: c._count.likes,
      repliesCount: c._count.replies,
      hasLiked: visitorId ? c.likes.length > 0 : false,
    }));
  }

  async addComment(slug: string, dto: { authorName?: string; content: string; parentId?: string }) {
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (dto.parentId) {
      const parent = await this.prisma.comment.findFirst({
        where: { id: dto.parentId, postId: post.id },
      });
      if (!parent) throw new NotFoundException('Parent comment not found');
    }

    const trimmedName = dto.authorName?.trim() || 'Anonymous';
    const trimmedContent = dto.content?.trim();
    if (!trimmedContent) throw new BadRequestException('Comment content cannot be empty');

    const created = await this.prisma.comment.create({
      data: {
        postId: post.id,
        parentId: dto.parentId || null,
        authorName: trimmedName,
        content: trimmedContent,
        status: 'PENDING',
      },
    });

    return {
      message: 'Comment submitted successfully! It will be visible after review.',
      comment: {
        id: created.id,
        authorName: created.authorName,
        status: created.status,
      },
    };
  }

  async toggleCommentLike(commentId: string, visitorId: string) {
    if (!visitorId) throw new BadRequestException('visitorId required');
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    const existing = await this.prisma.commentLike.findUnique({
      where: {
        commentId_visitorId: {
          commentId,
          visitorId,
        },
      },
    });

    let liked = false;
    if (existing) {
      await this.prisma.commentLike.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      await this.prisma.commentLike.create({
        data: { commentId, visitorId },
      });
      liked = true;
    }

    const likesCount = await this.prisma.commentLike.count({
      where: { commentId },
    });

    return { liked, likesCount };
  }

  async listCommentsAdmin(postId?: string, status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return this.prisma.comment.findMany({
      where: {
        ...(postId ? { postId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        post: {
          select: { id: true, title: true, slug: true },
        },
        _count: {
          select: { likes: true, replies: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCommentStatusAdmin(commentId: string, status: 'APPROVED' | 'REJECTED') {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { status },
    });
  }

  async deleteCommentAdmin(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    await this.prisma.comment.delete({
      where: { id: commentId },
    });
    return { success: true };
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
