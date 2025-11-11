import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/auth/entities/user.entity';

@Entity('deals')
export class Deal extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  dealType: string; // flash_sale, daily_deal, bulk_discount, seasonal_sale

  @Column({ type: 'simple-json' })
  discountRules: {
    type: string; // percentage, fixed_amount, buy_x_get_y
    value: number;
    minQuantity?: number;
    maxQuantity?: number;
    minOrderValue?: number;
    freeItems?: number;
  };

  @Column({ type: 'simple-json', nullable: true })
  conditions: {
    applicableProducts?: string[]; // Product IDs
    applicableCategories?: string[]; // Category IDs
    applicableVendors?: string[]; // Vendor IDs
    newCustomersOnly?: boolean;
    minOrderValue?: number;
    maxUsagePerCustomer?: number;
    excludedProducts?: string[];
    paymentMethods?: string[];
  };

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'int', nullable: true })
  usageLimit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ type: 'simple-json', nullable: true })
  banner: {
    imageUrl: string;
    altText: string;
    clickAction: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  targeting: {
    userSegments: string[]; // new_customers, vip_customers, inactive_customers
    geoLocations: string[]; // city, state, country
    demographics: {
      ageRange?: { min: number; max: number };
      gender?: string;
    };
  };

  @Column({ type: 'simple-json', nullable: true })
  analytics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number; // Click-through rate
    conversionRate: number;
    avgOrderValue: number;
  };

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];
}