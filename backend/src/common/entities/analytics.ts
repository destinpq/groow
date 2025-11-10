import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';

// ============================================
// Analytics Dashboard Entity
// ============================================

@Entity('analytics_dashboards')
@Index(['userId', 'type'])
@Index(['createdAt'])
export class AnalyticsDashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 50 })
  type: string; // overview, sales, products, customers, traffic, financial

  @Column('json', { nullable: true })
  config: {
    widgets: Array<{
      id: string;
      type: string;
      title: string;
      position: { x: number; y: number; width: number; height: number };
      dataSource: string;
      filters?: Record<string, any>;
      visualization: string; // chart, table, metric, gauge
      options?: Record<string, any>;
    }>;
    layout: string;
    theme: string;
    refreshInterval: number;
    timezone: string;
  };

  @Column('json', { nullable: true })
  filters: {
    dateRange?: { start: string; end: string };
    granularity?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    segments?: string[];
    categories?: string[];
    regions?: string[];
    channels?: string[];
  };

  @Column('varchar', { length: 50, default: 'private' })
  visibility: 'private' | 'team' | 'organization' | 'public';

  @Column('json', { nullable: true })
  permissions: {
    view: string[];
    edit: string[];
    share: string[];
  };

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('varchar', { length: 100, nullable: true })
  tags: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => AnalyticsReport, report => report.dashboard)
  reports: AnalyticsReport[];

  @OneToMany(() => AnalyticsAlert, alert => alert.dashboard)
  alerts: AnalyticsAlert[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validateConfig() {
    if (this.config && this.config.widgets) {
      for (const widget of this.config.widgets) {
        if (!widget.id || !widget.type || !widget.dataSource) {
          throw new Error('Invalid widget configuration');
        }
      }
    }
  }
}

// ============================================
// Analytics Report Entity
// ============================================

