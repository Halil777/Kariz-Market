import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string | null;

  @Column({ name: 'session_id', nullable: true })
  sessionId?: string | null;

  @Column()
  type: string; // view | add_to_cart | purchase

  @Column({ name: 'entity_id', nullable: true })
  entityId?: string | null;

  @Column({ name: 'entity_type', nullable: true })
  entityType?: string | null;

  @Column({ type: 'jsonb', default: {} })
  meta: Record<string, any>;

  @CreateDateColumn({ name: 'ts' })
  ts: Date;
}

