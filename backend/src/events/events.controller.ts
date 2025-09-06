import { Body, Controller, Post, Req } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Post()
  ingest(
    @Req() req: any,
    @Body()
    body: {
      type: string;
      entityId?: string;
      entityType?: string;
      sessionId?: string;
      meta?: any;
    },
  ) {
    return this.events.ingest({
      type: body.type,
      entityId: body.entityId,
      entityType: body.entityType,
      sessionId: body.sessionId,
      userId: req.user?.id,
      meta: body.meta ?? {},
    });
  }
}

