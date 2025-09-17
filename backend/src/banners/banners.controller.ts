import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banners')
export class BannersController {
  constructor(private readonly banners: BannersService) {}

  @Get()
  list(@Query('active') active?: string) {
    const activeOnly = active === '1' || active === 'true';
    return this.banners.list(activeOnly);
  }

  @Post()
  create(@Body() dto: CreateBannerDto) {
    return this.banners.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.banners.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.banners.remove(id);
  }
}

