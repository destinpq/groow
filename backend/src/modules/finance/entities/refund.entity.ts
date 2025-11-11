import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Order } from '@/modules/order/entities/order.entity';

@Entity('refunds')
export class Refund extends BaseEntity {
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  reason: string;

  @Column()
  status: string; // pending, processing, completed, failed

  @Column()
  refundMethod: string; // original_payment, bank_transfer, store_credit

  @Column({ nullable: true })
  gatewayRefundId: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'text', nullable: true })
  gatewayResponse: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  failureReason: string;
}