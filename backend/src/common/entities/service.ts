// Comprehensive B2B Service Management Entities for Enterprise Marketplace
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
  JoinColumn,
} from 'typeorm';
import { VendorEntity } from './vendor';
import { CustomerEntity } from './customer';
import { UserEntity } from './user';
import { OrderEntity } from './order';

// ========================================
// Main Service Entity
// ========================================
@Entity('services')
@Index(['status', 'isActive', 'vendorId'])
@Index(['category', 'subCategory', 'pricingModel'])
@Index(['complianceLevel', 'securityLevel'])
export class ServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @Index()
  name: string;

  @Column({ length: 500 })
  @Index()
  slug: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  detailedDescription?: string;

  @Column('text', { nullable: true })
  technicalSpecifications?: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'pending_approval', 'active', 'inactive', 'suspended', 'archived'],
    default: 'draft',
  })
  @Index()
  status: 'draft' | 'pending_approval' | 'active' | 'inactive' | 'suspended' | 'archived';

  @Column({ default: true })
  @Index()
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isPromoted: boolean;

  // Vendor Information
  @Column('uuid')
  @Index()
  vendorId: string;

  @ManyToOne(() => VendorEntity, vendor => vendor.services)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  // Service Classification
  @Column({ length: 100 })
  @Index()
  category: string;

  @Column({ length: 100, nullable: true })
  @Index()
  subCategory?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column('simple-array', { nullable: true })
  keywords?: string[];

  @Column({ length: 50, nullable: true })
  industryVertical?: string;

  @Column('simple-array', { nullable: true })
  targetMarkets?: string[];

  // Pricing Structure
  @Column({
    type: 'enum',
    enum: ['fixed', 'hourly', 'project_based', 'subscription', 'tiered', 'custom'],
    default: 'fixed',
  })
  @Index()
  pricingModel: 'fixed' | 'hourly' | 'project_based' | 'subscription' | 'tiered' | 'custom';

  @Column('decimal', { precision: 12, scale: 2 })
  basePrice: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column('json', { nullable: true })
  pricingTiers?: {
    tier: string;
    minQuantity: number;
    maxQuantity?: number;
    price: number;
    discountPercentage?: number;
  }[];

  @Column('json', { nullable: true })
  customPricingRules?: {
    condition: string;
    adjustment: number;
    adjustmentType: 'fixed' | 'percentage';
    description: string;
  }[];

  // Service Delivery
  @Column({
    type: 'enum',
    enum: ['remote', 'onsite', 'hybrid', 'cloud_based'],
    default: 'remote',
  })
  deliveryMethod: 'remote' | 'onsite' | 'hybrid' | 'cloud_based';

  @Column('int', { nullable: true })
  estimatedDeliveryDays?: number;

  @Column('json', { nullable: true })
  deliverySchedule?: {
    startDate?: Date;
    endDate?: Date;
    workingHours?: {
      start: string;
      end: string;
      timezone: string;
    };
    workingDays?: string[];
    milestones?: {
      name: string;
      description: string;
      estimatedDate: Date;
      deliverables: string[];
    }[];
  };

  @Column('simple-array', { nullable: true })
  supportedTimeZones?: string[];

  @Column('simple-array', { nullable: true })
  supportedLanguages?: string[];

  // Capacity Management
  @Column('int', { nullable: true })
  maxConcurrentOrders?: number;

  @Column('int', { nullable: true })
  availableSlots?: number;

  @Column('int', { nullable: true })
  usedSlots?: number;

  @Column({ default: false })
  allowOverbooking: boolean;

  @Column('json', { nullable: true })
  capacitySchedule?: {
    date: string;
    availableSlots: number;
    bookedSlots: number;
    isBlocked: boolean;
    blockReason?: string;
  }[];

  // Requirements and Dependencies
  @Column('json', { nullable: true })
  customerRequirements?: {
    required: string[];
    optional: string[];
    systemRequirements?: {
      hardware?: string[];
      software?: string[];
      networkRequirements?: string[];
      accessRequirements?: string[];
    };
  };

  @Column('json', { nullable: true })
  dependencies?: {
    services?: string[];
    tools?: string[];
    integrations?: string[];
    thirdPartyServices?: string[];
  };

  // Compliance and Security
  @Column({
    type: 'enum',
    enum: ['basic', 'enhanced', 'enterprise', 'government'],
    default: 'basic',
  })
  @Index()
  complianceLevel: 'basic' | 'enhanced' | 'enterprise' | 'government';

  @Column('simple-array', { nullable: true })
  complianceCertifications?: string[];

  @Column({
    type: 'enum',
    enum: ['standard', 'enhanced', 'high', 'top_secret'],
    default: 'standard',
  })
  @Index()
  securityLevel: 'standard' | 'enhanced' | 'high' | 'top_secret';

  @Column('simple-array', { nullable: true })
  securityCertifications?: string[];

  @Column('json', { nullable: true })
  dataHandling?: {
    dataTypes: string[];
    dataLocation: string[];
    retentionPeriod: string;
    encryptionLevel: string;
    backupFrequency: string;
    accessControls: string[];
  };

  // Quality Assurance
  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  averageRating?: number;

  @Column('int', { default: 0 })
  totalReviews: number;

  @Column('json', { nullable: true })
  qualityMetrics?: {
    onTimeDelivery: number;
    customerSatisfaction: number;
    firstTimeRightRate: number;
    responseTime: number; // in hours
    resolutionTime: number; // in hours
    escalationRate: number;
  };

  @Column('json', { nullable: true })
  slaTerms?: {
    responseTime: string;
    resolutionTime: string;
    uptime: string;
    availability: string;
    penalties: {
      condition: string;
      penalty: string;
    }[];
  };

  // Media and Documentation
  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column('simple-array', { nullable: true })
  documents?: string[];

  @Column('simple-array', { nullable: true })
  videos?: string[];

  @Column('simple-array', { nullable: true })
  caseStudies?: string[];

  @Column('simple-array', { nullable: true })
  portfolioItems?: string[];

  @Column('json', { nullable: true })
  downloadableResources?: {
    name: string;
    description: string;
    fileUrl: string;
    fileType: string;
    size: number;
    accessLevel: 'public' | 'customer_only' | 'enterprise_only';
  }[];

  // Integration Capabilities
  @Column('json', { nullable: true })
  integrations?: {
    apiEndpoints?: {
      name: string;
      method: string;
      endpoint: string;
      description: string;
      authentication: string;
    }[];
    webhooks?: {
      event: string;
      endpoint: string;
      description: string;
    }[];
    platformIntegrations?: {
      platform: string;
      integrationLevel: 'basic' | 'advanced' | 'custom';
      setupComplexity: 'simple' | 'moderate' | 'complex';
      description: string;
    }[];
  };

  // Business Terms
  @Column('json', { nullable: true })
  contractTerms?: {
    minimumCommitment?: string;
    cancellationPolicy?: string;
    paymentTerms?: string;
    renewalTerms?: string;
    terminationClause?: string;
    intellectualProperty?: string;
    confidentiality?: string;
    liability?: string;
  };

  @Column('json', { nullable: true })
  licensing?: {
    licenseType: string;
    usageRights: string[];
    restrictions: string[];
    transferability: boolean;
    duration: string;
    renewalOptions: string[];
  };

  // Performance Analytics
  @Column('json', { nullable: true })
  performanceMetrics?: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    averageOrderValue: number;
    totalRevenue: number;
    monthlyRecurringRevenue?: number;
    customerRetentionRate: number;
    netPromoterScore?: number;
    utilizationRate: number;
  };

  @Column('json', { nullable: true })
  marketingMetrics?: {
    views: number;
    inquiries: number;
    conversionRate: number;
    leadQualityScore: number;
    averageSalesyCle: number;
    sourceAnalytics: {
      source: string;
      conversions: number;
      revenue: number;
    }[];
  };

  // Audit and Tracking
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('uuid', { nullable: true })
  createdBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdBy' })
  creator?: UserEntity;

  @Column('uuid', { nullable: true })
  updatedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updatedBy' })
  updater?: UserEntity;

  @Column({ nullable: true })
  lastModifiedReason?: string;

  @Column('timestamp', { nullable: true })
  approvedAt?: Date;

  @Column('uuid', { nullable: true })
  approvedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'approvedBy' })
  approver?: UserEntity;

  // Relationships
  @OneToMany(() => ServiceVariantEntity, variant => variant.service)
  variants: ServiceVariantEntity[];

  @OneToMany(() => ServiceAddonEntity, addon => addon.service)
  addons: ServiceAddonEntity[];

  @OneToMany(() => ServiceReviewEntity, review => review.service)
  reviews: ServiceReviewEntity[];

  @OneToMany(() => ServiceQuoteEntity, quote => quote.service)
  quotes: ServiceQuoteEntity[];

  @OneToMany(() => OrderEntity, order => order.service)
  orders: OrderEntity[];

  @ManyToMany(() => CustomerEntity, customer => customer.favoriteServices)
  @JoinTable({
    name: 'service_favorites',
    joinColumn: { name: 'serviceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'customerId', referencedColumnName: 'id' },
  })
  favoritedBy: CustomerEntity[];

  @OneToMany(() => ServiceAnalyticsEntity, analytics => analytics.service)
  analytics: ServiceAnalyticsEntity[];

  @OneToMany(() => ServiceComplianceAuditEntity, audit => audit.service)
  complianceAudits: ServiceComplianceAuditEntity[];
}

