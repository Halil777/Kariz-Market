import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, User])],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [TypeOrmModule],
})
export class VendorsModule {}
