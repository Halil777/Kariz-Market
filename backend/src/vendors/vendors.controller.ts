import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendors: VendorsService) {}

  @Get()
  list() {
    return this.vendors.list();
  }

  @Post()
  create(@Body() dto: CreateVendorDto) {
    return this.vendors.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.vendors.getMe(req.user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVendorDto) {
    return this.vendors.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendors.remove(id);
  }
}
