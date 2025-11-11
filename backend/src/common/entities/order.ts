// Comprehensive B2B Order Management Entities for Enterprise Marketplace
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
import { VendorEntity } from './vendor';
import { CustomerEntity } from './customer';
import { User as UserEntity } from '@modules/auth/entities/user.entity';
import { ServiceEntity } from './service';
import { PaymentEntity } from './payment';

// ========================================
// Main Order Entity for B2B Services
// ========================================
@Entity('orders')
@Index(['orderNumber', 'status', 'customerId', 'vendorId'])
@Index(['createdAt', 'status'])
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  @Index()
  orderNumber: string;

  @Column({ length: 100, nullable: true })
  purchaseOrderNumber?: string; // Customer's PO number

  // Customer and Vendor References
  @Column('uuid')
  @Index()
  customerId: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column('uuid')
  @Index()
  vendorId: string;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  // Order Status and Workflow
  @Column({
    type: 'enum',
    enum: ['draft', 'pending_approval', 'approved', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed', 'refunded'],
    default: 'draft',
  })
  @Index()
  status: 'draft' | 'pending_approval' | 'approved' | 'confirmed' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed' | 'refunded';

  @Column({
    type: 'enum',
    enum: ['pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
  })
  @Index()
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'partially_refunded';

  // Approval Workflow for Enterprise
  @Column('json', { nullable: true })
  approvalWorkflow?: {
    requiresApproval: boolean;
    approvalLevel: 'manager' | 'director' | 'finance' | 'procurement';
    approvers: Array<{
      userId: string;
      level: string;
      status: 'pending' | 'approved' | 'rejected';
      approvedAt?: Date;
      rejectionReason?: string;
    }>;
    currentApprover?: string;
    isApproved: boolean;
  };

  // Financial Information
  @Column('decimal', { precision: 18, scale: 6 })
  subtotal: number;

  @Column('decimal', { precision: 18, scale: 6, default: 0 })
  taxAmount: number;

  @Column('decimal', { precision: 18, scale: 6, default: 0 })
  discountAmount: number;

  @Column('decimal', { precision: 18, scale: 6, default: 0 })
  shippingCost: number;

  @Column('decimal', { precision: 18, scale: 6 })
  totalAmount: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  // Service Details
  @OneToMany(() => OrderItemEntity, item => item.order)
  items: OrderItemEntity[];

  @Column('json', { nullable: true })
  serviceRequirements?: {
    deliveryAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      contactPerson?: string;
      contactPhone?: string;
    };
    deliveryDate?: Date;
    specialInstructions?: string;
    accessRequirements?: string[];
    workingHours?: {
      start: string;
      end: string;
      timezone: string;
    };
    stakeholders?: Array<{
      name: string;
      role: string;
      email: string;
      phone?: string;
    }>;
  };

  // Contract and Billing Information
  @Column('json', { nullable: true })
  contractTerms?: {
    serviceLevel: string;
    deliveryCommitments: string[];
    penaltyClause?: string;
    terminationRights?: string;
    intellectualProperty?: string;
    confidentiality?: string;
    liabilityLimit?: number;
  };

  @Column('json', { nullable: true })
  billingDetails?: {
    billingFrequency: 'upfront' | 'milestone' | 'monthly' | 'upon_completion';
    paymentTerms: string; // e.g., "NET30"
    invoiceRecipient: {
      name: string;
      email: string;
      department?: string;
    };
    costCenter?: string;
    budgetCode?: string;
    projectCode?: string;
  };

  // Delivery and Fulfillment
  @Column('json', { nullable: true })
  deliverySchedule?: {
    estimatedStartDate?: Date;
    estimatedCompletionDate?: Date;
    milestones?: Array<{
      name: string;
      description: string;
      targetDate: Date;
      status: 'pending' | 'in_progress' | 'completed' | 'delayed';
      deliverables: string[];
      dependencies: string[];
    }>;
    actualStartDate?: Date;
    actualCompletionDate?: Date;
  };

  @Column('json', { nullable: true })
  tracking?: {
    trackingNumber?: string;
    carrier?: string;
    trackingUrl?: string;
    currentLocation?: string;
    deliveryStatus: 'not_started' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    signedBy?: string;
  };

  // Communication and Notes
  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column('text', { nullable: true })
  customerNotes?: string;

  @Column('text', { nullable: true })
  vendorNotes?: string;

  @Column('text', { nullable: true })
  internalNotes?: string;

  // Quality Assurance and Feedback
  @Column('json', { nullable: true })
  qualityAssurance?: {
    checkpoints: Array<{
      name: string;
      description: string;
      status: 'pending' | 'passed' | 'failed' | 'not_applicable';
      checkedBy?: string;
      checkedAt?: Date;
      notes?: string;
    }>;
    overallScore?: number;
    customerFeedback?: {
      rating: number;
      comment: string;
      submittedAt: Date;
    };
  };

  // Risk and Compliance
  @Column('json', { nullable: true })
  riskAssessment?: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    mitigationPlans: Array<{
      risk: string;
      mitigation: string;
      responsible: string;
      status: 'planned' | 'implemented' | 'monitored';
    }>;
    complianceRequirements: string[];
    auditTrail: Array<{
      event: string;
      timestamp: Date;
      userId: string;
      details: any;
    }>;
  };

  // Integration and Automation
  @Column('json', { nullable: true })
  integrations?: {
    erpSystem?: {
      systemName: string;
      orderId: string;
      syncStatus: 'pending' | 'synced' | 'failed';
      lastSync?: Date;
    };
    procurementSystem?: {
      systemName: string;
      requisitionId: string;
      syncStatus: 'pending' | 'synced' | 'failed';
    };
    notificationSettings: {
      email: boolean;
      sms: boolean;
      webhooks: string[];
    };
  };

  // Performance Metrics
  @Column('json', { nullable: true })
  performanceMetrics?: {
    responseTime?: number; // in hours
    onTimeDelivery: boolean;
    qualityScore?: number;
    customerSatisfactionScore?: number;
    costVariance?: number; // % difference from estimate
    scopeChanges?: number;
    issuesCount?: number;
  };

  // Audit and History
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
  approvedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'approvedBy' })
  approver?: UserEntity;

  @Column('timestamp', { nullable: true })
  approvedAt?: Date;

  @Column('uuid', { nullable: true })
  assignedTo?: string; // Project manager or account manager

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'assignedTo' })
  assignee?: UserEntity;

  // Relationships
  @OneToMany(() => OrderStatusHistoryEntity, history => history.order)
  statusHistory: OrderStatusHistoryEntity[];

  @OneToMany(() => OrderCommunicationEntity, communication => communication.order)
  communications: OrderCommunicationEntity[];

  @OneToMany(() => OrderDocumentEntity, document => document.order)
  documents: OrderDocumentEntity[];

  @OneToMany(() => PaymentEntity, payment => payment.order)
  payments: PaymentEntity[];
}

