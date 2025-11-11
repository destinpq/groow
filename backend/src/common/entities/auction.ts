import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { ServiceEntity } from './service';
import { VendorEntity } from './vendor';
import { CustomerEntity } from './customer';
import { User as UserEntity } from '@modules/auth/entities/user.entity';
import { OrderEntity } from './order';

@Entity('service_auctions')
@Index(['serviceId', 'status'])
@Index(['vendorId', 'status'])
@Index(['status', 'endDate'])
@Index(['auctionType', 'status'])
export class ServiceAuctionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  auctionNumber: string;

  @Column('uuid')
  serviceId: string;

  @Column('uuid')
  vendorId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['reverse', 'forward', 'sealed_bid', 'dutch'],
    default: 'reverse'
  })
  auctionType: 'reverse' | 'forward' | 'sealed_bid' | 'dutch';

  @Column('decimal', { precision: 15, scale: 2 })
  startingPrice: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  reservePrice: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  buyNowPrice: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  currentBid: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  minBidIncrement: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'timestamp' })
  @Index()
  startDate: Date;

  @Column({ type: 'timestamp' })
  @Index()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ['draft', 'scheduled', 'active', 'extended', 'ended', 'cancelled', 'awarded'],
    default: 'draft'
  })
  @Index()
  status: 'draft' | 'scheduled' | 'active' | 'extended' | 'ended' | 'cancelled' | 'awarded';

  @Column('int', { default: 0 })
  totalBids: number;

  @Column('int', { default: 0 })
  totalBidders: number;

  @Column('int', { default: 0 })
  watchers: number;

  @Column('uuid', { nullable: true })
  winnerId: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  winningBid: number;

  @Column('json')
  serviceRequirements: {
    scope: string;
    deliverables: string[];
    timeline: string;
    skillsRequired: string[];
    experienceLevel: 'entry' | 'intermediate' | 'expert';
    budget: {
      min: number;
      max: number;
      currency: string;
    };
    location?: string;
    remote?: boolean;
    languages?: string[];
  };

  @Column('json', { nullable: true })
  evaluationCriteria: {
    price: number; // percentage weight
    quality: number;
    timeline: number;
    experience: number;
    reviews: number;
  };

  @Column('json', { nullable: true })
  terms: {
    paymentTerms?: string;
    cancellationPolicy?: string;
    revisionRounds?: number;
    warrantyCoverage?: string;
    supportIncluded?: boolean;
  };

  @Column('json', { nullable: true })
  attachments: string[];

  @Column('boolean', { default: true })
  allowAutoBidding: boolean;

  @Column('boolean', { default: false })
  isPrivate: boolean;

  @Column('json', { nullable: true })
  invitedVendors: string[];

  @Column('boolean', { default: false })
  requiresApproval: boolean;

  @Column('int', { nullable: true })
  maxParticipants: number;

  @Column('boolean', { default: false })
  hasAutoExtension: boolean;

  @Column('int', { nullable: true })
  autoExtensionMinutes: number;

  @Column('int', { default: 0 })
  viewCount: number;

  @Column({ type: 'timestamp', nullable: true })
  awardedAt: Date;

  @Column('uuid', { nullable: true })
  awardedBy: string;

  @Column('text', { nullable: true })
  cancellationReason: string;

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

  @ManyToOne(() => ServiceEntity)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'winnerId' })
  winner: UserEntity;

  @OneToMany(() => AuctionBidEntity, bid => bid.auction)
  bids: AuctionBidEntity[];

  @OneToMany(() => AuctionWatcherEntity, watcher => watcher.auction)
  watchersList: AuctionWatcherEntity[];

  @OneToMany(() => AuctionActivityEntity, activity => activity.auction)
  activities: AuctionActivityEntity[];

  @OneToMany(() => AuctionQuestionEntity, question => question.auction)
  questions: AuctionQuestionEntity[];

  // Note: Orders relationship handled separately - no auction field on OrderEntity
  // @OneToMany(() => OrderEntity, order => order.auction)
  // orders: OrderEntity[];
}

@Entity('auction_bids')
@Index(['auctionId', 'createdAt'])
@Index(['bidderId', 'auctionId'])
@Index(['isWinning', 'auctionId'])
export class AuctionBidEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  auctionId: string;

  @Column('uuid')
  bidderId: string;

  @Column('decimal', { precision: 15, scale: 2 })
  bidAmount: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  maxBidAmount: number; // For automatic bidding

  @Column({
    type: 'enum',
    enum: ['manual', 'automatic', 'proxy'],
    default: 'manual'
  })
  bidType: 'manual' | 'automatic' | 'proxy';

  @Column('boolean', { default: false })
  isWinning: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('text', { nullable: true })
  proposal: string;

  @Column('json', { nullable: true })
  deliveryTimeline: {
    estimatedDays: number;
    milestones: Array<{
      title: string;
      description: string;
      deliveryDays: number;
      payment: number;
    }>;
  };

  @Column('json', { nullable: true })
  qualifications: {
    experience: string;
    portfolioItems: string[];
    certifications: string[];
    teamSize: number;
    availability: string;
  };

  @Column('json', { nullable: true })
  attachments: string[];

  @Column('varchar', { length: 45, nullable: true })
  ipAddress: string;

  @Column('text', { nullable: true })
  userAgent: string;

  @Column({ type: 'timestamp', nullable: true })
  retractedAt: Date;

  @Column('text', { nullable: true })
  retractionReason: string;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ServiceAuctionEntity, auction => auction.bids)
  @JoinColumn({ name: 'auctionId' })
  auction: ServiceAuctionEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'bidderId' })
  bidder: UserEntity;

  @OneToMany(() => BidEvaluationEntity, evaluation => evaluation.bid)
  evaluations: BidEvaluationEntity[];
}

