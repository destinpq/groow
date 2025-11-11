/**
 * Social Sharing API Services
 * Social media integration, content sharing, and viral marketing
 */
import { api } from './client';

export interface SocialPlatform {
  id: string;
  name: string;
  type: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'pinterest' | 'snapchat' | 'whatsapp' | 'telegram' | 'custom';
  status: 'active' | 'inactive' | 'error' | 'pending_auth' | 'rate_limited';
  configuration: {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    appId?: string;
    webhookUrl?: string;
    permissions: string[];
    rateLimit: {
      requests: number;
      window: number; // seconds
      remaining?: number;
      resetTime?: string;
    };
  };
  features: {
    posting: boolean;
    analytics: boolean;
    messaging: boolean;
    stories: boolean;
    liveStreaming: boolean;
    advertising: boolean;
    comments: boolean;
    reactions: boolean;
  };
  account: {
    username: string;
    displayName: string;
    profileImage?: string;
    verified: boolean;
    followers: number;
    following: number;
    accountType: 'personal' | 'business' | 'creator';
  };
  lastSync?: string;
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface SocialPost {
  id: string;
  platformId: string;
  externalId?: string;
  type: 'text' | 'image' | 'video' | 'story' | 'reel' | 'carousel' | 'live' | 'event' | 'poll' | 'link';
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'archived' | 'deleted';
  content: {
    text?: string;
    media: Array<{
      id: string;
      type: 'image' | 'video' | 'gif' | 'document';
      url: string;
      thumbnail?: string;
      duration?: number; // for videos
      size: number; // bytes
      dimensions?: { width: number; height: number };
      altText?: string;
      filters?: string[];
    }>;
    hashtags: string[];
    mentions: Array<{
      username: string;
      displayName: string;
      platform: string;
    }>;
    location?: {
      name: string;
      coordinates?: { lat: number; lng: number };
      address?: string;
    };
    poll?: {
      question: string;
      options: string[];
      duration: number; // hours
      allowMultiple: boolean;
    };
    link?: {
      url: string;
      title: string;
      description: string;
      image?: string;
      domain: string;
    };
  };
  targeting: {
    audience: 'public' | 'friends' | 'followers' | 'custom' | 'private';
    demographics?: {
      ageMin?: number;
      ageMax?: number;
      genders?: string[];
      locations?: string[];
      interests?: string[];
      languages?: string[];
    };
    customAudience?: string[];
    excludeAudience?: string[];
  };
  scheduling: {
    publishAt?: string;
    timezone?: string;
    optimal?: boolean; // use AI to determine best time
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      endDate?: string;
    };
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    reactions: Record<string, number>; // platform-specific reactions
    clickThroughs: number;
    saves: number;
    reach: number;
    impressions: number;
  };
  analytics: {
    engagement: {
      rate: number;
      peak: string; // timestamp of peak engagement
      demographics: Record<string, number>;
    };
    traffic: {
      referrals: number;
      conversions: number;
      revenue: number;
    };
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
      score: number; // -1 to 1
    };
  };
  moderation: {
    reviewed: boolean;
    approved: boolean;
    reviewedBy?: string;
    reviewedAt?: string;
    violations?: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
    }>;
    actions?: Array<{
      type: 'flag' | 'hide' | 'delete' | 'restrict';
      reason: string;
      timestamp: string;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    campaignId?: string;
    tags: string[];
    source: 'manual' | 'scheduled' | 'automated' | 'api' | 'bulk_upload';
  };
}