@Entity('analytics_reports')
@Index(['type', 'status'])
@Index(['createdAt'])
@Index(['scheduledAt'])
export class AnalyticsReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 50 })
  type: string; // sales, products, customers, traffic, financial, custom

  @Column('varchar', { length: 50 })
  category: string; // operational, strategic, compliance, ad-hoc

  @Column('json')
  dateRange: {
    start: string;
    end: string;
    timezone: string;
    granularity: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  };

  @Column('json', { nullable: true })
  filters: {
    productIds?: string[];
    categoryIds?: string[];
    vendorIds?: string[];
    customerSegments?: string[];
    regions?: string[];
    channels?: string[];
    priceRange?: { min: number; max: number };
    customFilters?: Record<string, any>;
  };

  @Column('json', { nullable: true })
  metrics: {
    totalRevenue?: number;
    totalOrders?: number;
    totalCustomers?: number;
    averageOrderValue?: number;
    conversionRate?: number;
    customerLifetimeValue?: number;
    profitMargin?: number;
    returnRate?: number;
    customMetrics?: Record<string, number>;
  };

  @Column('json', { nullable: true })
  data: {
    summary?: Record<string, any>;
    breakdown?: Array<Record<string, any>>;
    trends?: Array<Record<string, any>>;
    comparisons?: Record<string, any>;
    insights?: Array<{
      type: string;
      message: string;
      severity: 'low' | 'medium' | 'high';
      actionable: boolean;
      recommendation?: string;
    }>;
  };

  @Column('varchar', { length: 50, default: 'pending' })
  status: 'pending' | 'generating' | 'completed' | 'failed' | 'cancelled';

  @Column('varchar', { length: 50, default: 'json' })
  format: 'json' | 'csv' | 'xlsx' | 'pdf';

  @Column('varchar', { length: 500, nullable: true })
  fileUrl: string;

  @Column('bigint', { nullable: true })
  fileSizeBytes: number;

  @Column('varchar', { length: 100, nullable: true })
  fileHash: string;

  @Column('timestamp', { nullable: true })
  expiresAt: Date;

  @Column('json', { nullable: true })
  schedule: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    time: string; // HH:MM format
    timezone: string;
    recipients: string[];
    nextRun?: string;
    lastRun?: string;
  };

  @Column('json', { nullable: true })
  template: {
    id: string;
    name: string;
    sections: string[];
    branding: {
      logo?: string;
      colors: Record<string, string>;
      fonts: Record<string, string>;
    };
  };

  @Column('json', { nullable: true })
  sharing: {
    isPublic: boolean;
    allowedUsers: string[];
    allowedRoles: string[];
    externalSharing: boolean;
    password?: string;
    linkExpiry?: string;
  };

  @Column('timestamp', { nullable: true })
  scheduledAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date;

  @Column('text', { nullable: true })
  errorMessage: string;

  @Column('int', { default: 0 })
  downloadCount: number;

  @Column('varchar', { length: 100, nullable: true })
  tags: string;

  @Column('uuid', { nullable: true })
  dashboardId: string;

  @ManyToOne(() => AnalyticsDashboard, dashboard => dashboard.reports, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dashboardId' })
  dashboard: AnalyticsDashboard;

  @Column('uuid', { nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => AnalyticsReportView, view => view.report)
  views: AnalyticsReportView[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

// ============================================
// Analytics Metrics Entity (Time Series)
// ============================================

@Entity('analytics_metrics')
@Index(['metricType', 'date'])
@Index(['entityType', 'entityId', 'date'])
@Index(['date'])
export class AnalyticsMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  metricType: string; // revenue, orders, customers, traffic, conversion, etc.

  @Column('varchar', { length: 50 })
  entityType: string; // global, product, category, vendor, customer, region

  @Column('varchar', { length: 100, nullable: true })
  entityId: string; // ID of the specific entity (product ID, vendor ID, etc.)

  @Column('date')
  date: Date;

  @Column('varchar', { length: 20 })
  granularity: string; // hour, day, week, month, quarter, year

  @Column('decimal', { precision: 20, scale: 4 })
  value: number;

  @Column('decimal', { precision: 20, scale: 4, nullable: true })
  previousValue: number; // For comparison

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  changePercentage: number;

  @Column('json', { nullable: true })
  dimensions: {
    channel?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    region?: string;
    deviceType?: string;
    segment?: string;
    category?: string;
  };

  @Column('json', { nullable: true })
  metadata: {
    calculationMethod?: string;
    dataQuality?: 'high' | 'medium' | 'low';
    confidence?: number;
    seasonalityAdjusted?: boolean;
    outlierDetected?: boolean;
    notes?: string;
  };

  @Column('varchar', { length: 50, nullable: true })
  aggregationLevel: string; // raw, hourly, daily, weekly, monthly

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Analytics Events Entity (Behavioral Tracking)
// ============================================

@Entity('analytics_events')
@Index(['eventType', 'createdAt'])
@Index(['entityType', 'entityId', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['sessionId'])
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  eventType: string; // page_view, product_view, add_to_cart, purchase, etc.

  @Column('varchar', { length: 100 })
  category: string; // user_interaction, transaction, system, error

  @Column('varchar', { length: 50, nullable: true })
  entityType: string; // product, order, customer, page

  @Column('varchar', { length: 100, nullable: true })
  entityId: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column('varchar', { length: 100, nullable: true })
  sessionId: string;

  @Column('varchar', { length: 200, nullable: true })
  userAgent: string;

  @Column('inet', { nullable: true })
  ipAddress: string;

  @Column('varchar', { length: 500, nullable: true })
  url: string;

  @Column('varchar', { length: 500, nullable: true })
  referrer: string;

  @Column('json', { nullable: true })
  properties: {
    value?: number;
    currency?: string;
    quantity?: number;
    price?: number;
    productName?: string;
    categoryName?: string;
    pageTitle?: string;
    duration?: number;
    revenue?: number;
    customProperties?: Record<string, any>;
  };

  @Column('json', { nullable: true })
  location: {
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
  };

  @Column('json', { nullable: true })
  device: {
    type?: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;
    screenResolution?: string;
    language?: string;
  };

  @Column('json', { nullable: true })
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };

  @Column('timestamp')
  timestamp: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// Analytics Funnel Entity
// ============================================

@Entity('analytics_funnels')
@Index(['name', 'isActive'])
export class AnalyticsFunnel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('json')
  steps: Array<{
    id: string;
    name: string;
    eventType: string;
    conditions?: Record<string, any>;
    order: number;
  }>;

  @Column('json', { nullable: true })
  filters: {
    dateRange?: { start: string; end: string };
    userSegments?: string[];
    trafficSources?: string[];
    deviceTypes?: string[];
    regions?: string[];
  };

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('uuid', { nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => AnalyticsFunnelStep, step => step.funnel)
  stepAnalytics: AnalyticsFunnelStep[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

// ============================================
// Analytics Funnel Step Entity
// ============================================

@Entity('analytics_funnel_steps')
@Index(['funnelId', 'date'])
export class AnalyticsFunnelStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  funnelId: string;

  @Column('varchar', { length: 100 })
  stepId: string;

  @Column('date')
  date: Date;

  @Column('int', { default: 0 })
  totalUsers: number;

  @Column('int', { default: 0 })
  completedUsers: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  conversionRate: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  dropoffRate: number;

  @Column('int', { default: 0 })
  averageTimeToComplete: number; // in seconds

  @Column('json', { nullable: true })
  segmentBreakdown: {
    [segment: string]: {
      totalUsers: number;
      completedUsers: number;
      conversionRate: number;
    };
  };

  @ManyToOne(() => AnalyticsFunnel, funnel => funnel.stepAnalytics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'funnelId' })
  funnel: AnalyticsFunnel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Analytics Segment Entity
// ============================================

@Entity('analytics_segments')
@Index(['name', 'isActive'])
export class AnalyticsSegment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 50 })
  type: string; // demographic, behavioral, geographic, psychographic, value-based

  @Column('json')
  criteria: {
    conditions: Array<{
      field: string;
      operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between';
      value: any;
      logicalOperator?: 'and' | 'or';
    }>;
    rules?: {
      minimumOrders?: number;
      minimumRevenue?: number;
      timeframe?: string;
      recency?: string;
    };
  };

  @Column('json', { nullable: true })
  characteristics: {
    averageOrderValue?: number;
    purchaseFrequency?: number;
    lifetimeValue?: number;
    churnRisk?: 'low' | 'medium' | 'high';
    profitability?: 'low' | 'medium' | 'high';
    engagement?: 'low' | 'medium' | 'high';
  };

  @Column('int', { default: 0 })
  userCount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalRevenue: number;

  @Column('timestamp', { nullable: true })
  lastCalculated: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  autoUpdate: boolean;

  @Column('varchar', { length: 50, nullable: true })
  updateFrequency: string; // daily, weekly, monthly

  @Column('uuid', { nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => AnalyticsSegmentMember, member => member.segment)
  members: AnalyticsSegmentMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

// ============================================
// Analytics Segment Member Entity
// ============================================

@Entity('analytics_segment_members')
@Index(['segmentId', 'userId'])
@Index(['userId'])
export class AnalyticsSegmentMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  segmentId: string;

  @Column('uuid')
  userId: string;

  @Column('timestamp')
  joinedAt: Date;

  @Column('timestamp', { nullable: true })
  leftAt: Date;

  @Column('json', { nullable: true })
  attributes: {
    scoreAtJoin?: number;
    currentScore?: number;
    behaviorData?: Record<string, any>;
    preferences?: Record<string, any>;
  };

  @Column('boolean', { default: true })
  isActive: boolean;

  @ManyToOne(() => AnalyticsSegment, segment => segment.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'segmentId' })
  segment: AnalyticsSegment;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Analytics Alert Entity
// ============================================

@Entity('analytics_alerts')
@Index(['type', 'isActive'])
@Index(['triggeredAt'])
export class AnalyticsAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 50 })
  type: string; // threshold, anomaly, goal, trend

  @Column('varchar', { length: 100 })
  metric: string; // revenue, orders, traffic, conversion_rate, etc.

  @Column('json')
  conditions: {
    operator: 'greater_than' | 'less_than' | 'equals' | 'change_by' | 'anomaly_detected';
    threshold?: number;
    percentage?: number;
    timeframe: 'hour' | 'day' | 'week' | 'month';
    comparison?: 'previous_period' | 'same_period_last_year' | 'moving_average';
    sensitivity?: 'low' | 'medium' | 'high'; // for anomaly detection
  };

  @Column('json', { nullable: true })
  filters: {
    productIds?: string[];
    categoryIds?: string[];
    regions?: string[];
    channels?: string[];
    segments?: string[];
  };

  @Column('varchar', { length: 50, default: 'medium' })
  priority: 'low' | 'medium' | 'high' | 'critical';

  @Column('json')
  notifications: {
    email: {
      enabled: boolean;
      recipients: string[];
      subject?: string;
      template?: string;
    };
    slack: {
      enabled: boolean;
      webhook?: string;
      channel?: string;
      mentions?: string[];
    };
    dashboard: {
      enabled: boolean;
      persistent?: boolean;
    };
    sms: {
      enabled: boolean;
      numbers?: string[];
    };
  };

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('timestamp', { nullable: true })
  lastChecked: Date;

  @Column('timestamp', { nullable: true })
  triggeredAt: Date;

  @Column('int', { default: 0 })
  triggerCount: number;

  @Column('json', { nullable: true })
  lastTriggerData: {
    value: number;
    threshold: number;
    changePercentage?: number;
    metadata?: Record<string, any>;
  };

  @Column('uuid', { nullable: true })
  dashboardId: string;

  @ManyToOne(() => AnalyticsDashboard, dashboard => dashboard.alerts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dashboardId' })
  dashboard: AnalyticsDashboard;

  @Column('uuid', { nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => AnalyticsAlertTrigger, trigger => trigger.alert)
  triggers: AnalyticsAlertTrigger[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

// ============================================
// Analytics Alert Trigger Entity
// ============================================

@Entity('analytics_alert_triggers')
@Index(['alertId', 'triggeredAt'])
export class AnalyticsAlertTrigger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  alertId: string;

  @Column('timestamp')
  triggeredAt: Date;

  @Column('decimal', { precision: 20, scale: 4 })
  actualValue: number;

  @Column('decimal', { precision: 20, scale: 4 })
  thresholdValue: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  deviationPercentage: number;

  @Column('varchar', { length: 50 })
  severity: 'low' | 'medium' | 'high' | 'critical';

  @Column('json', { nullable: true })
  context: {
    timeframe?: string;
    comparedTo?: string;
    affectedEntities?: string[];
    relatedMetrics?: Record<string, number>;
    possibleCauses?: string[];
  };

  @Column('json', { nullable: true })
  notifications: {
    emailSent?: boolean;
    slackSent?: boolean;
    smsSent?: boolean;
    dashboardUpdated?: boolean;
    sentAt?: string;
    errors?: string[];
  };

  @Column('boolean', { default: false })
  acknowledged: boolean;

  @Column('uuid', { nullable: true })
  acknowledgedBy: string;

  @Column('timestamp', { nullable: true })
  acknowledgedAt: Date;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => AnalyticsAlert, alert => alert.triggers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'alertId' })
  alert: AnalyticsAlert;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'acknowledgedBy' })
  acknowledger: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Analytics Report View Entity (Tracking)
