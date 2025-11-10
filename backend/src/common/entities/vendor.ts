import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CustomerEntity } from './customer';
import { UserEntity } from './user';
import { ProductEntity } from './product';
import { ServiceEntity } from './service';
import { OrderEntity } from './order';

// ========================================
// Vendor Entity - B2B Supplier/Service Provider
// ========================================

@Entity('vendors')
@Index(['vendorNumber', 'status'])
@Index(['businessName'])
@Index(['businessEmail'])
@Index(['verificationStatus'])
@Index(['performanceRating'])
@Index(['registrationDate'])
export class VendorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  vendorNumber: string; // V000001, V000002, etc.

  // Basic Information
  @Column()
  businessName: string;

  @Column({ nullable: true })
  legalName: string;

  @Column({ nullable: true })
  tradeName: string;

  @Column({ unique: true })
  businessEmail: string;

  @Column({ nullable: true })
  businessPhone: string;

  @Column({ nullable: true })
  website: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  bannerUrl: string;

  // Business Classification
  @Column('enum', { 
    enum: ['individual', 'sole_proprietorship', 'partnership', 'corporation', 'llc', 'non_profit'],
    default: 'individual'
  })
  businessType: string;

  @Column('simple-array', { nullable: true })
  businessCategories: string[]; // ['manufacturing', 'services', 'consulting']

  @Column('simple-array', { nullable: true })
  serviceCategories: string[]; // ['logistics', 'marketing', 'development']

  @Column('simple-array', { nullable: true })
  industryVerticals: string[]; // ['healthcare', 'finance', 'education']

  // Legal and Registration
  @Column({ nullable: true })
  businessRegistrationNumber: string;

  @Column({ nullable: true })
  taxIdentificationNumber: string;

  @Column({ nullable: true })
  vatNumber: string;

  @Column('date', { nullable: true })
  incorporationDate: Date;

  @Column({ nullable: true })
  countryOfIncorporation: string;

  @Column('json', { nullable: true })
  businessAddress: any; // { street, city, state, country, postalCode }

  @Column('json', { nullable: true })
  billingAddress: any;

  @Column('json', { nullable: true })
  shippingAddress: any;

  // Status and Verification
  @Column('enum', { 
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'suspended', 'inactive'],
    default: 'draft'
  })
  status: string;

  @Column('enum', { 
    enum: ['unverified', 'pending', 'verified', 'failed', 'expired'],
    default: 'unverified'
  })
  verificationStatus: string;

  @Column('json', { nullable: true })
  verificationData: any; // KYC/KYB verification details

  @Column({ nullable: true })
  verificationDate: Date;

  @Column('uuid', { nullable: true })
  verifiedByUserId: string;

  @Column('text', { nullable: true })
  verificationNotes: string;

  // Onboarding and Approval
  @Column('boolean', { default: false })
  isOnboardingComplete: boolean;

  @Column('json', { nullable: true })
  onboardingSteps: any; // { profile: true, documents: false, review: false }

  @Column('enum', { 
    enum: ['auto', 'manual', 'interview', 'references'],
    default: 'manual'
  })
  approvalProcess: string;

  @Column('uuid', { nullable: true })
  approvedByUserId: string;

  @Column({ nullable: true })
  approvalDate: Date;

  @Column('text', { nullable: true })
  approvalNotes: string;

  @Column('text', { nullable: true })
  rejectionReason: string;

  // Business Capabilities
  @Column('json', { nullable: true })
  capabilities: any; // Services, products, specializations

  @Column('json', { nullable: true })
  certifications: any; // Industry certifications and standards

  @Column('json', { nullable: true })
  complianceStandards: any; // ISO, SOC2, GDPR, etc.

  @Column('simple-array', { nullable: true })
  geographicCoverage: string[]; // Countries/regions served

  @Column('json', { nullable: true })
  operatingHours: any; // Business hours by timezone

  @Column('simple-array', { nullable: true })
  languages: string[]; // Supported languages

  // Financial Information
  @Column('varchar', { length: 3, default: 'USD' })
  primaryCurrency: string;

  @Column('simple-array', { nullable: true })
  acceptedCurrencies: string[];

  @Column('decimal', { precision: 20, scale: 2, nullable: true })
  annualRevenue: number;

  @Column('enum', { 
    enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    nullable: true
  })
  companySize: string;

  @Column('int', { nullable: true })
  employeeCount: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  creditLimit: number;

  @Column('enum', { 
    enum: ['net_15', 'net_30', 'net_45', 'net_60', 'immediate', 'custom'],
    default: 'net_30'
  })
  defaultPaymentTerms: string;

  // Performance Metrics
  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  performanceRating: number; // 0.00 to 5.00

  @Column('int', { default: 0 })
  totalOrders: number;

  @Column('decimal', { precision: 20, scale: 2, default: 0 })
  totalRevenue: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  onTimeDeliveryRate: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  qualityScore: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  customerSatisfactionScore: number;

  @Column('int', { default: 0 })
  positiveReviews: number;

  @Column('int', { default: 0 })
  negativeReviews: number;

  @Column('int', { default: 0 })
  disputeCount: number;

  // Contract and Pricing
  @Column('boolean', { default: false })
  hasPreferredVendorStatus: boolean;

  @Column('boolean', { default: false })
  hasVolumeDiscounts: boolean;

  @Column('json', { nullable: true })
  contractTerms: any; // Standard terms and conditions

  @Column('json', { nullable: true })
  pricingStructure: any; // Standard rates, discounts, etc.

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  commissionRate: number; // Platform commission percentage

  @Column('boolean', { default: true })
  allowsNegotiation: boolean;

  // Insurance and Guarantees
  @Column('json', { nullable: true })
  insuranceInfo: any; // Liability, professional indemnity, etc.

  @Column('json', { nullable: true })
  guarantees: any; // Service guarantees, warranties, etc.

  @Column('json', { nullable: true })
  bondingInfo: any; // Bonding and security deposits

  // Communication and Support
  @Column('json', { nullable: true })
  contactPersons: any; // Primary contacts for different functions

  @Column('json', { nullable: true })
  supportChannels: any; // Phone, email, chat, etc.

  @Column('enum', { 
    enum: ['basic', 'standard', 'premium', 'enterprise'],
    default: 'basic'
  })
  supportLevel: string;

  @Column('varchar', { length: 10, nullable: true })
  responseTimeSLA: string; // "24h", "4h", "1h", etc.

  // Platform Integration
  @Column('json', { nullable: true })
  integrationSettings: any; // API keys, webhooks, etc.

  @Column('boolean', { default: false })
  apiEnabled: boolean;

  @Column('simple-array', { nullable: true })
  connectedSystems: string[]; // ERP, CRM, inventory systems

  @Column('json', { nullable: true })
  automationRules: any; // Order processing, notifications, etc.

  // Marketing and Visibility
  @Column('boolean', { default: true })
  isPubliclyVisible: boolean;

  @Column('boolean', { default: false })
  isFeatured: boolean;

  @Column('int', { default: 0 })
  searchRanking: number;

  @Column('simple-array', { nullable: true })
  keywords: string[]; // For search optimization

  @Column('json', { nullable: true })
  marketingMaterials: any; // Brochures, case studies, etc.

  // Risk Assessment
  @Column('enum', { 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  })
  riskLevel: string;

  @Column('json', { nullable: true })
  riskFactors: any; // Financial stability, compliance history, etc.

  @Column('date', { nullable: true })
  lastRiskAssessment: Date;

  @Column('uuid', { nullable: true })
  riskAssessedByUserId: string;

  // Activity and Engagement
  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  lastActivityAt: Date;

  @Column('int', { default: 0 })
  loginCount: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('date')
  registrationDate: Date;

  @Column({ nullable: true })
  suspensionDate: Date;

  @Column('text', { nullable: true })
  suspensionReason: string;

  // Metadata
  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column('text', { nullable: true })
  internalNotes: string;

  @Column('json', { nullable: true })
  customData: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'verifiedByUserId' })
  verifiedBy: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'approvedByUserId' })
  approvedBy: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'riskAssessedByUserId' })
  riskAssessedBy: UserEntity;

  @OneToMany(() => VendorDocumentEntity, document => document.vendor, { cascade: true })
  documents: VendorDocumentEntity[];

  @OneToMany(() => VendorContactEntity, contact => contact.vendor, { cascade: true })
  contacts: VendorContactEntity[];

  @OneToMany(() => VendorPerformanceEntity, performance => performance.vendor, { cascade: true })
  performanceMetrics: VendorPerformanceEntity[];

  @OneToMany(() => VendorContractEntity, contract => contract.vendor, { cascade: true })
  contracts: VendorContractEntity[];

  @OneToMany(() => VendorReviewEntity, review => review.vendor, { cascade: true })
  reviews: VendorReviewEntity[];

  @OneToMany(() => ProductEntity, product => product.vendor)
  products: ProductEntity[];

  @OneToMany(() => ServiceEntity, service => service.vendor)
  services: ServiceEntity[];

  @OneToMany(() => OrderEntity, order => order.vendor)
  orders: OrderEntity[];
}

