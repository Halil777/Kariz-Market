import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
export declare class EventsService {
    private readonly repo;
    constructor(repo: Repository<EventEntity>);
    ingest(event: Partial<EventEntity>): Promise<EventEntity>;
}
