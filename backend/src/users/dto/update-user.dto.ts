import { IsBoolean, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsPhoneNumber('TM', { message: 'phone must be a valid phone number' })
  phone?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string | null;
}

