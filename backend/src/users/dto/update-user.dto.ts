import { IsBoolean, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsPhoneNumber('TM', { message: 'phone must be a valid phone number' })
  phone?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

