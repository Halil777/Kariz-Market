import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyAccount } from './entities/loyalty-account.entity';

@Injectable()
export class LoyaltyService {
  constructor(@InjectRepository(LoyaltyAccount) private readonly repo: Repository<LoyaltyAccount>) {}

  async getOrCreate(userId: string) {
    let acc = await this.repo.findOne({ where: { userId } });
    if (!acc) {
      acc = this.repo.create({ userId, pointsBalance: 0 });
      acc = await this.repo.save(acc);
    }
    return acc;
  }
}

