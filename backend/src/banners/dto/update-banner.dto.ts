import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBannerDto {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  titleTm?: string | null;

  @IsOptional()
  @IsString()
  titleRu?: string | null;

  @IsOptional()
  @IsString()
  subtitleTm?: string | null;

  @IsOptional()
  @IsString()
  subtitleRu?: string | null;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
