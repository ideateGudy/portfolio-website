import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Param, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { PostsService } from './posts.service.js';
import { CreateCommentDto } from './dto/comment.dto.js';
import { AuthService } from '../auth/auth.service.js';
import { AUTH_COOKIE } from '../auth/jwt-auth.guard.js';
import { ContentService } from '../content/content.service.js';

/** Public routes for posts, views, likes, and comments */
@Controller('posts')
export class PostsController {
  constructor(
    private readonly posts: PostsService,
    private readonly auth: AuthService,
    private readonly content: ContentService,
  ) {}

  @Get()
  list(
    @Query('tag') tag?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.posts.listPublished({ tag, page, limit });
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.posts.getPublished(slug);
  }

  @Get(':slug/interactions')
  getInteractions(
    @Param('slug') slug: string,
    @Query('visitorId') visitorId?: string,
  ) {
    return this.posts.getPostInteractions(slug, visitorId);
  }

  @Post(':slug/view')
  recordView(
    @Param('slug') slug: string,
    @Body('visitorId') visitorId: string,
  ) {
    return this.posts.recordView(slug, visitorId);
  }

  @Post(':slug/like')
  toggleLike(
    @Param('slug') slug: string,
    @Body('visitorId') visitorId: string,
  ) {
    return this.posts.togglePostLike(slug, visitorId);
  }

  @Get(':slug/comments')
  listComments(
    @Param('slug') slug: string,
    @Query('visitorId') visitorId?: string,
  ) {
    return this.posts.listApprovedComments(slug, visitorId);
  }

  @Post(':slug/comments')
  async createComment(
    @Param('slug') slug: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request,
  ) {
    let isAuthor = false;
    let authorName = dto.authorName;
    let authorRole: string | undefined;
    let authorAvatar: string | undefined;

    const token = req.cookies?.[AUTH_COOKIE] as string | undefined;
    if (token) {
      const user = await this.auth.verifyToken(token);
      if (user) {
        isAuthor = true;
        const siteContent = await this.content.getAll();
        const profile = siteContent.profile as { name?: string; role?: string; avatarUrl?: string } | undefined;
        authorName = profile?.name || 'Site Author';
        authorRole = profile?.role || undefined;
        authorAvatar = profile?.avatarUrl || undefined;
      }
    }

    return this.posts.addComment(slug, {
      ...dto,
      authorName,
      authorRole,
      authorAvatar,
      isAuthor,
    });
  }

  @Post('comments/:id/like')
  toggleCommentLike(
    @Param('id') commentId: string,
    @Body('visitorId') visitorId: string,
  ) {
    return this.posts.toggleCommentLike(commentId, visitorId);
  }
}
