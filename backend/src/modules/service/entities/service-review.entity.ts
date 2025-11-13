import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Service } from './service.entity';
import { Customer } from '@/modules/auth/entities/customer.entity';

@Entity('service_reviews')
export class ServiceReview extends BaseEntity {
  @ManyToOne(() => Service)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  serviceId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @Column({ type: 'int', comment: 'Rating from 1 to 5' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'simple-json', nullable: true })
  pros: string[];

  @Column({ type: 'simple-json', nullable: true })
  cons: string[];

  @Column({ type: 'boolean', default: true })
  isVerified: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  orderId: string; // Reference to the order this review is for
}