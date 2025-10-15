import { Controller, Get, Patch, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';

@Controller('customers')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  @Get()
  async list(@Query('q') q?: string) {
    const qb = this.baseQuery();
    if (q) {
      const query = `%${q.toLowerCase()}%`;
      qb.andWhere(
        `(
          LOWER(u.email) LIKE :q OR
          LOWER(COALESCE(u.phone, '')) LIKE :q OR
          LOWER(COALESCE(u.display_name, '')) LIKE :q
        )`,
        { q: query },
      );
    }
    const rows = await qb.getRawMany();
    return rows.map((row) => this.mapRow(row));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const patch: Partial<User> = {};
    if (dto.phone !== undefined) patch.phone = dto.phone?.trim() || null;
    if (dto.isActive !== undefined) patch.isActive = dto.isActive;
    if (dto.displayName !== undefined) patch.displayName = dto.displayName?.trim() || null;
    await this.repo.update({ id }, patch);
    const row = await this.baseQuery()
      .andWhere('u.id = :id', { id })
      .getRawOne();
    if (!row) throw new NotFoundException('Customer not found');
    return this.mapRow(row);
  }

  private baseQuery() {
    return this.repo
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .addSelect('u.email', 'email')
      .addSelect('u.phone', 'phone')
      .addSelect('u.display_name', 'displayName')
      .addSelect('u.is_active', 'isActive')
      .addSelect('u.created_at', 'createdAt')
      .addSelect('MAX(o.placed_at)', 'lastOrderAt')
      .addSelect('COUNT(o.id)', 'orderCount')
      .addSelect('COALESCE(SUM(o.total::numeric), 0)', 'totalSpent')
      .addSelect('COALESCE(MAX(la.points_balance), 0)', 'loyaltyPoints')
      .leftJoin('orders', 'o', 'o.user_id = u.id')
      .leftJoin('loyalty_accounts', 'la', 'la.user_id = u.id')
      .where('u.role = :role', { role: Role.Customer })
      .groupBy('u.id')
      .orderBy('u.created_at', 'DESC');
  }

  private mapRow(row: Record<string, any>) {
    const normalizeDate = (value: any) => {
      if (!value) return null;
      if (value instanceof Date) return value.toISOString();
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    };

    const toNumber = (value: any) => {
      const num = typeof value === 'string' ? Number(value) : value;
      return Number.isFinite(num) ? Number(num) : 0;
    };

    return {
      id: row.id,
      email: row.email,
      phone: row.phone ?? null,
      displayName: row.displayName ?? null,
      isActive:
        row.isActive === true ||
        row.isActive === 'true' ||
        row.isActive === 't' ||
        row.isActive === 1,
      createdAt: normalizeDate(row.createdAt),
      lastOrderAt: normalizeDate(row.lastOrderAt),
      orderCount: toNumber(row.orderCount),
      totalSpent: toNumber(row.totalSpent),
      loyaltyPoints: toNumber(row.loyaltyPoints),
    };
  }
}

