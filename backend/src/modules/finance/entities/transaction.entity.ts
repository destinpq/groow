import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { TransactionType } from '@/common/enums';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: true })
  orderId: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column()
  referenceId: string;

  @Column()
  status: string; // pending, completed, failed

  @Column({ nullable: true })
  paymentGateway: string;

  @Column({ nullable: true })
  gatewayTransactionId: string;

  @Column({ type: 'text', nullable: true })
  gatewayResponse: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;
}