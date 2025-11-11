/**
 * Authentication API Services
 * Comprehensive user authentication, multi-factor authentication, and session management
 */
import { api } from './client';

export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    avatar?: string;
    bio?: string;
    website?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    location?: {
      country: string;
      state?: string;
      city?: string;
      timezone: string;
    };
    preferences: {
      language: string;
      theme: 'light' | 'dark' | 'auto';
      notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        marketing: boolean;
      };
      privacy: {
        profileVisibility: 'public' | 'private' | 'friends';
        activityVisibility: 'public' | 'private' | 'friends';
        searchable: boolean;
        indexable: boolean;
      };
    };
    customFields: Record<string, any>;
  };
  status: 'active' | 'inactive' | 'suspended' | 'pending' | 'deleted';
  verification: {
    email: {
      verified: boolean;
      verifiedAt?: string;
      token?: string;
      expiresAt?: string;
    };
    phone: {
      verified: boolean;
      verifiedAt?: string;
      token?: string;
      expiresAt?: string;
    };
    identity: {
      verified: boolean;
      verifiedAt?: string;
      level: 'basic' | 'standard' | 'premium' | 'enterprise';
      documents?: Array<{
        type: string;
        status: 'pending' | 'approved' | 'rejected';
        uploadedAt: string;
      }>;
    };
  };
  security: {
    mfaEnabled: boolean;
    mfaMethods: Array<{
      type: 'totp' | 'sms' | 'email' | 'backup' | 'hardware' | 'biometric';
      enabled: boolean;
      primary: boolean;
      configuredAt?: string;
      lastUsed?: string;
      backupCodes?: string[];
    }>;
    passwordPolicy: {
      lastChanged: string;
      mustChange: boolean;
      changeReason?: string;
      strength: 'weak' | 'medium' | 'strong' | 'very_strong';
    };
    loginRestrictions: {
      ipWhitelist?: string[];
      ipBlacklist?: string[];
      geoRestrictions?: {
        allowed: string[];
        blocked: string[];
      };
      timeRestrictions?: {
        allowedHours: { start: string; end: string };
        timezone: string;
        daysOfWeek: number[];
      };
    };
    securityQuestions?: Array<{
      question: string;
      answered: boolean;
      setAt: string;
    }>;
  };
  permissions: {
    roles: Array<{
      id: string;
      name: string;
      type: 'system' | 'custom';
      permissions: string[];
      assignedAt: string;
      assignedBy: string;
      expiresAt?: string;
    }>;
    directPermissions: string[];
    effectivePermissions: string[];
    restrictions: Array<{
      resource: string;
      action: string;
      condition?: Record<string, any>;
    }>;
  };
  session: {
    current?: {
      id: string;
      deviceInfo: DeviceInfo;
      ipAddress: string;
      location?: string;
      loginAt: string;
      lastActivity: string;
      expiresAt: string;
    };
    history: Array<{
      id: string;
      deviceInfo: DeviceInfo;
      ipAddress: string;
      location?: string;
      loginAt: string;
      logoutAt?: string;
      duration: number;
      logoutReason?: 'manual' | 'timeout' | 'security' | 'admin';
    }>;
  };
  metadata: {
    createdAt: string;
    createdBy?: string;
    updatedAt: string;
    lastLogin?: string;
    loginCount: number;
    registrationSource: 'web' | 'mobile' | 'api' | 'social' | 'invite' | 'admin';
    tags: string[];
    notes?: string;
  };
}

