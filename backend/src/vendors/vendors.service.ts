import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateVendorDto) {
    const vendor = this.vendorRepo.create({
      name: dto.name,
      slug: slugify(dto.name),
      status: 'active',
      commissionType: 'percentage',
      commissionValue: '0',
      location: dto.location,
    });
    await this.vendorRepo.save(vendor);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: Role.VendorUser,
      vendorId: vendor.id,
      displayName: dto.displayName || dto.name,
      isActive: true,
    });
    await this.userRepo.save(user);

    return { vendorId: vendor.id };
  }

  async list() {
    // Return vendor info with vendor user contact (email, phone) if exists
    const vendors = await this.vendorRepo.find({ order: { createdAt: 'DESC' } });
    const vendorIds = vendors.map(v => v.id);
    const users = vendorIds.length
      ? await this.userRepo
          .createQueryBuilder('u')
          .where('u.vendor_id IN (:...ids)', { ids: vendorIds })
          .getMany()
      : [];
    const map = new Map(users.map(u => [u.vendorId!, u]));
    return vendors.map(v => ({
      id: v.id,
      name: v.name,
      slug: v.slug,
      status: v.status,
      location: v.location,
      createdAt: v.createdAt,
      email: map.get(v.id)?.email || null,
      phone: map.get(v.id)?.phone || null,
    }));
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || !user.vendorId) return null;
    const vendor = await this.vendorRepo.findOne({ where: { id: user.vendorId } });
    return vendor || null;
  }

  async update(id: string, dto: UpdateVendorDto) {
    const patch: Partial<Vendor> = {};
    if (dto.name) {
      patch.name = dto.name;
      patch.slug = slugify(dto.name);
    }
    if (dto.status) patch.status = dto.status;
    if (dto.location) patch.location = dto.location;
    await this.vendorRepo.update({ id }, patch);
    return this.vendorRepo.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.vendorRepo.delete({ id });
    return { success: true };
  }
}
