import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index, OneToOne } from 'typeorm';
import { User as UserEntity } from '@modules/auth/entities/user.entity';
import { VendorEntity } from './vendor';
import { OrderEntity } from './order';
import { CartEntity } from './cart';

// ========================================
// Customer Entity - B2B Enterprise Customer
// ========================================

@Entity('customers')
@Index(['customerNumber'])
@Index(['companyName'])
@Index(['primaryEmail'])
@Index(['accountType'])
@Index(['customerTier'])
@Index(['status'])
@Index(['registrationDate'])
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  customerNumber: string; // C000001, C000002, etc.

  // Basic Information
  @Column()
  companyName: string;

  @Column({ nullable: true })
  legalName: string;

  @Column({ nullable: true })
  tradeName: string;

  @Column({ unique: true })
  primaryEmail: string;

  @Column({ nullable: true })
  primaryPhone: string;

  @Column({ nullable: true })
  website: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  subIndustry: string;

  // Business Classification
  @Column('enum', { 
    enum: ['enterprise', 'mid_market', 'small_business', 'startup', 'individual'],
    default: 'small_business'
  })
  accountType: string;

  @Column('enum', { 
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  })
  customerTier: string;

  @Column('enum', { 
    enum: ['prospect', 'lead', 'opportunity', 'customer', 'champion', 'inactive', 'churned'],
    default: 'prospect'
  })
  lifecycleStage: string;

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

  // Account Status and Verification
  @Column('enum', { 
    enum: ['active', 'pending_approval', 'suspended', 'inactive', 'blocked', 'churned'],
    default: 'pending_approval'
  })
  status: string;

  @Column('enum', { 
    enum: ['unverified', 'email_verified', 'phone_verified', 'document_verified', 'fully_verified'],
    default: 'unverified'
  })
  verificationStatus: string;

  @Column('json', { nullable: true })
  verificationData: any; // KYC verification details

  @Column({ nullable: true })
  verificationDate: Date;

  @Column('uuid', { nullable: true })
  verifiedByUserId: string;

  // Financial Information
  @Column('varchar', { length: 3, default: 'USD' })
  preferredCurrency: string;

  @Column('decimal', { precision: 20, scale: 2, nullable: true })
  annualRevenue: number;

  @Column('enum', { 
    enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    nullable: true
  })
  companySize: string;

  @Column('int', { nullable: true })
  employeeCount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  creditLimit: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  currentBalance: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  availableCredit: number;

  @Column('enum', { 
    enum: ['net_15', 'net_30', 'net_45', 'net_60', 'immediate', 'custom'],
    default: 'net_30'
  })
  paymentTerms: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  creditScore: number; // 0.00 to 100.00

  // Business Relationships
  @Column('uuid', { nullable: true })
  parentCustomerId: string; // For subsidiary relationships

  @Column('boolean', { default: false })
  hasSubsidiaries: boolean;

  @Column('uuid', { nullable: true })
  primaryAccountManagerId: string;

  @Column('uuid', { nullable: true })
  salesRepId: string;

  @Column('uuid', { nullable: true })
  supportRepId: string;

  // Purchase Behavior and Preferences
  @Column('json', { nullable: true })
  purchasingPreferences: any; // Preferred vendors, categories, etc.

  @Column('simple-array', { nullable: true })
  preferredVendors: string[]; // Vendor IDs

  @Column('json', { nullable: true })
  approvalWorkflow: any; // Purchase approval hierarchy

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  autoApprovalLimit: number; // Orders below this amount auto-approved

  @Column('boolean', { default: false })
  requiresPurchaseOrders: boolean;

  @Column('json', { nullable: true })
  budgetLimits: any; // Category-wise budget limits

  // Performance Metrics
  @Column('int', { default: 0 })
  totalOrders: number;

  @Column('decimal', { precision: 20, scale: 2, default: 0 })
  totalSpent: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  averageOrderValue: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  orderFrequency: number; // Orders per month

  @Column({ nullable: true })
  lastOrderDate: Date;

  @Column({ nullable: true })
  lastLoginDate: Date;

  @Column('int', { default: 0 })
  loginCount: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  satisfactionScore: number;

  // Loyalty and Engagement
  @Column('int', { default: 0 })
  loyaltyPoints: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  lifetimeValue: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  churnProbability: number; // 0.00 to 1.00

  @Column({ nullable: true })
  churnRiskAssessmentDate: Date;

  @Column('int', { default: 0 })
  referralCount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  referralValue: number;

  // Communication and Support
  @Column('json', { nullable: true })
  communicationPreferences: any; // Email, SMS, phone preferences

  @Column('simple-array', { nullable: true })
  preferredContactMethods: string[];

  @Column('varchar', { length: 10, nullable: true })
  timezone: string; // UTC+05:30, etc.

  @Column('simple-array', { nullable: true })
  languages: string[];

  @Column('enum', { 
    enum: ['basic', 'standard', 'premium', 'enterprise', 'white_glove'],
    default: 'standard'
  })
  supportTier: string;

  @Column('boolean', { default: false })
  hasDedicatedAccountManager: boolean;

  // Contract and Compliance
  @Column('json', { nullable: true })
  contractTerms: any; // Special contract terms

  @Column('simple-array', { nullable: true })
  complianceRequirements: string[]; // Required certifications, standards

  @Column('json', { nullable: true })
  dataPrivacySettings: any; // GDPR, CCPA compliance settings

  @Column('boolean', { default: false })
  requiresDataResidency: boolean;

  @Column('simple-array', { nullable: true })
  allowedDataRegions: string[];

  // Marketing and Sales
  @Column('boolean', { default: true })
  allowsMarketing: boolean;

  @Column('simple-array', { nullable: true })
  marketingSegments: string[];

  @Column('json', { nullable: true })
  campaignHistory: any;

  @Column('simple-array', { nullable: true })
  leadSources: string[]; // Where customer came from

  @Column({ nullable: true })
  acquisitionDate: Date;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  acquisitionCost: number;

  // Integration and Technical
  @Column('boolean', { default: false })
  hasAPIAccess: boolean;

  @Column('json', { nullable: true })
  integrationSettings: any; // API configurations

  @Column('simple-array', { nullable: true })
  connectedSystems: string[]; // ERP, CRM integrations

  @Column('json', { nullable: true })
  customFields: any; // Industry-specific custom fields

  // Risk and Security
  @Column('enum', { 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  })
  riskLevel: string;

  @Column('json', { nullable: true })
  riskFactors: any;

  @Column('boolean', { default: false })
  isHighValue: boolean;

  @Column('boolean', { default: false })
  requiresBackgroundCheck: boolean;

  @Column('date', { nullable: true })
  lastRiskAssessment: Date;

  // Activity Tracking
  @Column({ nullable: true })
  lastActivityAt: Date;

  @Column('date')
  registrationDate: Date;

  @Column({ nullable: true })
  suspensionDate: Date;

  @Column('text', { nullable: true })
  suspensionReason: string;

  @Column({ nullable: true })
  deactivationDate: Date;

  @Column('text', { nullable: true })
  deactivationReason: string;

  // Metadata
  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column('text', { nullable: true })
  internalNotes: string;

  @Column('json', { nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CustomerEntity, { nullable: true })
  @JoinColumn({ name: 'parentCustomerId' })
  parentCustomer: CustomerEntity;

  @OneToMany(() => CustomerEntity, customer => customer.parentCustomer)
  subsidiaries: CustomerEntity[];

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'verifiedByUserId' })
  verifiedBy: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'primaryAccountManagerId' })
  primaryAccountManager: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'salesRepId' })
  salesRep: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'supportRepId' })
  supportRep: UserEntity;

  @OneToMany(() => CustomerAddressEntity, address => address.customer, { cascade: true })
  addresses: CustomerAddressEntity[];

  @OneToMany(() => CustomerContactEntity, contact => contact.customer, { cascade: true })
  contacts: CustomerContactEntity[];

  @OneToMany(() => CustomerDocumentEntity, document => document.customer, { cascade: true })
  documents: CustomerDocumentEntity[];

  @OneToMany(() => CustomerInteractionEntity, interaction => interaction.customer, { cascade: true })
  interactions: CustomerInteractionEntity[];

  @OneToMany(() => CustomerContractEntity, contract => contract.customer, { cascade: true })
  contracts: CustomerContractEntity[];

  @OneToMany(() => OrderEntity, order => order.customer)
  orders: OrderEntity[];

  @OneToMany(() => CartEntity, cart => cart.customer)
  carts: CartEntity[];
}

