import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { CustomerEntity } from './customer';
import { VendorEntity } from './vendor';
import { Product as ProductEntity } from '@modules/product/entities/product.entity';
import { ServiceEntity } from './service';
import { User as UserEntity } from '@modules/auth/entities/user.entity';

// ========================================
// Core Cart Entity - B2B Enterprise Shopping Cart
// ========================================

@Entity('carts')
@Index(['customerId', 'status'])
@Index(['vendorId', 'status'])
@Index(['createdAt'])
@Index(['lastActivityAt'])
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cartNumber: string; // C000001, C000002, etc.

  @Column('uuid')
  customerId: string;

  @Column('uuid', { nullable: true })
  vendorId: string; // For vendor-specific carts in B2B

  @Column('uuid', { nullable: true })
  sessionId: string; // For guest carts

  @Column({
    type: 'enum',
    enum: ['active', 'saved', 'abandoned', 'merged', 'converted', 'expired'],
    default: 'active'
  })
  status: string;

  // B2B Features
  @Column({ nullable: true })
  purchaseOrderReference: string;

  @Column({ nullable: true })
  costCenter: string;

  @Column({ nullable: true })
  budgetCode: string;

  @Column({ nullable: true })
  departmentCode: string;

  @Column('uuid', { nullable: true })
  requesterId: string; // Employee creating cart for approval

  @Column('uuid', { nullable: true })
  approverId: string; // Manager who needs to approve

  @Column({
    type: 'enum',
    enum: ['none', 'required', 'pending', 'approved', 'rejected'],
    default: 'none'
  })
  approvalStatus: string;

  @Column('text', { nullable: true })
  approvalNotes: string;

  // Cart Configuration
  @Column('varchar', { length: 3, default: 'USD' })
  currency: string;

  @Column('boolean', { default: false })
  requiresQuote: boolean;

  @Column('boolean', { default: false })
  isTemplate: boolean;

  @Column({ nullable: true })
  templateName: string;

  @Column('boolean', { default: false })
  isRecurring: boolean;

  @Column('json', { nullable: true })
  recurringSchedule: any; // { frequency: 'monthly', interval: 1, endDate: '2024-12-31' }

  // Pricing and Totals
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  shippingEstimate: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column('int', { default: 0 })
  itemCount: number;

  // Shipping and Delivery
  @Column('json', { nullable: true })
  shippingAddress: any;

  @Column('json', { nullable: true })
  billingAddress: any;

  @Column({ nullable: true })
  preferredDeliveryDate: Date;

  @Column('text', { nullable: true })
  deliveryInstructions: string;

  @Column({
    type: 'enum',
    enum: ['standard', 'express', 'overnight', 'scheduled'],
    default: 'standard'
  })
  deliveryMethod: string;

  // Business Logic
  @Column('json', { nullable: true })
  businessRules: any; // Approval thresholds, restrictions, etc.

  @Column('json', { nullable: true })
  complianceRequirements: any;

  @Column('text', { nullable: true })
  notes: string;

  @Column('text', { nullable: true })
  internalNotes: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  // Activity Tracking
  @Column({ nullable: true })
  lastActivityAt: Date;

  @Column('int', { default: 0 })
  sessionDurationMinutes: number;

  @Column('int', { default: 1 })
  visitCount: number;

  @Column({ nullable: true })
  abandonedAt: Date;

  @Column({ nullable: true })
  convertedAt: Date;

  @Column('uuid', { nullable: true })
  convertedOrderId: string;

  // Integration
  @Column('json', { nullable: true })
  erpData: any; // ERP system integration data

  @Column('json', { nullable: true })
  customData: any; // Custom fields for specific implementations

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CustomerEntity, { eager: false })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => VendorEntity, { eager: false })
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'requesterId' })
  requester: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'approverId' })
  approver: UserEntity;

  @OneToMany(() => CartItemEntity, cartItem => cartItem.cart, { cascade: true })
  items: CartItemEntity[];

  @OneToMany(() => SavedCartEntity, savedCart => savedCart.cart, { cascade: true })
  savedVersions: SavedCartEntity[];

  @OneToMany(() => CartAbandonmentEntity, abandonment => abandonment.cart, { cascade: true })
  abandonmentEvents: CartAbandonmentEntity[];

  @OneToMany(() => CartShareEntity, share => share.cart, { cascade: true })
  shares: CartShareEntity[];
}