export interface DeviceInfo {
  deviceId: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'tv' | 'watch' | 'other';
  os: {
    name: string;
    version: string;
    architecture?: string;
  };
  browser: {
    name: string;
    version: string;
    engine?: string;
  };
  screen?: {
    width: number;
    height: number;
    colorDepth: number;
  };
  capabilities: {
    touchscreen: boolean;
    geolocation: boolean;
    camera: boolean;
    microphone: boolean;
    biometric: boolean;
  };
  trusted: boolean;
  fingerprint: string;
  registeredAt: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  authentication: {
    method: 'password' | 'social' | 'saml' | 'ldap' | 'api_key' | 'magic_link' | 'biometric';
    provider?: string;
    mfaCompleted: boolean;
    mfaMethods: string[];
    riskScore: number; // 0-100
    trustScore: number; // 0-100
  };
  location: {
    ipAddress: string;
    country?: string;
    region?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    isp?: string;
    vpn: boolean;
    proxy: boolean;
  };
  timing: {
    createdAt: string;
    loginAt: string;
    lastActivity: string;
    expiresAt: string;
    idleTimeout: number; // seconds
    absoluteTimeout: number; // seconds
  };
  security: {
    encrypted: boolean;
    tokenType: 'jwt' | 'opaque' | 'hybrid';
    refreshToken?: {
      enabled: boolean;
      expiresAt?: string;
      rotated: boolean;
    };
    csrfToken?: string;
    securityHeaders: Record<string, string>;
  };
  permissions: {
    scopes: string[];
    restrictions: Array<{
      type: 'ip' | 'time' | 'resource' | 'rate';
      rule: string;
      value: any;
    }>;
    elevation: {
      elevated: boolean;
      elevatedAt?: string;
      elevatedBy?: string;
      reason?: string;
      expiresAt?: string;
    };
  };
  activity: {
    requests: number;
    lastRequest?: string;
    userAgent: string;
    referrer?: string;
    actions: Array<{
      action: string;
      resource?: string;
      timestamp: string;
      success: boolean;
      metadata?: Record<string, any>;
    }>;
  };
  flags: {
    suspicious: boolean;
    verified: boolean;
    concurrent: boolean;
    elevated: boolean;
    readonly: boolean;
    monitoring: boolean;
  };
  metadata: {
    sessionToken?: string;
    deviceToken?: string;
    pushToken?: string;
    tags: string[];
    notes?: string;
  };
}

export interface AuthAttempt {
  id: string;
  type: 'login' | 'register' | 'reset' | 'mfa' | 'refresh' | 'logout' | 'verify';
  status: 'success' | 'failure' | 'blocked' | 'pending' | 'expired' | 'cancelled';
  method: 'password' | 'social' | 'saml' | 'ldap' | 'api_key' | 'magic_link' | 'biometric' | 'mfa';
  identifier: {
    type: 'email' | 'username' | 'phone' | 'social_id' | 'device_id' | 'api_key';
    value: string;
    verified: boolean;
  };
  user?: {
    id?: string;
    exists: boolean;
    status?: string;
    locked: boolean;
    suspended: boolean;
  };
  device: DeviceInfo;
  location: {
    ipAddress: string;
    country?: string;
    region?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    isp?: string;
    vpn: boolean;
    proxy: boolean;
    suspicious: boolean;
  };
  risk: {
    score: number; // 0-100
    factors: Array<{
      type: string;
      weight: number;
      reason: string;
    }>;
    decision: 'allow' | 'challenge' | 'block' | 'review';
    rules: Array<{
      rule: string;
      triggered: boolean;
      action: string;
    }>;
  };
  verification: {
    required: boolean;
    methods: string[];
    completed: string[];
    pending: string[];
    attempts: number;
    maxAttempts: number;
  };
  timing: {
    startedAt: string;
    completedAt?: string;
    duration?: number;
    timeout: number;
    retryAfter?: number;
  };
  errors: Array<{
    code: string;
    message: string;
    field?: string;
    timestamp: string;
  }>;
  audit: {
    source: string;
    userAgent: string;
    referrer?: string;
    sessionId?: string;
    requestId: string;
    correlationId?: string;
  };
  metadata: {
    provider?: string;
    campaign?: string;
    version: string;
    flags: string[];
    context: Record<string, any>;
  };
}

export interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'saml' | 'ldap' | 'openid' | 'custom';
  status: 'active' | 'inactive' | 'testing' | 'deprecated';
  configuration: {
    oauth?: {
      clientId: string;
      clientSecret: string;
      authorizationUrl: string;
      tokenUrl: string;
      userInfoUrl?: string;
      scopes: string[];
      pkce: boolean;
      state: boolean;
    };
    saml?: {
      entityId: string;
      ssoUrl: string;
      sloUrl?: string;
      certificateFingerprint: string;
      nameIdFormat: string;
      attributeMapping: Record<string, string>;
    };
    ldap?: {
      host: string;
      port: number;
      bindDn: string;
      baseDn: string;
      filter: string;
      attributes: Record<string, string>;
      ssl: boolean;
    };
    custom?: Record<string, any>;
  };
  mapping: {
    userIdField: string;
    emailField: string;
    nameFields: {
      firstName: string;
      lastName: string;
      displayName?: string;
    };
    profileFields: Record<string, string>;
    roleMapping: Array<{
      providerRole: string;
      systemRole: string;
    }>;
  };
  features: {
    autoProvisioning: boolean;
    autoUpdate: boolean;
    deprovisioning: boolean;
    groupSync: boolean;
    profileSync: boolean;
    linkExisting: boolean;
  };
  security: {
    encrypted: boolean;
    signRequests: boolean;
    verifySignature: boolean;
    trustLevel: 'low' | 'medium' | 'high' | 'verified';
    allowedDomains?: string[];
    blockedDomains?: string[];
  };
  usage: {
    enabled: boolean;
    users: number;
    lastSync?: string;
    syncFrequency?: number; // hours
    errorCount: number;
    successRate: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    tags: string[];
    description?: string;
  };
}

