import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// NOTIFICATION ENTITY TYPES  
// ================================

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  WEBHOOK = 'webhook'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationCategory {
  ORDER = 'order',
  PAYMENT = 'payment',
  SHIPPING = 'shipping',
  ACCOUNT = 'account',
  MARKETING = 'marketing',
  SYSTEM = 'system',
  SUPPORT = 'support'
}

export enum TemplateType {
  WELCOME = 'welcome',
  ORDER_CONFIRMATION = 'order_confirmation',
  PAYMENT_SUCCESS = 'payment_success',
  SHIPPING_UPDATE = 'shipping_update',
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_VERIFICATION = 'account_verification',
  PROMOTIONAL = 'promotional',
  REMINDER = 'reminder'
}

export interface Notification extends BaseEntity {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  priority: NotificationPriority;
  category: NotificationCategory;
  recipientId: string;
  recipientType: 'customer' | 'vendor' | 'staff' | 'admin';
  title: string;
  message: string;
  data?: Record<string, any>;
  templateId?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
  expiresAt?: Date;
  actionUrl?: string;
  actionText?: string;
  imageUrl?: string;
  recipient?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface NotificationTemplate extends BaseEntity {
  id: string;
  name: string;
  type: TemplateType;
  notificationType: NotificationType;
  category: NotificationCategory;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  isDefault: boolean;
  settings?: {
    priority: NotificationPriority;
    retries: number;
    expiryHours?: number;
  };
  metadata?: Record<string, any>;
  createdBy?: string;
  usageCount: number;
}

export interface NotificationPreference extends BaseEntity {
  id: string;
  userId: string;
  userType: 'customer' | 'vendor' | 'staff';
  preferences: {
    [key in NotificationCategory]: {
      email: boolean;
      sms: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  globalSettings: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    marketingEnabled: boolean;
    quietHours?: {
      enabled: boolean;
      startTime: string;
      endTime: string;
      timezone: string;
    };
  };
}

export interface NotificationQueue {
  id: string;
  name: string;
  type: NotificationType;
  isActive: boolean;
  priority: number;
  processingRate: number; // messages per minute
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: 'linear' | 'exponential';
    initialDelay: number;
    maxDelay: number;
  };
  stats: {
    pending: number;
    processing: number;
    sent: number;
    failed: number;
    lastProcessed?: Date;
  };
}

export interface NotificationCampaign extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  type: NotificationType;
  category: NotificationCategory;
  templateId: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  targetAudience: {
    segments: string[];
    filters: Record<string, any>;
    excludeSegments?: string[];
  };
  content: {
    subject?: string;
    message: string;
    variables?: Record<string, any>;
    attachments?: string[];
  };
  settings: {
    priority: NotificationPriority;
    sendRate: number; // per minute
    timezone: string;
    respectQuietHours: boolean;
  };
  metrics: {
    totalRecipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
    unsubscribed: number;
  };
  createdBy: string;
}

