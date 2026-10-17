import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TrackActivityDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  path!: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsString()
  @IsNotEmpty()
  visitorId!: string;
}

