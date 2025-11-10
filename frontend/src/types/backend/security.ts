// Backend Security Entities - Security & Audit Module

import { PaginatedResponse } from './pagination';

// Base interface for entities
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simple Customer reference
interface CustomerRef {
  id: string;
  name: string;
  email: string;
}

// Core Security Event Entity
export interface SecurityEventEntity extends BaseEntity {
  id: string;
  
  // Event Classification
  type: SecurityEventType;
  severity: SecuritySeverity;
  category: SecurityCategory;
  
  // Event Details
  title: string;
  description: string;
  source: SecurityEventSourceInfo;
  
  // Actor Information
  actor?: SecurityActor;
  
  // Target Information
  target: SecurityTarget;
  
  // Context & Metadata
  context: SecurityContext;
  metadata: SecurityMetadata;
  
  // Risk Assessment
  riskScore: number;
  threatLevel: SecurityThreatLevel;
  
  // Response & Resolution
  response?: SecurityResponse;
  status: SecurityEventStatus;
  
  // Correlation
  correlationId?: string;
  parentEventId?: string;
  childEvents: string[];
  
  // Timing
  detectedAt: Date;
  occurredAt: Date;
  resolvedAt?: Date;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// Security Threat Entity
export interface SecurityThreatEntity extends BaseEntity {
  id: string;
  
  // Threat Classification
  type: ThreatType;
  subType?: string;
  severity: SecuritySeverity;
  category: ThreatCategory;
  
  // Threat Details
  title: string;
  description: string;
  indicators: ThreatIndicator[];
  
  // Source Information
  source: ThreatSource;
  
  // Target Information
  targets: SecurityTarget[];
  
  // Attack Information
  attackPattern: AttackPattern;
  
  // Status & Lifecycle
  status: ThreatStatus;
  confidence: number; // 0-100
  
  // Impact Assessment
  impact: ThreatImpact;
  
  // Mitigation
  mitigation?: ThreatMitigation;
  
  // Intelligence
  intelligence: ThreatIntelligence;
  
  // Relations
  events: SecurityEventEntity[];
  eventIds: string[];
  
  // Timing
  firstSeenAt: Date;
  lastSeenAt: Date;
  expiresAt?: Date;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  detectedBy: string;
}

// Security Audit Log Entity
export interface SecurityAuditLogEntity extends BaseEntity {
  id: string;
  
  // Event Information
  eventType: AuditEventType;
  action: string;
  result: AuditResult;
  
  // Actor Information
  actor: AuditActor;
  
  // Resource Information
  resource: AuditResource;
  
  // Change Tracking
  changes?: AuditChanges;
  
  // Context
  context: AuditContext;
  
  // Risk Assessment
  riskLevel: SecuritySeverity;
  
  // Compliance
  compliance: AuditCompliance;
  
  // Timing
  timestamp: Date;
  duration?: number; // milliseconds
  
  // Audit
  createdAt: Date;
  retentionUntil: Date;
}

// Security Alert Entity
export interface SecurityAlertEntity extends BaseEntity {
  id: string;
  
  // Alert Classification
  type: AlertType;
  severity: SecuritySeverity;
  priority: AlertPriority;
  
  // Alert Content
  title: string;
  description: string;
  details: AlertDetails;
  
  // Source & Context
  source: AlertSource;
  context: AlertContext;
  
  // Notification & Assignment
  assignedTo?: string;
  notificationChannels: NotificationChannel[];
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  
  // Status & Resolution
  status: AlertStatus;
  resolution?: AlertResolution;
  
  // Escalation
  escalationLevel: number;
  escalationHistory: EscalationEntry[];
  
  // Related Events
  relatedEvents: string[];
  triggeredByEvent?: string;
  
  // SLA & Timing
  sla: AlertSLA;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

// Security Configuration Entity
export interface SecurityConfigurationEntity extends BaseEntity {
  id: string;
  name: string;
  description: string;
  
  // Configuration Scope
  scope: ConfigurationScope;
  
