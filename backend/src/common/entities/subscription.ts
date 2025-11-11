import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { User as UserEntity } from '@modules/auth/entities/user.entity';
import { ServiceEntity } from './service';
import { VendorEntity } from './vendor';
import { CustomerEntity } from './customer';
import { PaymentMethodEntity, InvoiceEntity } from './payment';

@Entity('service_subscriptions')
@Index(['customerId', 'status'])
@Index(['serviceId', 'status'])
@Index(['vendorId', 'status'])
@Index(['nextBillingDate'])
@Index(['status', 'nextRenewalDate'])
export class ServiceSubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  subscriptionNumber: string;

  @Column('uuid')
  customerId: string;

  @Column('uuid')
  serviceId: string;

  @Column('uuid')
  vendorId: string;

  @Column('uuid')
  planId: string;

  @Column({
    type: 'enum',
    enum: ['active', 'paused', 'cancelled', 'expired', 'pending', 'suspended', 'trial'],
    default: 'pending'
  })
  @Index()
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'pending' | 'suspended' | 'trial';

  @Column({
    type: 'enum',
    enum: ['monthly', 'quarterly', 'semi_annually', 'annually', 'bi_annually'],
    default: 'monthly'
  })
  billingCycle: 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'bi_annually';

  @Column('decimal', { precision: 15, scale: 2 })
  monthlyPrice: number;

  @Column('decimal', { precision: 15, scale: 2 })
  totalPrice: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  setupFee: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'timestamp' })
  @Index()
  nextBillingDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextRenewalDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  trialEndDate: Date;

  @Column('int', { default: 0 })
  trialDays: number;

  @Column('boolean', { default: true })
  autoRenew: boolean;

  @Column('uuid', { nullable: true })
  paymentMethodId: string;

  @Column('int', { default: 0 })
  billingCycleCount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalBilled: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalPaid: number;

  @Column('json', { nullable: true })
  serviceParameters: {
    userLimit?: number;
    storageLimit?: number;
    apiCallLimit?: number;
    features?: string[];
    customizations?: Record<string, any>;
  };

  @Column('json', { nullable: true })
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column('text', { nullable: true })
  cancellationReason: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column('uuid', { nullable: true })
  cancelledBy: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => ServiceEntity)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @ManyToOne(() => SubscriptionPlanEntity, plan => plan.subscriptions)
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlanEntity;

  @ManyToOne(() => PaymentMethodEntity, { nullable: true })
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod: PaymentMethodEntity;

  @OneToMany(() => BillingHistoryEntity, billing => billing.subscription)
  billingHistory: BillingHistoryEntity[];

  @OneToMany(() => SubscriptionUsageEntity, usage => usage.subscription)
  usageHistory: SubscriptionUsageEntity[];

  @OneToMany(() => SubscriptionChangeEntity, change => change.subscription)
  changeHistory: SubscriptionChangeEntity[];

  // Note: Invoice relationship handled separately - no subscription field on InvoiceEntity
  // @OneToMany(() => InvoiceEntity, invoice => invoice.subscription)
  // invoices: InvoiceEntity[];
}

@Entity('subscription_plans')
@Index(['serviceId', 'isActive'])
@Index(['vendorId', 'isActive'])
@Index(['planType', 'billingCycle'])
export class SubscriptionPlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  serviceId: string;

  @Column('uuid')
  vendorId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['basic', 'professional', 'enterprise', 'custom'],
    default: 'basic'
  })
  planType: 'basic' | 'professional' | 'enterprise' | 'custom';

  @Column({
    type: 'enum',
    enum: ['monthly', 'quarterly', 'semi_annually', 'annually', 'bi_annually'],
    default: 'monthly'
  })
  billingCycle: 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'bi_annually';

  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  originalPrice: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  setupFee: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column('int', { default: 0 })
  trialDays: number;

  @Column('json')
  features: string[];

  @Column('json')
  limitations: {
    userLimit?: number;
    storageLimit?: number; // in GB
    apiCallLimit?: number; // per month
    dataTransferLimit?: number; // in GB
    supportLevel?: 'basic' | 'priority' | 'dedicated';
    customIntegrations?: boolean;
  };

  @Column('json', { nullable: true })
  benefits: string[];

  @Column('boolean', { default: false })
  isPopular: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  availableFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  availableUntil: Date;

  @Column('int', { default: 0 })
  sortOrder: number;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ServiceEntity)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @OneToMany(() => ServiceSubscriptionEntity, subscription => subscription.plan)
  subscriptions: ServiceSubscriptionEntity[];
}

