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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';

// ============================================
// Authentication Session Entity
// ============================================

@Entity('auth_sessions')
@Index(['userId', 'isActive'])
@Index(['sessionToken'], { unique: true })
@Index(['refreshToken'], { unique: true })
@Index(['expiresAt'])
@Index(['ipAddress'])
@Index(['userAgent'])
class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 255, unique: true })
  sessionToken: string;

  @Column('varchar', { length: 255, unique: true })
  refreshToken: string;

  @Column('varchar', { length: 100, nullable: true })
  deviceId: string;

  @Column('varchar', { length: 500, nullable: true })
  userAgent: string;

  @Column('inet', { nullable: true })
  ipAddress: string;

  @Column('json', { nullable: true })
  geolocation: {
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    isp?: string;
  };

  @Column('json', { nullable: true })
  deviceInfo: {
    type?: 'desktop' | 'mobile' | 'tablet' | 'api' | 'other';
    os?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;
    platform?: string;
    isMobile?: boolean;
    isBot?: boolean;
  };

  @Column('timestamp')
  expiresAt: Date;

  @Column('timestamp', { nullable: true })
  lastActivityAt: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('varchar', { length: 50, default: 'active' })
  status: 'active' | 'expired' | 'revoked' | 'compromised';

  @Column('json', { nullable: true })
  permissions: {
    scopes: string[];
    resources: string[];
    restrictions?: {
      ipWhitelist?: string[];
      timeRestrictions?: {
        allowedHours: { start: string; end: string }[];
        allowedDays: number[];
        timezone: string;
      };
      featureRestrictions?: string[];
    };
  };

  @Column('json', { nullable: true })
  metadata: {
    loginMethod?: 'email' | 'sso' | 'api_key' | 'oauth';
    mfaVerified?: boolean;
    riskScore?: number;
    loginAttempts?: number;
    failedAttempts?: number;
    notes?: string;
  };

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => AuthSessionActivity, activity => activity.session)
  activities: AuthSessionActivity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateLastActivity() {
    this.lastActivityAt = new Date();
  }
}

// ============================================
// Authentication Session Activity Entity
// ============================================

@Entity('auth_session_activities')
@Index(['sessionId', 'createdAt'])
@Index(['activityType'])
@Index(['ipAddress'])
class AuthSessionActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sessionId: string;

  @Column('varchar', { length: 100 })
  activityType: string; // login, logout, api_call, permission_change, etc.

  @Column('varchar', { length: 100 })
  action: string; // specific action performed

  @Column('varchar', { length: 500, nullable: true })
  resource: string; // API endpoint or resource accessed

  @Column('varchar', { length: 20, nullable: true })
  httpMethod: string;

  @Column('varchar', { length: 500, nullable: true })
  userAgent: string;

  @Column('inet', { nullable: true })
  ipAddress: string;

  @Column('int', { nullable: true })
  statusCode: number;

  @Column('json', { nullable: true })
  requestData: {
    parameters?: Record<string, any>;
    headers?: Record<string, string>;
    body?: Record<string, any>;
    query?: Record<string, any>;
  };

  @Column('json', { nullable: true })
  responseData: {
    success?: boolean;
    message?: string;
    errorCode?: string;
    duration?: number;
  };

  @Column('varchar', { length: 50, default: 'info' })
  severity: 'info' | 'warning' | 'error' | 'critical';

  @Column('boolean', { default: false })
  isSuspicious: boolean;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => AuthSession, session => session.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session: AuthSession;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// Multi-Factor Authentication Entity
// ============================================