  // Authentication Configuration
  authentication: AuthenticationConfig;
  
  // Authorization Configuration
  authorization: AuthorizationConfig;
  
  // Session Management
  session: SessionConfig;
  
  // Password Policy
  password: PasswordPolicy;
  
  // Account Security
  account: AccountSecurityConfig;
  
  // Network Security
  network: NetworkSecurityConfig;
  
  // Data Protection
  dataProtection: DataProtectionConfig;
  
  // Monitoring & Logging
  monitoring: MonitoringConfig;
  
  // Threat Protection
  threatProtection: ThreatProtectionConfig;
  
  // Compliance
  compliance: ComplianceConfig;
  
  // Status
  isActive: boolean;
  isDefault: boolean;
  version: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

// Security Access Control Entity
export interface SecurityAccessControlEntity extends BaseEntity {
  id: string;
  
  // Subject (who)
  subject: AccessSubject;
  
  // Resource (what)
  resource: AccessResource;
  
  // Permissions (how)
  permissions: Permission[];
  
  // Conditions (when/where)
  conditions: AccessCondition[];
  
  // Policy
  policy: AccessPolicy;
  
  // Status
  status: AccessControlStatus;
  
  // Validity
  validFrom: Date;
  validTo?: Date;
  
  // Approval
  approvedBy?: string;
  approvedAt?: Date;
  