// ========================================
// Order Items (Service Line Items)
// ========================================
@Entity('order_items')
@Index(['orderId', 'serviceId'])
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  orderId: string;

  @ManyToOne(() => OrderEntity, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column('uuid')
  @Index()
  serviceId: string;

  @ManyToOne(() => ServiceEntity)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column('uuid', { nullable: true })
  variantId?: string; // Service variant if applicable

  @Column('text')
  serviceName: string; // Snapshot of service name at time of order

  @Column('text', { nullable: true })
  serviceDescription?: string;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('decimal', { precision: 18, scale: 6 })
  unitPrice: number;

  @Column('decimal', { precision: 18, scale: 6 })
  totalPrice: number;

  @Column({ length: 3 })
  currency: string;

  // Service-specific configurations
  @Column('json', { nullable: true })
  configuration?: {
    customizations?: any[];
    addons?: Array<{
      addonId: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    specifications?: any;
    deliveryOptions?: any;
  };

  @Column('json', { nullable: true })
  deliverySchedule?: {
    estimatedDays: number;
    startDate?: Date;
    endDate?: Date;
    milestones?: Array<{
      name: string;
      targetDate: Date;
      status: string;
    }>;
  };

  // Status and Progress
  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  progressPercentage?: number; // 0.00 to 100.00

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ========================================
// Order Status History
// ========================================
@Entity('order_status_history')
@Index(['orderId', 'timestamp'])
export class OrderStatusHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  orderId: string;

  @ManyToOne(() => OrderEntity, order => order.statusHistory)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column({ length: 50 })
  previousStatus: string;

  @Column({ length: 50 })
  newStatus: string;

  @Column('text', { nullable: true })
  reason?: string;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('uuid', { nullable: true })
  changedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'changedBy' })
  changer?: UserEntity;

  @Column('timestamp')
  @Index()
  timestamp: Date;

  @Column('json', { nullable: true })
  metadata?: any; // Additional context data

  @CreateDateColumn()
  createdAt: Date;
}

