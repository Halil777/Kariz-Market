import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private readonly repo: Repository<Order>) {}

  listForUser(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  getForUser(userId: string, id: string) {
    return this.repo.findOne({ where: { id, userId } });
  }
}

