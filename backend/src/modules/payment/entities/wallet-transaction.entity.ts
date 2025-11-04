import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Vendor } from '@/modules/auth/entities/vendor.entity';
import { Customer } from '@/modules/auth/entities/customer.entity';
import { TransactionType } from '@/common/enums';

@Entity('wallet_transactions')
export class WalletTransaction extends BaseEntity {
  @Column({ unique: true })
  transactionId: string;

  @ManyToOne(() => Vendor, { nullable: true })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column({ nullable: true })
  vendorId: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ nullable: true })
  customerId: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceBefore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceAfter: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;
}