@Entity('billing_history')
@Index(['subscriptionId', 'billingDate'])
@Index(['status', 'billingDate'])
@Index(['vendorId', 'billingDate'])
export class BillingHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  subscriptionId: string;

  @Column('uuid')
  customerId: string;

  @Column('uuid')
  vendorId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  invoiceNumber: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  taxes: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  fees: number;

  @Column('decimal', { precision: 15, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded', 'disputed'],
    default: 'pending'
  })
  @Index()
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | 'disputed';

  @Column({ type: 'varchar', length: 100 })
  paymentMethod: string;

  @Column({ type: 'timestamp' })
  @Index()
  billingDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionId: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  invoiceUrl: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  failureReason: string;

  @Column('json', { nullable: true })
  paymentDetails: {
    gateway?: string;
    method?: string;
    last4?: string;
    brand?: string;
  };

  @Column('json', { nullable: true })
  refundInfo: {
    amount?: number;
    reason?: string;
    refundedAt?: Date;
    refundId?: string;
  };

  @Column({ type: 'timestamp', nullable: true })
  nextRetryAt: Date;

  @Column('int', { default: 0 })
  retryCount: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ServiceSubscriptionEntity, subscription => subscription.billingHistory)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: ServiceSubscriptionEntity;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;
}

@Entity('subscription_usage')
@Index(['subscriptionId', 'usageMonth'])
@Index(['serviceId', 'usageMonth'])
export class SubscriptionUsageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  subscriptionId: string;

  @Column('uuid')
  serviceId: string;

  @Column('uuid')
  customerId: string;

  @Column({ type: 'varchar', length: 7 }) // YYYY-MM format
  @Index()
  usageMonth: string;

  @Column('int', { default: 0 })
  activeUsers: number;

  @Column('decimal', { precision: 15, scale: 6, default: 0 })
  storageUsedGB: number;

  @Column('int', { default: 0 })
  apiCallsCount: number;

  @Column('decimal', { precision: 15, scale: 6, default: 0 })
  dataTransferGB: number;

  @Column('int', { default: 0 })
  supportTickets: number;

  @Column('json', { nullable: true })
  featureUsage: {
    feature: string;
    usageCount: number;
    usageHours?: number;
  }[];

  @Column('json', { nullable: true })
  customMetrics: Record<string, number>;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  utilizationRate: number; // Percentage of plan limits used

  @Column('json', { nullable: true })
  overage: {
    users?: number;
    storage?: number;
    apiCalls?: number;
    dataTransfer?: number;
  };

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  overageCharges: number;

  @Column({ type: 'timestamp' })
  calculatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ServiceSubscriptionEntity, subscription => subscription.usageHistory)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: ServiceSubscriptionEntity;

  @ManyToOne(() => ServiceEntity)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;
}

@Entity('subscription_changes')
@Index(['subscriptionId', 'changeDate'])
@Index(['changeType', 'changeDate'])
export class SubscriptionChangeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  subscriptionId: string;

  @Column({
    type: 'enum',
    enum: ['plan_upgrade', 'plan_downgrade', 'billing_cycle_change', 'pause', 'resume', 'cancel', 'payment_update', 'parameter_change'],
    default: 'parameter_change'
  })
  @Index()
  changeType: 'plan_upgrade' | 'plan_downgrade' | 'billing_cycle_change' | 'pause' | 'resume' | 'cancel' | 'payment_update' | 'parameter_change';

  @Column('json')
  previousValues: Record<string, any>;

  @Column('json')
  newValues: Record<string, any>;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  proratedAmount: number;

  @Column({ type: 'timestamp' })
  @Index()
  changeDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  effectiveDate: Date;

  @Column('uuid')
  changedBy: string;

  @Column({
    type: 'enum',
    enum: ['customer', 'vendor', 'admin', 'system'],
    default: 'customer'
  })
  changedByType: 'customer' | 'vendor' | 'admin' | 'system';

  @Column('text', { nullable: true })
  reason: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ServiceSubscriptionEntity, subscription => subscription.changeHistory)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: ServiceSubscriptionEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'changedBy' })
  user: UserEntity;
}

@Entity('subscription_discounts')
@Index(['subscriptionId', 'isActive'])
@Index(['discountType', 'validUntil'])
export class SubscriptionDiscountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  subscriptionId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['percentage', 'fixed_amount', 'free_months'],
    default: 'percentage'
  })
  discountType: 'percentage' | 'fixed_amount' | 'free_months';

  @Column('decimal', { precision: 10, scale: 4 })
  value: number;

  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column('int', { nullable: true })
  maxUsages: number;

  @Column('int', { default: 0 })
  usedCount: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ServiceSubscriptionEntity)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: ServiceSubscriptionEntity;
}