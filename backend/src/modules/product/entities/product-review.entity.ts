import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Product } from './product.entity';
import { Customer } from '@/modules/auth/entities/customer.entity';

@Entity('product_reviews')
export class ProductReview extends BaseEntity {
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'simple-json', nullable: true })
  images: string[];

  @Column({ type: 'boolean', default: true })
  isVerifiedPurchase: boolean;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'int', default: 0 })
  helpfulCount: number;
}
