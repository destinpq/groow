import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { UserEntity } from './user';
import { VendorEntity } from './vendor';
import { ServiceEntity } from './service';
import { OrderEntity } from './order';

@Entity('affiliate_programs')
@Index(['status', 'createdAt'])
export class AffiliateProgramEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['percentage', 'fixed', 'tiered', 'hybrid'],
    default: 'percentage'
  })
  commissionType: 'percentage' | 'fixed' | 'tiered' | 'hybrid';

  @Column('decimal', { precision: 10, scale: 4 })
  commissionRate: number;

  @Column('json', { nullable: true })
  commissionTiers: Array<{
    minSales: number;
    rate: number;
    description?: string;
  }>;

  @Column('int', { default: 30 })
  cookieDuration: number;

  @Column('decimal', { precision: 15, scale: 2, default: 100 })
  minPayoutAmount: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspended', 'archived'],
    default: 'active'
  })
  @Index()
  status: 'active' | 'inactive' | 'suspended' | 'archived';

  @Column('text')
  terms: string;

  @Column('json', { nullable: true })
  serviceCategories: string[];

  @Column('json', { nullable: true })
  restrictions: {
    countries?: string[];
    excludedCountries?: string[];
    minServiceValue?: number;
    maxServiceValue?: number;
    allowedPromotionMethods?: string[];
  };

  @Column('json', { nullable: true })
  requirements: {
    minMonthlyTraffic?: number;
    requiredWebsite?: boolean;
    industryExperience?: boolean;
    socialMediaFollowing?: number;
  };

  @Column({ type: 'timestamp', nullable: true })
  launchDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AffiliateAccountEntity, account => account.program)
  affiliates: AffiliateAccountEntity[];

  @OneToMany(() => CommissionEntity, commission => commission.program)
  commissions: CommissionEntity[];
}

@Entity('affiliate_accounts')
@Index(['userId', 'programId'], { unique: true })
@Index(['affiliateCode'], { unique: true })
@Index(['status', 'joinDate'])
export class AffiliateAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  affiliateCode: string;

  @Column('uuid')
  programId: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'suspended', 'terminated'],
    default: 'pending'
  })
  @Index()
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'terminated';

  @Column({ type: 'timestamp' })
  joinDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  approvalDate: Date;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalEarnings: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  pendingEarnings: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  paidEarnings: number;

  @Column('int', { default: 0 })
  totalReferrals: number;

  @Column('int', { default: 0 })
  successfulReferrals: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  conversionRate: number;

  @Column({ type: 'timestamp', nullable: true })
  lastActivity: Date;

  @Column('json', { nullable: true })
  paymentMethod: {
    type: 'bank' | 'paypal' | 'crypto' | 'wallet';
    details: Record<string, any>;
  };

  @Column('json', { nullable: true })
  applicationData: {
    website?: string;
    socialMedia?: Record<string, string>;
    expectedMonthlyReferrals?: number;
    promotionMethods?: string[];
    industryExperience?: string;
    notes?: string;
  };

  @Column({ type: 'varchar', length: 500, nullable: true })
  rejectionReason: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  suspensionReason: string;

  @Column('json', { nullable: true })
  performanceMetrics: {
    avgOrderValue: number;
    topServiceCategories: string[];
    bestPerformingLinks: string[];
    monthlyStats: Array<{
      month: string;
      referrals: number;
      earnings: number;
      conversionRate: number;
    }>;
  };

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.affiliateAccounts)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => AffiliateProgramEntity, program => program.affiliates)
  @JoinColumn({ name: 'programId' })
  program: AffiliateProgramEntity;

  @OneToMany(() => ReferralLinkEntity, link => link.affiliate)
  links: ReferralLinkEntity[];

  @OneToMany(() => CommissionEntity, commission => commission.affiliate)
  commissions: CommissionEntity[];

  @OneToMany(() => PayoutRequestEntity, payout => payout.affiliate)
  payouts: PayoutRequestEntity[];

  @OneToMany(() => ReferralActivityEntity, activity => activity.affiliate)
  activities: ReferralActivityEntity[];
}

@Entity('referral_links')
@Index(['affiliateId', 'isActive'])
@Index(['shortCode'], { unique: true })
export class ReferralLinkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  affiliateId: string;

  @Column({ type: 'varchar', length: 1000 })
  originalUrl: string;

  @Column({ type: 'varchar', length: 1000 })
  referralUrl: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  shortCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { default: 0 })
  clicks: number;

  @Column('int', { default: 0 })
  conversions: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  conversionRate: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalEarnings: number;

  @Column('json', { nullable: true })
  utmParameters: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };

  @Column('json', { nullable: true })
  targetAudience: {
    demographics?: string[];
    interests?: string[];
    location?: string[];
  };

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastClickAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AffiliateAccountEntity, affiliate => affiliate.links)
  @JoinColumn({ name: 'affiliateId' })
  affiliate: AffiliateAccountEntity;

  @OneToMany(() => ReferralActivityEntity, activity => activity.link)
  activities: ReferralActivityEntity[];
}

