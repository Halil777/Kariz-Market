import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(@InjectRepository(Banner) private readonly repo: Repository<Banner>) {}

  list(activeOnly = false) {
    return this.repo.find({
      where: activeOnly ? { isActive: true } : {},
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async create(dto: CreateBannerDto) {
    const entity = this.repo.create({
      imageUrl: dto.imageUrl,
      titleTm: dto.titleTm ?? null,
      titleRu: dto.titleRu ?? null,
      subtitleTm: dto.subtitleTm ?? null,
      subtitleRu: dto.subtitleRu ?? null,
      order: dto.order ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateBannerDto) {
    const patch: any = {};
    if (dto.imageUrl !== undefined) patch.imageUrl = dto.imageUrl;
    if (dto.titleTm !== undefined) patch.titleTm = dto.titleTm;
    if (dto.titleRu !== undefined) patch.titleRu = dto.titleRu;
    if (dto.subtitleTm !== undefined) patch.subtitleTm = dto.subtitleTm;
    if (dto.subtitleRu !== undefined) patch.subtitleRu = dto.subtitleRu;
    if (dto.order !== undefined) patch.order = dto.order;
    if (dto.isActive !== undefined) patch.isActive = dto.isActive;
    await this.repo.update({ id }, patch);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.repo.delete({ id });
    return { id };
  }
}

