import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { CustomerEntity } from './customer';
import { VendorEntity } from './vendor';
import { User as UserEntity } from '@modules/auth/entities/user.entity';

@Entity('rfq')
@Index(['status', 'createdAt'])
@Index(['customerId', 'status'])
export class RFQEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  rfqNumber: string;

  @Column('uuid')
  customerId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  category: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column('json', { nullable: true })
  attachments: string[];

  @Column({
    type: 'enum',
    enum: ['open', 'quoted', 'closed', 'cancelled'],
    default: 'open'
  })
  @Index()
  status: 'open' | 'quoted' | 'closed' | 'cancelled';

  @Column('int', { default: 0 })
  quotationCount: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  notes: string;

  @Column('json', { nullable: true })
  specifications: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  viewedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @OneToMany(() => QuotationEntity, quotation => quotation.rfq)
  quotations: QuotationEntity[];

  @OneToMany(() => RFQMessageEntity, message => message.rfq)
  messages: RFQMessageEntity[];

  @OneToMany(() => RFQViewEntity, view => view.rfq)
  views: RFQViewEntity[];
}

@Entity('quotations')
@Index(['rfqId', 'vendorId'])
@Index(['vendorId', 'status'])
@Index(['status', 'validUntil'])
export class QuotationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  rfqId: string;

  @Column('uuid')
  vendorId: string;

  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column('int')
  moq: number;

  @Column({ type: 'varchar', length: 100 })
  deliveryTime: string;

  @Column({ type: 'timestamp' })
  validUntil: Date;

  @Column('text', { nullable: true })
  notes: string;

  @Column('json', { nullable: true })
  attachments: string[];

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  })
  @Index()
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';

  @Column('json', { nullable: true })
  specifications: Record<string, any>;

  @Column('json', { nullable: true })
  terms: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  viewedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column('text', { nullable: true })
  rejectionReason: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RFQEntity, rfq => rfq.quotations)
  @JoinColumn({ name: 'rfqId' })
  rfq: RFQEntity;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @OneToMany(() => QuotationRevisionEntity, revision => revision.quotation)
  revisions: QuotationRevisionEntity[];
}

@Entity('rfq_messages')
@Index(['rfqId', 'createdAt'])
@Index(['senderId', 'senderType'])
export class RFQMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  rfqId: string;

  @Column('uuid')
  senderId: string;

  @Column({
    type: 'enum',
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  })
  @Index()
  senderType: 'customer' | 'vendor' | 'admin';

  @Column('text')
  message: string;

  @Column('json', { nullable: true })
  attachments: string[];

  @Column('boolean', { default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RFQEntity, rfq => rfq.messages)
  @JoinColumn({ name: 'rfqId' })
  rfq: RFQEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'senderId' })
  sender: UserEntity;
}

@Entity('rfq_views')
@Index(['rfqId', 'vendorId'])
@Index(['vendorId', 'viewedAt'])
export class RFQViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  rfqId: string;

  @Column('uuid')
  vendorId: string;

  @Column({ type: 'timestamp' })
  viewedAt: Date;

  @Column('varchar', { length: 45, nullable: true })
  ipAddress: string;

  @Column('text', { nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => RFQEntity, rfq => rfq.views)
  @JoinColumn({ name: 'rfqId' })
  rfq: RFQEntity;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;
}

@Entity('quotation_revisions')
@Index(['quotationId', 'version'])
export class QuotationRevisionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  quotationId: string;

  @Column('int')
  version: number;

  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column('int')
  moq: number;

  @Column({ type: 'varchar', length: 100 })
  deliveryTime: string;

  @Column({ type: 'timestamp' })
  validUntil: Date;

  @Column('text', { nullable: true })
  notes: string;

  @Column('json', { nullable: true })
  attachments: string[];

  @Column('json', { nullable: true })
  specifications: Record<string, any>;

  @Column('text', { nullable: true })
  changeReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => QuotationEntity, quotation => quotation.revisions)
  @JoinColumn({ name: 'quotationId' })
  quotation: QuotationEntity;
}

@Entity('rfq_negotiations')
@Index(['rfqId', 'quotationId'])
@Index(['customerId', 'vendorId'])
export class RFQNegotiationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  rfqId: string;

  @Column('uuid')
  quotationId: string;

  @Column('uuid')
  customerId: string;

  @Column('uuid')
  vendorId: string;

  @Column('decimal', { precision: 15, scale: 2 })
  proposedPrice: number;

  @Column('int')
  proposedQuantity: number;

  @Column({ type: 'varchar', length: 100 })
  proposedDeliveryTime: string;

  @Column('text', { nullable: true })
  negotiationNotes: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected', 'counter-offer'],
    default: 'pending'
  })
  status: 'pending' | 'accepted' | 'rejected' | 'counter-offer';

  @Column('uuid', { nullable: true })
  respondedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column('text', { nullable: true })
  response: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RFQEntity)
  @JoinColumn({ name: 'rfqId' })
  rfq: RFQEntity;

  @ManyToOne(() => QuotationEntity)
  @JoinColumn({ name: 'quotationId' })
  quotation: QuotationEntity;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;
}