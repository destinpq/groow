/**
 * Social Content Publishing API Services
 * Content creation, publishing workflows, and multi-platform distribution
 */
import { api } from './client';

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'product_promotion' | 'announcement' | 'educational' | 'entertainment' | 'seasonal' | 'user_generated' | 'custom';
  type: 'text' | 'image' | 'video' | 'carousel' | 'story' | 'reel' | 'poll' | 'live';
  platforms: Array<{
    platform: string;
    supported: boolean;
    optimizations: {
      dimensions?: { width: number; height: number };
      duration?: { min: number; max: number };
      textLength?: { min: number; max: number };
      aspectRatio?: string;
      fileSize?: number;
      quality?: string;
    };
  }>;
  content: {
    title?: string;
    text: string;
    variables: Array<{
      name: string;
      type: 'text' | 'number' | 'date' | 'url' | 'image' | 'product' | 'user';
      placeholder: string;
      required: boolean;
      default?: any;
      validation?: {
        pattern?: string;
        min?: number;
        max?: number;
        options?: string[];
      };
    }>;
    hashtags: {
      default: string[];
      suggested: string[];
      trending: string[];
      custom: string[];
    };
    media: {
      required: boolean;
      types: string[];
      count: { min: number; max: number };
      templates?: Array<{
        type: string;
        url: string;
        editable: boolean;
      }>;
    };
  };
  styling: {
    colors: string[];
    fonts: string[];
    layout: string;
    branding: {
      logo: boolean;
      watermark: boolean;
      brandColors: boolean;
    };
  };
  automation: {
    autoSchedule: boolean;
    optimalTiming: boolean;
    aiOptimization: boolean;
    crossPosting: boolean;
    variations: Array<{
      platform: string;
      modifications: Record<string, any>;
    }>;
  };
  engagement: {
    callToAction: string[];
    interactivity: {
      polls: boolean;
      questions: boolean;
      contests: boolean;
      userGenerated: boolean;
    };
  };
  analytics: {
    trackingEnabled: boolean;
    goals: Array<{
      type: 'reach' | 'engagement' | 'clicks' | 'conversions';
      target: number;
    }>;
    customEvents: string[];
  };
  approval: {
    required: boolean;
    workflow: Array<{
      role: string;
      order: number;
      required: boolean;
    }>;
    autoApprove: {
      conditions: Array<{
        field: string;
        operator: string;
        value: any;
      }>;
    };
  };
  statistics: {
    usage: number;
    success: number;
    averageEngagement: number;
    conversions: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    industry: string[];
  };
}

