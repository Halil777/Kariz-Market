import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  variantId: string;

  @IsInt()
  @Min(1)
  qty: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayNotEmpty()
  items: CreateOrderItemDto[];

  @IsString()
  @IsIn(['cash', 'online'])
  paymentMethod: 'cash' | 'online';

  @IsOptional()
  @IsString()
  note?: string;
}
