// Backend Email Entity Types - Generated from Common Entity Patterns

export interface EmailTemplateEntity {
  id: string;
  name: string;
  slug: string;
  subject: string;
  previewText?: string;
  htmlContent: string;
  textContent?: string;
  category: string; // transactional, marketing, newsletter, notification, onboarding
  type: string; // welcome, password_reset, order_confirmation, promotional, etc.
  status: string; // active, draft, archived
  variables: {
    name: string;
    type: string; // text, number, date, boolean, array
    description?: string;
    required: boolean;
    defaultValue?: any;
  }[];
  design: {
    layout: string;
    theme: string;
    colors: {
      primary: string;
      secondary: string;
      text: string;
      background: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    customCss?: string;
  };
  sender: {
    fromName: string;
    fromEmail: string;
    replyTo?: string;
    organization?: string;
  };
  tracking: {
    openTracking: boolean;
    clickTracking: boolean;
    unsubscribeTracking: boolean;
    googleAnalytics?: string;
  };
  metadata?: Record<string, any>;
  createdBy: string;
  lastModifiedBy?: string;
  usageCount: number;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaignEntity {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  status: string; // draft, scheduled, sending, sent, paused, cancelled
  type: string; // broadcast, drip, triggered, a_b_test
  content: {
    htmlContent?: string;
    textContent?: string;
    personalizedSubject?: boolean;
    dynamicContent?: Record<string, any>;
  };
  audience: {
    type: string; // all_customers, segment, list, individual
    segmentId?: string;
    listId?: string;
    customerIds?: string[];
    filters?: Record<string, any>;
    excludeSegments?: string[];
  };
  scheduling: {
    sendType: string; // immediate, scheduled, drip, triggered
    scheduledAt?: Date;
    timezone?: string;
    frequency?: string; // once, daily, weekly, monthly
    triggers?: {
      event: string;
      conditions?: Record<string, any>;
      delay?: number;
    }[];
  };
  testing: {
    isABTest: boolean;
    variants?: {
      id: string;
      name: string;
      subject?: string;
      content?: string;
      percentage: number;
      metrics?: Record<string, number>;
    }[];
    testDuration?: number;
    winningCriteria?: string;
  };
  settings: {
    trackOpens: boolean;
    trackClicks: boolean;
    enableUnsubscribe: boolean;
    sendPlainText: boolean;
    priority: string; // low, normal, high
    throttling?: {
      enabled: boolean;
      rate: number; // emails per hour
    };
  };
  metrics: {
    totalRecipients: number;
    queued: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
    failed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    complaintRate: number;
    unsubscribeRate: number;
    deliveryRate: number;
  };
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  sentAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailRecipientEntity {
  id: string;
  campaignId: string;
  recipientId: string;
  recipientType: string; // customer, lead, subscriber
  email: string;
  name?: string;
  status: string; // queued, sending, sent, delivered, bounced, failed, opened, clicked, unsubscribed
  personalizedSubject?: string;
  personalizedContent?: string;
  variables?: Record<string, any>;
  events: {
    type: string; // sent, delivered, opened, clicked, bounced, complained, unsubscribed
    timestamp: Date;
    metadata?: Record<string, any>;
  }[];
  sendAttempts: number;
  lastSentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  unsubscribedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailListEntity {
  id: string;
  name: string;
  description?: string;
  type: string; // subscribers, customers, leads, custom
  status: string; // active, archived
  visibility: string; // public, private
  subscriberCount: number;
  tags: string[];
  customFields: {
    name: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }[];
  settings: {
    doubleOptIn: boolean;
    welcomeEmail?: string;
    unsubscribeRedirect?: string;
    confirmationEmail?: string;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSubscriberEntity {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: string; // active, unsubscribed, bounced, complained
  subscriptionSource: string; // website, import, api, manual
  customFields: Record<string, any>;
  preferences: {
    emailFormat: string; // html, text, both
    frequency: string; // daily, weekly, monthly
    categories: string[];
  };
  lists: string[];
  tags: string[];
  segments: string[];
  subscribedAt: Date;
  confirmedAt?: Date;
  unsubscribedAt?: Date;
  lastActivityAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSegmentEntity {
  id: string;
  name: string;
  description?: string;
  type: string; // dynamic, static, behavioral
  conditions: {
    field: string;
    operator: string;
    value: any;
    logic?: 'and' | 'or';
  }[];
  memberCount: number;
  lastCalculatedAt?: Date;
  autoUpdate: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailAnalyticsEntity {
  id: string;
  entityId: string;
  entityType: string; // campaign, template, list
  period: string; // day, week, month, year
  date: Date;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
    revenue?: number;
  };
  rates: {
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    complaintRate: number;
    unsubscribeRate: number;
    conversionRate?: number;
  };
  topLinks?: {
    url: string;
    clicks: number;
  }[];
  topDevices?: {
    type: string;
    count: number;
  }[];
  topClients?: {
    name: string;
    count: number;
  }[];
  createdAt: Date;
}

export interface EmailProviderEntity {
  id: string;
  name: string;
  type: string; // smtp, api, sendgrid, mailgun, ses, etc.
  isActive: boolean;
  isPrimary: boolean;
  config: {
    host?: string;
    port?: number;
    secure?: boolean;
    username?: string;
    password?: string;
    apiKey?: string;
    apiSecret?: string;
    region?: string;
    webhookUrl?: string;
  };
  limits: {
    dailyLimit?: number;
    monthlyLimit?: number;
    rateLimit?: number; // per hour
  };
  usage: {
    dailyUsed: number;
    monthlyUsed: number;
    lastResetAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface CreateEmailTemplateRequest {
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  category: string;
  type?: string;
  variables?: {
    name: string;
    type: string;
    description?: string;
    required: boolean;
    defaultValue?: any;
  }[];
  design?: Partial<EmailTemplateEntity['design']>;
  sender?: Partial<EmailTemplateEntity['sender']>;
  tracking?: Partial<EmailTemplateEntity['tracking']>;
}

export interface CreateEmailCampaignRequest {
  name: string;
  subject: string;
  templateId?: string;
  htmlContent?: string;
  textContent?: string;
  type: string;
  audience: {
    type: string;
    segmentId?: string;
    listId?: string;
    customerIds?: string[];
    filters?: Record<string, any>;
  };
  scheduling?: {
    sendType: string;
    scheduledAt?: Date;
    timezone?: string;
  };
  settings?: Partial<EmailCampaignEntity['settings']>;
  testing?: Partial<EmailCampaignEntity['testing']>;
}

export interface SendTestEmailRequest {
  templateId?: string;
  campaignId?: string;
  recipients: string[];
  variables?: Record<string, any>;
}

export interface BulkImportSubscribersRequest {
  listId?: string;
  subscribers: {
    email: string;
    firstName?: string;
    lastName?: string;
    customFields?: Record<string, any>;
  }[];
  updateExisting?: boolean;
  sendWelcomeEmail?: boolean;
}