// ========================================
// Cart Item Entity - Items in Shopping Cart
// ========================================

@Entity('cart_items')
@Index(['cartId', 'status'])
@Index(['productId'])
@Index(['serviceId'])
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  cartId: string;

  @Column('uuid', { nullable: true })
  productId: string;

  @Column('uuid', { nullable: true })
  serviceId: string;

  @Column('uuid', { nullable: true })
  variantId: string;

  @Column({ nullable: true })
  sku: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('decimal', { precision: 15, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 15, scale: 2 })
  totalPrice: number;

  @Column('varchar', { length: 3, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['active', 'saved', 'out_of_stock', 'discontinued', 'requires_quote'],
    default: 'active'
  })
  status: string;

  // B2B Features
  @Column({ nullable: true })
  contractPriceId: string; // Reference to negotiated pricing

  @Column('boolean', { default: false })
  requiresApproval: boolean;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  discountPercentage: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ nullable: true })
  discountReason: string;

  // Configuration and Customization
  @Column('json', { nullable: true })
  configuration: any; // Product/service specific configuration

  @Column('json', { nullable: true })
  customizations: any;

  @Column('text', { nullable: true })
  specialInstructions: string;

  @Column({ nullable: true })
  requestedDeliveryDate: Date;

  // Inventory and Availability
  @Column('int', { nullable: true })
  availableQuantity: number;

  @Column({ nullable: true })
  leadTime: string; // "2-3 weeks", "In stock", etc.

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  unavailableReason: string;

  // Compliance and Quality
  @Column('json', { nullable: true })
  complianceInfo: any;

  @Column('json', { nullable: true })
  qualityRequirements: any;

  @Column('simple-array', { nullable: true })
  certifications: string[];

  // Line Item Details
  @Column('text', { nullable: true })
  notes: string;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  @Column('json', { nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CartEntity, cart => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity, { eager: false })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => ServiceEntity, { eager: false })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;
}

// ========================================
// Saved Cart Entity - Saved Cart Templates and Versions
// ========================================

@Entity('saved_carts')
@Index(['customerId', 'isTemplate'])
@Index(['name'])
export class SavedCartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @Column('uuid', { nullable: true })
  cartId: string; // Reference to original cart

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { default: false })
  isTemplate: boolean;

  @Column('boolean', { default: false })
  isShared: boolean;

  @Column('json')
  cartData: any; // Serialized cart and items data

  // Template Features
  @Column('boolean', { default: false })
  isRecurring: boolean;

  @Column('json', { nullable: true })
  scheduleConfig: any;

  @Column({ nullable: true })
  nextExecutionDate: Date;

  // Access Control
  @Column('enum', { 
    enum: ['private', 'team', 'department', 'company', 'public'],
    default: 'private'
  })
  accessLevel: string;

  @Column('simple-array', { nullable: true })
  allowedUsers: string[]; // User IDs who can access

  @Column('simple-array', { nullable: true })
  allowedRoles: string[]; // Roles that can access

  // Usage Statistics
  @Column('int', { default: 0 })
  usageCount: number;

  @Column({ nullable: true })
  lastUsedAt: Date;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  averageOrderValue: number;

  @Column('text', { nullable: true })
  notes: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CustomerEntity, { eager: false })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => CartEntity, { eager: false })
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;
}

// ========================================
// Cart Abandonment Tracking Entity
// ========================================