export interface SocialCampaign {
  id: string;
  name: string;
  description: string;
  type: 'awareness' | 'engagement' | 'conversion' | 'traffic' | 'lead_generation' | 'sales' | 'event_promotion';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  objectives: Array<{
    type: 'reach' | 'engagement' | 'clicks' | 'conversions' | 'revenue' | 'brand_awareness';
    target: number;
    current?: number;
    unit: string;
  }>;
  platforms: string[]; // platform IDs
  content: {
    template?: string;
    variations: Array<{
      id: string;
      content: Partial<SocialPost['content']>;
      platforms: string[];
      weight: number; // for A/B testing
    }>;
    assets: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
      usage: string[];
    }>;
  };
  targeting: {
    global: SocialPost['targeting'];
    platformSpecific: Record<string, SocialPost['targeting']>;
  };
  schedule: {
    startDate: string;
    endDate: string;
    timezone: string;
    frequency: 'once' | 'daily' | 'weekly' | 'custom';
    schedule?: Array<{
      day: string;
      times: string[];
    }>;
    optimal: boolean;
  };
  budget?: {
    total: number;
    daily: number;
    spent: number;
    currency: string;
    allocation: Record<string, number>; // per platform
  };
  tracking: {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent?: string;
    utmTerm?: string;
    pixelIds: string[];
    conversionEvents: string[];
  };
  performance: {
    reach: number;
    impressions: number;
    engagement: number;
    clicks: number;
    conversions: number;
    revenue: number;
    costs: number;
    roi: number;
  };
  posts: string[]; // post IDs
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface SocialComment {
  id: string;
  postId: string;
  platformId: string;
  externalId?: string;
  parentId?: string; // for replies
  author: {
    id: string;
    username: string;
    displayName: string;
    profileImage?: string;
    verified: boolean;
    followerCount?: number;
    influence?: 'low' | 'medium' | 'high' | 'influencer';
  };
  content: {
    text: string;
    mentions: string[];
    hashtags: string[];
    media?: Array<{
      type: string;
      url: string;
    }>;
  };
  engagement: {
    likes: number;
    replies: number;
    reactions: Record<string, number>;
  };
  sentiment: {
    score: number; // -1 to 1
    confidence: number; // 0 to 1
    emotions?: string[];
  };
  moderation: {
    flagged: boolean;
    reasons: string[];
    action?: 'none' | 'hide' | 'delete' | 'restrict';
    reviewedBy?: string;
    reviewedAt?: string;
  };
  response?: {
    replied: boolean;
    replyId?: string;
    responseTime?: number; // minutes
    responseBy?: string;
    responseAt?: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    language?: string;
    location?: string;
    device?: string;
  };
}