// ========================================
// Vendor Document Entity - KYC/KYB Documents
// ========================================

@Entity('vendor_documents')
@Index(['vendorId'])
@Index(['documentType', 'status'])
@Index(['expirationDate'])
export class VendorDocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @Column('enum', {
    enum: [
      'business_license', 'tax_certificate', 'insurance_certificate',
      'bank_statement', 'financial_statement', 'audit_report',
      'incorporation_document', 'directors_list', 'shareholders_agreement',
      'professional_license', 'certification', 'compliance_document',
      'identity_proof', 'address_proof', 'signature_card',
      'other'
    ]
  })
  documentType: string;

  @Column()
  documentName: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column('enum', {
    enum: ['uploaded', 'under_review', 'approved', 'rejected', 'expired'],
    default: 'uploaded'
  })
  status: string;

  @Column('uuid', { nullable: true })
  reviewedByUserId: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column('text', { nullable: true })
  reviewNotes: string;

  @Column('date', { nullable: true })
  issueDate: Date;

  @Column('date', { nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  issueingAuthority: string;

  @Column({ nullable: true })
  documentNumber: string;

  @Column('boolean', { default: false })
  isRequired: boolean;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column('json', { nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => VendorEntity, vendor => vendor.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'reviewedByUserId' })
  reviewedBy: UserEntity;
}

// ========================================
// Vendor Contact Entity - Key Contacts
// ========================================

@Entity('vendor_contacts')
@Index(['vendorId'])
@Index(['contactType'])
@Index(['isPrimary'])
export class VendorContactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @Column('enum', {
    enum: ['primary', 'billing', 'technical', 'sales', 'support', 'legal', 'compliance'],
    default: 'primary'
  })
  contactType: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  department: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  mobile: string;

  @Column('boolean', { default: false })
  isPrimary: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('simple-array', { nullable: true })
  responsibilities: string[]; // ['orders', 'billing', 'technical_support']

  @Column('json', { nullable: true })
  availabilitySchedule: any;

  @Column('simple-array', { nullable: true })
  preferredContactMethods: string[]; // ['email', 'phone', 'slack']

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => VendorEntity, vendor => vendor.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;
}

