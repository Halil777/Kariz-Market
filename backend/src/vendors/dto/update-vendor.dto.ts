import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VendorLocation } from '../entities/vendor.entity';

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: 'active' | 'suspended' | string;

  @IsOptional()
  @IsEnum(VendorLocation)
  location?: VendorLocation;
}

