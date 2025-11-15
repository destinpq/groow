import featureFlags, { logMockUsage } from '@/config/featureFlags';

// Temporary types for backend integration (will be replaced when backend POJOs are available)
interface LoginDTO {
  email: string;
  password: string;
}

interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
}

// Temporary types for backend integration (will be replaced when backend POJOs are available)
interface AuthSession {
  id: string;
  sessionToken: string;
  refreshToken: string;
  deviceId: string;
  userAgent: string;
  ipAddress: string;
  geolocation: any;
  deviceInfo: any;
  expiresAt: Date;
  lastActivityAt: Date;
  isActive: boolean;
  status: 'active' | 'expired' | 'revoked' | 'compromised';
  permissions: any;
  metadata: any;
}

interface AuthMFAConfiguration {
  id: string;
  type: 'sms' | 'email' | 'totp' | 'backup_codes' | 'hardware_key' | 'biometric';
  identifier: string;
  configuration: any;
  isActive: boolean;
  isPrimary: boolean;
  lastUsedAt: Date;
  usageCount: number;
  verifiedAt: Date;
}

interface AuthSSOProvider {
  id: string;
  name: string;
  slug: string;
  type: 'saml' | 'oauth2' | 'oidc' | 'ldap' | 'active_directory';
  displayName: string;
  description: string;
  configuration: any;
  metadata: any;
  isActive: boolean;
  isDefault: boolean;
}

interface AuthRole {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'system' | 'organization' | 'custom';
  permissions: any;
  restrictions: any;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
}

interface AuthAPIKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: any;
  restrictions: any;
  expiresAt: Date;
  lastUsedAt: Date;
  usageCount: number;
  isActive: boolean;
  metadata: any;
}

interface AuthAuditLog {
  id: string;
  userId: string;
  eventType: string;
  action: string;
  resource: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  isSuspicious: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  session?: AuthSession;
  expiresAt: Date;
  permissions?: string[];
  mfaRequired?: boolean;
  mfaToken?: string;
}

export interface PasswordResetRequest {
  email: string;
  captchaToken?: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailVerification {
  token: string;
}

export interface MFASetupRequest {
  type: 'sms' | 'email' | 'totp' | 'backup_codes' | 'hardware_key';
  identifier?: string; // phone number or email
  deviceInfo?: any;
}

export interface MFAVerificationRequest {
  code: string;
  mfaConfigurationId?: string;
  rememberDevice?: boolean;
}

export interface SSOLoginRequest {
  provider: string;
  code?: string;
  state?: string;
  redirectUri?: string;
}

export interface SessionInfo {
  current: AuthSession;
  active: AuthSession[];
  revokedCount: number;
  totalCount: number;
}

export interface APIKeyRequest {
  name: string;
  permissions: {
    scopes: string[];
    resources: string[];
    actions: string[];
  };
  restrictions?: {
    ipWhitelist?: string[];
    allowedMethods?: string[];
    allowedEndpoints?: string[];
  };
  expiresAt?: Date;
  metadata?: {
    purpose?: string;
    environment?: 'development' | 'staging' | 'production';
    application?: string;
  };
}

export interface RoleAssignmentRequest {
  userId: string;
  roleId: string;
  reason?: string;
  expiresAt?: Date;
  conditions?: any;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  mfaRequired: boolean;
  sessionTimeout: number;
  maxConcurrentSessions: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    preventReuse: number;
    expiresAfterDays: number;
  };
  ipWhitelist?: string[];
  allowedCountries?: string[];
}

export interface VendorRegisterDTO extends RegisterDTO {
  companyName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  documents: {
    businessLicense: string;
    taxCertificate: string;
    bankStatement?: string;
  };
}

class AuthService {
    private baseURL = process.env.REACT_APP_API_URL || 'https://groow-api.destinpq.com/api/v1';  // ============================================
  private readonly shouldUseMockAuth = featureFlags.useMockAuth;
  // Core Authentication
  // ============================================

  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const result = await response.json();
    
    // Handle the actual API response structure
    if (result.success && result.data) {
      return {
        user: result.data.user,
        token: result.data.access_token,
        refreshToken: result.data.refresh_token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      };
    }
    