export interface NotificationAnalytics {
  period: string;
  overview: {
    totalSent: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    failureRate: number;
  };
  byType: {
    type: NotificationType;
    sent: number;
    delivered: number;
    failed: number;
    deliveryRate: number;
  }[];
  byCategory: {
    category: NotificationCategory;
    sent: number;
    engagement: number;
    conversionRate: number;
  }[];
  topTemplates: {
    templateId: string;
    templateName: string;
    usage: number;
    deliveryRate: number;
    engagement: number;
  }[];
  dailyStats: {
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }[];
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface SendNotificationRequest {
  type: NotificationType;
  recipientId: string;
  recipientType: 'customer' | 'vendor' | 'staff' | 'admin';
  title: string;
  message: string;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  data?: Record<string, any>;
  templateId?: string;
  templateVariables?: Record<string, any>;
  scheduledAt?: Date;
  actionUrl?: string;
  actionText?: string;
  imageUrl?: string;
}

export interface SendNotificationResponse {
  notification: Notification;
  message: string;
}

export interface SendBulkNotificationRequest {
  type: NotificationType;
  recipients: {
    id: string;
    type: 'customer' | 'vendor' | 'staff' | 'admin';
  }[];
  title: string;
  message: string;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  templateId?: string;
  templateVariables?: Record<string, any>;
  scheduledAt?: Date;
}

export interface SendBulkNotificationResponse {
  queued: number;
  failed: number;
  jobId: string;
  message: string;
}

export interface GetNotificationsResponse {
  notifications: PaginatedResponse<Notification>;
}

export interface GetNotificationResponse {
  notification: Notification;
}

export interface CreateTemplateRequest {
  name: string;
  type: TemplateType;
  notificationType: NotificationType;
  category: NotificationCategory;
  subject?: string;
  content: string;
  variables?: string[];
  settings?: {
    priority: NotificationPriority;
    retries: number;
    expiryHours?: number;
  };
  isActive?: boolean;
}

export interface CreateTemplateResponse {
  template: NotificationTemplate;
  message: string;
}

export interface GetTemplatesResponse {
  templates: PaginatedResponse<NotificationTemplate>;
}

export interface UpdatePreferencesRequest {
  preferences: {
    [key in NotificationCategory]?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      inApp?: boolean;
    };
  };
  globalSettings?: {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    marketingEnabled?: boolean;
    quietHours?: {
      enabled: boolean;
      startTime: string;
      endTime: string;
      timezone: string;
    };
  };
}

export interface UpdatePreferencesResponse {
  preferences: NotificationPreference;
  message: string;
}

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  type: NotificationType;
  category: NotificationCategory;
  templateId: string;
  scheduledAt?: Date;
  targetAudience: {
    segments: string[];
    filters: Record<string, any>;
    excludeSegments?: string[];
  };
  content: {
    subject?: string;
    message: string;
    variables?: Record<string, any>;
  };
  settings?: {
    priority?: NotificationPriority;
    sendRate?: number;
    timezone?: string;
    respectQuietHours?: boolean;
  };
}

export interface CreateCampaignResponse {
  campaign: NotificationCampaign;
  message: string;
}

export interface GetCampaignsResponse {
  campaigns: PaginatedResponse<NotificationCampaign>;
}

// ================================
// FILTER TYPES
// ================================

export interface NotificationFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  type?: NotificationType | NotificationType[];
  status?: NotificationStatus | NotificationStatus[];
  category?: NotificationCategory | NotificationCategory[];
  priority?: NotificationPriority;
  recipientId?: string;
  recipientType?: ('customer' | 'vendor' | 'staff' | 'admin')[];
  dateFrom?: Date;
  dateTo?: Date;
  isRead?: boolean;
  search?: string;
}

export interface TemplateFilter {
  page?: number;
  limit?: number;
  type?: TemplateType;
  notificationType?: NotificationType;
  category?: NotificationCategory;
  isActive?: boolean;
  isDefault?: boolean;
  search?: string;
}

export interface CampaignFilter {
  page?: number;
  limit?: number;
  type?: NotificationType;
  status?: ('draft' | 'scheduled' | 'active' | 'completed' | 'cancelled')[];
  category?: NotificationCategory;
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

// ================================
// NOTIFICATION API INTERFACE
// ================================

export interface NotificationAPI {
  // Sending Notifications
  sendNotification(request: SendNotificationRequest): Promise<ApiResponse<SendNotificationResponse>>;
  sendBulkNotification(request: SendBulkNotificationRequest): Promise<ApiResponse<SendBulkNotificationResponse>>;
  resendNotification(notificationId: string): Promise<ApiResponse<SendNotificationResponse>>;
  cancelNotification(notificationId: string): Promise<ApiResponse<{ message: string }>>;
  
  // Notification Management
  getAllNotifications(filter?: NotificationFilter): Promise<ApiResponse<GetNotificationsResponse>>;
  getMyNotifications(filter?: Partial<NotificationFilter>): Promise<ApiResponse<GetNotificationsResponse>>;
  getNotificationById(id: string): Promise<ApiResponse<GetNotificationResponse>>;
  markAsRead(notificationIds: string[]): Promise<ApiResponse<{ marked: number }>>;
  markAllAsRead(): Promise<ApiResponse<{ marked: number }>>;
  deleteNotification(id: string): Promise<ApiResponse<{ message: string }>>;
  
