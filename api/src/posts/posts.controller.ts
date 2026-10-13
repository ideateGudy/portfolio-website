import { Controller, DefaultValuePipe, Get, ParseIntPipe, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service.js';

/** Public read-only routes (PRD §8). */
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
}