export interface SocialInfluencer {
  id: string;
  platforms: Record<string, {
    username: string;
    followerCount: number;
    engagementRate: number;
    verified: boolean;
    accountType: string;
  }>;
  profile: {
    name: string;
    bio: string;
    profileImage: string;
    website?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  demographics: {
    age?: number;
    gender?: string;
    location?: string;
    languages: string[];
  };
  audience: {
    size: number;
    demographics: {
      age: Record<string, number>;
      gender: Record<string, number>;
      location: Record<string, number>;
      interests: Record<string, number>;
    };
    engagement: {
      rate: number;
      peakTimes: string[];
      activeHours: Record<string, number>;
    };
  };
  content: {
    categories: string[];
    averagePostsPerWeek: number;
    contentTypes: Record<string, number>;
    engagement: {
      averageLikes: number;
      averageComments: number;
      averageShares: number;
    };
  };
  collaboration: {
    rates: {
      post: number;
      story: number;
      video: number;
      campaign: number;
    };
    packages: Array<{
      name: string;
      description: string;
      deliverables: string[];
      price: number;
      currency: string;
    }>;
    availability: boolean;
    responseTime: number; // hours
    preferred: {
      niches: string[];
      collaborationTypes: string[];
    };
  };
  metrics: {
    influenceScore: number; // 0-100
    reachScore: number;
    engagementScore: number;
    authenticityScore: number;
    riskScore: number; // 0-100, lower is better
  };
  campaigns: Array<{
    campaignId: string;
    role: 'primary' | 'secondary' | 'ambassador';
    status: string;
    performance: Record<string, number>;
  }>;
  metadata: {
    discoveredAt: string;
    lastUpdated: string;
    verified: boolean;
    tags: string[];
    notes: string;
  };
}

export interface SocialAnalytics {
  id: string;
  type: 'post' | 'campaign' | 'platform' | 'overall' | 'competitor';
  period: {
    start: string;
    end: string;
    timezone: string;
  };
  metrics: {
    reach: {
      total: number;
      unique: number;
      trend: number; // percentage change
      byPlatform: Record<string, number>;
    };
    engagement: {
      total: number;
      rate: number;
      byType: Record<string, number>; // likes, comments, shares, etc.
      byPlatform: Record<string, number>;
      trend: number;
    };
    audience: {
      growth: number;
      demographics: {
        age: Record<string, number>;
        gender: Record<string, number>;
        location: Record<string, number>;
      };
      interests: Record<string, number>;
      devices: Record<string, number>;
    };
    content: {
      topPosts: Array<{
        postId: string;
        platform: string;
        engagement: number;
        reach: number;
      }>;
      contentTypes: Record<string, {
        count: number;
        avgEngagement: number;
      }>;
      hashtags: Record<string, {
        usage: number;
        engagement: number;
      }>;
      optimalTimes: Array<{
        day: string;
        hour: number;
        engagement: number;
      }>;
    };
    traffic: {
      referrals: number;
      conversions: number;
      revenue: number;
      sources: Record<string, number>;
    };
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
      score: number;
      trends: Array<{
        date: string;
        score: number;
      }>;
    };
  };
  insights: Array<{
    type: 'opportunity' | 'warning' | 'trend' | 'recommendation';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    actionable: boolean;
    data?: Record<string, any>;
  }>;
  benchmarks: {
    industry: {
      engagementRate: number;
      followerGrowth: number;
      postFrequency: number;
    };
    competitors: Array<{
      name: string;
      metrics: Record<string, number>;
    }>;
  };
  metadata: {
    generatedAt: string;
    generatedBy: string;
    reportType: 'automated' | 'custom' | 'scheduled';
    confidence: number;
  };
}