// ========================================
// Order Communications (Messages, Updates)
// ========================================
@Entity('order_communications')
@Index(['orderId', 'communicationType', 'timestamp'])
export class OrderCommunicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  orderId: string;

  @ManyToOne(() => OrderEntity, order => order.communications)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column({
    type: 'enum',
    enum: ['message', 'update', 'alert', 'notification', 'escalation'],
  })
  @Index()
  communicationType: 'message' | 'update' | 'alert' | 'notification' | 'escalation';

  @Column({
    type: 'enum',
    enum: ['customer', 'vendor', 'internal', 'system'],
  })
  senderType: 'customer' | 'vendor' | 'internal' | 'system';

  @Column('uuid', { nullable: true })
  senderId?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'senderId' })
  sender?: UserEntity;

  @Column({ length: 255 })
  subject: string;

  @Column('text')
  message: string;

  @Column('simple-array', { nullable: true })
  attachments?: string[];

  @Column({
    type: 'enum',
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  })
  priority: 'low' | 'normal' | 'high' | 'urgent';

  @Column({ default: false })
  isInternal: boolean; // Internal communication not visible to customer

  @Column({ default: false })
  requiresResponse: boolean;

  @Column('timestamp', { nullable: true })
  responseByDate?: Date;

  @Column('timestamp')
  @Index()
  timestamp: Date;

  @Column('json', { nullable: true })
  readStatus?: Record<string, Date>; // userId -> read timestamp

  @CreateDateColumn()
  createdAt: Date;
}

// ========================================
// Order Documents (Contracts, Invoices, Reports)
// ========================================
@Entity('order_documents')
@Index(['orderId', 'documentType'])
export class OrderDocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  orderId: string;

  @ManyToOne(() => OrderEntity, order => order.documents)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column({
    type: 'enum',
    enum: ['contract', 'invoice', 'receipt', 'delivery_confirmation', 'quality_report', 'change_order', 'other'],
  })
  @Index()
  documentType: 'contract' | 'invoice' | 'receipt' | 'delivery_confirmation' | 'quality_report' | 'change_order' | 'other';

  @Column({ length: 255 })
  documentName: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ length: 500 })
  filePath: string;

  @Column({ length: 100 })
  fileName: string;

  @Column({ length: 50 })
  mimeType: string;

  @Column('bigint')
  fileSize: number;

  @Column({
    type: 'enum',
    enum: ['public', 'customer_only', 'vendor_only', 'internal_only'],
    default: 'customer_only',
  })
  accessLevel: 'public' | 'customer_only' | 'vendor_only' | 'internal_only';

  @Column({ default: false })
  requiresSignature: boolean;

  @Column('json', { nullable: true })
  signatures?: Array<{
    signerId: string;
    signerName: string;
    signerEmail: string;
    signedAt: Date;
    signatureData: string; // Base64 or reference
    ipAddress?: string;
  }>;

  @Column({ default: 1 })
  version: number;

  @Column('uuid', { nullable: true })
  uploadedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'uploadedBy' })
  uploader?: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ========================================
// Order Change Requests (Scope Changes, Modifications)
// ========================================
@Entity('order_change_requests')
@Index(['orderId', 'status'])
export class OrderChangeRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  orderId: string;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column({ length: 100 })
  changeRequestNumber: string;

  @Column({
    type: 'enum',
    enum: ['scope_change', 'timeline_change', 'pricing_change', 'specification_change', 'resource_change'],
  })
  changeType: 'scope_change' | 'timeline_change' | 'pricing_change' | 'specification_change' | 'resource_change';

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  justification: string;

  @Column('json')
  proposedChanges: {
    original: any;
    proposed: any;
    impact: {
      cost?: number;
      timeline?: string;
      scope?: string;
      resources?: string[];
    };
  };

  @Column({
    type: 'enum',
    enum: ['pending', 'under_review', 'approved', 'rejected', 'implemented', 'cancelled'],
    default: 'pending',
  })
  @Index()
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'implemented' | 'cancelled';

  @Column('uuid', { nullable: true })
  requestedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'requestedBy' })
  requester?: UserEntity;

  @Column('uuid', { nullable: true })
  reviewedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewedBy' })
  reviewer?: UserEntity;

  @Column('timestamp', { nullable: true })
  reviewedAt?: Date;

  @Column('text', { nullable: true })
  reviewNotes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}