export interface ContentPlan {
  id: string;
  name: string;
  description: string;
  type: 'campaign' | 'ongoing' | 'seasonal' | 'event' | 'product_launch' | 'brand_awareness';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  timeline: {
    startDate: string;
    endDate?: string;
    timezone: string;
    milestones: Array<{
      id: string;
      name: string;
      date: string;
      description: string;
      completed: boolean;
    }>;
  };
  objectives: Array<{
    type: 'awareness' | 'engagement' | 'traffic' | 'leads' | 'sales' | 'retention';
    target: number;
    current: number;
    unit: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  audience: {
    primary: {
      demographics: Record<string, any>;
      interests: string[];
      behaviors: string[];
      platforms: string[];
    };
    secondary?: {
      demographics: Record<string, any>;
      interests: string[];
      behaviors: string[];
      platforms: string[];
    };
    size: number;
    reach: number;
  };
  content: {
    themes: string[];
    pillars: Array<{
      name: string;
      description: string;
      percentage: number;
      examples: string[];
    }>;
    frequency: {
      daily?: number;
      weekly?: number;
      monthly?: number;
    };
    distribution: Record<string, number>; // platform percentages
  };
  calendar: Array<{
    id: string;
    date: string;
    time: string;
    platform: string;
    contentType: string;
    title: string;
    status: 'planned' | 'created' | 'approved' | 'scheduled' | 'published';
    templateId?: string;
    assignee?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  resources: {
    team: Array<{
      userId: string;
      role: string;
      responsibilities: string[];
      availability: number; // percentage
    }>;
    budget: {
      total: number;
      allocated: number;
      spent: number;
      currency: string;
      breakdown: Record<string, number>;
    };
    assets: Array<{
      type: string;
      name: string;
      url: string;
      usage: string[];
    }>;
  };
  approval: {
    workflow: Array<{
      step: string;
      assignee: string;
      deadline: string;
      status: 'pending' | 'approved' | 'rejected' | 'skipped';
    }>;
    currentStep?: string;
    autoApproval: {
      enabled: boolean;
      conditions: Array<{
        field: string;
        operator: string;
        value: any;
      }>;
    };
  };
  performance: {
    reach: number;
    impressions: number;
    engagement: number;
    clicks: number;
    conversions: number;
    revenue: number;
    roi: number;
    topContent: string[];
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    collaborators: string[];
  };
}

export interface ContentItem {
  id: string;
  planId?: string;
  templateId?: string;
  type: 'post' | 'story' | 'reel' | 'video' | 'carousel' | 'live' | 'event' | 'article' | 'poll';
  status: 'draft' | 'review' | 'approved' | 'rejected' | 'scheduled' | 'published' | 'archived' | 'failed';
  content: {
    title?: string;
    text: string;
    summary?: string;
    excerpt?: string;
    media: Array<{
      id: string;
      type: 'image' | 'video' | 'gif' | 'document' | 'audio';
      url: string;
      thumbnail?: string;
      alt: string;
      caption?: string;
      metadata: {
        size: number;
        format: string;
        dimensions?: { width: number; height: number };
        duration?: number;
        quality?: string;
      };
      transformations?: Array<{
        platform: string;
        modifications: Record<string, any>;
      }>;
    }>;
    hashtags: string[];
    mentions: string[];
    links: Array<{
      url: string;
      title: string;
      description?: string;
      preview?: string;
    }>;
    location?: {
      name: string;
      coordinates?: { lat: number; lng: number };
      address?: string;
    };
    poll?: {
      question: string;
      options: string[];
      duration: number;
      allowMultiple: boolean;
    };
  };
  targeting: {
    platforms: Array<{
      platform: string;
      enabled: boolean;
      customizations: {
        text?: string;
        hashtags?: string[];
        media?: string[];
        timing?: string;
      };
      audience?: {
        demographics: Record<string, any>;
        interests: string[];
        locations: string[];
        behaviors: string[];
      };
    }>;
    global: {
      audience: 'public' | 'followers' | 'friends' | 'custom' | 'private';
      restrictions: {
        ageMin?: number;
        ageMax?: number;
        locations?: string[];
        languages?: string[];
      };
    };
  };
  scheduling: {
    publishAt?: string;
    timezone: string;
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      endDate?: string;
      occurrences?: number;
    };
    optimal: {
      enabled: boolean;
      factors: string[];
      confidence?: number;
    };
  };
  workflow: {
    currentStep: string;
    history: Array<{
      step: string;
      user: string;
      action: 'submit' | 'approve' | 'reject' | 'comment' | 'edit';
      timestamp: string;
      comment?: string;
      changes?: Record<string, any>;
    }>;
    assignees: Array<{
      step: string;
      userId: string;
      role: string;
      deadline?: string;
    }>;
    notifications: {
      onSubmit: boolean;
      onApproval: boolean;
      onRejection: boolean;
      onPublish: boolean;
      recipients: string[];
    };
  };
  collaboration: {
    contributors: Array<{
      userId: string;
      role: 'creator' | 'editor' | 'reviewer' | 'approver';
      permissions: string[];
      addedAt: string;
    }>;
    comments: Array<{
      id: string;
      userId: string;
      text: string;
      timestamp: string;
      resolved: boolean;
      replies?: Array<{
        userId: string;
        text: string;
        timestamp: string;
      }>;
    }>;
    version: number;
    changes: Array<{
      version: number;
      userId: string;
      timestamp: string;
      description: string;
      diff: Record<string, any>;
    }>;
  };
  performance: {
    reach: number;
    impressions: number;
    engagement: {
      total: number;
      rate: number;
      breakdown: Record<string, number>;
    };
    clicks: number;
    shares: number;
    saves: number;
    comments: number;
    reactions: Record<string, number>;
    conversions: number;
    revenue: number;
  };
  analytics: {
    goals: Array<{
      type: string;
      target: number;
      achieved: number;
      status: 'pending' | 'achieved' | 'failed';
    }>;
    attribution: {
      campaign?: string;
      source: string;
      medium: string;
      utmParameters: Record<string, string>;
    };
    audience: {
      demographics: Record<string, number>;
      interests: Record<string, number>;
      behavior: Record<string, number>;
    };
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
      score: number;
    };
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    externalIds: Record<string, string>;
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    language: string;
  };
}

