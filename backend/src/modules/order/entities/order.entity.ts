import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Customer } from '@/modules/auth/entities/customer.entity';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@/common/enums';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @Column({ type: 'simple-json' })
  items: {
    productId: string;
    productName: string;
    variantId?: string;
    quantity: number;
    price: number;
    total: number;
  }[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.NEW })
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'simple-json' })
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    phone: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  billingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  carrierId: string;

  @Column({ nullable: true })
  courierName: string;

  @Column({ type: 'timestamp', nullable: true })
  manifestedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  heldAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  disputedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnRequestedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;

  @Column({ nullable: true })
  holdReason: string;

  @Column({ nullable: true })
  disputeReason: string;

  @Column({ type: 'text', nullable: true })
  disputeDescription: string;

  @Column({ nullable: true })
  returnReason: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundAmount: number;

  @Column({ nullable: true })
  refundReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
