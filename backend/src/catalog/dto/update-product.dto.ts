import { IsArray, IsIn, IsInt, IsNumberString, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  nameTk?: string;

  @IsOptional()
  @IsString()
  nameRu?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsIn(['kg', 'l', 'count'])
  unit?: 'kg' | 'l' | 'count';

  @IsOptional()
  @IsNumberString()
  price?: string; // numeric as string

  @IsOptional()
  @ValidateIf((o) => o.compareAt !== undefined)
  @IsNumberString()
  compareAt?: string | null;

  @IsOptional()
  @IsNumberString()
  discountPct?: string;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string | null; // subcategory id

  @IsOptional()
  @IsArray()
  specs?: Array<{ titleTk?: string; titleRu?: string; textTk?: string; textRu?: string }>;
}
