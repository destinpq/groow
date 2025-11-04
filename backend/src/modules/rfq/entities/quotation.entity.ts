import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Rfq } from './rfq.entity';
import { Vendor } from '@/modules/auth/entities/vendor.entity';

@Entity('quotations')
export class Quotation extends BaseEntity {
  @Column({ unique: true })
  quotationNumber: string;

  @ManyToOne(() => Rfq, rfq => rfq.quotations)
  @JoinColumn({ name: 'rfqId' })
  rfq: Rfq;

  @Column()
  rfqId: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column()
  vendorId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'simple-json' })
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int', nullable: true })
  validityDays: number;

  @Column({ default: 'submitted' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date;
}
