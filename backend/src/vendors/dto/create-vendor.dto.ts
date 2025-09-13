import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { VendorLocation } from '../entities/vendor.entity';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string; // login

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(VendorLocation)
  location: VendorLocation;

  @IsString()
  @IsOptional()
  displayName?: string; // vendor user display name
}

