import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Customer } from '@/modules/auth/entities/customer.entity';
import { Product } from '@/modules/product/entities/product.entity';

@Entity('wishlist_items')
export class WishlistItem extends BaseEntity {
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