export interface SocialRule {
  id: string;
  name: string;
  description: string;
  type: 'auto_post' | 'auto_reply' | 'content_curation' | 'moderation' | 'engagement' | 'monitoring';
  status: 'active' | 'inactive' | 'paused' | 'error';
  platforms: string[];
  triggers: Array<{
    type: 'schedule' | 'keyword' | 'mention' | 'hashtag' | 'engagement_threshold' | 'follower_count' | 'sentiment';
    condition: {
      keywords?: string[];
      hashtags?: string[];
      mentions?: string[];
      threshold?: number;
      operator?: 'gt' | 'lt' | 'eq' | 'contains';
      schedule?: {
        frequency: string;
        time: string;
        timezone: string;
      };
    };
  }>;
  actions: Array<{
    type: 'post' | 'reply' | 'like' | 'share' | 'follow' | 'message' | 'flag' | 'notify';
    configuration: {
      content?: string;
      template?: string;
      delay?: number; // seconds
      target?: string;
      message?: string;
    };
    conditions?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  }>;
  filters: Array<{
    type: 'content' | 'user' | 'engagement' | 'sentiment' | 'language';
    criteria: {
      include?: string[];
      exclude?: string[];
      minValue?: number;
      maxValue?: number;
    };
  }>;
  limits: {
    maxExecutions?: number;
    dailyLimit?: number;
    interval?: number; // seconds between executions
    budget?: number;
  };
  execution: {
    totalRuns: number;
    lastRun?: string;
    nextRun?: string;
    successRate: number;
    averageResponseTime: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export const socialSharingAPI = {
  /**
   * Connect social platform
   */
  connectPlatform: async (
    platformData: Omit<SocialPlatform, 'id' | 'account' | 'lastSync' | 'metadata'>
  ): Promise<SocialPlatform> => {
    const { data } = await api.post('/social/platforms/connect', platformData);
    return data;
  },

  /**
   * Get connected platforms
   */
  getPlatforms: async (
    filters?: {
      type?: SocialPlatform['type'];
      status?: SocialPlatform['status'];
    }
  ): Promise<SocialPlatform[]> => {
    const { data } = await api.get('/social/platforms', { params: filters });
    return data;
  },

  /**
   * Get platform details
   */
  getPlatform: async (platformId: string): Promise<SocialPlatform> => {
    const { data } = await api.get(`/social/platforms/${platformId}`);
    return data;
  },

  /**
   * Update platform configuration
   */
  updatePlatform: async (
    platformId: string,
    updates: Partial<SocialPlatform>
  ): Promise<SocialPlatform> => {
    const { data } = await api.put(`/social/platforms/${platformId}`, updates);
    return data;
  },

  /**
   * Disconnect platform
   */
  disconnectPlatform: async (platformId: string): Promise<void> => {
    await api.delete(`/social/platforms/${platformId}`);
  },

  /**
   * Test platform connection
   */
  testPlatformConnection: async (
    platformId: string
  ): Promise<{
    connected: boolean;
    permissions: string[];
    rateLimit: {
      remaining: number;
      resetTime: string;
    };
    account: SocialPlatform['account'];
    errors: string[];
  }> => {
    const { data } = await api.post(`/social/platforms/${platformId}/test`);
    return data;
  },

  /**
   * Refresh platform tokens
   */
  refreshPlatformTokens: async (platformId: string): Promise<SocialPlatform> => {
    const { data } = await api.post(`/social/platforms/${platformId}/refresh`);
    return data;
  },

  /**
   * Create social post
   */
  createPost: async (
    postData: Omit<SocialPost, 'id' | 'externalId' | 'engagement' | 'analytics' | 'metadata'>
  ): Promise<SocialPost> => {
    const { data } = await api.post('/social/posts', postData);
    return data;
  },

  /**
   * Get social posts
   */
  getPosts: async (
    filters?: {
      platformId?: string;
      status?: SocialPost['status'];
      type?: SocialPost['type'];
      campaignId?: string;
      from?: string;
      to?: string;
      limit?: number;
    }
  ): Promise<SocialPost[]> => {
    const { data } = await api.get('/social/posts', { params: filters });
    return data;
  },

  /**
   * Get post details
   */
  getPost: async (postId: string): Promise<SocialPost> => {
    const { data } = await api.get(`/social/posts/${postId}`);
    return data;
  },

  /**
   * Update post
   */
  updatePost: async (
    postId: string,
    updates: Partial<SocialPost>
  ): Promise<SocialPost> => {
    const { data } = await api.put(`/social/posts/${postId}`, updates);
    return data;
  },

  /**
   * Delete post
   */
  deletePost: async (
    postId: string,
    deletePlatformPost?: boolean
  ): Promise<void> => {
    await api.delete(`/social/posts/${postId}`, {
      params: { deletePlatformPost },
    });
  },

  /**
   * Publish post
   */
  publishPost: async (
    postId: string,
    options?: {
      publishAt?: string;
      platforms?: string[];
    }
  ): Promise<SocialPost> => {
    const { data } = await api.post(`/social/posts/${postId}/publish`, options);
    return data;
  },

  /**
   * Schedule post
   */
  schedulePost: async (
    postId: string,
    scheduleData: {
      publishAt: string;
      timezone?: string;
      platforms?: string[];
    }
  ): Promise<SocialPost> => {
    const { data } = await api.post(`/social/posts/${postId}/schedule`, scheduleData);
    return data;
  },

  /**
   * Duplicate post
   */
  duplicatePost: async (
    postId: string,
    modifications?: Partial<SocialPost>
  ): Promise<SocialPost> => {
    const { data } = await api.post(`/social/posts/${postId}/duplicate`, modifications);
    return data;
  },

  /**
   * Bulk create posts
   */
  bulkCreatePosts: async (
    posts: Array<Omit<SocialPost, 'id' | 'externalId' | 'engagement' | 'analytics' | 'metadata'>>
  ): Promise<{
    success: SocialPost[];
    failed: Array<{
      post: any;
      error: string;
    }>;
  }> => {
    const { data } = await api.post('/social/posts/bulk', { posts });
    return data;
  },

  /**
   * Create social campaign
   */
  createCampaign: async (
    campaignData: Omit<SocialCampaign, 'id' | 'performance' | 'posts' | 'metadata'>
  ): Promise<SocialCampaign> => {
    const { data } = await api.post('/social/campaigns', campaignData);
    return data;
  },

  /**
   * Get campaigns
   */
  getCampaigns: async (
    filters?: {
      status?: SocialCampaign['status'];
      type?: SocialCampaign['type'];
      platform?: string;
    }
  ): Promise<SocialCampaign[]> => {
    const { data } = await api.get('/social/campaigns', { params: filters });
    return data;
  },

  /**
   * Get campaign details
   */
  getCampaign: async (campaignId: string): Promise<SocialCampaign> => {
    const { data } = await api.get(`/social/campaigns/${campaignId}`);
    return data;
  },

  /**
   * Update campaign
   */
  updateCampaign: async (
    campaignId: string,
    updates: Partial<SocialCampaign>
  ): Promise<SocialCampaign> => {
    const { data } = await api.put(`/social/campaigns/${campaignId}`, updates);
    return data;
  },

  /**
   * Launch campaign
   */
  launchCampaign: async (campaignId: string): Promise<SocialCampaign> => {
    const { data } = await api.post(`/social/campaigns/${campaignId}/launch`);
    return data;
  },

  /**
   * Pause campaign
   */
  pauseCampaign: async (campaignId: string): Promise<SocialCampaign> => {
    const { data } = await api.post(`/social/campaigns/${campaignId}/pause`);
    return data;
  },

  /**
   * Get campaign performance
   */
  getCampaignPerformance: async (
    campaignId: string,
    timeframe?: { start: string; end: string }
  ): Promise<{
    metrics: SocialCampaign['performance'];
    trends: Array<{
      date: string;
      metrics: Record<string, number>;
    }>;
    breakdown: {
      byPlatform: Record<string, SocialCampaign['performance']>;
      byContent: Record<string, SocialCampaign['performance']>;
    };
  }> => {
    const { data } = await api.get(`/social/campaigns/${campaignId}/performance`, {
      params: timeframe,
    });
    return data;
  },

  /**
   * Get post comments
   */
  getComments: async (
    postId: string,
    filters?: {
      sentiment?: 'positive' | 'negative' | 'neutral';
      flagged?: boolean;
      replied?: boolean;
    }
  ): Promise<SocialComment[]> => {
    const { data } = await api.get(`/social/posts/${postId}/comments`, {
      params: filters,
    });
    return data;
  },

  /**
   * Reply to comment
   */
  replyToComment: async (
    commentId: string,
    reply: string
  ): Promise<SocialComment> => {
    const { data } = await api.post(`/social/comments/${commentId}/reply`, { reply });
    return data;
  },

  /**
   * Moderate comment
   */
  moderateComment: async (
    commentId: string,
    action: 'approve' | 'hide' | 'delete' | 'flag'
  ): Promise<SocialComment> => {
    const { data } = await api.post(`/social/comments/${commentId}/moderate`, { action });
    return data;
  },

  /**
   * Get influencers
   */
  getInfluencers: async (
    filters?: {
      platform?: string;
      category?: string;
      minFollowers?: number;
      maxFollowers?: number;
      minEngagement?: number;
      location?: string;
    }
  ): Promise<SocialInfluencer[]> => {
    const { data } = await api.get('/social/influencers', { params: filters });
    return data;
  },

  /**
   * Get influencer details
   */
  getInfluencer: async (influencerId: string): Promise<SocialInfluencer> => {
    const { data } = await api.get(`/social/influencers/${influencerId}`);
    return data;
  },

  /**
   * Search influencers
   */
  searchInfluencers: async (
    criteria: {
      keywords: string[];
      platforms: string[];
      demographics?: Record<string, any>;
      engagement?: { min: number; max: number };
      followers?: { min: number; max: number };
    }
  ): Promise<SocialInfluencer[]> => {
    const { data } = await api.post('/social/influencers/search', criteria);
    return data;
  },

  /**
   * Get analytics
   */
  getAnalytics: async (
    type: SocialAnalytics['type'],
    period: SocialAnalytics['period'],
    filters?: {
      platforms?: string[];
      campaigns?: string[];
      posts?: string[];
    }
  ): Promise<SocialAnalytics> => {
    const { data } = await api.post('/social/analytics', {
      type,
      period,
      filters,
    });
    return data;
  },

  /**
   * Create automation rule
   */
  createRule: async (
    ruleData: Omit<SocialRule, 'id' | 'execution' | 'metadata'>
  ): Promise<SocialRule> => {
    const { data } = await api.post('/social/rules', ruleData);
    return data;
  },

  /**
   * Get automation rules
   */
  getRules: async (
    filters?: {
      type?: SocialRule['type'];
      status?: SocialRule['status'];
      platform?: string;
    }
  ): Promise<SocialRule[]> => {
    const { data } = await api.get('/social/rules', { params: filters });
    return data;
  },

  /**
   * Update rule
   */
  updateRule: async (
    ruleId: string,
    updates: Partial<SocialRule>
  ): Promise<SocialRule> => {
    const { data } = await api.put(`/social/rules/${ruleId}`, updates);
    return data;
  },

  /**
   * Toggle rule
   */
  toggleRule: async (
    ruleId: string,
    enabled: boolean
  ): Promise<SocialRule> => {
    const { data } = await api.put(`/social/rules/${ruleId}/toggle`, { enabled });
    return data;
  },

  /**
   * Test rule
   */
  testRule: async (
    ruleId: string,
    testData?: any
  ): Promise<{
    triggered: boolean;
    actions: Array<{
      type: string;
      success: boolean;
      result: any;
    }>;
    logs: string[];
  }> => {
    const { data } = await api.post(`/social/rules/${ruleId}/test`, testData);
    return data;
  },

  /**
   * Upload media
   */
  uploadMedia: async (
    file: File,
    options?: {
      altText?: string;
      tags?: string[];
      optimization?: {
        resize?: boolean;
        quality?: number;
        format?: string;
      };
    }
  ): Promise<{
    id: string;
    url: string;
    type: string;
    size: number;
    dimensions?: { width: number; height: number };
    duration?: number;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const { data } = await api.post('/social/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Generate content suggestions
   */
  generateContentSuggestions: async (
    criteria: {
      platforms: string[];
      topics: string[];
      audience?: string;
      style?: string;
      count?: number;
    }
  ): Promise<Array<{
    type: string;
    title: string;
    content: string;
    hashtags: string[];
    media?: string[];
    platform: string;
    score: number;
  }>> => {
    const { data } = await api.post('/social/content/suggestions', criteria);
    return data;
  },

  /**
   * Get optimal posting times
   */
  getOptimalTimes: async (
    platformId: string,
    timeframe?: { start: string; end: string }
  ): Promise<Array<{
    day: string;
    hour: number;
    engagement: number;
    confidence: number;
  }>> => {
    const { data } = await api.get(`/social/platforms/${platformId}/optimal-times`, {
      params: timeframe,
    });
    return data;
  },

  /**
   * Export analytics report
   */
  exportAnalytics: async (
    config: {
      type: string;
      period: { start: string; end: string };
      format: 'pdf' | 'excel' | 'csv';
      sections: string[];
    }
  ): Promise<Blob> => {
    const { data } = await api.post('/social/analytics/export', config, {
      responseType: 'blob',
    });
    return data;
  },
};

export default socialSharingAPI;