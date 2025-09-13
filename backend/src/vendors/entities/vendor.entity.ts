import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum VendorLocation {
  Dashoguz = 'Dashoguz',
  Balkan = 'Balkan',
  Lebap = 'Lebap',
  Mary = 'Mary',
  Ahal = 'Ahal',
  Ashgabat = 'Ashgabat',
}

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'commission_type', default: 'percentage' })
  commissionType: string;

  @Column({ name: 'commission_value', type: 'numeric', precision: 10, scale: 2, default: 0 })
  commissionValue: string;

  @Column({ type: 'enum', enum: VendorLocation, default: VendorLocation.Ashgabat })
  location: VendorLocation;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

