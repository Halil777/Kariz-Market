import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(['percent', 'fixed'] as any)
  type?: 'percent' | 'fixed';

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string | null;

  @IsOptional()
  @IsDateString()
  endsAt?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  nameTk?: string | null;

  @IsOptional()
  @IsString()
  nameRu?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;
}

