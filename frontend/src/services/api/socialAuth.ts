/**
 * Social Authentication API Services
 * OAuth integration, social login, and user profile synchronization
 */
import { api } from './client';

export interface SocialProvider {
  id: string;
  name: string;
  type: 'facebook' | 'google' | 'twitter' | 'linkedin' | 'github' | 'apple' | 'discord' | 'tiktok' | 'instagram' | 'snapchat' | 'custom';
  status: 'active' | 'inactive' | 'error' | 'maintenance' | 'rate_limited';
  configuration: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope: string[];
    authUrl: string;
    tokenUrl: string;
    userInfoUrl: string;
    revokeUrl?: string;
    apiVersion?: string;
    sandbox: boolean;
  };
  mapping: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    username?: string;
    bio?: string;
    verified?: string;
    customFields: Record<string, string>;
  };
  settings: {
    autoRegister: boolean;
    autoLogin: boolean;
    linkExisting: boolean;
    updateProfile: boolean;
    importContacts: boolean;
    postPermissions: boolean;
    emailVerificationRequired: boolean;
    roleMapping: Record<string, string>;
  };
  security: {
    useStateParameter: boolean;
    usePKCE: boolean;
    validateEmail: boolean;
    allowedDomains: string[];
    blockedDomains: string[];
    requireVerifiedAccount: boolean;
    sessionTimeout: number; // minutes
  };
  branding: {
    buttonText: string;
    buttonColor: string;
    buttonIcon: string;
    displayOrder: number;
    visible: boolean;
    customCss?: string;
  };
  statistics: {
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    registrations: number;
    lastUsed?: string;
    averageResponseTime: number; // milliseconds
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    tags: string[];
  };
}

export interface SocialUser {
  id: string;
  userId: string; // Internal user ID
  providerId: string;
  externalId: string;
  username?: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    profileImage: string;
    coverImage?: string;
    bio?: string;
    website?: string;
    location?: string;
    birthDate?: string;
    gender?: string;
    language?: string;
    timezone?: string;
    verified: boolean;
  };
  social: {
    followers?: number;
    following?: number;
    posts?: number;
    likes?: number;
    connections?: number;
    influence?: 'low' | 'medium' | 'high' | 'celebrity';
  };
  permissions: {
    email: boolean;
    profile: boolean;
    friends: boolean;
    posts: boolean;
    photos: boolean;
    videos: boolean;
    pages: boolean;
    events: boolean;
    groups: boolean;
    messaging: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresAt?: string;
    scope: string[];
    lastRefreshed?: string;
  };
  sync: {
    lastSync?: string;
    syncStatus: 'pending' | 'syncing' | 'completed' | 'failed' | 'disabled';
    syncFields: string[];
    autoSync: boolean;
    syncFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'manual';
  };
  activity: {
    firstLogin: string;
    lastLogin: string;
    loginCount: number;
    lastActivity?: string;
    deviceInfo?: {
      type: string;
      browser: string;
      os: string;
      location: string;
    };
  };
  privacy: {
    shareProfile: boolean;
    shareEmail: boolean;
    shareActivity: boolean;
    allowMessaging: boolean;
    allowTagging: boolean;
    visibilityLevel: 'public' | 'friends' | 'private';
  };
  metadata: {
    linkedAt: string;
    updatedAt: string;
    source: 'registration' | 'login' | 'linking' | 'import';
    notes?: string;
    tags: string[];
  };
}

export interface SocialSession {
  id: string;
  userId: string;
  providerId: string;
  sessionToken: string;
  type: 'login' | 'registration' | 'linking' | 'refresh';
  status: 'active' | 'expired' | 'revoked' | 'pending';
  authentication: {
    method: 'oauth2' | 'openid' | 'saml' | 'custom';
    state: string;
    codeVerifier?: string;
    nonce?: string;
    authCode?: string;
    redirectUri: string;
  };
  tokens: {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    tokenType: string;
    expiresIn?: number;
    scope: string[];
  };
  user: {
    externalId: string;
    email: string;
    profile: Record<string, any>;
    permissions: string[];
    isNewUser: boolean;
  };
  security: {
    ipAddress: string;
    userAgent: string;
    deviceFingerprint?: string;
    riskScore: number; // 0-100
    geoLocation?: {
      country: string;
      city: string;
      coordinates?: { lat: number; lng: number };
    };
  };
  flow: {
    startedAt: string;
    completedAt?: string;
    duration?: number; // seconds
    steps: Array<{
      step: string;
      timestamp: string;
      duration: number;
      success: boolean;
      error?: string;
    }>;
  };
  metadata: {
    createdAt: string;
    expiresAt: string;
    lastActivity?: string;
    sessionData?: Record<string, any>;
  };
}