// ========================================
// Service Variants Entity
// ========================================
@Entity('service_variants')
@Index(['serviceId', 'isActive'])
export class ServiceVariantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  serviceId: string;

  @ManyToOne(() => ServiceEntity, service => service.variants)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column({ length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ length: 100 })
  sku: string;

  @Column('decimal', { precision: 12, scale: 2 })
  priceModifier: number;

  @Column({
    type: 'enum',
    enum: ['fixed', 'percentage'],
    default: 'fixed',
  })
  priceModifierType: 'fixed' | 'percentage';

  @Column('json', { nullable: true })
  features?: {
    included: string[];
    excluded: string[];
    enhanced: string[];
  };

  @Column('json', { nullable: true })
  specifications?: {
    key: string;
    value: string;
    unit?: string;
    description?: string;
  }[];

  @Column('json', { nullable: true })
  deliveryOptions?: {
    estimatedDays: number;
    rushAvailable: boolean;
    rushUpcharge?: number;
    schedulingFlexibility: 'fixed' | 'flexible' | 'customer_choice';
  };

  @Column({ default: true })
  @Index()
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column('int', { default: 0 })
  sortOrder: number;

  @Column('int', { nullable: true })
  maxConcurrentOrders?: number;

  @Column('json', { nullable: true })
  customizations?: {
    option: string;
    type: 'text' | 'select' | 'multiselect' | 'file' | 'number';
    required: boolean;
    values?: string[];
    priceImpact?: number;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ========================================
// Service Add-ons Entity
// ========================================
@Entity('service_addons')
@Index(['serviceId', 'isActive'])
export class ServiceAddonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  serviceId: string;

  @ManyToOne(() => ServiceEntity, service => service.addons)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({ length: 100 })
  sku: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ['one_time', 'recurring', 'per_use'],
    default: 'one_time',
  })
  billingType: 'one_time' | 'recurring' | 'per_use';

  @Column({
    type: 'enum',
    enum: ['optional', 'recommended', 'required'],
    default: 'optional',
  })
  requirementLevel: 'optional' | 'recommended' | 'required';

  @Column('json', { nullable: true })
  applicableVariants?: string[]; // variant IDs

  @Column('json', { nullable: true })
  dependencies?: string[]; // addon IDs that must be selected first

  @Column('json', { nullable: true })
  exclusions?: string[]; // addon IDs that cannot be selected together

  @Column({ default: true })
  @Index()
  isActive: boolean;

  @Column('int', { default: 0 })
  sortOrder: number;

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ========================================
// Service Categories Entity
// ========================================
@Entity('service_categories')
@Index(['parentId', 'isActive'])
export class ServiceCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @Index()
  name: string;

  @Column({ length: 500 })
  @Index()
  slug: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('uuid', { nullable: true })
  @Index()
  parentId?: string;

  @ManyToOne(() => ServiceCategoryEntity, category => category.children)
  @JoinColumn({ name: 'parentId' })
  parent?: ServiceCategoryEntity;

  @OneToMany(() => ServiceCategoryEntity, category => category.parent)
  children: ServiceCategoryEntity[];

  @Column('int', { default: 0 })
  level: number;

  @Column('int', { default: 0 })
  sortOrder: number;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ default: true })
  @Index()
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column('json', { nullable: true })
  metadata?: {
    keywords: string[];
    seoTitle?: string;
    seoDescription?: string;
    industryVerticals?: string[];
    skillsRequired?: string[];
    typicalProjectSize?: string;
    averagePrice?: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ========================================
// Service Reviews Entity
// ========================================
@Entity('service_reviews')
@Index(['serviceId', 'customerId'])
@Index(['rating', 'isVerified'])
export class ServiceReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  serviceId: string;

  @ManyToOne(() => ServiceEntity, service => service.reviews)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column('uuid')
  @Index()
  customerId: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column('uuid', { nullable: true })
  orderId?: string;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'orderId' })
  order?: OrderEntity;

  @Column('decimal', { precision: 2, scale: 1 })
  @Index()
  rating: number; // 1.0 to 5.0

  @Column({ length: 255, nullable: true })
  title?: string;

  @Column('text')
  comment: string;

  @Column('json', { nullable: true })
  detailedRatings?: {
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
    valueForMoney: number;
  };

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column({ default: false })
  @Index()
  isVerified: boolean;

  @Column({ default: false })
  isAnonymous: boolean;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  @Index()
  moderationStatus: 'pending' | 'approved' | 'rejected';

  @Column('text', { nullable: true })
  moderationNotes?: string;

  @Column('uuid', { nullable: true })
  moderatedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'moderatedBy' })
  moderator?: UserEntity;

  @Column('timestamp', { nullable: true })
  moderatedAt?: Date;

  @Column('int', { default: 0 })
  helpfulVotes: number;

  @Column('int', { default: 0 })
  totalVotes: number;

  @Column('json', { nullable: true })
  vendorResponse?: {
    response: string;
    respondedAt: Date;
    respondedBy: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ========================================
// Service Quotes Entity
// ========================================
@Entity('service_quotes')
@Index(['serviceId', 'customerId', 'status'])
export class ServiceQuoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  serviceId: string;

  @ManyToOne(() => ServiceEntity, service => service.quotes)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column('uuid')
  @Index()
  customerId: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column({ length: 100 })
  @Index()
  quoteNumber: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'revised'],
    default: 'draft',
  })
  @Index()
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'revised';

  @Column('json')
  requirements: {
    description: string;
    specifications?: any;
    timeline?: string;
    budget?: number;
    deliveryPreferences?: string[];
    customizations?: any[];
  };

  @Column('json')
  quotedItems: {
    type: 'service' | 'variant' | 'addon';
    itemId: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    deliveryTime?: string;
    notes?: string;
  }[];

  @Column('decimal', { precision: 12, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column('timestamp')
  validUntil: Date;

  @Column('text', { nullable: true })
  terms?: string;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('simple-array', { nullable: true })
  attachments?: string[];

  @Column('timestamp', { nullable: true })
  sentAt?: Date;

  @Column('timestamp', { nullable: true })
  viewedAt?: Date;

  @Column('timestamp', { nullable: true })
  respondedAt?: Date;

  @Column('json', { nullable: true })
  revisionHistory?: {
    version: number;
    changedAt: Date;
    changedBy: string;
    changes: string[];
    notes?: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('uuid', { nullable: true })
  createdBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdBy' })
  creator?: UserEntity;
}

// ========================================
// Service Analytics Entity
// ========================================
@Entity('service_analytics')
@Index(['serviceId', 'dateRange', 'metricType'])
export class ServiceAnalyticsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  serviceId: string;

  @ManyToOne(() => ServiceEntity, service => service.analytics)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column('date')
  @Index()
  dateRange: Date;

  @Column({
    type: 'enum',
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
  })
  @Index()
  metricType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

  @Column('json')
  metrics: {
    views: number;
    inquiries: number;
    quotes: number;
    orders: number;
    revenue: number;
    averageOrderValue: number;
    conversionRate: number;
    customerSatisfaction?: number;
    repeatCustomers: number;
    refunds: number;
    cancellations: number;
    completionRate: number;
    averageDeliveryTime: number;
    capacityUtilization: number;
  };

  @Column('json', { nullable: true })
  demographicBreakdown?: {
    industry: Record<string, number>;
    companySize: Record<string, number>;
    geography: Record<string, number>;
    customerSegment: Record<string, number>;
  };

  @Column('json', { nullable: true })
  performanceIndicators?: {
    trending: 'up' | 'down' | 'stable';
    percentageChange: number;
    comparedToPrevious: number;
    benchmarkComparison: number;
    seasonalityFactor: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ========================================
// Service Compliance Audit Entity
// ========================================
@Entity('service_compliance_audits')
@Index(['serviceId', 'auditType', 'status'])
export class ServiceComplianceAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  serviceId: string;

  @ManyToOne(() => ServiceEntity, service => service.complianceAudits)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column({ length: 100 })
  @Index()
  auditType: string; // SOC2, HIPAA, ISO27001, GDPR, etc.

  @Column({
    type: 'enum',
    enum: ['scheduled', 'in_progress', 'completed', 'failed', 'remediation_required'],
    default: 'scheduled',
  })
  @Index()
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'remediation_required';

  @Column('timestamp')
  scheduledDate: Date;

  @Column('timestamp', { nullable: true })
  completedDate?: Date;

  @Column('uuid', { nullable: true })
  auditorId?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'auditorId' })
  auditor?: UserEntity;

  @Column('json', { nullable: true })
  findings?: {
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    evidence?: string[];
    recommendation: string;
    status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
    dueDate?: Date;
  }[];

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  complianceScore?: number; // 0.00 to 100.00

  @Column('json', { nullable: true })
  certifications?: {
    certification: string;
    issuer: string;
    issuedDate: Date;
    expiryDate: Date;
    certificateNumber: string;
    status: 'valid' | 'expired' | 'suspended' | 'revoked';
  }[];

  @Column('timestamp', { nullable: true })
  nextAuditDate?: Date;

  @Column('simple-array', { nullable: true })
  reportDocuments?: string[];

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}