  // Template Management
  createTemplate(request: CreateTemplateRequest): Promise<ApiResponse<CreateTemplateResponse>>;
  getAllTemplates(filter?: TemplateFilter): Promise<ApiResponse<GetTemplatesResponse>>;
  getTemplateById(id: string): Promise<ApiResponse<{ template: NotificationTemplate }>>;
  updateTemplate(id: string, updates: Partial<CreateTemplateRequest>): Promise<ApiResponse<CreateTemplateResponse>>;
  deleteTemplate(id: string): Promise<ApiResponse<{ message: string }>>;
  previewTemplate(id: string, variables?: Record<string, any>): Promise<ApiResponse<{
    preview: { subject?: string; content: string };
  }>>;
  
  // Preference Management
  getPreferences(): Promise<ApiResponse<{ preferences: NotificationPreference }>>;
  updatePreferences(request: UpdatePreferencesRequest): Promise<ApiResponse<UpdatePreferencesResponse>>;
  getUserPreferences(userId: string): Promise<ApiResponse<{ preferences: NotificationPreference }>>;
  
  // Campaign Management
  createCampaign(request: CreateCampaignRequest): Promise<ApiResponse<CreateCampaignResponse>>;
  getAllCampaigns(filter?: CampaignFilter): Promise<ApiResponse<GetCampaignsResponse>>;
  getCampaignById(id: string): Promise<ApiResponse<{ campaign: NotificationCampaign }>>;
  updateCampaign(id: string, updates: Partial<CreateCampaignRequest>): Promise<ApiResponse<CreateCampaignResponse>>;
  startCampaign(id: string): Promise<ApiResponse<{ campaign: NotificationCampaign }>>;
  pauseCampaign(id: string): Promise<ApiResponse<{ campaign: NotificationCampaign }>>;
  cancelCampaign(id: string): Promise<ApiResponse<{ message: string }>>;
  getCampaignMetrics(id: string): Promise<ApiResponse<{ metrics: NotificationCampaign['metrics'] }>>;
  
  // Queue Management
  getQueues(): Promise<ApiResponse<{ queues: NotificationQueue[] }>>;
  pauseQueue(queueName: string): Promise<ApiResponse<{ queue: NotificationQueue }>>;
  resumeQueue(queueName: string): Promise<ApiResponse<{ queue: NotificationQueue }>>;
  clearQueue(queueName: string): Promise<ApiResponse<{ cleared: number }>>;
  getQueueStats(queueName: string): Promise<ApiResponse<{ stats: NotificationQueue['stats'] }>>;
  
  // Analytics & Reports
  getNotificationAnalytics(period?: string): Promise<ApiResponse<NotificationAnalytics>>;
  getDeliveryReport(filter: NotificationFilter): Promise<ApiResponse<{
    total: number;
    delivered: number;
    failed: number;
    deliveryRate: number;
    failureReasons: { reason: string; count: number }[];
  }>>;
  getEngagementReport(period?: string): Promise<ApiResponse<{
    openRate: number;
    clickRate: number;
    unsubscribeRate: number;
    byCategory: { category: NotificationCategory; openRate: number; clickRate: number }[];
  }>>;
  
  // Testing & Development
  testNotification(request: SendNotificationRequest): Promise<ApiResponse<{ sent: boolean }>>;
  validateTemplate(templateId: string, variables: Record<string, any>): Promise<ApiResponse<{
    valid: boolean;
    errors?: string[];
    preview?: string;
  }>>;
  
  // Webhooks
  registerWebhook(url: string, events: string[]): Promise<ApiResponse<{ webhook: { id: string; url: string } }>>;
  unregisterWebhook(webhookId: string): Promise<ApiResponse<{ message: string }>>;
  testWebhook(webhookId: string): Promise<ApiResponse<{ delivered: boolean }>>;
}