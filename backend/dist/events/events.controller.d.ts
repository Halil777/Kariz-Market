import { EventsService } from './events.service';
export declare class EventsController {
    private readonly events;
    constructor(events: EventsService);
    ingest(req: any, body: {
        type: string;
        entityId?: string;
        entityType?: string;
        sessionId?: string;
        meta?: any;
    }): Promise<import("./entities/event.entity").EventEntity>;
}