// ========================================
// Customer Address Entity
// ========================================

@Entity('customer_addresses')
@Index(['customerId'])
@Index(['addressType'])
@Index(['isDefault'])
export class CustomerAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @Column('enum', {
    enum: ['billing', 'shipping', 'office', 'warehouse', 'other'],
    default: 'office'
  })
  addressType: string;

  @Column()
  label: string; // "Main Office", "Warehouse 1", etc.

  @Column('text')
  streetAddress: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  fax: string;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('json', { nullable: true })
  coordinates: any; // { lat: number, lng: number }

  @Column('text', { nullable: true })
  deliveryInstructions: string;

  @Column('json', { nullable: true })
  businessHours: any;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CustomerEntity, customer => customer.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;
}

// ========================================
// Customer Contact Entity
// ========================================

@Entity('customer_contacts')
@Index(['customerId'])
@Index(['contactType'])
@Index(['isPrimary'])
export class CustomerContactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @Column('enum', {
    enum: ['primary', 'billing', 'purchasing', 'technical', 'legal', 'executive', 'procurement'],
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

  @Column('boolean', { default: false })
  hasSigningAuthority: boolean;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  approvalLimit: number;

  @Column('simple-array', { nullable: true })
  responsibilities: string[];

  @Column('json', { nullable: true })
  availabilitySchedule: any;

  @Column('simple-array', { nullable: true })
  preferredContactMethods: string[];

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CustomerEntity, customer => customer.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;
}

// ========================================
// Customer Document Entity
// ========================================

@Entity('customer_documents')
@Index(['customerId'])
@Index(['documentType'])
@Index(['status'])
export class CustomerDocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @Column('enum', {
    enum: [
      'business_license', 'tax_certificate', 'insurance_certificate',
      'credit_application', 'financial_statement', 'purchase_order',
      'contract', 'nda', 'compliance_certificate', 'other'
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
  uploadedByUserId: string;

  @Column('uuid', { nullable: true })
  reviewedByUserId: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column('text', { nullable: true })
  reviewNotes: string;

  @Column('date', { nullable: true })
  expirationDate: Date;

  @Column('boolean', { default: false })
  isConfidential: boolean;

  @Column('json', { nullable: true })
  accessPermissions: any; // Who can view this document

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CustomerEntity, customer => customer.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'uploadedByUserId' })
  uploadedBy: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'reviewedByUserId' })
  reviewedBy: UserEntity;
}

