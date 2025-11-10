// Comprehensive enterprise payment entities for Groow
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

// Note: depends on existing VendorEntity, CustomerEntity, UserEntity, OrderEntity
import { VendorEntity } from './vendor';
import { CustomerEntity } from './customer';
import { UserEntity } from './user';
import { OrderEntity } from './order';

// Wallet entity for customers/vendors
@Entity('wallets')
@Index(['ownerId', 'ownerType'])
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ownerId: string; // customerId or vendorId

  @Column({ length: 20 })
  ownerType: 'customer' | 'vendor' | 'platform';

  @Column('decimal', { precision: 18, scale: 6, default: 0 })
  balance: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => WalletTransactionEntity, tx => tx.wallet)
  transactions: WalletTransactionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Wallet transactions
@Entity('wallet_transactions')
@Index(['walletId', 'transactionType', 'status'])
export class WalletTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  walletId: string;

  @ManyToOne(() => WalletEntity, wallet => wallet.transactions)
  @JoinColumn({ name: 'walletId' })
  wallet: WalletEntity;

  @Column('decimal', { precision: 18, scale: 6 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ length: 50, nullable: true })
  referenceId?: string;

  @Column({
    type: 'enum',
    enum: ['credit', 'debit', 'hold', 'release'],
    default: 'credit',
  })
  transactionType: 'credit' | 'debit' | 'hold' | 'release';

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed', 'reversed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'completed' | 'failed' | 'reversed' | 'cancelled';

  @Column('text', { nullable: true })
  description?: string;

  @Column('json', { nullable: true })
  metadata?: any;

  @Column('uuid', { nullable: true })
  relatedOrderId?: string;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'relatedOrderId' })
  order?: OrderEntity;

  @Column('uuid', { nullable: true })
  createdBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdBy' })
  creator?: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Payment method stored for user/vendor
@Entity('payment_methods')
@Index(['ownerId', 'provider', 'isDefault'])
export class PaymentMethodEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ownerId: string; // customerId or vendorId

  @Column({ length: 20 })
  ownerType: 'customer' | 'vendor';

  @Column({ length: 100 })
  provider: string; // stripe, paypal, bank_transfer, internal

  @Column('json')
  providerData: any; // tokenized data or vault reference

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column('json', { nullable: true })
  verification?: {
    verified: boolean;
    verifiedAt?: Date;
    verificationData?: any;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Payment records (charges, captures, refunds)
@Entity('payments')
@Index(['orderId', 'status', 'gateway'])
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  gatewayReference?: string;

  @Column({ length: 50 })
  gateway: string; // stripe, paypal, adyen, etc.

  @Column('decimal', { precision: 18, scale: 6 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['authorized', 'captured', 'failed', 'refunded', 'voided', 'pending'],
    default: 'pending',
  })
  status: 'authorized' | 'captured' | 'failed' | 'refunded' | 'voided' | 'pending';

  @Column('uuid', { nullable: true })
  paymentMethodId?: string;

  @ManyToOne(() => PaymentMethodEntity)
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod?: PaymentMethodEntity;

  @Column('uuid', { nullable: true })
  orderId?: string;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'orderId' })
  order?: OrderEntity;

  @Column('json', { nullable: true })
  gatewayResponse?: any;

  @Column('json', { nullable: true })
  metadata?: any;

  @Column('uuid', { nullable: true })
  createdBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdBy' })
  creator?: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Refunds
@Entity('refunds')
@Index(['paymentId', 'status'])
export class RefundEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  paymentId: string;

  @ManyToOne(() => PaymentEntity)
  @JoinColumn({ name: 'paymentId' })
  payment: PaymentEntity;

  @Column('decimal', { precision: 18, scale: 6 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'processed', 'failed', 'reversed'],
    default: 'pending',
  })
  status: 'pending' | 'processed' | 'failed' | 'reversed';

  @Column('text', { nullable: true })
  reason?: string;

  @Column('json', { nullable: true })
  gatewayResponse?: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Payouts (to vendors)
@Entity('payouts')
@Index(['vendorId', 'status'])
export class PayoutEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @Column('decimal', { precision: 18, scale: 6 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['requested', 'processing', 'paid', 'failed', 'cancelled'],
    default: 'requested',
  })
  status: 'requested' | 'processing' | 'paid' | 'failed' | 'cancelled';

  @Column('uuid', { nullable: true })
  paymentMethodId?: string;

  @Column('json', { nullable: true })
  metadata?: any;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Invoices for billing
@Entity('invoices')
@Index(['invoiceNumber', 'status', 'customerId'])
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  invoiceNumber: string;

  @Column('uuid')
  customerId: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column('json')
  items: any[];

  @Column('decimal', { precision: 18, scale: 6 })
  subtotal: number;

  @Column('decimal', { precision: 18, scale: 6 })
  tax: number;

  @Column('decimal', { precision: 18, scale: 6 })
  total: number;

  @Column({
    type: 'enum',
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid'],
    default: 'draft',
  })
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'partially_paid';

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column('timestamp', { nullable: true })
  dueDate?: Date;

  @Column('json', { nullable: true })
  paymentSchedule?: any;

  @Column('json', { nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Gateway connections
@Entity('payment_gateways')
@Index(['name', 'isActive'])
export class PaymentGatewayEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('json')
  config: any;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Escrow and split settlement
@Entity('escrows')
@Index(['orderId', 'status'])
export class EscrowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  orderId: string;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column('decimal', { precision: 18, scale: 6 })
  totalAmount: number;

  @Column('json')
  allocations: Array<{
    accountId: string;
    amount: number;
    currency: string;
    settled?: boolean;
  }>;

  @Column({
    type: 'enum',
    enum: ['holding', 'released', 'disputed', 'settled', 'cancelled'],
    default: 'holding',
  })
  status: 'holding' | 'released' | 'disputed' | 'settled' | 'cancelled';

  @Column('json', { nullable: true })
  dispute?: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
