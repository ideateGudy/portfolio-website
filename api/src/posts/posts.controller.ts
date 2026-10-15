import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Param, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreateCommentDto } from './dto/comment.dto.js';

/** Public routes for posts, views, likes, and comments */
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

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
  createComment(
    @Param('slug') slug: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.posts.addComment(slug, dto);
  }

  @Post('comments/:id/like')
  toggleCommentLike(
    @Param('id') commentId: string,
    @Body('visitorId') visitorId: string,
  ) {
    return this.posts.toggleCommentLike(commentId, visitorId);
  }
}
