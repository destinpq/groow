/**
 * Social Media Management API Services
 * Unified social media account management, team collaboration, and operations
 */
import { api } from './client';

export interface SocialAccount {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'pinterest' | 'snapchat' | 'discord' | 'twitch' | 'custom';
  handle: string;
  displayName: string;
  accountType: 'personal' | 'business' | 'creator' | 'brand' | 'organization' | 'influencer';
  status: 'active' | 'inactive' | 'suspended' | 'pending' | 'error' | 'rate_limited';
  verification: {
    verified: boolean;
    verifiedAt?: string;
    verificationType?: 'blue' | 'gold' | 'gray' | 'business' | 'creator';
  };
  profile: {
    bio: string;
    profileImage: string;
    coverImage?: string;
    website?: string;
    location?: string;
    contactEmail?: string;
    phoneNumber?: string;
    categories: string[];
    customFields: Record<string, any>;
  };
  metrics: {
    followers: number;
    following: number;
    posts: number;
    averageEngagement: number;
    reachRate: number;
    growthRate: number; // monthly percentage
    lastActivity?: string;
    engagementTrend: 'up' | 'down' | 'stable';
  };
  connection: {
    connectedAt: string;
    lastSync?: string;
    syncStatus: 'synced' | 'syncing' | 'error' | 'pending';
    permissions: Array<{
      scope: string;
      granted: boolean;
      required: boolean;
    }>;
    tokenExpiry?: string;
    lastError?: {
      code: string;
      message: string;
      timestamp: string;
    };
  };
  settings: {
    autoPost: boolean;
    autoReply: boolean;
    moderationEnabled: boolean;
    hashtagSuggestions: boolean;
    optimalTiming: boolean;
    crossPosting: boolean;
    backupPosts: boolean;
    contentApproval: boolean;
    analyticsTracking: boolean;
  };
  team: Array<{
    userId: string;
    role: 'admin' | 'manager' | 'editor' | 'analyst' | 'viewer';
    permissions: string[];
    assignedAt: string;
    assignedBy: string;
  }>;
  branding: {
    colors: string[];
    fonts: string[];
    logoUrl?: string;
    watermarkUrl?: string;
    brandVoice: {
      tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful' | 'custom';
      style: string[];
      keywords: string[];
      avoidWords: string[];
    };
  };
  compliance: {
    gdprCompliant: boolean;
    ccpaCompliant: boolean;
    contentGuidelines: string[];
    restricted: {
      countries: string[];
      ageGroups: string[];
      content: string[];
    };
    disclaimers: Array<{
      type: string;
      text: string;
      required: boolean;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    notes: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface TeamMember {
  id: string;
  userId: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    title?: string;
    department?: string;
    timezone: string;
    language: string;
  };
  role: {
    name: string;
    type: 'admin' | 'manager' | 'editor' | 'analyst' | 'intern' | 'contractor' | 'custom';
    level: 1 | 2 | 3 | 4 | 5; // hierarchy level
    description: string;
  };
  permissions: {
    accounts: Record<string, string[]>; // account ID -> permissions
    features: string[];
    content: {
      create: boolean;
      edit: boolean;
      delete: boolean;
      publish: boolean;
      schedule: boolean;
      approve: boolean;
    };
    analytics: {
      view: boolean;
      export: boolean;
      configure: boolean;
    };
    team: {
      invite: boolean;
      manage: boolean;
      remove: boolean;
    };
    billing: {
      view: boolean;
      manage: boolean;
    };
  };
  availability: {
    status: 'available' | 'busy' | 'away' | 'offline';
    workingHours: {
      timezone: string;
      schedule: Record<string, { start: string; end: string }>;
    };
    vacations: Array<{
      start: string;
      end: string;
      type: 'vacation' | 'sick' | 'personal' | 'other';
    }>;
    capacity: number; // percentage of full-time
  };
  activity: {
    lastLogin: string;
    lastActivity: string;
    loginCount: number;
    contentCreated: number;
    contentPublished: number;
    commentsAdded: number;
    collaborations: number;
  };
  notifications: {
    email: {
      enabled: boolean;
      frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
      types: string[];
    };
    push: {
      enabled: boolean;
      types: string[];
    };
    inApp: {
      enabled: boolean;
      types: string[];
    };
  };
  training: {
    completed: Array<{
      course: string;
      completedAt: string;
      score?: number;
    }>;
    pending: string[];
    certifications: Array<{
      name: string;
      issuer: string;
      issuedAt: string;
      expiresAt?: string;
    }>;
  };
  metadata: {
    joinedAt: string;
    invitedBy: string;
    lastUpdated: string;
    tags: string[];
    notes: string;
  };
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  type: 'agency' | 'brand' | 'freelancer' | 'enterprise' | 'startup' | 'nonprofit';
  status: 'active' | 'suspended' | 'trial' | 'expired';
  settings: {
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
    theme: 'light' | 'dark' | 'auto';
    branding: {
      logo?: string;
      primaryColor: string;
      secondaryColor: string;
      customCss?: string;
    };
  };
  features: {
    enabled: string[];
    limits: {
      accounts: number;
      users: number;
      posts: number;
      storage: number; // GB
      apiCalls: number;
    };
    usage: {
      accounts: number;
      users: number;
      posts: number;
      storage: number;
      apiCalls: number;
    };
  };
  subscription: {
    plan: string;
    status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
    startDate: string;
    endDate?: string;
    autoRenew: boolean;
    billing: {
      amount: number;
      currency: string;
      frequency: 'monthly' | 'yearly';
      nextBilling?: string;
    };
  };
  security: {
    twoFactorRequired: boolean;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
      expiryDays: number;
    };
    ipWhitelist: string[];
    ssoEnabled: boolean;
    auditLogRetention: number; // days
    dataRetention: number; // days
  };
  integrations: Array<{
    name: string;
    type: string;
    status: 'active' | 'inactive' | 'error';
    configuration: Record<string, any>;
    connectedAt: string;
  }>;
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number; // days
    location: string;
    lastBackup?: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    tags: string[];
  };
}

