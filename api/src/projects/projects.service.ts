import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findVisible() {
    return this.prisma.project.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    });
  }

  findAllAdmin() {
    return this.prisma.project.findMany({ orderBy: { order: 'asc' } });
  }

  async create(dto: CreateProjectDto) {
    const count = await this.prisma.project.count();
    return this.prisma.project.create({
      data: this.buildData({ ...dto, order: count }),
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id); // 404 if missing
    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
        ...(dto.imageAlt !== undefined ? { imageAlt: dto.imageAlt } : {}),
        ...(dto.tech !== undefined ? { tech: dto.tech } : {}),
        ...(dto.liveUrl !== undefined ? { liveUrl: dto.liveUrl || null } : {}),
        ...(dto.repoUrl !== undefined ? { repoUrl: dto.repoUrl || null } : {}),
        ...(dto.visible !== undefined ? { visible: dto.visible } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return { ok: true };
  }

  /** Persist a full id ordering (PRD §8 reorder). */
  async reorder(ids: string[]) {
    if (ids.length === 0) throw new BadRequestException('ids must not be empty');
    const unique = new Set(ids);
    if (unique.size !== ids.length) {
      throw new BadRequestException('ids must not contain duplicates');
    }
    const count = await this.prisma.project.count();
    if (ids.length !== count) {
      throw new BadRequestException(
        `ids must contain all ${count} project ids, got ${ids.length}`,
      );
    }
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.project.update({ where: { id }, data: { order: index } }),
      ),
    );
    return this.findAllAdmin();
  }

  private async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  /** Create-time defaults (visible=true, order appended); update() never calls this. */
  private buildData(dto: CreateProjectDto & { order?: number }): Prisma.ProjectUncheckedCreateInput {
    const data: Prisma.ProjectUncheckedCreateInput = {
      title: dto.title,
      description: dto.description,
      imageUrl: dto.imageUrl ?? null,
      imageAlt: dto.imageAlt ?? null,
      tech: dto.tech ?? [],
      liveUrl: dto.liveUrl || null,
      repoUrl: dto.repoUrl || null,
      visible: dto.visible ?? true,
    };
    if (dto.order !== undefined) data.order = dto.order;
    return data;
  }
}
