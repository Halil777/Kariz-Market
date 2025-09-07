import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
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
    const qb = this.repo
      .createQueryBuilder('u')
      .where('u.role = :role', { role: Role.Customer })
      .orderBy('u.created_at', 'DESC');
    if (q) {
      qb.andWhere('(LOWER(u.email) LIKE :q OR LOWER(u.phone) LIKE :q)', {
        q: `%${q.toLowerCase()}%`,
      });
    }
    return qb.getMany();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const patch: Partial<User> = {};
    if (dto.phone !== undefined) patch.phone = dto.phone;
    if (dto.isActive !== undefined) patch.isActive = dto.isActive;
    await this.repo.update({ id }, patch);
    return this.repo.findOne({ where: { id } });
  }
}