@Entity('cart_abandonments')
@Index(['cartId'])
@Index(['customerId', 'abandonedAt'])
@Index(['recoveryStatus'])
export class CartAbandonmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  cartId: string;

  @Column('uuid')
  customerId: string;

  @Column()
  abandonedAt: Date;

  @Column('int')
  sessionDurationMinutes: number;

  @Column('int')
  itemCount: number;

  @Column('decimal', { precision: 15, scale: 2 })
  cartValue: number;

  @Column('varchar', { length: 3 })
  currency: string;

  // Abandonment Context
  @Column({ nullable: true })
  lastPageVisited: string;

  @Column({ nullable: true })
  exitTrigger: string; // 'timeout', 'navigation', 'close_browser', etc.

  @Column('json', { nullable: true })
  deviceInfo: any;

  @Column('json', { nullable: true })
  browserInfo: any;

  // Recovery Efforts
  @Column('enum', { 
    enum: ['not_attempted', 'email_sent', 'sms_sent', 'push_sent', 'recovered', 'expired'],
    default: 'not_attempted'
  })
  recoveryStatus: string;

  @Column('int', { default: 0 })
  recoveryAttempts: number;

  @Column({ nullable: true })
  firstRecoveryAttempt: Date;

  @Column({ nullable: true })
  lastRecoveryAttempt: Date;

  @Column({ nullable: true })
  recoveredAt: Date;

  @Column('uuid', { nullable: true })
  recoveryOrderId: string;

  // Analytics Data
  @Column('json', { nullable: true })
  analyticsData: any;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CartEntity, cart => cart.abandonmentEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;

  @ManyToOne(() => CustomerEntity, { eager: false })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;
}

// ========================================
// Cart Sharing Entity - B2B Team Collaboration
// ========================================

@Entity('cart_shares')
@Index(['cartId'])
@Index(['sharedWithUserId'])
@Index(['shareStatus'])
export class CartShareEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  cartId: string;

  @Column('uuid')
  sharedByUserId: string;

  @Column('uuid')
  sharedWithUserId: string;

  @Column('enum', {
    enum: ['view', 'edit', 'approve', 'admin'],
    default: 'view'
  })
  permission: string;

  @Column('enum', {
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  })
  shareStatus: string;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  respondedAt: Date;

  @Column('text', { nullable: true })
  responseMessage: string;

  // Notification Settings
  @Column('boolean', { default: true })
  notifyOnChanges: boolean;

  @Column('boolean', { default: false })
  notifyOnCheckout: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CartEntity, cart => cart.shares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'sharedByUserId' })
  sharedBy: UserEntity;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'sharedWithUserId' })
  sharedWith: UserEntity;
}

// ========================================
// Wishlist Entity - B2B Requirement Lists
// ========================================

@Entity('wishlists')
@Index(['customerId'])
@Index(['name'])
@Index(['isShared'])
export class WishlistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @Column({ default: 'My Wishlist' })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column('boolean', { default: false })
  isShared: boolean;

  @Column('enum', {
    enum: ['private', 'team', 'department', 'company', 'public'],
    default: 'private'
  })
  visibility: string;

  // Business Features
  @Column({ nullable: true })
  budgetLimit: number;

  @Column('varchar', { length: 3, default: 'USD' })
  currency: string;

  @Column({ nullable: true })
  targetDate: Date;

  @Column({ nullable: true })
  priority: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column('text', { nullable: true })
  notes: string;

  @Column('int', { default: 0 })
  itemCount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  estimatedTotal: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CustomerEntity, { eager: false })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @OneToMany(() => WishlistItemEntity, item => item.wishlist, { cascade: true })
  items: WishlistItemEntity[];
}

// ========================================
// Wishlist Item Entity
// ========================================

@Entity('wishlist_items')
@Index(['wishlistId'])
@Index(['productId'])
@Index(['serviceId'])
export class WishlistItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  wishlistId: string;

  @Column('uuid', { nullable: true })
  productId: string;

  @Column('uuid', { nullable: true })
  serviceId: string;

  @Column('uuid', { nullable: true })
  variantId: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { default: 1 })
  desiredQuantity: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  targetPrice: number;

  @Column('varchar', { length: 3, default: 'USD' })
  currency: string;

  @Column('enum', {
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  })
  priority: string;

  @Column({ nullable: true })
  neededByDate: Date;

  @Column('text', { nullable: true })
  notes: string;

  @Column('text', { nullable: true })
  businessJustification: string;

  // Tracking
  @Column('boolean', { default: false })
  isPriceAlert: boolean;

  @Column('boolean', { default: false })
  isStockAlert: boolean;

  @Column({ nullable: true })
  lastPriceCheck: Date;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  currentPrice: number;

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => WishlistEntity, wishlist => wishlist.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wishlistId' })
  wishlist: WishlistEntity;

  @ManyToOne(() => ProductEntity, { eager: false })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => ServiceEntity, { eager: false })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;
}