export interface PublishingQueue {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error' | 'maintenance';
  platforms: string[];
  rules: Array<{
    id: string;
    name: string;
    conditions: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    actions: Array<{
      type: 'schedule' | 'modify' | 'approve' | 'reject' | 'notify';
      configuration: Record<string, any>;
    }>;
    priority: number;
    enabled: boolean;
  }>;
  scheduling: {
    timezone: string;
    workingHours: {
      start: string;
      end: string;
      days: string[];
    };
    bufferTime: number; // minutes between posts
    maxPerHour: number;
    maxPerDay: number;
    optimalTimes: Array<{
      day: string;
      hours: number[];
      effectiveness: number;
    }>;
  };
  items: Array<{
    contentId: string;
    scheduledAt: string;
    status: 'queued' | 'processing' | 'published' | 'failed' | 'cancelled';
    attempts: number;
    lastAttempt?: string;
    error?: string;
    platform: string;
    priority: number;
  }>;
  automation: {
    autoRetry: {
      enabled: boolean;
      maxAttempts: number;
      backoffStrategy: 'linear' | 'exponential';
      interval: number;
    };
    failureHandling: {
      notifyOnFailure: boolean;
      escalateAfter: number;
      fallbackActions: string[];
    };
    optimization: {
      enabled: boolean;
      factors: string[];
      learningEnabled: boolean;
    };
  };
  monitoring: {
    healthCheck: {
      enabled: boolean;
      interval: number;
      timeout: number;
    };
    metrics: Array<{
      name: string;
      value: number;
      threshold: number;
      status: 'normal' | 'warning' | 'critical';
    }>;
    alerts: Array<{
      condition: string;
      threshold: number;
      recipients: string[];
      frequency: string;
    }>;
  };
  statistics: {
    totalProcessed: number;
    successRate: number;
    averageLatency: number;
    errorRate: number;
    lastProcessed?: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface ContentAnalytics {
  id: string;
  contentId?: string;
  planId?: string;
  type: 'content_item' | 'content_plan' | 'template' | 'campaign' | 'overall';
  period: {
    start: string;
    end: string;
    timezone: string;
  };
  metrics: {
    content: {
      published: number;
      scheduled: number;
      draft: number;
      approved: number;
      rejected: number;
    };
    engagement: {
      total: number;
      average: number;
      rate: number;
      byPlatform: Record<string, number>;
      byContentType: Record<string, number>;
      trend: number; // percentage change
    };
    reach: {
      total: number;
      unique: number;
      organic: number;
      paid: number;
      byPlatform: Record<string, number>;
    };
    audience: {
      growth: number;
      demographics: Record<string, number>;
      interests: Record<string, number>;
      activeHours: Record<string, number>;
      retention: number;
    };
    performance: {
      clicks: number;
      conversions: number;
      revenue: number;
      roi: number;
      costPerClick: number;
      costPerConversion: number;
    };
  };
  insights: {
    topPerforming: Array<{
      contentId: string;
      title: string;
      platform: string;
      metric: string;
      value: number;
      improvement: number;
    }>;
    underPerforming: Array<{
      contentId: string;
      title: string;
      platform: string;
      issues: string[];
      recommendations: string[];
    }>;
    trends: Array<{
      trend: string;
      description: string;
      impact: 'positive' | 'negative' | 'neutral';
      confidence: number;
      actionable: boolean;
    }>;
    opportunities: Array<{
      type: string;
      description: string;
      potential: number;
      effort: 'low' | 'medium' | 'high';
      priority: number;
    }>;
  };
  benchmarks: {
    industry: {
      engagementRate: number;
      postFrequency: number;
      audienceGrowth: number;
      conversionRate: number;
    };
    internal: {
      bestPerformingContent: string[];
      averageMetrics: Record<string, number>;
      seasonalTrends: Record<string, number>;
    };
  };
  recommendations: Array<{
    category: 'content' | 'timing' | 'audience' | 'platform' | 'format';
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    expectedImpact: string;
    effort: string;
    implementation: string[];
  }>;
  metadata: {
    generatedAt: string;
    generatedBy: string;
    confidence: number;
    dataQuality: number;
    reportType: 'automated' | 'custom' | 'scheduled';
  };
}

export interface ContentWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'simple' | 'complex' | 'conditional' | 'parallel' | 'custom';
  status: 'active' | 'inactive' | 'draft';
  steps: Array<{
    id: string;
    name: string;
    type: 'create' | 'review' | 'approve' | 'edit' | 'schedule' | 'publish' | 'analyze';
    order: number;
    required: boolean;
    assignee: {
      type: 'user' | 'role' | 'group' | 'auto';
      value: string;
    };
    conditions: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    actions: Array<{
      type: 'notify' | 'assign' | 'modify' | 'approve' | 'reject' | 'escalate';
      configuration: Record<string, any>;
      delay?: number;
    }>;
    deadline: {
      type: 'hours' | 'days' | 'date';
      value: number | string;
      escalation?: {
        enabled: boolean;
        actions: string[];
        recipients: string[];
      };
    };
    automation: {
      enabled: boolean;
      triggers: string[];
      conditions: Array<{
        field: string;
        operator: string;
        value: any;
      }>;
    };
  }>;
  routing: {
    parallel: boolean;
    conditional: Array<{
      condition: string;
      nextStep: string;
    }>;
    fallback: string;
  };
  permissions: {
    create: string[];
    view: string[];
    edit: string[];
    delete: string[];
    execute: string[];
  };
  notifications: {
    onStart: boolean;
    onComplete: boolean;
    onError: boolean;
    onDelay: boolean;
    recipients: {
      creators: boolean;
      assignees: boolean;
      managers: boolean;
      custom: string[];
    };
    channels: string[];
  };
  escalation: {
    enabled: boolean;
    triggers: Array<{
      condition: string;
      threshold: number;
      actions: string[];
    }>;
    levels: Array<{
      level: number;
      delay: number;
      recipients: string[];
      actions: string[];
    }>;
  };
  analytics: {
    trackPerformance: boolean;
    metrics: string[];
    bottlenecks: Array<{
      step: string;
      averageTime: number;
      issues: string[];
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
  };
}

export const contentPublishingAPI = {
  /**
   * Create content template
   */
  createTemplate: async (
    templateData: Omit<ContentTemplate, 'id' | 'statistics' | 'metadata'>
  ): Promise<ContentTemplate> => {
    const { data } = await api.post('/content/templates', templateData);
    return data;
  },

  /**
   * Get content templates
   */
  getTemplates: async (
    filters?: {
      category?: ContentTemplate['category'];
      type?: ContentTemplate['type'];
      platform?: string;
      tags?: string[];
    }
  ): Promise<ContentTemplate[]> => {
    const { data } = await api.get('/content/templates', { params: filters });
    return data;
  },

  /**
   * Get template details
   */
  getTemplate: async (templateId: string): Promise<ContentTemplate> => {
    const { data } = await api.get(`/content/templates/${templateId}`);
    return data;
  },

  /**
   * Update template
   */
  updateTemplate: async (
    templateId: string,
    updates: Partial<ContentTemplate>
  ): Promise<ContentTemplate> => {
    const { data } = await api.put(`/content/templates/${templateId}`, updates);
    return data;
  },

  /**
   * Delete template
   */
  deleteTemplate: async (templateId: string): Promise<void> => {
    await api.delete(`/content/templates/${templateId}`);
  },

  /**
   * Duplicate template
   */
  duplicateTemplate: async (
    templateId: string,
    modifications?: Partial<ContentTemplate>
  ): Promise<ContentTemplate> => {
    const { data } = await api.post(`/content/templates/${templateId}/duplicate`, modifications);
    return data;
  },

  /**
   * Create content plan
   */
  createPlan: async (
    planData: Omit<ContentPlan, 'id' | 'performance' | 'metadata'>
  ): Promise<ContentPlan> => {
    const { data } = await api.post('/content/plans', planData);
    return data;
  },

  /**
   * Get content plans
   */
  getPlans: async (
    filters?: {
      type?: ContentPlan['type'];
      status?: ContentPlan['status'];
      assignee?: string;
      from?: string;
      to?: string;
    }
  ): Promise<ContentPlan[]> => {
    const { data } = await api.get('/content/plans', { params: filters });
    return data;
  },

  /**
   * Get plan details
   */
  getPlan: async (planId: string): Promise<ContentPlan> => {
    const { data } = await api.get(`/content/plans/${planId}`);
    return data;
  },

  /**
   * Update plan
   */
  updatePlan: async (
    planId: string,
    updates: Partial<ContentPlan>
  ): Promise<ContentPlan> => {
    const { data } = await api.put(`/content/plans/${planId}`, updates);
    return data;
  },

  /**
   * Launch plan
   */
  launchPlan: async (planId: string): Promise<ContentPlan> => {
    const { data } = await api.post(`/content/plans/${planId}/launch`);
    return data;
  },

  /**
   * Generate content calendar
   */
  generateCalendar: async (
    planId: string,
    options?: {
      duration: number; // days
      frequency: Record<string, number>;
      themes: string[];
      autoAssign: boolean;
    }
  ): Promise<{
    calendar: ContentPlan['calendar'];
    statistics: {
      totalItems: number;
      byPlatform: Record<string, number>;
      byType: Record<string, number>;
    };
  }> => {
    const { data } = await api.post(`/content/plans/${planId}/generate-calendar`, options);
    return data;
  },

  /**
   * Create content item
   */
  createContent: async (
    contentData: Omit<ContentItem, 'id' | 'performance' | 'analytics' | 'metadata'>
  ): Promise<ContentItem> => {
    const { data } = await api.post('/content/items', contentData);
    return data;
  },

  /**
   * Get content items
   */
  getContent: async (
    filters?: {
      planId?: string;
      templateId?: string;
      type?: ContentItem['type'];
      status?: ContentItem['status'];
      assignee?: string;
      platform?: string;
      from?: string;
      to?: string;
      limit?: number;
    }
  ): Promise<ContentItem[]> => {
    const { data } = await api.get('/content/items', { params: filters });
    return data;
  },

  /**
   * Get content item details
   */
  getContentItem: async (contentId: string): Promise<ContentItem> => {
    const { data } = await api.get(`/content/items/${contentId}`);
    return data;
  },

  /**
   * Update content item
   */
  updateContent: async (
    contentId: string,
    updates: Partial<ContentItem>
  ): Promise<ContentItem> => {
    const { data } = await api.put(`/content/items/${contentId}`, updates);
    return data;
  },

  /**
   * Delete content item
   */
  deleteContent: async (contentId: string): Promise<void> => {
    await api.delete(`/content/items/${contentId}`);
  },

  /**
   * Submit content for review
   */
  submitForReview: async (
    contentId: string,
    reviewers?: string[]
  ): Promise<ContentItem> => {
    const { data } = await api.post(`/content/items/${contentId}/submit`, { reviewers });
    return data;
  },

  /**
   * Approve content
   */
  approveContent: async (
    contentId: string,
    comment?: string
  ): Promise<ContentItem> => {
    const { data } = await api.post(`/content/items/${contentId}/approve`, { comment });
    return data;
  },

  /**
   * Reject content
   */
  rejectContent: async (
    contentId: string,
    reason: string,
    suggestions?: string[]
  ): Promise<ContentItem> => {
    const { data } = await api.post(`/content/items/${contentId}/reject`, {
      reason,
      suggestions,
    });
    return data;
  },

  /**
   * Schedule content
   */
  scheduleContent: async (
    contentId: string,
    schedule: {
      publishAt: string;
      platforms: string[];
      timezone?: string;
      recurring?: ContentItem['scheduling']['recurring'];
    }
  ): Promise<ContentItem> => {
    const { data } = await api.post(`/content/items/${contentId}/schedule`, schedule);
    return data;
  },

  /**
   * Publish content immediately
   */
  publishContent: async (
    contentId: string,
    platforms?: string[]
  ): Promise<{
    success: boolean;
    results: Array<{
      platform: string;
      success: boolean;
      postId?: string;
      error?: string;
    }>;
    analytics: {
      trackingEnabled: boolean;
      trackingIds: Record<string, string>;
    };
  }> => {
    const { data } = await api.post(`/content/items/${contentId}/publish`, { platforms });
    return data;
  },

  /**
   * Cancel scheduled content
   */
  cancelScheduled: async (
    contentId: string,
    platforms?: string[]
  ): Promise<ContentItem> => {
    const { data } = await api.post(`/content/items/${contentId}/cancel`, { platforms });
    return data;
  },

  /**
   * Duplicate content
   */
  duplicateContent: async (
    contentId: string,
    modifications?: Partial<ContentItem>
  ): Promise<ContentItem> => {
    const { data } = await api.post(`/content/items/${contentId}/duplicate`, modifications);
    return data;
  },

  /**
   * Bulk create content
   */
  bulkCreateContent: async (
    items: Array<Omit<ContentItem, 'id' | 'performance' | 'analytics' | 'metadata'>>
  ): Promise<{
    success: ContentItem[];
    failed: Array<{
      item: any;
      error: string;
    }>;
  }> => {
    const { data } = await api.post('/content/items/bulk', { items });
    return data;
  },

  /**
   * Create publishing queue
   */
  createQueue: async (
    queueData: Omit<PublishingQueue, 'id' | 'items' | 'statistics' | 'metadata'>
  ): Promise<PublishingQueue> => {
    const { data } = await api.post('/content/queues', queueData);
    return data;
  },

  /**
   * Get publishing queues
   */
  getQueues: async (
    filters?: {
      status?: PublishingQueue['status'];
      platform?: string;
    }
  ): Promise<PublishingQueue[]> => {
    const { data } = await api.get('/content/queues', { params: filters });
    return data;
  },

  /**
   * Get queue details
   */
  getQueue: async (queueId: string): Promise<PublishingQueue> => {
    const { data } = await api.get(`/content/queues/${queueId}`);
    return data;
  },

  /**
   * Add to queue
   */
  addToQueue: async (
    queueId: string,
    contentIds: string[],
    options?: {
      priority?: number;
      scheduledAt?: string;
    }
  ): Promise<PublishingQueue> => {
    const { data } = await api.post(`/content/queues/${queueId}/add`, {
      contentIds,
      ...options,
    });
    return data;
  },

  /**
   * Process queue
   */
  processQueue: async (
    queueId: string,
    options?: {
      dryRun?: boolean;
      limit?: number;
    }
  ): Promise<{
    processed: number;
    successful: number;
    failed: number;
    results: Array<{
      contentId: string;
      success: boolean;
      error?: string;
    }>;
  }> => {
    const { data } = await api.post(`/content/queues/${queueId}/process`, options);
    return data;
  },

  /**
   * Pause/resume queue
   */
  toggleQueue: async (
    queueId: string,
    action: 'pause' | 'resume'
  ): Promise<PublishingQueue> => {
    const { data } = await api.post(`/content/queues/${queueId}/${action}`);
    return data;
  },

  /**
   * Create workflow
   */
  createWorkflow: async (
    workflowData: Omit<ContentWorkflow, 'id' | 'analytics' | 'metadata'>
  ): Promise<ContentWorkflow> => {
    const { data } = await api.post('/content/workflows', workflowData);
    return data;
  },

  /**
   * Get workflows
   */
  getWorkflows: async (
    filters?: {
      type?: ContentWorkflow['type'];
      status?: ContentWorkflow['status'];
    }
  ): Promise<ContentWorkflow[]> => {
    const { data } = await api.get('/content/workflows', { params: filters });
    return data;
  },

  /**
   * Execute workflow
   */
  executeWorkflow: async (
    workflowId: string,
    contentId: string,
    variables?: Record<string, any>
  ): Promise<{
    executionId: string;
    status: 'started' | 'completed' | 'failed';
    currentStep?: string;
    nextStep?: string;
  }> => {
    const { data } = await api.post(`/content/workflows/${workflowId}/execute`, {
      contentId,
      variables,
    });
    return data;
  },

  /**
   * Get content analytics
   */
  getAnalytics: async (
    type: ContentAnalytics['type'],
    period: ContentAnalytics['period'],
    filters?: {
      contentIds?: string[];
      planIds?: string[];
      platforms?: string[];
      contentTypes?: string[];
    }
  ): Promise<ContentAnalytics> => {
    const { data } = await api.post('/content/analytics', {
      type,
      period,
      filters,
    });
    return data;
  },

  /**
   * Get content performance
   */
  getContentPerformance: async (
    contentId: string,
    timeframe?: { start: string; end: string }
  ): Promise<{
    metrics: ContentItem['performance'];
    trends: Array<{
      date: string;
      metrics: Record<string, number>;
    }>;
    breakdown: {
      byPlatform: Record<string, ContentItem['performance']>;
      byAudience: Record<string, number>;
    };
    comparisons: {
      previousPeriod: Record<string, number>;
      similar: Array<{
        contentId: string;
        similarity: number;
        performance: Record<string, number>;
      }>;
    };
  }> => {
    const { data } = await api.get(`/content/items/${contentId}/performance`, {
      params: timeframe,
    });
    return data;
  },

  /**
   * Generate content suggestions
   */
  generateSuggestions: async (
    criteria: {
      platform: string;
      type: string;
      audience?: string;
      topic?: string;
      trend?: string;
      count?: number;
    }
  ): Promise<Array<{
    title: string;
    content: string;
    hashtags: string[];
    mediaType?: string;
    score: number;
    reasoning: string;
  }>> => {
    const { data } = await api.post('/content/suggestions', criteria);
    return data;
  },

  /**
   * Optimize content
   */
  optimizeContent: async (
    contentId: string,
    options: {
      platforms: string[];
      objectives: string[];
      audience?: string;
    }
  ): Promise<{
    optimizations: Array<{
      platform: string;
      suggestions: Array<{
        type: string;
        description: string;
        impact: 'low' | 'medium' | 'high';
        implementation: string;
      }>;
    }>;
    variations: Array<{
      platform: string;
      optimizedContent: Partial<ContentItem>;
      expectedImprovement: number;
    }>;
  }> => {
    const { data } = await api.post(`/content/items/${contentId}/optimize`, options);
    return data;
  },

  /**
   * Export content plan
   */
  exportPlan: async (
    planId: string,
    format: 'pdf' | 'excel' | 'csv' | 'json'
  ): Promise<Blob> => {
    const { data } = await api.get(`/content/plans/${planId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Import content items
   */
  importContent: async (
    file: File,
    options?: {
      planId?: string;
      templateId?: string;
      autoSchedule?: boolean;
      skipValidation?: boolean;
    }
  ): Promise<{
    success: number;
    failed: number;
    items: ContentItem[];
    errors: Array<{
      row: number;
      error: string;
    }>;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const { data } = await api.post('/content/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Add workflow comment
   */
  addWorkflowComment: async (
    contentId: string,
    comment: string,
    stepId?: string
  ): Promise<ContentItem> => {
    const { data } = await api.post(`/content/items/${contentId}/comments`, {
      comment,
      stepId,
    });
    return data;
  },

  /**
   * Resolve workflow comment
   */
  resolveComment: async (
    contentId: string,
    commentId: string
  ): Promise<ContentItem> => {
    const { data } = await api.post(`/content/items/${contentId}/comments/${commentId}/resolve`);
    return data;
  },
};

export default contentPublishingAPI;