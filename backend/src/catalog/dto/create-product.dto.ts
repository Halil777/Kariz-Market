import { IsArray, IsIn, IsInt, IsNumberString, IsOptional, IsString, IsUUID, Min, ValidateIf } from 'class-validator';

export class CreateProductDto {
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

  @IsIn(['kg', 'l', 'count'])
  unit: 'kg' | 'l' | 'count';

  @IsNumberString()
  price: string; // numeric as string

  @IsOptional()
  @ValidateIf((o) => o.compareAt !== undefined)
  @IsNumberString()
  compareAt?: string;

  @IsOptional()
  @IsNumberString()
  discountPct?: string; // 0..100

  @IsInt()
  @Min(0)
  stock: number;

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