  // Usage Tracking
  usageCount: number;
  lastUsedAt?: Date;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Supporting Enums and Interfaces

export enum SecurityEventType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_ACCESS = 'data_access',
  SYSTEM_ACCESS = 'system_access',
  NETWORK_ACCESS = 'network_access',
  CONFIGURATION_CHANGE = 'configuration_change',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  POLICY_VIOLATION = 'policy_violation',
  COMPLIANCE_EVENT = 'compliance_event'
}

export enum ThreatType {
  MALWARE = 'malware',
  PHISHING = 'phishing',
  DDOS = 'ddos',
  BRUTE_FORCE = 'brute_force',
  SQL_INJECTION = 'sql_injection',
  XSS = 'xss',
  CSRF = 'csrf',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  DATA_EXFILTRATION = 'data_exfiltration',
  INSIDER_THREAT = 'insider_threat',
  SOCIAL_ENGINEERING = 'social_engineering',
  ZERO_DAY = 'zero_day'
}

export enum SecuritySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export enum SecurityCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_PROTECTION = 'data_protection',
  NETWORK_SECURITY = 'network_security',
  APPLICATION_SECURITY = 'application_security',
  INFRASTRUCTURE = 'infrastructure',
  COMPLIANCE = 'compliance',
  INCIDENT_RESPONSE = 'incident_response'
}

export enum SecurityThreatLevel {
  IMMINENT = 'imminent',
  HIGH = 'high',
  ELEVATED = 'elevated',
  GUARDED = 'guarded',
  LOW = 'low'
}

export enum SecurityEventStatus {
  NEW = 'new',
  INVESTIGATING = 'investigating',
  CONFIRMED = 'confirmed',
  MITIGATING = 'mitigating',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  FALSE_POSITIVE = 'false_positive'
}

export enum ThreatStatus {
  ACTIVE = 'active',
  CONTAINED = 'contained',
  MITIGATED = 'mitigated',
  RESOLVED = 'resolved',
  FALSE_POSITIVE = 'false_positive',
  EXPIRED = 'expired'
}

export enum AlertType {
  INTRUSION_ATTEMPT = 'intrusion_attempt',
  POLICY_VIOLATION = 'policy_violation',
  ANOMALY_DETECTION = 'anomaly_detection',
  THRESHOLD_BREACH = 'threshold_breach',
  SYSTEM_ERROR = 'system_error',
  COMPLIANCE_VIOLATION = 'compliance_violation',
  DATA_BREACH = 'data_breach',
  ACCOUNT_COMPROMISE = 'account_compromise'
}

export enum AlertStatus {
  OPEN = 'open',
  ACKNOWLEDGED = 'acknowledged',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated'
}

export enum AuditEventType {
  USER_ACTION = 'user_action',
  SYSTEM_EVENT = 'system_event',
  CONFIGURATION_CHANGE = 'configuration_change',
  DATA_ACCESS = 'data_access',
  SECURITY_EVENT = 'security_event',
  COMPLIANCE_EVENT = 'compliance_event'
}

export enum AuditResult {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PARTIAL = 'partial',
  DENIED = 'denied',
  ERROR = 'error'
}

export enum AccessControlStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  SUSPENDED = 'suspended'
}

export interface SecurityActor {
  type: 'user' | 'system' | 'service' | 'external';
  id: string;
  name: string;
  email?: string;
  role?: string;
  department?: string;
  ipAddress: string;
  userAgent?: string;
  sessionId?: string;
  impersonatedBy?: string;
}

export interface SecurityTarget {
  type: 'user' | 'system' | 'resource' | 'data' | 'service';
  id: string;
  name: string;
  category?: string;
  sensitivity?: 'public' | 'internal' | 'confidential' | 'restricted';
  location?: string;
}

export interface SecurityContext {
  environment: string;
  application: string;
  module?: string;
  method?: string;
  endpoint?: string;
  request?: {
    headers: Record<string, string>;
    parameters: Record<string, any>;
    body?: any;
  };
  response?: {
    statusCode: number;
    headers: Record<string, string>;
  };
  session?: {
    id: string;
    duration: number;
    lastActivity: Date;
  };
  geolocation?: {
    country: string;
    region?: string;
    city?: string;
    coordinates?: [number, number];
  };
}

export interface SecurityMetadata {
  correlationId?: string;
  traceId?: string;
  tags: string[];
  custom: Record<string, any>;
  enrichment?: {
    reputation?: {
      score: number;
      source: string;
    };
    geolocation?: {
      country: string;
      isp?: string;
      organization?: string;
      isProxy?: boolean;
      isTor?: boolean;
    };
    deviceFingerprint?: string;
  };
}

export interface SecurityResponse {
  action: ResponseAction;
  description: string;
  automated: boolean;
  effectiveness: number; // 0-100
  cost: number;
  implementedAt: Date;
  implementedBy: string;
  followUpActions?: string[];
}

export enum ResponseAction {
  BLOCK = 'block',
  QUARANTINE = 'quarantine',
  MONITOR = 'monitor',
  ALERT = 'alert',
  ESCALATE = 'escalate',
  IGNORE = 'ignore',
  INVESTIGATE = 'investigate'
}

export interface ThreatIndicator {
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'signature';
  value: string;
  confidence: number;
  source: string;
  firstSeen: Date;
  lastSeen: Date;
}

export interface ThreatSource {
  type: 'external' | 'internal' | 'unknown';
  origin: string;
  actor?: {
    type: 'individual' | 'group' | 'nation_state' | 'criminal' | 'hacktivist';
    name?: string;
    motivation?: string;
    capabilities?: string[];
  };
  attribution?: {
    confidence: number;
    evidence: string[];
  };
}

export interface AttackPattern {
  technique: string;
  tactics: string[];
  timeline: AttackPhase[];
  signature?: string;
  complexity: 'low' | 'medium' | 'high';
  sophistication: 'low' | 'medium' | 'high';
}

export interface AttackPhase {
  phase: string;
  description: string;
  timestamp: Date;
  artifacts?: string[];
}

export interface ThreatImpact {
  scope: 'individual' | 'department' | 'organization' | 'external';
  confidentiality: SecuritySeverity;
  integrity: SecuritySeverity;
  availability: SecuritySeverity;
  financial?: number;
  reputational?: SecuritySeverity;
  regulatory?: SecuritySeverity;
  affectedSystems: string[];
  affectedUsers: number;
  dataCompromised?: {
    type: string;
    records: number;
    sensitivity: string;
  }[];
}

export interface ThreatMitigation {
  strategy: string;
  actions: MitigationAction[];
  status: 'planned' | 'in_progress' | 'completed' | 'failed';
  effectiveness: number; // 0-100
  cost: number;
  timeline: {
    start: Date;
    end?: Date;
    milestones: MitigationMilestone[];
  };
}

export interface MitigationAction {
  id: string;
  type: string;
  description: string;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
}

export interface MitigationMilestone {
  name: string;
  description: string;
  targetDate: Date;
  actualDate?: Date;
  status: 'pending' | 'completed' | 'delayed';
}

export interface ThreatIntelligence {
  sources: string[];
  indicators: ThreatIndicator[];
  campaigns?: string[];
  attribution?: {
    actor: string;
    confidence: number;
    evidence: string[];
  };
  ttps: {
    tactics: string[];
    techniques: string[];
    procedures: string[];
  };
  iocs: {
    type: string;
    value: string;
    context: string;
  }[];
}

export interface AuthenticationConfig {
  methods: AuthMethod[];
  mfaRequired: boolean;
  mfaMethods: MFAMethod[];
  ssoEnabled: boolean;
  ssoProvider?: string;
  passwordless: boolean;
  biometricsEnabled: boolean;
  sessionTimeout: number; // minutes
  maxSessions: number;
  lockoutPolicy: LockoutPolicy;
}

export interface AuthorizationConfig {
  model: 'rbac' | 'abac' | 'hybrid';
  defaultRole: string;
  roleHierarchy: boolean;
  permissionInheritance: boolean;
  dynamicPermissions: boolean;
  contextualAccess: boolean;
  accessReview: AccessReviewConfig;
}

export interface PasswordPolicy {
  minLength: number;
  maxLength?: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  prohibitCommon: boolean;
  prohibitPersonal: boolean;
  historyCount: number;
  maxAge: number; // days
  warningDays: number;
  complexityScore: number;
}

export interface NetworkSecurityConfig {
  ipWhitelist: string[];
  ipBlacklist: string[];
  geoBlocking: {
    enabled: boolean;
    allowedCountries: string[];
    blockedCountries: string[];
  };
  rateLimit: {
    enabled: boolean;
    requests: number;
    window: number; // seconds
    skipWhitelist: boolean;
  };
  ddosProtection: boolean;
  tlsVersion: string;
  cipherSuites: string[];
}

export enum AuthMethod {
  PASSWORD = 'password',
  TOKEN = 'token',
  CERTIFICATE = 'certificate',
  BIOMETRIC = 'biometric',
  SSO = 'sso',
  OAUTH = 'oauth',
  LDAP = 'ldap'
}

export enum MFAMethod {
  SMS = 'sms',
  EMAIL = 'email',
  TOTP = 'totp',
  PUSH = 'push',
  HARDWARE_TOKEN = 'hardware_token',
  BIOMETRIC = 'biometric'
}

// API Response Types
export interface SecurityAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

export interface PaginatedSecurityResponse<T> {
  success: boolean;
  data: PaginatedResponse<T>;
  message?: string;
  timestamp: Date;
}

// Request DTOs
export interface CreateSecurityEventRequest {
  type: SecurityEventType;
  severity: SecuritySeverity;
  title: string;
  description: string;
  source: SecurityEventSourceInfo;
  actor?: Partial<SecurityActor>;
  target: SecurityTarget;
  context?: Partial<SecurityContext>;
  metadata?: Partial<SecurityMetadata>;
}

export interface CreateSecurityThreatRequest {
  type: ThreatType;
  severity: SecuritySeverity;
  title: string;
  description: string;
  source: Partial<ThreatSource>;
  targets: SecurityTarget[];
  indicators?: ThreatIndicator[];
  confidence?: number;
}

export interface UpdateSecurityConfigurationRequest {
  authentication?: Partial<AuthenticationConfig>;
  authorization?: Partial<AuthorizationConfig>;
  password?: Partial<PasswordPolicy>;
  network?: Partial<NetworkSecurityConfig>;
}

export interface SecurityScanRequest {
  type: 'vulnerability' | 'compliance' | 'configuration' | 'full';
  scope: {
    systems?: string[];
    applications?: string[];
    networks?: string[];
  };
  options?: {
    deep: boolean;
    aggressive: boolean;
    credentials?: boolean;
  };
}

// Response DTOs
export interface GetSecurityEventsResponse {
  events: SecurityEventEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetSecurityThreatsResponse {
  threats: SecurityThreatEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetSecurityAlertsResponse {
  alerts: SecurityAlertEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetAuditLogsResponse {
  logs: SecurityAuditLogEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SecurityMetricsResponse {
  overview: {
    totalEvents: number;
    totalThreats: number;
    totalAlerts: number;
    riskScore: number;
    securityPosture: string;
  };
  
  eventsByType: {
    type: SecurityEventType;
    count: number;
    severity: SecuritySeverity;
  }[];
  
  threatsByType: {
    type: ThreatType;
    count: number;
    trend: number; // percentage change
  }[];
  
  alertsByStatus: {
    status: AlertStatus;
    count: number;
    avgResolutionTime: number;
  }[];
  
  topRisks: {
    risk: string;
    score: number;
    impact: SecuritySeverity;
    likelihood: number;
  }[];
  
  complianceScore: {
    overall: number;
    frameworks: {
      name: string;
      score: number;
      requirements: number;
      compliant: number;
    }[];
  };
  
  trends: {
    date: string;
    events: number;
    threats: number;
    alerts: number;
    riskScore: number;
  }[];
}

export interface SecurityScanResponse {
  scanId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  results?: {
    vulnerabilities: VulnerabilityFinding[];
    misconfigurations: ConfigurationFinding[];
    complianceIssues: ComplianceFinding[];
    summary: {
      critical: number;
      high: number;
      medium: number;
      low: number;
      info: number;
    };
  };
}

export interface VulnerabilityFinding {
  id: string;
  severity: SecuritySeverity;
  title: string;
  description: string;
  cve?: string;
  cvss?: number;
  affected: {
    system: string;
    component: string;
    version: string;
  };
  remediation: {
    effort: 'low' | 'medium' | 'high';
    steps: string[];
    references: string[];
  };
}

export interface ConfigurationFinding {
  id: string;
  severity: SecuritySeverity;
  rule: string;
  description: string;
  current: any;
  recommended: any;
  impact: string;
  remediation: string[];
}

export interface ComplianceFinding {
  id: string;
  framework: string;
  control: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'partially_compliant';
  gap: string;
  evidence?: string[];
  remediation: string[];
}

// Additional supporting types
export interface LockoutPolicy {
  enabled: boolean;
  maxAttempts: number;
  lockoutDuration: number; // minutes
  progressiveDelay: boolean;
  notifyUser: boolean;
  notifyAdmin: boolean;
}

export interface AccessReviewConfig {
  enabled: boolean;
  frequency: number; // days
  autoRevoke: boolean;
  reviewers: string[];
  escalation: {
    enabled: boolean;
    timeout: number; // days
    escalateTo: string[];
  };
}

export interface SecurityEventSourceInfo {
  system: string;
  component: string;
  version?: string;
  location?: string;
}

export interface ConfigurationScope {
  global: boolean;
  applications?: string[];
  environments?: string[];
  userGroups?: string[];
}

export interface SessionConfig {
  timeout: number; // minutes
  absoluteTimeout: number; // minutes
  maxConcurrent: number;
  singleSession: boolean;
  rememberMe: boolean;
  secureFlag: boolean;
  httpOnly: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}

export interface AccountSecurityConfig {
  autoLock: boolean;
  inactivityTimeout: number; // days
  passwordExpiration: boolean;
  accountReview: boolean;
  privilegedAccounts: {
    monitoring: boolean;
    approval: boolean;
    timeboxed: boolean;
  };
}

export interface DataProtectionConfig {
  encryption: {
    atRest: boolean;
    inTransit: boolean;
    algorithm: string;
    keyRotation: number; // days
  };
  dataClassification: boolean;
  dlpEnabled: boolean;
  backupEncryption: boolean;
  retentionPolicies: {
    category: string;
    period: number; // days
  }[];
}

export interface MonitoringConfig {
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    retention: number; // days
    structured: boolean;
    remote: boolean;
  };
  alerting: {
    enabled: boolean;
    channels: NotificationChannel[];
    escalation: boolean;
  };
  metrics: {
    enabled: boolean;
    collection: number; // seconds
    retention: number; // days
  };
}

export interface ThreatProtectionConfig {
  intrusionDetection: boolean;
  behaviorAnalysis: boolean;
  threatIntelligence: boolean;
  automatedResponse: boolean;
  quarantine: boolean;
  forensics: boolean;
}

export interface ComplianceConfig {
  frameworks: string[];
  reporting: boolean;
  automation: boolean;
  evidence: boolean;
  attestation: boolean;
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'push';
  target: string;
  priority: AlertPriority;
  enabled: boolean;
}

export enum AlertPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface AlertDetails {
  summary: string;
  indicators: string[];
  affectedSystems: string[];
  potentialImpact: string;
  recommendedActions: string[];
}

export interface AlertSource {
  system: string;
  component: string;
  rule?: string;
  signature?: string;
}

export interface AlertContext {
  environment: string;
  timeWindow: {
    start: Date;
    end: Date;
  };
  baseline?: any;
  threshold?: any;
}

export interface AlertResolution {
  action: string;
  description: string;
  resolvedBy: string;
  resolvedAt: Date;
  effectiveness: number;
  preventive: boolean;
}

export interface EscalationEntry {
  level: number;
  escalatedAt: Date;
  escalatedBy: string;
  escalatedTo: string;
  reason: string;
  acknowledged: boolean;
}

export interface AlertSLA {
  acknowledgmentTime: number; // minutes
  resolutionTime: number; // hours
  escalationTime: number; // minutes
}

export interface AuditActor {
  type: 'user' | 'system' | 'service';
  id: string;
  name: string;
  role?: string;
  sessionId?: string;
  impersonated?: boolean;
  impersonatedBy?: string;
}

export interface AuditResource {
  type: string;
  id: string;
  name: string;
  category?: string;
  owner?: string;
  classification?: string;
}

export interface AuditChanges {
  before: Record<string, any>;
  after: Record<string, any>;
  fields: string[];
}

export interface AuditContext {
  application: string;
  module?: string;
  function?: string;
  ipAddress: string;
  userAgent?: string;
  requestId?: string;
  sessionId?: string;
  correlationId?: string;
}

export interface AuditCompliance {
  frameworks: string[];
  requirements: string[];
  retention: Date;
  classification: string;
}

export interface AccessSubject {
  type: 'user' | 'group' | 'role' | 'service';
  id: string;
  name: string;
  attributes?: Record<string, any>;
}

export interface AccessResource {
  type: string;
  id: string;
  name: string;
  namespace?: string;
  attributes?: Record<string, any>;
}

export interface Permission {
  action: string;
  effect: 'allow' | 'deny';
  conditions?: AccessCondition[];
}

export interface AccessCondition {
  type: string;
  operator: string;
  value: any;
  context?: string;
}

export interface AccessPolicy {
  id: string;
  name: string;
  version: string;
  rules: PolicyRule[];
}

export interface PolicyRule {
  id: string;
  name: string;
  effect: 'allow' | 'deny';
  subjects: string[];
  resources: string[];
  actions: string[];
  conditions?: AccessCondition[];
}

export interface ThreatCategory {
  name: string;
  severity: SecuritySeverity;
  tactics: string[];
  techniques: string[];
}

export enum SecurityEventSource {
  FIREWALL = 'firewall',
  IDS = 'ids',
  ANTIVIRUS = 'antivirus',
  ENDPOINT = 'endpoint',
  APPLICATION = 'application',
  DATABASE = 'database',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  EMAIL = 'email',
  WEB = 'web'
}