import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller.js';
import { AdminProjectsController } from './admin-projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ProjectsController, AdminProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