// ========================================
// Vendor Performance Tracking Entity
// ========================================

@Entity('vendor_performance')
@Index(['vendorId', 'metricDate'])
@Index(['metricType'])
export class VendorPerformanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @Column('date')
  metricDate: Date;

  @Column('enum', {
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'ad_hoc']
  })
  metricPeriod: string;

  // Performance Metrics
  @Column('int', { default: 0 })
  ordersReceived: number;

  @Column('int', { default: 0 })
  ordersCompleted: number;

  @Column('int', { default: 0 })
  ordersOnTime: number;

  @Column('int', { default: 0 })
  ordersCancelled: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  revenueGenerated: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  averageOrderValue: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  onTimeDeliveryRate: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  qualityScore: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  customerSatisfactionScore: number;

  // Quality Metrics
  @Column('int', { default: 0 })
  qualityIssues: number;

  @Column('int', { default: 0 })
  customerComplaints: number;

  @Column('int', { default: 0 })
  returnsProcessed: number;

  @Column('int', { default: 0 })
  disputesRaised: number;

  @Column('int', { default: 0 })
  disputesResolved: number;

  // Response Times
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  averageResponseTimeHours: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  averageResolutionTimeHours: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  slaComplianceRate: number;

  // Financial Metrics
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  costSavings: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  priceCompetitiveness: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  paymentTermsCompliance: number;

  // Additional Metrics
  @Column('json', { nullable: true })
  customMetrics: any; // Industry-specific metrics

  @Column('text', { nullable: true })
  notes: string;

  @Column('uuid', { nullable: true })
  reviewedByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => VendorEntity, vendor => vendor.performanceMetrics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'reviewedByUserId' })
  reviewedBy: UserEntity;
}

