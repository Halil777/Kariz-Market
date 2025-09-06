import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(EventEntity) private readonly repo: Repository<EventEntity>) {}

  async ingest(event: Partial<EventEntity>) {
    const e = this.repo.create(event);
    return this.repo.save(e);
  }
}

