import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  authorName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(3000)
  content!: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  visitorId?: string;
}

