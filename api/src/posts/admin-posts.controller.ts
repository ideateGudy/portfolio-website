import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PostsService } from './posts.service.js';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto.js';

/** Admin CRUD — every write requires the JWT cookie (PRD §8). */
@Controller('admin/posts')
@UseGuards(JwtAuthGuard)
export class AdminPostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  list() {
    return this.posts.findAllAdmin();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.posts.findOneAdmin(id);
  }

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.posts.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.posts.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posts.remove(id);
  }

  @Get('comments/all')
  listComments(
    @Param('id') _postId?: string,
    @Body('postId') bodyPostId?: string,
  ) {
    return this.posts.listCommentsAdmin(bodyPostId);
  }

  @Get(':id/comments')
  listPostComments(@Param('id') postId: string) {
    return this.posts.listCommentsAdmin(postId);
  }

  @Patch('comments/:commentId/status')
  updateCommentStatus(
    @Param('commentId') commentId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.posts.updateCommentStatusAdmin(commentId, status);
  }

  @Delete('comments/:commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.posts.deleteCommentAdmin(commentId);
  }
}
