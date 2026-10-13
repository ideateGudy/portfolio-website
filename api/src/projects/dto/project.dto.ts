import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  description!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imageAlt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech?: string[];

  @IsOptional()
  @IsUrl({ require_tld: false })
  liveUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  repoUrl?: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imageAlt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech?: string[];

  @IsOptional()
  @IsUrl({ require_tld: false })
  liveUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  repoUrl?: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}

export class ReorderDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ids!: string[];
}