@Entity('auction_watchers')
@Index(['auctionId', 'userId'], { unique: true })
export class AuctionWatcherEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  auctionId: string;

  @Column('uuid')
  userId: string;

  @Column('boolean', { default: true })
  notifyOnBid: boolean;

  @Column('boolean', { default: true })
  notifyOnEnd: boolean;

  @Column('boolean', { default: false })
  notifyOnExtension: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastNotifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ServiceAuctionEntity, auction => auction.watchersList)
  @JoinColumn({ name: 'auctionId' })
  auction: ServiceAuctionEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

@Entity('auction_activities')
@Index(['auctionId', 'timestamp'])
@Index(['activityType', 'timestamp'])
export class AuctionActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  auctionId: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column({
    type: 'enum',
    enum: ['bid_placed', 'bid_retracted', 'auction_started', 'auction_extended', 'auction_ended', 'question_asked', 'question_answered', 'auction_awarded', 'buy_now'],
    default: 'bid_placed'
  })
  @Index()
  activityType: 'bid_placed' | 'bid_retracted' | 'auction_started' | 'auction_extended' | 'auction_ended' | 'question_asked' | 'question_answered' | 'auction_awarded' | 'buy_now';

  @Column('text')
  description: string;

  @Column('json', { nullable: true })
  details: Record<string, any>;

  @Column({ type: 'timestamp' })
  @Index()
  timestamp: Date;

  @Column('varchar', { length: 45, nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ServiceAuctionEntity, auction => auction.activities)
  @JoinColumn({ name: 'auctionId' })
  auction: ServiceAuctionEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

@Entity('auction_questions')
@Index(['auctionId', 'createdAt'])
@Index(['isAnswered', 'createdAt'])
export class AuctionQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  auctionId: string;

  @Column('uuid')
  askerId: string;

  @Column('text')
  question: string;

  @Column('text', { nullable: true })
  answer: string;

  @Column('uuid', { nullable: true })
  answeredBy: string;

  @Column({ type: 'timestamp', nullable: true })
  answeredAt: Date;

  @Column('boolean', { default: false })
  isAnswered: boolean;

  @Column('boolean', { default: true })
  isPublic: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ServiceAuctionEntity, auction => auction.questions)
  @JoinColumn({ name: 'auctionId' })
  auction: ServiceAuctionEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'askerId' })
  asker: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'answeredBy' })
  answerer: UserEntity;
}

@Entity('bid_evaluations')
@Index(['bidId', 'evaluatorId'])
@Index(['auctionId', 'evaluatorId'])
export class BidEvaluationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  bidId: string;

  @Column('uuid')
  auctionId: string;

  @Column('uuid')
  evaluatorId: string;

  @Column('decimal', { precision: 3, scale: 2 })
  priceScore: number; // 0-10

  @Column('decimal', { precision: 3, scale: 2 })
  qualityScore: number; // 0-10

  @Column('decimal', { precision: 3, scale: 2 })
  timelineScore: number; // 0-10

  @Column('decimal', { precision: 3, scale: 2 })
  experienceScore: number; // 0-10

  @Column('decimal', { precision: 3, scale: 2 })
  totalScore: number; // Weighted average

  @Column('text', { nullable: true })
  comments: string;

  @Column('json', { nullable: true })
  criteriaScores: Record<string, number>;

  @Column('boolean', { default: false })
  isRecommended: boolean;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AuctionBidEntity, bid => bid.evaluations)
  @JoinColumn({ name: 'bidId' })
  bid: AuctionBidEntity;

  @ManyToOne(() => ServiceAuctionEntity)
  @JoinColumn({ name: 'auctionId' })
  auction: ServiceAuctionEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'evaluatorId' })
  evaluator: UserEntity;
}

@Entity('auction_extensions')
@Index(['auctionId', 'createdAt'])
export class AuctionExtensionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  auctionId: string;

  @Column({ type: 'timestamp' })
  originalEndDate: Date;

  @Column({ type: 'timestamp' })
  newEndDate: Date;

  @Column('int')
  extensionMinutes: number;

  @Column({
    type: 'enum',
    enum: ['automatic', 'manual', 'admin'],
    default: 'automatic'
  })
  extensionType: 'automatic' | 'manual' | 'admin';

  @Column('text', { nullable: true })
  reason: string;

  @Column('uuid', { nullable: true })
  extendedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ServiceAuctionEntity)
  @JoinColumn({ name: 'auctionId' })
  auction: ServiceAuctionEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'extendedBy' })
  extender: UserEntity;
}