export interface ContentLibrary {
  id: string;
  name: string;
  description: string;
  type: 'images' | 'videos' | 'templates' | 'hashtags' | 'captions' | 'mixed';
  category: 'brand_assets' | 'stock_content' | 'user_generated' | 'seasonal' | 'campaigns' | 'general';
  organization: {
    structure: 'folders' | 'tags' | 'categories' | 'mixed';
    folders: Array<{
      id: string;
      name: string;
      parent?: string;
      items: number;
    }>;
    tags: Array<{
      name: string;
      color: string;
      usage: number;
    }>;
    categories: string[];
  };
  items: Array<{
    id: string;
    name: string;
    type: 'image' | 'video' | 'gif' | 'template' | 'caption' | 'hashtag_set' | 'document';
    url?: string;
    thumbnail?: string;
    fileMetadata: {
      size?: number;
      dimensions?: { width: number; height: number };
      duration?: number; // for videos
      format: string;
      quality?: string;
      license?: string;
      copyright?: string;
      keywords: string[];
    };
    content?: {
      text?: string;
      variables?: string[];
      hashtags?: string[];
    };
    usage: {
      platforms: string[];
      campaigns: string[];
      frequency: number;
      lastUsed?: string;
      performance?: Record<string, number>;
    };
    approval: {
      status: 'approved' | 'pending' | 'rejected';
      approvedBy?: string;
      approvedAt?: string;
      notes?: string;
    };
    versions: Array<{
      version: number;
      url: string;
      changes: string;
      createdAt: string;
      createdBy: string;
    }>;
    location: {
      folder?: string;
      tags: string[];
      categories: string[];
    };
    access: {
      public: boolean;
      teams: string[];
      users: string[];
    };
    analytics: {
      views: number;
      downloads: number;
      uses: number;
      rating?: number;
      feedback: Array<{
        user: string;
        rating: number;
        comment?: string;
        timestamp: string;
      }>;
    };
    metadata: {
      createdBy: string;
      createdAt: string;
      updatedAt: string;
      source: 'upload' | 'generate' | 'import' | 'api';
    };
  }>;
  sharing: {
    public: boolean;
    teams: string[];
    external: Array<{
      email: string;
      permissions: string[];
      expiresAt?: string;
    }>;
  };
  backup: {
    enabled: boolean;
    location: string;
    lastBackup?: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    itemCount: number;
    totalSize: number;
    tags: string[];
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'content_creation' | 'approval' | 'publishing' | 'crisis_management' | 'campaign' | 'onboarding' | 'custom';
  type: 'linear' | 'parallel' | 'conditional' | 'iterative';
  industry: string[];
  complexity: 'simple' | 'medium' | 'complex' | 'enterprise';
  steps: Array<{
    id: string;
    name: string;
    type: 'task' | 'approval' | 'review' | 'automation' | 'notification' | 'delay';
    description: string;
    assignee: {
      type: 'role' | 'user' | 'team' | 'auto';
      value: string;
    };
    duration: {
      estimated: number; // hours
      maximum?: number; // hours
    };
    conditions: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    actions: Array<{
      type: 'create' | 'update' | 'notify' | 'escalate' | 'approve' | 'reject';
      configuration: Record<string, any>;
    }>;
    dependencies: string[]; // step IDs
    parallel: boolean;
  }>;
  variables: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'user' | 'team';
    required: boolean;
    default?: any;
    options?: string[];
    description: string;
  }>;
  notifications: {
    onCreate: boolean;
    onComplete: boolean;
    onDelay: boolean;
    onError: boolean;
    recipients: {
      creator: boolean;
      assignee: boolean;
      manager: boolean;
      custom: string[];
    };
  };
  escalation: {
    enabled: boolean;
    levels: Array<{
      delay: number; // hours
      action: 'notify' | 'reassign' | 'auto_approve' | 'escalate';
      target: string;
    }>;
  };
  analytics: {
    trackPerformance: boolean;
    metrics: string[];
    kpis: Array<{
      name: string;
      target: number;
      unit: string;
    }>;
  };
  usage: {
    instances: number;
    completionRate: number;
    averageTime: number; // hours
    satisfaction: number; // 1-5
    feedback: Array<{
      user: string;
      rating: number;
      comment: string;
      timestamp: string;
    }>;
  };
  customization: {
    editable: boolean;
    allowFork: boolean;
    branching: Array<{
      condition: string;
      branch: string;
      description: string;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    public: boolean;
    featured: boolean;
    tags: string[];
    industry: string[];
  };
}

export interface CrisisManagement {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'resolved' | 'monitoring' | 'escalated' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  type: 'reputation' | 'security' | 'legal' | 'operational' | 'financial' | 'pr' | 'other';
  trigger: {
    source: 'monitoring' | 'manual' | 'alert' | 'external' | 'customer';
    description: string;
    detectedAt: string;
    detectedBy?: string;
    evidence: Array<{
      type: 'post' | 'comment' | 'mention' | 'article' | 'report' | 'screenshot';
      url?: string;
      content?: string;
      platform?: string;
      timestamp: string;
    }>;
  };
  assessment: {
    impact: {
      reach: 'local' | 'regional' | 'national' | 'global';
      audience: string[];
      sentiment: number; // -5 to 5
      volume: number;
      velocity: number; // rate of spread
    };
    risks: Array<{
      type: string;
      probability: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      description: string;
    }>;
    stakeholders: Array<{
      group: string;
      impact: 'low' | 'medium' | 'high';
      communication: 'immediate' | 'urgent' | 'scheduled' | 'none';
    }>;
  };
  response: {
    strategy: 'acknowledge' | 'explain' | 'apologize' | 'correct' | 'defend' | 'ignore' | 'legal';
    timeline: Array<{
      id: string;
      action: string;
      assignee: string;
      deadline: string;
      status: 'pending' | 'in_progress' | 'completed' | 'overdue';
      priority: 'low' | 'medium' | 'high' | 'urgent';
    }>;
    communications: Array<{
      id: string;
      type: 'statement' | 'response' | 'update' | 'apology' | 'correction';
      content: string;
      platforms: string[];
      audience: string[];
      approvedBy: string;
      publishedAt?: string;
      metrics?: {
        reach: number;
        engagement: number;
        sentiment: number;
      };
    }>;
    escalation: {
      level: number;
      criteria: string[];
      contacts: Array<{
        name: string;
        role: string;
        contact: string;
        notified: boolean;
      }>;
    };
  };
  monitoring: {
    keywords: string[];
    platforms: string[];
    alerts: Array<{
      condition: string;
      threshold: number;
      action: string;
      frequency: string;
    }>;
    metrics: {
      mentions: number;
      sentiment: number;
      reach: number;
      engagement: number;
      mediaPickup: number;
    };
    reports: Array<{
      timestamp: string;
      summary: string;
      metrics: Record<string, number>;
      recommendations: string[];
    }>;
  };
  team: {
    lead: string;
    members: Array<{
      userId: string;
      role: 'leader' | 'spokesperson' | 'analyst' | 'legal' | 'support';
      responsibilities: string[];
      availability: 'available' | 'on_call' | 'unavailable';
    }>;
    external: Array<{
      name: string;
      organization: string;
      role: string;
      contact: string;
      engaged: boolean;
    }>;
  };
  documentation: {
    summary: string;
    timeline: Array<{
      timestamp: string;
      event: string;
      details: string;
      source: string;
    }>;
    decisions: Array<{
      decision: string;
      rationale: string;
      alternatives: string[];
      decidedBy: string;
      decidedAt: string;
    }>;
    lessons: Array<{
      lesson: string;
      impact: string;
      prevention: string;
      category: string;
    }>;
  };
  resolution: {
    outcome: string;
    effectiveness: number; // 1-10
    cost: number;
    duration: number; // hours
    reputation: {
      before: number;
      after: number;
      recovery: number; // percentage
    };
    followUp: Array<{
      action: string;
      deadline: string;
      assignee: string;
      status: string;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    category: string;
    tags: string[];
    confidential: boolean;
  };
}

export interface BrandMonitoring {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error' | 'setup';
  configuration: {
    keywords: Array<{
      term: string;
      type: 'brand' | 'product' | 'competitor' | 'industry' | 'campaign';
      weight: number;
      variations: string[];
      exclude: string[];
    }>;
    platforms: Array<{
      platform: string;
      enabled: boolean;
      sources: string[];
      filters: Record<string, any>;
    }>;
    geography: {
      countries: string[];
      regions: string[];
      languages: string[];
    };
    sentiment: {
      trackPositive: boolean;
      trackNegative: boolean;
      trackNeutral: boolean;
      threshold: number; // sentiment score threshold
    };
  };
  analysis: {
    volume: {
      total: number;
      trend: number; // percentage change
      breakdown: Record<string, number>; // by platform, sentiment, etc.
    };
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
      score: number; // -1 to 1
      trend: number;
      drivers: Array<{
        keyword: string;
        sentiment: number;
        volume: number;
      }>;
    };
    reach: {
      total: number;
      unique: number;
      influencers: number;
      potential: number;
      viral: Array<{
        content: string;
        reach: number;
        engagement: number;
        platform: string;
      }>;
    };
    themes: Array<{
      theme: string;
      volume: number;
      sentiment: number;
      keywords: string[];
      trend: 'rising' | 'stable' | 'declining';
    }>;
    influencers: Array<{
      handle: string;
      platform: string;
      followers: number;
      engagement: number;
      mentions: number;
      sentiment: number;
      influence: number;
    }>;
  };
  alerts: Array<{
    id: string;
    type: 'volume' | 'sentiment' | 'viral' | 'crisis' | 'opportunity';
    condition: string;
    threshold: number;
    severity: 'info' | 'warning' | 'critical';
    status: 'active' | 'triggered' | 'resolved';
    recipients: string[];
    lastTriggered?: string;
    frequency: 'real_time' | 'hourly' | 'daily';
  }>;
  reports: Array<{
    id: string;
    type: 'daily' | 'weekly' | 'monthly' | 'incident' | 'campaign';
    period: { start: string; end: string };
    summary: string;
    highlights: string[];
    recommendations: string[];
    generatedAt: string;
  }>;
  competitors: Array<{
    name: string;
    keywords: string[];
    comparison: {
      volume: number;
      sentiment: number;
      reach: number;
      shareOfVoice: number;
    };
    tracking: boolean;
  }>;
  automation: {
    responseTemplates: Array<{
      trigger: string;
      sentiment: string;
      template: string;
      approval: 'none' | 'review' | 'manager';
    }>;
    escalation: Array<{
      condition: string;
      action: 'notify' | 'create_ticket' | 'alert_team' | 'auto_respond';
      target: string;
    }>;
    tagging: {
      enabled: boolean;
      rules: Array<{
        condition: string;
        tags: string[];
      }>;
    };
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    lastAnalysis?: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high';
  };
}

export const socialMediaManagementAPI = {
  /**
   * Add social account
   */
  addAccount: async (
    accountData: Omit<SocialAccount, 'id' | 'metrics' | 'connection' | 'metadata'>
  ): Promise<SocialAccount> => {
    const { data } = await api.post('/social/management/accounts', accountData);
    return data;
  },

  /**
   * Get social accounts
   */
  getAccounts: async (
    filters?: {
      platform?: SocialAccount['platform'];
      status?: SocialAccount['status'];
      accountType?: SocialAccount['accountType'];
      teamMember?: string;
    }
  ): Promise<SocialAccount[]> => {
    const { data } = await api.get('/social/management/accounts', { params: filters });
    return data;
  },

  /**
   * Get account details
   */
  getAccount: async (accountId: string): Promise<SocialAccount> => {
    const { data } = await api.get(`/social/management/accounts/${accountId}`);
    return data;
  },

  /**
   * Update account
   */
  updateAccount: async (
    accountId: string,
    updates: Partial<SocialAccount>
  ): Promise<SocialAccount> => {
    const { data } = await api.put(`/social/management/accounts/${accountId}`, updates);
    return data;
  },

  /**
   * Sync account data
   */
  syncAccount: async (
    accountId: string,
    options?: {
      force?: boolean;
      includeAnalytics?: boolean;
      includeContent?: boolean;
    }
  ): Promise<{
    success: boolean;
    synced: string[];
    errors: string[];
    lastSync: string;
  }> => {
    const { data } = await api.post(`/social/management/accounts/${accountId}/sync`, options);
    return data;
  },

  /**
   * Disconnect account
   */
  disconnectAccount: async (
    accountId: string,
    options?: {
      revokeTokens?: boolean;
      removeData?: boolean;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete(`/social/management/accounts/${accountId}`, {
      params: options,
    });
    return data;
  },

  /**
   * Invite team member
   */
  inviteTeamMember: async (
    inviteData: {
      email: string;
      role: string;
      accounts: string[];
      permissions: Record<string, string[]>;
      message?: string;
    }
  ): Promise<{
    inviteId: string;
    status: 'sent';
    expiresAt: string;
  }> => {
    const { data } = await api.post('/social/management/team/invite', inviteData);
    return data;
  },

  /**
   * Get team members
   */
  getTeamMembers: async (
    filters?: {
      role?: string;
      status?: string;
      accountAccess?: string;
    }
  ): Promise<TeamMember[]> => {
    const { data } = await api.get('/social/management/team', { params: filters });
    return data;
  },

  /**
   * Get team member details
   */
  getTeamMember: async (memberId: string): Promise<TeamMember> => {
    const { data } = await api.get(`/social/management/team/${memberId}`);
    return data;
  },

  /**
   * Update team member
   */
  updateTeamMember: async (
    memberId: string,
    updates: Partial<TeamMember>
  ): Promise<TeamMember> => {
    const { data } = await api.put(`/social/management/team/${memberId}`, updates);
    return data;
  },

  /**
   * Remove team member
   */
  removeTeamMember: async (
    memberId: string,
    options?: {
      transferContent?: string; // user ID to transfer to
      revokeAccess?: boolean;
    }
  ): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/social/management/team/${memberId}`, {
      params: options,
    });
    return data;
  },

  /**
   * Get workspace settings
   */
  getWorkspace: async (): Promise<Workspace> => {
    const { data } = await api.get('/social/management/workspace');
    return data;
  },

  /**
   * Update workspace
   */
  updateWorkspace: async (
    updates: Partial<Workspace>
  ): Promise<Workspace> => {
    const { data } = await api.put('/social/management/workspace', updates);
    return data;
  },

  /**
   * Get workspace usage
   */
  getWorkspaceUsage: async (
    period?: { start: string; end: string }
  ): Promise<{
    current: Workspace['features']['usage'];
    limits: Workspace['features']['limits'];
    trends: Array<{
      date: string;
      usage: Record<string, number>;
    }>;
    projections: {
      accounts: number;
      users: number;
      posts: number;
      storage: number;
    };
  }> => {
    const { data } = await api.get('/social/management/workspace/usage', {
      params: period,
    });
    return data;
  },

  /**
   * Create content library
   */
  createLibrary: async (
    libraryData: Omit<ContentLibrary, 'id' | 'items' | 'metadata'>
  ): Promise<ContentLibrary> => {
    const { data } = await api.post('/social/management/libraries', libraryData);
    return data;
  },

  /**
   * Get content libraries
   */
  getLibraries: async (
    filters?: {
      type?: ContentLibrary['type'];
      category?: ContentLibrary['category'];
      shared?: boolean;
    }
  ): Promise<ContentLibrary[]> => {
    const { data } = await api.get('/social/management/libraries', { params: filters });
    return data;
  },

  /**
   * Upload to library
   */
  uploadToLibrary: async (
    libraryId: string,
    file: File,
    metadata: {
      name?: string;
      tags?: string[];
      folder?: string;
      description?: string;
    }
  ): Promise<ContentLibrary['items'][0]> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const { data } = await api.post(`/social/management/libraries/${libraryId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Search library items
   */
  searchLibrary: async (
    libraryId: string,
    query: {
      text?: string;
      tags?: string[];
      type?: string;
      folder?: string;
      dateRange?: { start: string; end: string };
    }
  ): Promise<ContentLibrary['items']> => {
    const { data } = await api.post(`/social/management/libraries/${libraryId}/search`, query);
    return data;
  },

  /**
   * Create workflow template
   */
  createWorkflowTemplate: async (
    templateData: Omit<WorkflowTemplate, 'id' | 'usage' | 'metadata'>
  ): Promise<WorkflowTemplate> => {
    const { data } = await api.post('/social/management/workflow-templates', templateData);
    return data;
  },

  /**
   * Get workflow templates
   */
  getWorkflowTemplates: async (
    filters?: {
      category?: WorkflowTemplate['category'];
      industry?: string;
      complexity?: WorkflowTemplate['complexity'];
      public?: boolean;
    }
  ): Promise<WorkflowTemplate[]> => {
    const { data } = await api.get('/social/management/workflow-templates', { params: filters });
    return data;
  },

  /**
   * Create workflow instance
   */
  createWorkflowInstance: async (
    templateId: string,
    variables: Record<string, any>,
    options?: {
      name?: string;
      autoStart?: boolean;
      assignees?: Record<string, string>;
    }
  ): Promise<{
    instanceId: string;
    status: 'created' | 'started';
    currentStep?: string;
  }> => {
    const { data } = await api.post(`/social/management/workflow-templates/${templateId}/create`, {
      variables,
      ...options,
    });
    return data;
  },

  /**
   * Get workflow instances
   */
  getWorkflowInstances: async (
    filters?: {
      templateId?: string;
      status?: string;
      assignee?: string;
      createdBy?: string;
    }
  ): Promise<Array<{
    id: string;
    templateId: string;
    templateName: string;
    status: string;
    currentStep?: string;
    progress: number;
    createdAt: string;
    assignee?: string;
  }>> => {
    const { data } = await api.get('/social/management/workflows', { params: filters });
    return data;
  },

  /**
   * Create crisis management plan
   */
  createCrisis: async (
    crisisData: Omit<CrisisManagement, 'id' | 'monitoring' | 'resolution' | 'metadata'>
  ): Promise<CrisisManagement> => {
    const { data } = await api.post('/social/management/crisis', crisisData);
    return data;
  },

  /**
   * Get crisis management cases
   */
  getCrises: async (
    filters?: {
      status?: CrisisManagement['status'];
      severity?: CrisisManagement['severity'];
      type?: CrisisManagement['type'];
      active?: boolean;
    }
  ): Promise<CrisisManagement[]> => {
    const { data } = await api.get('/social/management/crisis', { params: filters });
    return data;
  },

  /**
   * Update crisis status
   */
  updateCrisisStatus: async (
    crisisId: string,
    status: CrisisManagement['status'],
    notes?: string
  ): Promise<CrisisManagement> => {
    const { data } = await api.put(`/social/management/crisis/${crisisId}/status`, {
      status,
      notes,
    });
    return data;
  },

  /**
   * Add crisis communication
   */
  addCrisisCommunication: async (
    crisisId: string,
    communication: {
      type: string;
      content: string;
      platforms: string[];
      audience: string[];
      scheduledFor?: string;
    }
  ): Promise<CrisisManagement> => {
    const { data } = await api.post(`/social/management/crisis/${crisisId}/communications`, communication);
    return data;
  },

  /**
   * Create brand monitoring
   */
  createBrandMonitoring: async (
    monitoringData: Omit<BrandMonitoring, 'id' | 'analysis' | 'reports' | 'metadata'>
  ): Promise<BrandMonitoring> => {
    const { data } = await api.post('/social/management/brand-monitoring', monitoringData);
    return data;
  },

  /**
   * Get brand monitoring setups
   */
  getBrandMonitoring: async (): Promise<BrandMonitoring[]> => {
    const { data } = await api.get('/social/management/brand-monitoring');
    return data;
  },

  /**
   * Get monitoring analysis
   */
  getMonitoringAnalysis: async (
    monitoringId: string,
    timeframe: { start: string; end: string }
  ): Promise<{
    analysis: BrandMonitoring['analysis'];
    insights: Array<{
      type: string;
      priority: string;
      message: string;
      data: Record<string, any>;
      recommendations: string[];
    }>;
    alerts: Array<{
      type: string;
      severity: string;
      message: string;
      triggeredAt: string;
      resolved: boolean;
    }>;
  }> => {
    const { data } = await api.get(`/social/management/brand-monitoring/${monitoringId}/analysis`, {
      params: timeframe,
    });
    return data;
  },

  /**
   * Start monitoring analysis
   */
  startMonitoringAnalysis: async (
    monitoringId: string,
    options?: {
      realTime?: boolean;
      includeHistorical?: boolean;
      depth?: 'basic' | 'standard' | 'comprehensive';
    }
  ): Promise<{
    jobId: string;
    status: 'started';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/social/management/brand-monitoring/${monitoringId}/analyze`, options);
    return data;
  },

  /**
   * Get team activity
   */
  getTeamActivity: async (
    timeframe: { start: string; end: string },
    filters?: {
      members?: string[];
      activities?: string[];
      accounts?: string[];
    }
  ): Promise<{
    summary: {
      totalActivities: number;
      activeMembers: number;
      contentCreated: number;
      contentPublished: number;
      averageResponseTime: number;
    };
    activities: Array<{
      timestamp: string;
      user: string;
      action: string;
      target: string;
      details: Record<string, any>;
    }>;
    productivity: Record<string, {
      activities: number;
      content: number;
      efficiency: number;
      quality: number;
    }>;
  }> => {
    const { data } = await api.get('/social/management/team/activity', {
      params: { ...timeframe, ...filters },
    });
    return data;
  },

  /**
   * Generate team report
   */
  generateTeamReport: async (
    config: {
      type: 'productivity' | 'performance' | 'activity' | 'engagement';
      timeframe: { start: string; end: string };
      members?: string[];
      accounts?: string[];
      format: 'pdf' | 'excel' | 'csv';
    }
  ): Promise<Blob> => {
    const { data } = await api.post('/social/management/team/report', config, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get workspace backup
   */
  createWorkspaceBackup: async (
    options?: {
      includeContent?: boolean;
      includeAnalytics?: boolean;
      includeSettings?: boolean;
      compression?: boolean;
    }
  ): Promise<{
    backupId: string;
    status: 'started';
    estimatedCompletion?: string;
    downloadUrl?: string;
  }> => {
    const { data } = await api.post('/social/management/workspace/backup', options);
    return data;
  },

  /**
   * Restore from backup
   */
  restoreFromBackup: async (
    backupId: string,
    options?: {
      overwrite?: boolean;
      selective?: {
        accounts?: boolean;
        content?: boolean;
        settings?: boolean;
        team?: boolean;
      };
    }
  ): Promise<{
    restoreId: string;
    status: 'started';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post('/social/management/workspace/restore', {
      backupId,
      ...options,
    });
    return data;
  },

  /**
   * Audit workspace
   */
  auditWorkspace: async (): Promise<{
    security: {
      score: number;
      issues: Array<{
        severity: string;
        issue: string;
        recommendation: string;
      }>;
    };
    compliance: {
      gdpr: boolean;
      ccpa: boolean;
      issues: string[];
    };
    performance: {
      score: number;
      bottlenecks: string[];
      recommendations: string[];
    };
    usage: {
      efficiency: number;
      waste: Array<{
        area: string;
        impact: string;
        suggestion: string;
      }>;
    };
  }> => {
    const { data } = await api.get('/social/management/workspace/audit');
    return data;
  },

  /**
   * Bulk operations
   */
  bulkOperation: async (
    operation: 'sync' | 'update' | 'delete' | 'archive',
    targets: {
      type: 'accounts' | 'content' | 'members';
      ids: string[];
    },
    parameters?: Record<string, any>
  ): Promise<{
    jobId: string;
    status: 'queued' | 'processing';
    total: number;
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post('/social/management/bulk', {
      operation,
      targets,
      parameters,
    });
    return data;
  },

  /**
   * Get bulk operation status
   */
  getBulkOperationStatus: async (
    jobId: string
  ): Promise<{
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    processed: number;
    total: number;
    successful: number;
    failed: number;
    errors: Array<{
      id: string;
      error: string;
    }>;
    results?: any;
  }> => {
    const { data } = await api.get(`/social/management/bulk/${jobId}`);
    return data;
  },
};

export default socialMediaManagementAPI;