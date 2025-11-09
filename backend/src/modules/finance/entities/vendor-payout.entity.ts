import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Vendor } from '@/modules/auth/entities/vendor.entity';

@Entity('vendor_payouts')
export class VendorPayout extends BaseEntity {
  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column()
  vendorId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  commission: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netAmount: number;

  @Column()
  status: string; // pending, processing, completed, failed

  @Column()
  payoutMethod: string; // bank_transfer, paypal, etc.

  @Column({ type: 'simple-json', nullable: true })
  paymentDetails: {
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    paypalEmail?: string;
  };

  @Column({ nullable: true })
  transactionReference: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  failureReason: string;
}