// ============================================

@Entity('analytics_report_views')
@Index(['reportId', 'viewedAt'])
@Index(['userId', 'viewedAt'])
export class AnalyticsReportView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  reportId: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column('varchar', { length: 200, nullable: true })
  userAgent: string;

  @Column('inet', { nullable: true })
  ipAddress: string;

  @Column('varchar', { length: 500, nullable: true })
  referrer: string;

  @Column('int', { nullable: true })
  duration: number; // seconds spent viewing

  @Column('varchar', { length: 50, nullable: true })
  accessMethod: string; // direct, shared_link, email, api

  @Column('timestamp')
  viewedAt: Date;

  @ManyToOne(() => AnalyticsReport, report => report.views, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: AnalyticsReport;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// Analytics Configuration Entity
// ============================================

@Entity('analytics_configurations')
export class AnalyticsConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50, unique: true })
  key: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('json')
  value: {
    trackingEnabled?: boolean;
    dataRetentionDays?: number;
    anonymizationEnabled?: boolean;
    samplingRate?: number;
    realTimeEnabled?: boolean;
    exportLimits?: Record<string, number>;
    alertLimits?: Record<string, number>;
    customDimensions?: Array<{
      name: string;
      type: string;
      defaultValue?: any;
    }>;
    integrations?: Record<string, {
      enabled: boolean;
      config: Record<string, any>;
    }>;
  };

  @Column('varchar', { length: 50, default: 'organization' })
  scope: 'global' | 'organization' | 'user';

  @Column('uuid', { nullable: true })
  organizationId: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

// Export all analytics entities
export {
  AnalyticsDashboard,
  AnalyticsReport,
  AnalyticsMetric,
  AnalyticsEvent,
  AnalyticsFunnel,
  AnalyticsFunnelStep,
  AnalyticsSegment,
  AnalyticsSegmentMember,
  AnalyticsAlert,
  AnalyticsAlertTrigger,
  AnalyticsReportView,
  AnalyticsConfig,
};