export interface AuthPolicy {
  id: string;
  name: string;
  description: string;
  type: 'password' | 'session' | 'access' | 'mfa' | 'device' | 'risk';
  status: 'active' | 'inactive' | 'testing' | 'deprecated';
  priority: number;
  scope: {
    global: boolean;
    users?: string[];
    roles?: string[];
    groups?: string[];
    resources?: string[];
    conditions?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  rules: {
    password?: {
      minLength: number;
      maxLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      prohibitCommon: boolean;
      prohibitPersonal: boolean;
      prohibitReuse: number;
      expiryDays: number;
      warningDays: number;
      complexityScore: number;
    };
    session?: {
      maxConcurrent: number;
      idleTimeout: number; // minutes
      absoluteTimeout: number; // minutes
      requireReauth: boolean;
      reauthTimeout: number; // minutes
      deviceLimit: number;
      ipBinding: boolean;
      locationBinding: boolean;
    };
    mfa?: {
      required: boolean;
      methods: string[];
      backup: boolean;
      grace: number; // hours
      remember: boolean;
      rememberDays: number;
      stepUp: Array<{
        trigger: string;
        methods: string[];
      }>;
    };
    access?: {
      ipWhitelist?: string[];
      ipBlacklist?: string[];
      geoAllowed?: string[];
      geoBlocked?: string[];
      timeRestrictions?: {
        allowedHours: { start: string; end: string };
        timezone: string;
        daysOfWeek: number[];
      };
      deviceRestrictions?: {
        allowedTypes: string[];
        blockedTypes: string[];
        trustedOnly: boolean;
      };
    };
    risk?: {
      threshold: number;
      actions: Array<{
        score: number;
        action: 'allow' | 'challenge' | 'block' | 'review';
      }>;
      factors: Array<{
        factor: string;
        weight: number;
        enabled: boolean;
      }>;
    };
  };
  enforcement: {
    mode: 'enforcing' | 'permissive' | 'monitoring';
    exceptions: Array<{
      condition: string;
      action: 'skip' | 'modify' | 'escalate';
      expiry?: string;
    }>;
    violations: {
      action: 'warn' | 'block' | 'suspend' | 'escalate';
      notification: boolean;
      logging: boolean;
    };
  };
  analytics: {
    enabled: boolean;
    violations: number;
    exemptions: number;
    effectiveness: number; // percentage
    lastAnalysis?: string;
    trends: Array<{
      period: string;
      violations: number;
      compliance: number;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    notes?: string;
  };
}

export interface AuthToken {
  id: string;
  type: 'access' | 'refresh' | 'api' | 'magic_link' | 'verification' | 'reset';
  status: 'active' | 'expired' | 'revoked' | 'used' | 'pending';
  format: 'jwt' | 'opaque' | 'custom';
  userId?: string;
  sessionId?: string;
  deviceId?: string;
  value: {
    token: string;
    hash?: string;
    encrypted: boolean;
    signature?: string;
  };
  payload: {
    iss: string; // issuer
    sub: string; // subject
    aud: string[]; // audience
    exp: number; // expiration
    nbf?: number; // not before
    iat: number; // issued at
    jti?: string; // JWT ID
    scopes?: string[];
    permissions?: string[];
    claims?: Record<string, any>;
  };
  usage: {
    created: string;
    firstUsed?: string;
    lastUsed?: string;
    useCount: number;
    maxUses?: number;
    rateLimited: boolean;
    rateLimit?: {
      requests: number;
      window: number; // seconds
      remaining: number;
      reset: number;
    };
  };
  security: {
    bound: {
      ip?: string;
      device?: string;
      location?: string;
      session?: string;
    };
    encryption: {
      algorithm?: string;
      keyId?: string;
      rotated: boolean;
    };
    validation: {
      signature: boolean;
      expiry: boolean;
      audience: boolean;
      issuer: boolean;
      revocation: boolean;
    };
  };
  metadata: {
    purpose: string;
    source: string;
    userAgent?: string;
    ipAddress?: string;
    location?: string;
    tags: string[];
    notes?: string;
  };
}

export const authenticationAPI = {
  /**
   * Register new user
   */
  register: async (
    registrationData: {
      username?: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      acceptedTerms: boolean;
      source?: string;
      inviteCode?: string;
      marketingConsent?: boolean;
    }
  ): Promise<{
    user: User;
    session?: AuthSession;
    verification?: {
      required: boolean;
      methods: string[];
      tokens: Array<{ type: string; expiresAt: string }>;
    };
  }> => {
    const { data } = await api.post('/auth/register', registrationData);
    return data;
  },

  /**
   * Login user
   */
  login: async (
    credentials: {
      identifier: string; // email, username, or phone
      password: string;
      remember?: boolean;
      deviceInfo?: Partial<DeviceInfo>;
      mfaCode?: string;
      mfaMethod?: string;
    }
  ): Promise<{
    success: boolean;
    user?: User;
    session?: AuthSession;
    tokens?: {
      accessToken: string;
      refreshToken?: string;
      expiresIn: number;
    };
    mfa?: {
      required: boolean;
      methods: string[];
      challenge?: string;
    };
    risk?: {
      score: number;
      action: string;
      challenges: string[];
    };
  }> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  /**
   * Refresh authentication token
   */
  refresh: async (
    refreshToken: string,
    options?: {
      rotate?: boolean;
      extend?: boolean;
      scopes?: string[];
    }
  ): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    scopes: string[];
  }> => {
    const { data } = await api.post('/auth/refresh', { refreshToken, ...options });
    return data;
  },

  /**
   * Logout user
   */
  logout: async (
    options?: {
      everywhere?: boolean;
      sessionId?: string;
      reason?: string;
    }
  ): Promise<{
    success: boolean;
    sessionsTerminated: number;
    redirectUrl?: string;
  }> => {
    const { data } = await api.post('/auth/logout', options);
    return data;
  },

  /**
   * Verify account
   */
  verify: async (
    verification: {
      token: string;
      type: 'email' | 'phone' | 'identity';
      code?: string;
    }
  ): Promise<{
    success: boolean;
    verified: boolean;
    user?: User;
    nextSteps?: string[];
  }> => {
    const { data } = await api.post('/auth/verify', verification);
    return data;
  },

  /**
   * Initiate password reset
   */
  initiatePasswordReset: async (
    identifier: string,
    options?: {
      method?: 'email' | 'sms';
      template?: string;
    }
  ): Promise<{
    success: boolean;
    method: string;
    destination: string;
    expiresIn: number;
  }> => {
    const { data } = await api.post('/auth/password-reset/initiate', { identifier, ...options });
    return data;
  },

  /**
   * Complete password reset
   */
  completePasswordReset: async (
    resetData: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    }
  ): Promise<{
    success: boolean;
    message: string;
    autoLogin?: boolean;
  }> => {
    const { data } = await api.post('/auth/password-reset/complete', resetData);
    return data;
  },

