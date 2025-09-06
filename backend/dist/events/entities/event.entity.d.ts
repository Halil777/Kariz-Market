export declare class EventEntity {
    id: string;
    userId?: string | null;
    sessionId?: string | null;
    type: string;
    entityId?: string | null;
    entityType?: string | null;
    meta: Record<string, any>;
    ts: Date;
}
