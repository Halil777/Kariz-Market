import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(@InjectRepository(Coupon) private readonly repo: Repository<Coupon>) {}

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateCouponDto) {
    const entity = this.repo.create({
      code: dto.code,
      type: dto.type,
      value: String(dto.value),
      startsAt: dto.startsAt || null,
      endsAt: dto.endsAt || null,
      isActive: dto.isActive ?? true,
      nameTk: dto.nameTk || null,
      nameRu: dto.nameRu || null,
      imageUrl: dto.imageUrl || null,
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateCouponDto) {
    const patch: any = {};
    if (dto.code !== undefined) patch.code = dto.code;
    if (dto.type !== undefined) patch.type = dto.type;
    if (dto.value !== undefined) patch.value = String(dto.value);
    if (dto.startsAt !== undefined) patch.startsAt = dto.startsAt;
    if (dto.endsAt !== undefined) patch.endsAt = dto.endsAt;
    if (dto.isActive !== undefined) patch.isActive = dto.isActive;
    if (dto.nameTk !== undefined) patch.nameTk = dto.nameTk;
    if (dto.nameRu !== undefined) patch.nameRu = dto.nameRu;
    if (dto.imageUrl !== undefined) patch.imageUrl = dto.imageUrl;
    await this.repo.update({ id }, patch);
    return this.repo.findOne({ where: { id } });
  }
}