@Entity('auth_mfa_configurations')
@Index(['userId', 'isActive'])
@Index(['type', 'isActive'])
class AuthMFAConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 50 })
  type: 'sms' | 'email' | 'totp' | 'backup_codes' | 'hardware_key' | 'biometric';

  @Column('varchar', { length: 200, nullable: true })
  identifier: string; // phone number, email, device ID

  @Column('text', { nullable: true })
  secret: string; // encrypted TOTP secret or backup codes

  @Column('json', { nullable: true })
  configuration: {
    algorithm?: string;
    digits?: number;
    period?: number;
    issuer?: string;
    label?: string;
    backupCodes?: string[];
    deviceInfo?: Record<string, any>;
  };

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isPrimary: boolean;

  @Column('timestamp', { nullable: true })
  lastUsedAt: Date;

  @Column('int', { default: 0 })
  usageCount: number;

  @Column('timestamp', { nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => AuthMFAAttempt, attempt => attempt.mfaConfiguration)
  attempts: AuthMFAAttempt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Multi-Factor Authentication Attempt Entity
// ============================================

@Entity('auth_mfa_attempts')
@Index(['mfaConfigurationId', 'createdAt'])
@Index(['ipAddress'])
@Index(['success'])
class AuthMFAAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  mfaConfigurationId: string;

  @Column('varchar', { length: 100, nullable: true })
  code: string; // hashed verification code

  @Column('boolean')
  success: boolean;

  @Column('varchar', { length: 500, nullable: true })
  userAgent: string;

  @Column('inet', { nullable: true })
  ipAddress: string;

  @Column('varchar', { length: 100, nullable: true })
  failureReason: string;

  @Column('int', { nullable: true })
  attemptsRemaining: number;

  @Column('timestamp', { nullable: true })
  blockedUntil: Date;

  @ManyToOne(() => AuthMFAConfiguration, config => config.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mfaConfigurationId' })
  mfaConfiguration: AuthMFAConfiguration;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// SSO Provider Configuration Entity
// ============================================

@Entity('auth_sso_providers')
@Index(['name'], { unique: true })
@Index(['isActive'])
class AuthSSOProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100, unique: true })
  name: string;

  @Column('varchar', { length: 100, unique: true })
  slug: string;

  @Column('varchar', { length: 50 })
  type: 'saml' | 'oauth2' | 'oidc' | 'ldap' | 'active_directory';

  @Column('varchar', { length: 200 })
  displayName: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('json')
  configuration: {
    // OAuth2/OIDC
    clientId?: string;
    clientSecret?: string;
    authorizationUrl?: string;
    tokenUrl?: string;
    userInfoUrl?: string;
    scope?: string[];
    
    // SAML
    entityId?: string;
    ssoUrl?: string;
    certificate?: string;
    attributeMapping?: Record<string, string>;
    
    // LDAP/AD
    serverUrl?: string;
    bindDn?: string;
    bindPassword?: string;
    searchBase?: string;
    searchFilter?: string;
    
    // Common
    allowedDomains?: string[];
    autoCreateUsers?: boolean;
    defaultRole?: string;
    fieldMapping?: Record<string, string>;
  };

  @Column('json', { nullable: true })
  metadata: {
    logoUrl?: string;
    primaryColor?: string;
    buttonText?: string;
    helpUrl?: string;
    contactEmail?: string;
    supportedFeatures?: string[];
  };

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column('int', { default: 0 })
  sortOrder: number;

  @OneToMany(() => AuthSSOConnection, connection => connection.provider)
  connections: AuthSSOConnection[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// SSO Connection Entity
// ============================================

@Entity('auth_sso_connections')
@Index(['userId', 'providerId'], { unique: true })
@Index(['externalId', 'providerId'], { unique: true })
class AuthSSOConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  providerId: string;

  @Column('varchar', { length: 255 })
  externalId: string;

  @Column('varchar', { length: 255, nullable: true })
  externalUsername: string;

  @Column('json', { nullable: true })
  externalProfile: {
    email?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
    department?: string;
    jobTitle?: string;
    manager?: string;
    groups?: string[];
    attributes?: Record<string, any>;
  };

  @Column('json', { nullable: true })
  tokens: {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: string;
    tokenType?: string;
  };

  @Column('timestamp', { nullable: true })
  lastLoginAt: Date;

  @Column('timestamp', { nullable: true })
  lastSyncAt: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => AuthSSOProvider, provider => provider.connections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: AuthSSOProvider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Role-Based Access Control Entity
// ============================================

@Entity('auth_roles')
@Index(['name'], { unique: true })
@Index(['isActive'])
class AuthRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100, unique: true })
  name: string;

  @Column('varchar', { length: 100, unique: true })
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 50, default: 'custom' })
  type: 'system' | 'organization' | 'custom';

  @Column('json', { nullable: true })
  permissions: {
    modules: string[];
    actions: string[];
    resources: string[];
    conditions?: Record<string, any>;
  };

  @Column('json', { nullable: true })
  restrictions: {
    ipWhitelist?: string[];
    timeRestrictions?: {
      allowedHours: { start: string; end: string }[];
      allowedDays: number[];
      timezone: string;
    };
    dataAccess?: {
      ownDataOnly?: boolean;
      departmentDataOnly?: boolean;
      allowedTenants?: string[];
    };
  };

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column('int', { default: 0 })
  priority: number;

  @Column('uuid', { nullable: true })
  organizationId: string;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'auth_user_roles',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: User[];

  @OneToMany(() => AuthRoleAssignment, assignment => assignment.role)
  assignments: AuthRoleAssignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Role Assignment Entity
// ============================================

@Entity('auth_role_assignments')
@Index(['userId', 'roleId'], { unique: true })
@Index(['assignedBy'])
@Index(['expiresAt'])
class AuthRoleAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  roleId: string;

  @Column('uuid', { nullable: true })
  assignedBy: string;

  @Column('text', { nullable: true })
  reason: string;

  @Column('timestamp', { nullable: true })
  expiresAt: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('json', { nullable: true })
  conditions: {
    ipRestrictions?: string[];
    timeRestrictions?: {
      start?: string;
      end?: string;
      timezone?: string;
    };
    resourceRestrictions?: string[];
  };

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => AuthRole, role => role.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: AuthRole;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedBy' })
  assigner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Permission Entity
