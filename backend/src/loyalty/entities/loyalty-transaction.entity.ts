import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LoyaltyAccount } from './loyalty-account.entity';

@Entity('loyalty_transactions')
export class LoyaltyTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LoyaltyAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: LoyaltyAccount;

  @Index()
  @Column({ name: 'account_id' })
  accountId: string;

  @Column()
  type: string; // earn | redeem | adjust

  @Column({ type: 'int' })
  points: number;

  @Column({ name: 'ref_type', nullable: true })
  refType?: string | null;

  @Column({ name: 'ref_id', nullable: true })
  refId?: string | null;

  @CreateDateColumn({ name: 'ts' })
  ts: Date;
}

