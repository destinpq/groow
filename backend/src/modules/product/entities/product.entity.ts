import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { ProductStatus } from '@/common/enums';
import { Vendor } from '@/modules/auth/entities/vendor.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column()
  sku: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column()
  vendorId: string;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ nullable: true })
  subcategoryId: string;

  @Column({ nullable: true })
  brandId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'int', default: 1 })
  minOrderQuantity: number;

  @Column({ type: 'simple-json', nullable: true })
  images: string[];

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ type: 'simple-json', nullable: true })
  variants: {
    id: string;
    attributes: { name: string; value: string }[];
    sku: string;
    price: number;
    stock: number;
  }[];

  @Column({ type: 'simple-json', nullable: true })
  specifications: { key: string; value: string }[];

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  salesCount: number;

  @Column({ type: 'simple-json', nullable: true })
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;
}