@Entity('referral_activities')
@Index(['affiliateId', 'timestamp'])
@Index(['type', 'timestamp'])
@Index(['ipAddress', 'timestamp'])
export class ReferralActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  affiliateId: string;

  @Column('uuid', { nullable: true })
  linkId: string;

  @Column({
    type: 'enum',
    enum: ['click', 'view', 'signup', 'service_inquiry', 'service_purchase', 'commission_earned', 'commission_paid'],
    default: 'click'
  })
  @Index()
  type: 'click' | 'view' | 'signup' | 'service_inquiry' | 'service_purchase' | 'commission_earned' | 'commission_paid';

  @Column({ type: 'varchar', length: 255, nullable: true })
  customerEmail: string;

  @Column('uuid', { nullable: true })
  orderId: string;

  @Column('uuid', { nullable: true })
  serviceId: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  serviceValue: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  commissionAmount: number;

  @Column({ type: 'varchar', length: 45 })
  ipAddress: string;

  @Column('text', { nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  referrer: string;

  @Column('json', { nullable: true })
  sessionData: {
    sessionId?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
    location?: {
      country?: string;
      city?: string;
      region?: string;
    };
  };

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp' })
  @Index()
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => AffiliateAccountEntity, affiliate => affiliate.activities)
  @JoinColumn({ name: 'affiliateId' })
  affiliate: AffiliateAccountEntity;

  @ManyToOne(() => ReferralLinkEntity, link => link.activities, { nullable: true })
  @JoinColumn({ name: 'linkId' })
  link: ReferralLinkEntity;

  @ManyToOne(() => OrderEntity, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @ManyToOne(() => ServiceEntity, { nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;
}

@Entity('commissions')
@Index(['affiliateId', 'status'])
@Index(['orderId'])
@Index(['status', 'createdAt'])
export class CommissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  affiliateId: string;

  @Column('uuid')
  programId: string;

  @Column('uuid')
  orderId: string;

  @Column('uuid', { nullable: true })
  serviceId: string;

  @Column({ type: 'varchar', length: 255 })
  customerEmail: string;

  @Column('decimal', { precision: 15, scale: 2 })
  orderValue: number;

  @Column('decimal', { precision: 10, scale: 4 })
  commissionRate: number;

  @Column('decimal', { precision: 15, scale: 2 })
  commissionAmount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'paid', 'cancelled', 'disputed'],
    default: 'pending'
  })
  @Index()
  status: 'pending' | 'approved' | 'paid' | 'cancelled' | 'disputed';

  @Column({
    type: 'enum',
    enum: ['service_sale', 'recurring_service', 'service_upgrade', 'referral_bonus', 'milestone_bonus'],
    default: 'service_sale'
  })
  type: 'service_sale' | 'recurring_service' | 'service_upgrade' | 'referral_bonus' | 'milestone_bonus';

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  disputedAt: Date;

  @Column('text', { nullable: true })
  notes: string;

  @Column('text', { nullable: true })
  cancellationReason: string;

  @Column('json', { nullable: true })
  disputeInfo: {
    reason?: string;
    evidence?: string[];
    resolution?: string;
    resolvedAt?: Date;
  };

  @Column({ type: 'timestamp', nullable: true })
  holdUntil: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AffiliateAccountEntity, affiliate => affiliate.commissions)
  @JoinColumn({ name: 'affiliateId' })
  affiliate: AffiliateAccountEntity;

  @ManyToOne(() => AffiliateProgramEntity, program => program.commissions)
  @JoinColumn({ name: 'programId' })
  program: AffiliateProgramEntity;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @ManyToOne(() => ServiceEntity, { nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;
}

@Entity('payout_requests')
@Index(['affiliateId', 'status'])
@Index(['status', 'requestedAt'])
export class PayoutRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  affiliateId: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['bank', 'paypal', 'crypto', 'wallet', 'check'],
    default: 'bank'
  })
  method: 'bank' | 'paypal' | 'crypto' | 'wallet' | 'check';

  @Column('json')
  paymentDetails: Record<string, any>;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  })
  @Index()
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

  @Column({ type: 'timestamp' })
  requestedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionId: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('text', { nullable: true })
  failureReason: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  processingFee: number;

  @Column('decimal', { precision: 15, scale: 2 })
  netAmount: number;

  @Column('json', { nullable: true })
  commissionIds: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AffiliateAccountEntity, affiliate => affiliate.payouts)
  @JoinColumn({ name: 'affiliateId' })
  affiliate: AffiliateAccountEntity;
}

@Entity('affiliate_tiers')
@Index(['affiliateId', 'isActive'])
export class AffiliateTierEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  affiliateId: string;

  @Column({ type: 'varchar', length: 100 })
  tierName: string;

  @Column('decimal', { precision: 10, scale: 4 })
  commissionRate: number;

  @Column('decimal', { precision: 15, scale: 2 })
  minSales: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  maxSales: number;

  @Column('json', { nullable: true })
  benefits: {
    higherCommission?: boolean;
    prioritySupport?: boolean;
    exclusiveOffers?: boolean;
    marketingMaterials?: boolean;
    dedicatedManager?: boolean;
  };

  @Column({ type: 'timestamp' })
  achievedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AffiliateAccountEntity)
  @JoinColumn({ name: 'affiliateId' })
  affiliate: AffiliateAccountEntity;
}