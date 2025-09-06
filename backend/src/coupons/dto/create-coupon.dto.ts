import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsEnum(['percent', 'fixed'] as any)
  type: 'percent' | 'fixed';

  @IsNumber()
  value: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  nameTk?: string;

  @IsOptional()
  @IsString()
  nameRu?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;
}