  /**
   * Change password
   */
  changePassword: async (
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
      everywhere?: boolean; // invalidate all sessions
    }
  ): Promise<{
    success: boolean;
    message: string;
    sessionsInvalidated: number;
  }> => {
    const { data } = await api.post('/auth/password-change', passwordData);
    return data;
  },

  /**
   * Setup MFA
   */
  setupMFA: async (
    method: string,
    options?: {
      phoneNumber?: string;
      backupCodes?: boolean;
      primary?: boolean;
    }
  ): Promise<{
    method: string;
    secret?: string;
    qrCode?: string;
    backupCodes?: string[];
    verificationRequired: boolean;
  }> => {
    const { data } = await api.post('/auth/mfa/setup', { method, ...options });
    return data;
  },

  /**
   * Verify MFA setup
   */
  verifyMFASetup: async (
    verification: {
      method: string;
      code: string;
      secret?: string;
    }
  ): Promise<{
    success: boolean;
    enabled: boolean;
    backupCodes?: string[];
  }> => {
    const { data } = await api.post('/auth/mfa/verify-setup', verification);
    return data;
  },

  /**
   * Disable MFA
   */
  disableMFA: async (
    method: string,
    verification: {
      password?: string;
      code?: string;
      backupCode?: string;
    }
  ): Promise<{
    success: boolean;
    method: string;
    backupCodes?: string[];
  }> => {
    const { data } = await api.post('/auth/mfa/disable', { method, ...verification });
    return data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    updates: Partial<User['profile']>
  ): Promise<User> => {
    const { data } = await api.put('/auth/profile', updates);
    return data;
  },

  /**
   * Get user sessions
   */
  getSessions: async (
    filters?: {
      active?: boolean;
      deviceType?: string;
      location?: string;
      limit?: number;
    }
  ): Promise<AuthSession[]> => {
    const { data } = await api.get('/auth/sessions', { params: filters });
    return data;
  },

  /**
   * Terminate session
   */
  terminateSession: async (
    sessionId: string,
    reason?: string
  ): Promise<{
    success: boolean;
    session: AuthSession;
  }> => {
    const { data } = await api.delete(`/auth/sessions/${sessionId}`, {
      params: { reason },
    });
    return data;
  },

  /**
   * Get authentication attempts
   */
  getAuthAttempts: async (
    filters?: {
      type?: AuthAttempt['type'];
      status?: AuthAttempt['status'];
      timeframe?: { start: string; end: string };
      risk?: 'high' | 'medium' | 'low';
      limit?: number;
    }
  ): Promise<AuthAttempt[]> => {
    const { data } = await api.get('/auth/attempts', { params: filters });
    return data;
  },

  /**
   * Register device
   */
  registerDevice: async (
    deviceInfo: Omit<DeviceInfo, 'deviceId' | 'registeredAt' | 'trusted'>
  ): Promise<DeviceInfo> => {
    const { data } = await api.post('/auth/devices', deviceInfo);
    return data;
  },

  /**
   * Get registered devices
   */
  getDevices: async (): Promise<DeviceInfo[]> => {
    const { data } = await api.get('/auth/devices');
    return data;
  },

  /**
   * Trust/untrust device
   */
  updateDeviceTrust: async (
    deviceId: string,
    trusted: boolean,
    reason?: string
  ): Promise<DeviceInfo> => {
    const { data } = await api.put(`/auth/devices/${deviceId}/trust`, { trusted, reason });
    return data;
  },

  /**
   * Remove device
   */
  removeDevice: async (
    deviceId: string,
    options?: {
      terminateSessions?: boolean;
      reason?: string;
    }
  ): Promise<{
    success: boolean;
    sessionsTerminated: number;
  }> => {
    const { data } = await api.delete(`/auth/devices/${deviceId}`, { params: options });
    return data;
  },

  /**
   * Create API token
   */
  createAPIToken: async (
    tokenData: {
      name: string;
      scopes: string[];
      expiresIn?: number; // seconds
      rateLimit?: {
        requests: number;
        window: number;
      };
      ipRestrictions?: string[];
    }
  ): Promise<{
    token: string;
    tokenId: string;
    expiresAt?: string;
    scopes: string[];
  }> => {
    const { data } = await api.post('/auth/tokens', tokenData);
    return data;
  },

  /**
   * Get API tokens
   */
  getAPITokens: async (): Promise<Omit<AuthToken, 'value'>[]> => {
    const { data } = await api.get('/auth/tokens');
    return data;
  },

  /**
   * Revoke API token
   */
  revokeAPIToken: async (
    tokenId: string,
    reason?: string
  ): Promise<{
    success: boolean;
    tokenId: string;
  }> => {
    const { data } = await api.delete(`/auth/tokens/${tokenId}`, { params: { reason } });
    return data;
  },

  /**
   * Create magic link
   */
  createMagicLink: async (
    linkData: {
      email: string;
      purpose: 'login' | 'verify' | 'reset' | 'invite';
      expiresIn?: number; // seconds
      redirectUrl?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<{
    link: string;
    token: string;
    expiresAt: string;
  }> => {
    const { data } = await api.post('/auth/magic-links', linkData);
    return data;
  },

  /**
   * Validate magic link
   */
  validateMagicLink: async (
    token: string,
    options?: {
      consume?: boolean; // mark as used
      metadata?: Record<string, any>;
    }
  ): Promise<{
    valid: boolean;
    purpose: string;
    user?: User;
    session?: AuthSession;
    redirectUrl?: string;
    metadata?: Record<string, any>;
  }> => {
    const { data } = await api.post('/auth/magic-links/validate', { token, ...options });
    return data;
  },

  /**
   * Get authentication providers
   */
  getAuthProviders: async (
    filters?: {
      type?: AuthProvider['type'];
      status?: AuthProvider['status'];
    }
  ): Promise<Omit<AuthProvider, 'configuration'>[]> => {
    const { data } = await api.get('/auth/providers', { params: filters });
    return data;
  },

  /**
   * Social login initiate
   */
  initiateSocialLogin: async (
    provider: string,
    options?: {
      redirectUrl?: string;
      state?: string;
      scopes?: string[];
    }
  ): Promise<{
    authorizationUrl: string;
    state: string;
    codeVerifier?: string;
  }> => {
    const { data } = await api.post('/auth/social/initiate', { provider, ...options });
    return data;
  },

  /**
   * Social login callback
   */
  completeSocialLogin: async (
    callbackData: {
      provider: string;
      code: string;
      state: string;
      codeVerifier?: string;
    }
  ): Promise<{
    success: boolean;
    user?: User;
    session?: AuthSession;
    tokens?: {
      accessToken: string;
      refreshToken?: string;
      expiresIn: number;
    };
    linked: boolean;
    newAccount: boolean;
  }> => {
    const { data } = await api.post('/auth/social/callback', callbackData);
    return data;
  },

  /**
   * Link social account
   */
  linkSocialAccount: async (
    provider: string,
    accountData: {
      providerId: string;
      email?: string;
      profile?: Record<string, any>;
    }
  ): Promise<{
    success: boolean;
    linked: boolean;
    provider: string;
    providerId: string;
  }> => {
    const { data } = await api.post('/auth/social/link', { provider, ...accountData });
    return data;
  },

  /**
   * Unlink social account
   */
  unlinkSocialAccount: async (
    provider: string,
    verification?: {
      password?: string;
      mfaCode?: string;
    }
  ): Promise<{
    success: boolean;
    unlinked: boolean;
    provider: string;
  }> => {
    const { data } = await api.delete(`/auth/social/${provider}`, { data: verification });
    return data;
  },
};

export default authenticationAPI;