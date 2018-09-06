import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CattleFarmSchema {
  // Required
  @IsString()
  name!: string;

  @IsString()
  version!: string;

  // Optional
  @IsOptional()
  @IsString({ each: true })
  files?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  private?: boolean;

  @IsOptional()
  @IsString()
  license?: string;
}
