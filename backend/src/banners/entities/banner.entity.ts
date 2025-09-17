import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'title_tm', type: 'varchar', length: 255, nullable: true })
  titleTm?: string | null;

  @Column({ name: 'title_ru', type: 'varchar', length: 255, nullable: true })
  titleRu?: string | null;

  @Column({ name: 'subtitle_tm', type: 'text', nullable: true })
  subtitleTm?: string | null;

  @Column({ name: 'subtitle_ru', type: 'text', nullable: true })
  subtitleRu?: string | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

