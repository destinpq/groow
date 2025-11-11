import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/auth/entities/user.entity';

@Entity('promotions')
export class Promotion extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  type: string; // banner, popup, email_campaign, sms_campaign, social_media, referral_program

  @Column()
  status: string; // draft, scheduled, active, paused, completed, cancelled

  @Column({ type: 'simple-json' })
  campaign: {
    objective: string; // brand_awareness, traffic, conversions, retention
    budget?: number;
    targetAudience: string[]; // customer_segments
    channels: string[]; // email, sms, social, in-app, website
    frequency: string; // one_time, daily, weekly, monthly
  };

  @Column({ type: 'simple-json', nullable: true })
  content: {
    title: string;
    message: string;
    imageUrl?: string;
    videoUrl?: string;
    ctaText?: string; // Call-to-action text
    ctaUrl?: string; // Call-to-action URL
    emailTemplate?: string;
    smsTemplate?: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  scheduling: {
    startDate: string;
    endDate: string;
    timezone: string;
    sendTimes?: string[]; // For email/SMS campaigns
    frequency?: string;
    recurring?: boolean;
  };

  @Column({ type: 'simple-json', nullable: true })
  targeting: {
    customerSegments: string[]; // new, active, inactive, vip
    demographics: {
      ageRange?: { min: number; max: number };
      gender?: string;
      location?: string[];
    };
    behavioral: {
      purchaseHistory?: string[];
      categoryInterests?: string[];
      lastActivityDays?: number;
      avgOrderValue?: { min: number; max: number };
    };
    customFilters?: Record<string, any>;
  };

  @Column({ type: 'simple-json', nullable: true })
  rules: {
    displayRules?: {
      maxImpressionsPerUser?: number;
      cooldownPeriod?: number; // hours
      deviceTypes?: string[];
      browserTypes?: string[];
    };
    eligibilityRules?: {
      minOrderValue?: number;
      excludedCustomers?: string[];
      requiredActions?: string[];
    };
  };

  @Column({ type: 'simple-json', default: {} })
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    reach: number;
    engagement: number;
    ctr: number; // Click-through rate
    conversionRate: number;
    costPerClick?: number;
    costPerConversion?: number;
    roi?: number; // Return on investment
  };

  @Column({ type: 'simple-json', default: {} })
  performance: {
    emailsSent?: number;
    emailsOpened?: number;
    emailsClicked?: number;
    smsDelivered?: number;
    smsClicked?: number;
    socialShares?: number;
    socialLikes?: number;
    websiteVisits?: number;
    appInstalls?: number;
  };

  @Column({ type: 'simple-array', nullable: true })
  associatedDeals: string[]; // Deal IDs

  @Column({ type: 'simple-array', nullable: true })
  associatedCoupons: string[]; // Coupon IDs

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  spent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  revenueGenerated: number;

  @Column({ type: 'simple-json', nullable: true })
  abTesting: {
    enabled: boolean;
    variants?: {
      name: string;
      content: any;
      traffic: number; // Percentage of traffic
      performance: any;
    }[];
    winner?: string;
  };

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  launchedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;
}