export interface SocialConnection {
  id: string;
  userId: string;
  providerId: string;
  connectionType: 'friend' | 'follower' | 'following' | 'contact' | 'colleague' | 'family';
  externalId: string;
  profile: {
    name: string;
    username?: string;
    profileImage?: string;
    verified: boolean;
  };
  relationship: {
    status: 'connected' | 'pending' | 'blocked' | 'removed';
    mutualFriends?: number;
    connectionDate: string;
    source: 'imported' | 'suggested' | 'manual' | 'mutual';
  };
  permissions: {
    canMessage: boolean;
    canTag: boolean;
    canSeeProfile: boolean;
    canSeeActivity: boolean;
    notificationsEnabled: boolean;
  };
  interaction: {
    lastInteraction?: string;
    interactionCount: number;
    commonInterests: string[];
    sharedConnections: number;
  };
  sync: {
    syncEnabled: boolean;
    lastSync?: string;
    syncFrequency: 'real_time' | 'daily' | 'weekly' | 'manual';
  };
  metadata: {
    importedAt: string;
    updatedAt: string;
    tags: string[];
    notes?: string;
  };
}

export interface SocialGroup {
  id: string;
  name: string;
  description: string;
  type: 'imported' | 'custom' | 'dynamic' | 'campaign';
  provider?: string;
  externalId?: string;
  members: Array<{
    userId: string;
    connectionId?: string;
    role: 'admin' | 'moderator' | 'member';
    status: 'active' | 'pending' | 'removed';
    addedAt: string;
    addedBy: string;
  }>;
  criteria?: {
    providers: string[];
    demographics: Record<string, any>;
    interests: string[];
    activity: Record<string, any>;
    customRules: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  settings: {
    visibility: 'public' | 'private' | 'members_only';
    allowInvites: boolean;
    autoApprove: boolean;
    requireEmail: boolean;
    maxMembers?: number;
  };
  activity: {
    memberCount: number;
    activeMembers: number;
    recentActivity: string;
    engagementRate: number;
    growthRate: number;
  };
  sync: {
    autoSync: boolean;
    syncFrequency: 'real_time' | 'hourly' | 'daily';
    lastSync?: string;
    syncedMembers: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface SocialIntegration {
  id: string;
  name: string;
  type: 'webhook' | 'api_sync' | 'data_export' | 'real_time' | 'batch_import';
  status: 'active' | 'paused' | 'error' | 'configuring';
  providers: string[];
  configuration: {
    webhook?: {
      url: string;
      events: string[];
      secret?: string;
      retryPolicy: {
        maxRetries: number;
        backoffStrategy: 'linear' | 'exponential';
        initialDelay: number;
      };
    };
    sync?: {
      direction: 'inbound' | 'outbound' | 'bidirectional';
      frequency: string;
      batchSize: number;
      fields: string[];
      filters: Record<string, any>;
    };
    export?: {
      format: 'json' | 'csv' | 'xml';
      compression: boolean;
      encryption: boolean;
      destination: string;
      schedule: string;
    };
  };
  mapping: {
    fieldMappings: Record<string, string>;
    transformations: Array<{
      source: string;
      target: string;
      transformation: string;
    }>;
    defaults: Record<string, any>;
  };
  security: {
    encryption: boolean;
    authentication: {
      type: 'api_key' | 'oauth2' | 'jwt' | 'hmac';
      credentials: Record<string, string>;
    };
    ipWhitelist: string[];
    dataRetention: number; // days
  };
  monitoring: {
    enabled: boolean;
    metrics: string[];
    alerts: Array<{
      condition: string;
      threshold: number;
      recipients: string[];
    }>;
  };
  statistics: {
    totalEvents: number;
    successfulEvents: number;
    failedEvents: number;
    lastEvent?: string;
    averageLatency: number;
    dataVolume: number; // bytes
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface SocialAuditLog {
  id: string;
  userId?: string;
  providerId?: string;
  action: 'login' | 'logout' | 'register' | 'link' | 'unlink' | 'sync' | 'permission_change' | 'profile_update' | 'token_refresh' | 'error';
  details: {
    description: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
    sessionId?: string;
    duration?: number;
    success: boolean;
    errorCode?: string;
    errorMessage?: string;
  };
  data: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    changes?: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }>;
    metadata?: Record<string, any>;
  };
  security: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    anomalyDetected: boolean;
    flagged: boolean;
    reviewed: boolean;
    reviewedBy?: string;
    reviewedAt?: string;
  };
  context: {
    source: 'web' | 'mobile' | 'api' | 'system';
    referrer?: string;
    campaign?: string;
    correlationId?: string;
  };
  metadata: {
    timestamp: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    category: string;
    tags: string[];
  };
}

export const socialAuthAPI = {
  /**
   * Configure social provider
   */
  configureProvider: async (
    providerData: Omit<SocialProvider, 'id' | 'statistics' | 'metadata'>
  ): Promise<SocialProvider> => {
    const { data } = await api.post('/social/auth/providers', providerData);
    return data;
  },

  /**
   * Get social providers
   */
  getProviders: async (
    filters?: {
      type?: SocialProvider['type'];
      status?: SocialProvider['status'];
      active?: boolean;
    }
  ): Promise<SocialProvider[]> => {
    const { data } = await api.get('/social/auth/providers', { params: filters });
    return data;
  },

  /**
   * Get provider details
   */
  getProvider: async (providerId: string): Promise<SocialProvider> => {
    const { data } = await api.get(`/social/auth/providers/${providerId}`);
    return data;
  },

  /**
   * Update provider configuration
   */
  updateProvider: async (
    providerId: string,
    updates: Partial<SocialProvider>
  ): Promise<SocialProvider> => {
    const { data } = await api.put(`/social/auth/providers/${providerId}`, updates);
    return data;
  },

  /**
   * Test provider configuration
   */
  testProvider: async (
    providerId: string
  ): Promise<{
    success: boolean;
    configuration: {
      authUrl: boolean;
      tokenUrl: boolean;
      userInfoUrl: boolean;
      clientCredentials: boolean;
    };
    responseTime: number;
    errors: string[];
    warnings: string[];
  }> => {
    const { data } = await api.post(`/social/auth/providers/${providerId}/test`);
    return data;
  },

  /**
   * Generate auth URL
   */
  generateAuthUrl: async (
    providerId: string,
    options?: {
      redirectUri?: string;
      scope?: string[];
      state?: string;
      prompt?: string;
    }
  ): Promise<{
    authUrl: string;
    state: string;
    codeVerifier?: string;
    nonce?: string;
  }> => {
    const { data } = await api.post(`/social/auth/providers/${providerId}/auth-url`, options);
    return data;
  },

  /**
   * Handle OAuth callback
   */
  handleCallback: async (
    providerId: string,
    callbackData: {
      code: string;
      state: string;
      codeVerifier?: string;
    }
  ): Promise<{
    success: boolean;
    session: SocialSession;
    user: SocialUser;
    isNewUser: boolean;
    tokens: {
      accessToken: string;
      refreshToken?: string;
      expiresIn?: number;
    };
  }> => {
    const { data } = await api.post(`/social/auth/providers/${providerId}/callback`, callbackData);
    return data;
  },

  /**
   * Login with social provider
   */
  socialLogin: async (
    providerId: string,
    options?: {
      rememberMe?: boolean;
      linkExisting?: boolean;
      deviceInfo?: Record<string, string>;
    }
  ): Promise<{
    authUrl: string;
    sessionId: string;
    state: string;
  }> => {
    const { data } = await api.post('/social/auth/login', {
      providerId,
      ...options,
    });
    return data;
  },

  /**
   * Register with social provider
   */
  socialRegister: async (
    providerId: string,
    additionalData?: {
      acceptTerms: boolean;
      newsletter?: boolean;
      referralCode?: string;
    }
  ): Promise<{
    authUrl: string;
    sessionId: string;
    state: string;
  }> => {
    const { data } = await api.post('/social/auth/register', {
      providerId,
      ...additionalData,
    });
    return data;
  },

  /**
   * Link social account
   */
  linkAccount: async (
    providerId: string,
    userId: string
  ): Promise<{
    authUrl: string;
    sessionId: string;
    state: string;
  }> => {
    const { data } = await api.post('/social/auth/link', {
      providerId,
      userId,
    });
    return data;
  },

  /**
   * Unlink social account
   */
  unlinkAccount: async (
    userId: string,
    providerId: string,
    options?: {
      revokeTokens?: boolean;
      deleteData?: boolean;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete(`/social/auth/users/${userId}/providers/${providerId}`, {
      params: options,
    });
    return data;
  },

  /**
   * Get user's social accounts
   */
  getUserSocialAccounts: async (userId: string): Promise<SocialUser[]> => {
    const { data } = await api.get(`/social/auth/users/${userId}/accounts`);
    return data;
  },

  /**
   * Get social user details
   */
  getSocialUser: async (
    userId: string,
    providerId: string
  ): Promise<SocialUser> => {
    const { data } = await api.get(`/social/auth/users/${userId}/providers/${providerId}`);
    return data;
  },

  /**
   * Update social user profile
   */
  updateSocialUser: async (
    userId: string,
    providerId: string,
    updates: Partial<SocialUser>
  ): Promise<SocialUser> => {
    const { data } = await api.put(`/social/auth/users/${userId}/providers/${providerId}`, updates);
    return data;
  },

  /**
   * Sync user profile
   */
  syncUserProfile: async (
    userId: string,
    providerId: string,
    options?: {
      force?: boolean;
      fields?: string[];
    }
  ): Promise<{
    success: boolean;
    synced: string[];
    skipped: string[];
    errors: string[];
    profile: SocialUser['profile'];
  }> => {
    const { data } = await api.post(`/social/auth/users/${userId}/providers/${providerId}/sync`, options);
    return data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (
    userId: string,
    providerId: string
  ): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    scope: string[];
  }> => {
    const { data } = await api.post(`/social/auth/users/${userId}/providers/${providerId}/refresh`);
    return data;
  },

  /**
   * Revoke access token
   */
  revokeToken: async (
    userId: string,
    providerId: string
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.post(`/social/auth/users/${userId}/providers/${providerId}/revoke`);
    return data;
  },

  /**
   * Get user sessions
   */
  getUserSessions: async (
    userId: string,
    filters?: {
      providerId?: string;
      status?: SocialSession['status'];
      active?: boolean;
    }
  ): Promise<SocialSession[]> => {
    const { data } = await api.get(`/social/auth/users/${userId}/sessions`, {
      params: filters,
    });
    return data;
  },

  /**
   * Get session details
   */
  getSession: async (sessionId: string): Promise<SocialSession> => {
    const { data } = await api.get(`/social/auth/sessions/${sessionId}`);
    return data;
  },

  /**
   * Revoke session
   */
  revokeSession: async (sessionId: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/social/auth/sessions/${sessionId}`);
    return data;
  },

  /**
   * Import contacts
   */
  importContacts: async (
    userId: string,
    providerId: string,
    options?: {
      limit?: number;
      includeEmails?: boolean;
      includePhones?: boolean;
      createUsers?: boolean;
    }
  ): Promise<{
    imported: SocialConnection[];
    skipped: number;
    errors: Array<{
      contact: any;
      error: string;
    }>;
    summary: {
      total: number;
      new: number;
      existing: number;
      failed: number;
    };
  }> => {
    const { data } = await api.post(`/social/auth/users/${userId}/providers/${providerId}/import-contacts`, options);
    return data;
  },

  /**
   * Get user connections
   */
  getUserConnections: async (
    userId: string,
    filters?: {
      providerId?: string;
      connectionType?: SocialConnection['connectionType'];
      status?: string;
    }
  ): Promise<SocialConnection[]> => {
    const { data } = await api.get(`/social/auth/users/${userId}/connections`, {
      params: filters,
    });
    return data;
  },

  /**
   * Update connection
   */
  updateConnection: async (
    connectionId: string,
    updates: Partial<SocialConnection>
  ): Promise<SocialConnection> => {
    const { data } = await api.put(`/social/auth/connections/${connectionId}`, updates);
    return data;
  },

  /**
   * Remove connection
   */
  removeConnection: async (connectionId: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/social/auth/connections/${connectionId}`);
    return data;
  },

  /**
   * Create user group
   */
  createGroup: async (
    groupData: Omit<SocialGroup, 'id' | 'activity' | 'sync' | 'metadata'>
  ): Promise<SocialGroup> => {
    const { data } = await api.post('/social/auth/groups', groupData);
    return data;
  },

  /**
   * Get user groups
   */
  getGroups: async (
    filters?: {
      type?: SocialGroup['type'];
      provider?: string;
      userId?: string;
    }
  ): Promise<SocialGroup[]> => {
    const { data } = await api.get('/social/auth/groups', { params: filters });
    return data;
  },

  /**
   * Update group
   */
  updateGroup: async (
    groupId: string,
    updates: Partial<SocialGroup>
  ): Promise<SocialGroup> => {
    const { data } = await api.put(`/social/auth/groups/${groupId}`, updates);
    return data;
  },

  /**
   * Add members to group
   */
  addGroupMembers: async (
    groupId: string,
    members: Array<{
      userId: string;
      role?: string;
    }>
  ): Promise<{
    added: number;
    skipped: number;
    errors: Array<{
      userId: string;
      error: string;
    }>;
  }> => {
    const { data } = await api.post(`/social/auth/groups/${groupId}/members`, { members });
    return data;
  },

  /**
   * Remove group member
   */
  removeGroupMember: async (
    groupId: string,
    userId: string
  ): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/social/auth/groups/${groupId}/members/${userId}`);
    return data;
  },

  /**
   * Create integration
   */
  createIntegration: async (
    integrationData: Omit<SocialIntegration, 'id' | 'statistics' | 'metadata'>
  ): Promise<SocialIntegration> => {
    const { data } = await api.post('/social/auth/integrations', integrationData);
    return data;
  },

  /**
   * Get integrations
   */
  getIntegrations: async (
    filters?: {
      type?: SocialIntegration['type'];
      status?: SocialIntegration['status'];
    }
  ): Promise<SocialIntegration[]> => {
    const { data } = await api.get('/social/auth/integrations', { params: filters });
    return data;
  },

  /**
   * Test integration
   */
  testIntegration: async (
    integrationId: string
  ): Promise<{
    success: boolean;
    results: Array<{
      test: string;
      passed: boolean;
      message?: string;
    }>;
    performance: {
      responseTime: number;
      throughput: number;
    };
  }> => {
    const { data } = await api.post(`/social/auth/integrations/${integrationId}/test`);
    return data;
  },

  /**
   * Get audit logs
   */
  getAuditLogs: async (
    filters?: {
      userId?: string;
      providerId?: string;
      action?: SocialAuditLog['action'];
      from?: string;
      to?: string;
      riskLevel?: string;
      limit?: number;
    }
  ): Promise<SocialAuditLog[]> => {
    const { data } = await api.get('/social/auth/audit-logs', { params: filters });
    return data;
  },

  /**
   * Get authentication analytics
   */
  getAnalytics: async (
    timeRange: { start: string; end: string },
    filters?: {
      providers?: string[];
      actions?: string[];
    }
  ): Promise<{
    summary: {
      totalLogins: number;
      uniqueUsers: number;
      newRegistrations: number;
      successRate: number;
      averageSessionDuration: number;
    };
    providers: Array<{
      providerId: string;
      name: string;
      logins: number;
      registrations: number;
      successRate: number;
      averageResponseTime: number;
    }>;
    trends: Array<{
      date: string;
      logins: number;
      registrations: number;
      errors: number;
    }>;
    demographics: {
      countries: Record<string, number>;
      devices: Record<string, number>;
      browsers: Record<string, number>;
    };
    security: {
      riskEvents: number;
      blockedAttempts: number;
      anomalies: number;
    };
  }> => {
    const { data } = await api.get('/social/auth/analytics', {
      params: { ...timeRange, ...filters },
    });
    return data;
  },

  /**
   * Bulk import users
   */
  bulkImportUsers: async (
    providerId: string,
    importConfig: {
      source: 'csv' | 'api' | 'database';
      mapping: Record<string, string>;
      options: {
        createUsers: boolean;
        updateExisting: boolean;
        sendInvitations: boolean;
        batchSize?: number;
      };
    }
  ): Promise<{
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/social/auth/providers/${providerId}/bulk-import`, importConfig);
    return data;
  },

  /**
   * Export user data
   */
  exportUserData: async (
    filters: {
      providers?: string[];
      userIds?: string[];
      format: 'json' | 'csv' | 'excel';
      fields?: string[];
    }
  ): Promise<Blob> => {
    const { data } = await api.post('/social/auth/export', filters, {
      responseType: 'blob',
    });
    return data;
  },
};

export default socialAuthAPI;