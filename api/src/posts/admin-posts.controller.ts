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
}
