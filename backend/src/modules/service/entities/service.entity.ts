import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { ServiceStatus, ServiceType, PricingModel } from '@/common/enums';
import { Vendor } from '@/modules/auth/entities/vendor.entity';

@Entity('services')
export class Service extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ unique: true })
  serviceCode: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column()
  vendorId: string;

  @Column({ nullable: true })
  categoryId: string; // Software Development, Cloud Services, Cybersecurity, etc.

  @Column({ nullable: true })
  subcategoryId: string; // Web Development, Mobile Development, etc.

  @Column({ type: 'enum', enum: ServiceType })
  serviceType: ServiceType; // HOURLY, PROJECT, SUBSCRIPTION, CONSULTATION

  @Column({ type: 'enum', enum: PricingModel })
  pricingModel: PricingModel; // FIXED, HOURLY, MONTHLY, YEARLY, CUSTOM

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice: number;

  @Column({ type: 'int', default: 1, comment: 'Hours for completion or project duration' })
  estimatedDuration: number;

  @Column({ default: 'hours', comment: 'Duration unit: hours, days, weeks, months' })
  durationUnit: string;

  @Column({ type: 'int', default: 1, comment: 'Minimum project size or hours' })
  minOrderSize: number;

  @Column({ type: 'int', nullable: true, comment: 'Maximum concurrent projects' })
  maxConcurrentProjects: number;

  @Column({ type: 'simple-json', nullable: true })
  images: string[];

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ type: 'simple-json', nullable: true })
  servicePackages: {
    id: string;
    name: string; // Basic, Standard, Premium
    description: string;
    price: number;
    features: string[];
    deliveryTime: number;
    revisions: number;
  }[];

  @Column({ type: 'simple-json', nullable: true })
  technicalSpecs: { 
    category: string; // Technologies, Platforms, Tools
    items: string[]; 
  }[];

  @Column({ type: 'simple-json', nullable: true })
  deliverables: string[]; // What client will receive

  @Column({ type: 'simple-json', nullable: true })
  requirements: string[]; // What client needs to provide

  @Column({ type: 'enum', enum: ServiceStatus, default: ServiceStatus.DRAFT })
  status: ServiceStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  ordersCompleted: number;

  @Column({ type: 'simple-json', nullable: true })
  portfolio: {
    title: string;
    description: string;
    image: string;
    url?: string;
    technologies: string[];
  }[];

  @Column({ type: 'simple-json', nullable: true })
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'int', default: 0, comment: 'Response time in hours' })
  responseTime: number;

  @Column({ type: 'simple-json', nullable: true })
  availableTimezones: string[];

  @Column({ type: 'simple-json', nullable: true })
  supportedLanguages: string[];
}