    // Fallback for different response structure
    return result;
  }

  async register(userData: RegisterDTO): Promise<AuthResponse> {
    if (this.shouldUseMockAuth) {
      logMockUsage('auth.register');
      return this.createMockAuthResponse(userData);
    }

    try {
      return await this.performRegisterRequest(userData);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logMockUsage('auth.register (fallback)', error);
        return this.createMockAuthResponse(userData);
      }
      throw error;
    }
  }

  private async performRegisterRequest(userData: RegisterDTO): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorBody = await this.tryParseJson(response);
      const message =
        errorBody?.message ||
        errorBody?.error ||
        `Registration failed (${response.status})`;
      throw new Error(message);
    }

    return response.json();
  }

  private async tryParseJson(response: Response): Promise<any | null> {
    try {
      return await response.clone().json();
    } catch {
      return null;
    }
  }

  private createMockAuthResponse(userData: RegisterDTO): AuthResponse {
    const now = Date.now();
    const fallbackName = userData.email?.split?.('@')?.[0] || 'New';
    const role = (userData as any)?.role || 'customer';

    return {
      user: {
        id: `mock-user-${Math.random().toString(36).slice(2, 10)}`,
        email: userData.email,
        firstName: userData.firstName || fallbackName,
        lastName: userData.lastName || 'User',
        role,
        status: 'active',
        isEmailVerified: true,
      },
      token: `mock-token-${now}`,
      refreshToken: `mock-refresh-${now}`,
      expiresAt: new Date(now + 24 * 60 * 60 * 1000),
    };
  }

  async logout(): Promise<void> {
    await fetch(`${this.baseURL}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('sessionId');
  }

  async logoutAllSessions(): Promise<void> {
    await fetch(`${this.baseURL}/logout-all`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('sessionId');
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }

  // ============================================
  // Multi-Factor Authentication
  // ============================================

  async setupMFA(request: MFASetupRequest): Promise<{
    configuration: AuthMFAConfiguration;
    setupData: any; // QR code URL, backup codes, etc.
  }> {
    const response = await fetch(`${this.baseURL}/mfa/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('MFA setup failed');
    }

    return response.json();
  }

  async verifyMFA(request: MFAVerificationRequest): Promise<{
    verified: boolean;
    token?: string;
    backupCodes?: string[];
  }> {
    const response = await fetch(`${this.baseURL}/mfa/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('MFA verification failed');
    }

    return response.json();
  }

  async getMFAConfigurations(): Promise<AuthMFAConfiguration[]> {
    const response = await fetch(`${this.baseURL}/mfa/configurations`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch MFA configurations');
    }

    return response.json();
  }

  async disableMFA(configurationId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/mfa/configurations/${configurationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to disable MFA');
    }
  }

  async generateBackupCodes(): Promise<string[]> {
    const response = await fetch(`${this.baseURL}/mfa/backup-codes/generate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to generate backup codes');
    }

    return response.json();
  }

  // ============================================
  // Single Sign-On (SSO)
  // ============================================

  async getSSOProviders(): Promise<AuthSSOProvider[]> {
    const response = await fetch(`${this.baseURL}/sso/providers`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch SSO providers');
    }

    return response.json();
  }

  async initiateSSOLogin(providerId: string, redirectUri?: string): Promise<{
    redirectUrl: string;
    state: string;
  }> {
    const response = await fetch(`${this.baseURL}/sso/${providerId}/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redirectUri }),
    });

    if (!response.ok) {
      throw new Error('SSO initiation failed');
    }

    return response.json();
  }

  async completeSSOLogin(request: SSOLoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/sso/${request.provider}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('SSO login completion failed');
    }

    return response.json();
  }

  async unlinkSSO(providerId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/sso/${providerId}/unlink`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('SSO unlinking failed');
    }
  }

  // ============================================
  // Session Management
  // ============================================

  async getSessionInfo(): Promise<SessionInfo> {
    const response = await fetch(`${this.baseURL}/sessions`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch session info');
    }

    return response.json();
  }

  async revokeSession(sessionId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/sessions/${sessionId}/revoke`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to revoke session');
    }
  }

  async extendSession(sessionId?: string): Promise<AuthSession> {
    const response = await fetch(`${this.baseURL}/sessions/${sessionId || 'current'}/extend`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to extend session');
    }

    return response.json();
  }

  // ============================================
  // Role-Based Access Control
  // ============================================

  async getRoles(): Promise<AuthRole[]> {
    const response = await fetch(`${this.baseURL}/roles`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }

    return response.json();
  }

  async getUserRoles(userId?: string): Promise<AuthRole[]> {
    const endpoint = userId ? `/users/${userId}/roles` : '/me/roles';
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user roles');
    }

    return response.json();
  }

  async assignRole(request: RoleAssignmentRequest): Promise<void> {
    const response = await fetch(`${this.baseURL}/roles/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Role assignment failed');
    }
  }

  async revokeRole(userId: string, roleId: string, reason?: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/roles/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId, roleId, reason }),
    });

    if (!response.ok) {
      throw new Error('Role revocation failed');
    }
  }

  async checkPermission(permission: string, resource?: string): Promise<boolean> {
    const response = await fetch(`${this.baseURL}/permissions/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ permission, resource }),
    });

    if (!response.ok) {
      throw new Error('Permission check failed');
    }

    const result = await response.json();
    return result.granted;
  }

  // ============================================
  // API Key Management
  // ============================================

  async createAPIKey(request: APIKeyRequest): Promise<{
    apiKey: AuthAPIKey;
    key: string; // The actual API key (only shown once)
  }> {
    const response = await fetch(`${this.baseURL}/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('API key creation failed');
    }

    return response.json();
  }

  async getAPIKeys(): Promise<AuthAPIKey[]> {
    const response = await fetch(`${this.baseURL}/api-keys`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch API keys');
    }

    return response.json();
  }

  async updateAPIKey(keyId: string, updates: Partial<APIKeyRequest>): Promise<AuthAPIKey> {
    const response = await fetch(`${this.baseURL}/api-keys/${keyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('API key update failed');
    }

    return response.json();
  }

  async revokeAPIKey(keyId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/api-keys/${keyId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('API key revocation failed');
    }
  }

  async getAPIKeyUsage(keyId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    endpoint?: string;
    limit?: number;
  }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (filters?.startDate) queryParams.set('startDate', filters.startDate.toISOString());
    if (filters?.endDate) queryParams.set('endDate', filters.endDate.toISOString());
    if (filters?.endpoint) queryParams.set('endpoint', filters.endpoint);
    if (filters?.limit) queryParams.set('limit', filters.limit.toString());

    const response = await fetch(`${this.baseURL}/api-keys/${keyId}/usage?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch API key usage');
    }

    return response.json();
  }

  // ============================================
  // Security & Audit
  // ============================================

  async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await fetch(`${this.baseURL}/security/settings`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch security settings');
    }

    return response.json();
  }

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const response = await fetch(`${this.baseURL}/security/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Security settings update failed');
    }

    return response.json();
  }

  async getAuditLogs(filters?: {
    userId?: string;
    eventType?: string;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{
    logs: AuthAuditLog[];
    total: number;
    hasMore: boolean;
  }> {
    const queryParams = new URLSearchParams();
    if (filters?.userId) queryParams.set('userId', filters.userId);
    if (filters?.eventType) queryParams.set('eventType', filters.eventType);
    if (filters?.severity) queryParams.set('severity', filters.severity);
    if (filters?.startDate) queryParams.set('startDate', filters.startDate.toISOString());
    if (filters?.endDate) queryParams.set('endDate', filters.endDate.toISOString());
    if (filters?.limit) queryParams.set('limit', filters.limit.toString());
    if (filters?.offset) queryParams.set('offset', filters.offset.toString());

    const response = await fetch(`${this.baseURL}/audit/logs?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch audit logs');
    }

    return response.json();
  }

  async getSecurityEvents(filters?: {
    riskLevel?: string;
    isSuspicious?: boolean;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<{
    events: AuthAuditLog[];
    total: number;
    riskSummary: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (filters?.riskLevel) queryParams.set('riskLevel', filters.riskLevel);
    if (filters?.isSuspicious !== undefined) queryParams.set('isSuspicious', filters.isSuspicious.toString());
    if (filters?.startDate) queryParams.set('startDate', filters.startDate.toISOString());
    if (filters?.endDate) queryParams.set('endDate', filters.endDate.toISOString());
    if (filters?.limit) queryParams.set('limit', filters.limit.toString());

    const response = await fetch(`${this.baseURL}/security/events?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch security events');
    }

    return response.json();
  }

  // ============================================
  // Password Management
  // ============================================

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    const response = await fetch(`${this.baseURL}/password-reset/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Password reset request failed');
    }
  }

  async resetPassword(data: PasswordReset): Promise<void> {
    const response = await fetch(`${this.baseURL}/password-reset/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Password reset failed');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/password/change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      throw new Error('Password change failed');
    }
  }

  async validatePasswordStrength(password: string): Promise<{
    score: number;
    feedback: string[];
    isValid: boolean;
  }> {
    const response = await fetch(`${this.baseURL}/password/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error('Password validation failed');
    }

    return response.json();
  }

  // ============================================
  // Email Verification
  // ============================================

  async verifyEmail(data: EmailVerification): Promise<void> {
    const response = await fetch(`${this.baseURL}/email/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Email verification failed');
    }
  }

  async resendVerificationEmail(): Promise<void> {
    const response = await fetch(`${this.baseURL}/email/resend-verification`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to resend verification email');
    }
  }

  // ============================================
  // User Profile Management
  // ============================================

  async getCurrentUser(): Promise<AuthUser> {
    const response = await fetch(`${this.baseURL}/me`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }

  async updateProfile(profileData: Partial<AuthUser>): Promise<AuthUser> {
    const response = await fetch(`${this.baseURL}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    return response.json();
  }

  // ============================================
  // Vendor Registration
  // ============================================

  async registerVendor(vendorData: VendorRegisterDTO): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/vendor/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData),
    });

    if (!response.ok) {
      throw new Error('Vendor registration failed');
    }

    return response.json();
  }

  async verifyVendorDocuments(vendorId: string, approvalData: any): Promise<void> {
    const response = await fetch(`${this.baseURL}/vendor/${vendorId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
      throw new Error('Vendor verification failed');
    }
  }

  // ============================================
  // Admin Operations
  // ============================================

  async getUserList(filters?: any): Promise<AuthUser[]> {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/admin/users?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user list');
    }

    return response.json();
  }

  async updateUserStatus(userId: string, status: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user status');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }

  async impersonateUser(userId: string, reason?: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/admin/impersonate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId, reason }),
    });

    if (!response.ok) {
      throw new Error('User impersonation failed');
    }

    return response.json();
  }

  async stopImpersonation(): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/admin/stop-impersonation`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to stop impersonation');
    }

    return response.json();
  }

  // ============================================
  // Enterprise Features
  // ============================================

  async getComplianceReport(type: 'gdpr' | 'sox' | 'hipaa' | 'pci', filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    reportId: string;
    type: string;
    generatedAt: Date;
    data: any;
    compliance: {
      status: 'compliant' | 'non_compliant' | 'partial';
      score: number;
      issues: any[];
      recommendations: any[];
    };
  }> {
    const queryParams = new URLSearchParams({ type });
    if (filters?.startDate) queryParams.set('startDate', filters.startDate.toISOString());
    if (filters?.endDate) queryParams.set('endDate', filters.endDate.toISOString());

    const response = await fetch(`${this.baseURL}/compliance/report?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to generate compliance report');
    }

    return response.json();
  }

  async exportUserData(userId?: string, format: 'json' | 'csv' | 'xml' = 'json'): Promise<Blob> {
    const endpoint = userId ? `/admin/users/${userId}/export` : '/me/export';
    const response = await fetch(`${this.baseURL}${endpoint}?format=${format}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to export user data');
    }

    return response.blob();
  }

  async requestDataDeletion(userId?: string, reason?: string): Promise<{
    requestId: string;
    status: 'pending' | 'approved' | 'rejected';
    scheduledDeletionDate?: Date;
  }> {
    const endpoint = userId ? `/admin/users/${userId}/delete-request` : '/me/delete-request';
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to request data deletion');
    }

    return response.json();
  }

  // ============================================
  // Token Management & Validation
  // ============================================

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  getTokenPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  async validateToken(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token || this.isTokenExpired(token)) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/validate`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getTokenInfo(): Promise<{
    isValid: boolean;
    expiresAt: Date;
    permissions: string[];
    roles: string[];
    sessionInfo: Partial<AuthSession>;
  }> {
    const response = await fetch(`${this.baseURL}/token/info`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch token info');
    }

    return response.json();
  }

  // ============================================
  // Utility Methods
  // ============================================

  hasPermission(requiredPermission: string, userPermissions?: string[]): boolean {
    if (!userPermissions) {
      const token = localStorage.getItem('token');
      if (!token) return false;
      const payload = this.getTokenPayload(token);
      userPermissions = payload?.permissions || [];
    }

    return userPermissions?.includes(requiredPermission) || userPermissions?.includes('*') || false;
  }

  hasRole(requiredRole: string, userRoles?: string[]): boolean {
    if (!userRoles) {
      const token = localStorage.getItem('token');
      if (!token) return false;
      const payload = this.getTokenPayload(token);
      userRoles = payload?.roles || [];
    }

    return userRoles?.includes(requiredRole) || userRoles?.includes('admin') || userRoles?.includes('super_admin') || false;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && !this.isTokenExpired(token);
  }

  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('permissions');
    localStorage.removeItem('roles');
  }
}

const authService = new AuthService();
export const authAPI = authService;
export default authService;

// Type aliases for compatibility
export type LoginCredentials = LoginDTO;
export type RegisterData = RegisterDTO;
export type User = AuthUser;