// ========================================
// Vendor Contract Entity - Contract Management
// ========================================

@Entity('vendor_contracts')
@Index(['vendorId'])
@Index(['contractType', 'status'])
@Index(['startDate', 'endDate'])
export class VendorContractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @Column()
  contractNumber: string;

  @Column('enum', {
    enum: ['master_service_agreement', 'statement_of_work', 'purchase_order', 'nda', 'service_level_agreement', 'other'],
    default: 'master_service_agreement'
  })
  contractType: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('enum', {
    enum: ['draft', 'pending_approval', 'active', 'suspended', 'expired', 'terminated'],
    default: 'draft'
  })
  status: string;

  @Column('date')
  startDate: Date;

  @Column('date', { nullable: true })
  endDate: Date;

  @Column('boolean', { default: false })
  isAutoRenew: boolean;

  @Column('int', { nullable: true })
  autoRenewPeriodMonths: number;

  @Column('json', { nullable: true })
  terms: any; // Contract terms and conditions

  @Column('json', { nullable: true })
  pricing: any; // Rate cards, volume discounts, etc.

  @Column('json', { nullable: true })
  slaTerms: any; // Service level agreements

  @Column('json', { nullable: true })
  paymentTerms: any; // Payment schedules, terms

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  contractValue: number;

  @Column('varchar', { length: 3, nullable: true })
  contractCurrency: string;

  @Column('json', { nullable: true })
  milestones: any; // Contract milestones and deliverables

  @Column('json', { nullable: true })
  penalties: any; // Penalty clauses

  @Column('json', { nullable: true })
  incentives: any; // Performance incentives

  @Column({ nullable: true })
  documentPath: string;

  @Column('uuid', { nullable: true })
  createdByUserId: string;

  @Column('uuid', { nullable: true })
  approvedByUserId: string;

  @Column({ nullable: true })
  approvalDate: Date;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => VendorEntity, vendor => vendor.contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'approvedByUserId' })
  approvedBy: UserEntity;
}

// ========================================
// Vendor Review Entity - Customer Reviews and Ratings
// ========================================

@Entity('vendor_reviews')
@Index(['vendorId', 'rating'])
@Index(['customerId'])
@Index(['orderId'])
export class VendorReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @Column('uuid')
  customerId: string;

  @Column('uuid', { nullable: true })
  orderId: string; // Review linked to specific order

  @Column('int')
  rating: number; // 1-5 stars

  @Column()
  title: string;

  @Column('text')
  comment: string;

  @Column('json', { nullable: true })
  criteriaRatings: any; // { quality: 5, delivery: 4, communication: 5 }

  @Column('boolean', { default: true })
  isVerified: boolean; // Verified purchase

  @Column('boolean', { default: true })
  isPublic: boolean;

  @Column('uuid', { nullable: true })
  moderatedByUserId: string;

  @Column({ nullable: true })
  moderatedAt: Date;

  @Column('text', { nullable: true })
  moderationNotes: string;

  @Column('text', { nullable: true })
  vendorResponse: string;

  @Column({ nullable: true })
  vendorResponseAt: Date;

  @Column('int', { default: 0 })
  helpfulVotes: number;

  @Column('int', { default: 0 })
  unhelpfulVotes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => VendorEntity, vendor => vendor.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @ManyToOne(() => CustomerEntity, { eager: false })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => OrderEntity, { eager: false })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'moderatedByUserId' })
  moderatedBy: UserEntity;
}