// ============================================

@Entity('auth_permissions')
@Index(['module', 'action', 'resource'], { unique: true })
@Index(['isActive'])
class AuthPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  module: string; // products, orders, customers, vendors, etc.

  @Column('varchar', { length: 100 })
  action: string; // create, read, update, delete, approve, etc.

  @Column('varchar', { length: 100 })
  resource: string; // specific resource or * for all

  @Column('varchar', { length: 200 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('json', { nullable: true })
  conditions: {
    fieldRestrictions?: string[];
    valueRestrictions?: Record<string, any>;
    ownershipRequired?: boolean;
    departmentRequired?: boolean;
    minimumRole?: string;
  };

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('varchar', { length: 50, default: 'application' })
  category: 'system' | 'application' | 'data' | 'administrative';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// API Key Entity
// ============================================

@Entity('auth_api_keys')
@Index(['keyHash'], { unique: true })
@Index(['userId', 'isActive'])
@Index(['expiresAt'])
class AuthAPIKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('varchar', { length: 255, unique: true })
  keyHash: string; // hashed API key

  @Column('varchar', { length: 100, nullable: true })
  keyPrefix: string; // visible prefix for identification

  @Column('json', { nullable: true })
  permissions: {
    scopes: string[];
    resources: string[];
    actions: string[];
    rateLimit?: {
      requestsPerMinute: number;
      requestsPerHour: number;
      requestsPerDay: number;
    };
  };

  @Column('json', { nullable: true })
  restrictions: {
    ipWhitelist?: string[];
    allowedMethods?: string[];
    allowedEndpoints?: string[];
    maxRequestSize?: number;
  };

  @Column('timestamp', { nullable: true })
  expiresAt: Date;

  @Column('timestamp', { nullable: true })
  lastUsedAt: Date;

  @Column('int', { default: 0 })
  usageCount: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('json', { nullable: true })
  metadata: {
    purpose?: string;
    environment?: 'development' | 'staging' | 'production';
    application?: string;
    notes?: string;
  };

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => AuthAPIKeyUsage, usage => usage.apiKey)
  usageHistory: AuthAPIKeyUsage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// API Key Usage Entity
// ============================================

@Entity('auth_api_key_usage')
@Index(['apiKeyId', 'createdAt'])
@Index(['endpoint'])
@Index(['statusCode'])
class AuthAPIKeyUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  apiKeyId: string;

  @Column('varchar', { length: 500 })
  endpoint: string;

  @Column('varchar', { length: 20 })
  method: string;

  @Column('inet', { nullable: true })
  ipAddress: string;

  @Column('varchar', { length: 500, nullable: true })
  userAgent: string;

  @Column('int')
  statusCode: number;

  @Column('int', { nullable: true })
  responseTime: number; // milliseconds

  @Column('int', { nullable: true })
  requestSize: number; // bytes

  @Column('int', { nullable: true })
  responseSize: number; // bytes

  @Column('varchar', { length: 100, nullable: true })
  errorCode: string;

  @Column('text', { nullable: true })
  errorMessage: string;

  @ManyToOne(() => AuthAPIKey, apiKey => apiKey.usageHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'apiKeyId' })
  apiKey: AuthAPIKey;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// Security Audit Log Entity
// ============================================

@Entity('auth_audit_logs')
@Index(['userId', 'createdAt'])
@Index(['eventType'])
@Index(['severity'])
@Index(['ipAddress'])
class AuthAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column('varchar', { length: 100 })
  eventType: string; // login, logout, permission_change, password_change, etc.

  @Column('varchar', { length: 100 })
  action: string;

  @Column('varchar', { length: 500, nullable: true })
  resource: string;

  @Column('varchar', { length: 50, default: 'info' })
  severity: 'info' | 'warning' | 'error' | 'critical';

  @Column('text', { nullable: true })
  description: string;

  @Column('inet', { nullable: true })
  ipAddress: string;

  @Column('varchar', { length: 500, nullable: true })
  userAgent: string;

  @Column('json', { nullable: true })
  details: {
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    metadata?: Record<string, any>;
    context?: Record<string, any>;
  };

  @Column('boolean', { default: false })
  isSuspicious: boolean;

  @Column('varchar', { length: 50, nullable: true })
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}

// Export all authentication entities
export {
  AuthSession,
  AuthSessionActivity,
  AuthMFAConfiguration,
  AuthMFAAttempt,
  AuthSSOProvider,
  AuthSSOConnection,
  AuthRole,
  AuthRoleAssignment,
  AuthPermission,
  AuthAPIKey,
  AuthAPIKeyUsage,
  AuthAuditLog,
};