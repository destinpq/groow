import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Customer } from '@/modules/auth/entities/customer.entity';
import { Product } from '@/modules/product/entities/product.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
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

  @Column({ nullable: true })
  variantId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'simple-json', nullable: true })
  selectedAttributes: {
    name: string;
    value: string;
  }[];
}
