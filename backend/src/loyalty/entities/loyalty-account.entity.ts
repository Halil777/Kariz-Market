import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LoyaltyTransaction } from './loyalty-transaction.entity';

@Entity('loyalty_accounts')
export class LoyaltyAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'points_balance', type: 'int', default: 0 })
  pointsBalance: number;

  @OneToMany(() => LoyaltyTransaction, (t) => t.account)
  transactions: LoyaltyTransaction[];
}