// ========================================
// Customer Interaction Entity - CRM Activity Log
// ========================================

@Entity('customer_interactions')
@Index(['customerId', 'interactionDate'])
@Index(['interactionType'])
@Index(['userId'])
export class CustomerInteractionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @Column('uuid')
  userId: string; // Staff member who had the interaction

  @Column('enum', {
    enum: ['call', 'email', 'meeting', 'demo', 'proposal', 'negotiation', 'complaint', 'support', 'follow_up', 'other'],
    default: 'call'
  })
  interactionType: string;

  @Column('enum', {
    enum: ['inbound', 'outbound'],
    default: 'outbound'
  })
  direction: string;

  @Column()
  subject: string;

  @Column('text')
  description: string;

  @Column('enum', {
    enum: ['cold', 'warm', 'hot', 'positive', 'negative', 'neutral'],
    default: 'neutral'
  })
  sentiment: string;

  @Column('enum', {
    enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
    default: 'completed'
  })
  status: string;

  @Column()
  interactionDate: Date;

  @Column('int', { nullable: true })
  durationMinutes: number;

  @Column('json', { nullable: true })
  outcomes: any; // Next steps, commitments, etc.

  @Column('json', { nullable: true })
  followUpTasks: any;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column('text', { nullable: true })
  internalNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CustomerEntity, customer => customer.interactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

// ========================================
// Customer Contract Entity
// ========================================

@Entity('customer_contracts')
@Index(['customerId'])
@Index(['contractType', 'status'])
@Index(['startDate', 'endDate'])
export class CustomerContractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @Column()
  contractNumber: string;

  @Column('enum', {
    enum: ['master_agreement', 'purchase_agreement', 'service_agreement', 'nda', 'sla', 'other'],
    default: 'service_agreement'
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
  terms: any;

  @Column('json', { nullable: true })
  pricing: any;

  @Column('json', { nullable: true })
  slaTerms: any;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  contractValue: number;

  @Column('varchar', { length: 3, nullable: true })
  contractCurrency: string;

  @Column({ nullable: true })
  documentPath: string;

  @Column('uuid', { nullable: true })
  createdByUserId: string;

  @Column('uuid', { nullable: true })
  signedByContactId: string;

  @Column({ nullable: true })
  signedDate: Date;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CustomerEntity, customer => customer.contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: UserEntity;

  @ManyToOne(() => CustomerContactEntity, { eager: false })
  @JoinColumn({ name: 'signedByContactId' })
  signedBy: CustomerContactEntity;
}