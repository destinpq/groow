/**
 * Audit Logging API Services
 * Comprehensive audit trail, compliance logging, and security monitoring
 */
import { api } from './client';

export interface AuditLog {
  id: string;
  timestamp: string;
  event: {
    type: 'authentication' | 'authorization' | 'data_access' | 'configuration' | 'system' | 'security' | 'compliance' | 'business';
    action: string;
    category: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'access' | 'login' | 'logout' | 'approve' | 'reject';
    severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
    outcome: 'success' | 'failure' | 'error' | 'blocked' | 'timeout' | 'cancelled';
    description: string;
  };
  actor: {
    type: 'user' | 'service' | 'system' | 'anonymous' | 'admin';
    id: string;
    name: string;
    email?: string;
    role?: string;
    permissions?: string[];
    impersonator?: {
      id: string;
      name: string;
      reason: string;
    };
  };
  target: {
    type: 'user' | 'role' | 'resource' | 'system' | 'data' | 'configuration' | 'policy';
    id?: string;
    name?: string;
    classification?: 'public' | 'internal' | 'confidential' | 'restricted';
    owner?: string;
    attributes?: Record<string, any>;
  };
  context: {
    session: {
      id?: string;
      authenticated: boolean;
      mfaVerified?: boolean;
      riskScore?: number;
    };
    request: {
      id: string;
      method?: string;
      path?: string;
      userAgent?: string;
      origin?: string;
      correlationId?: string;
      traceId?: string;
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
      vpn?: boolean;
      tor?: boolean;
    };
    device?: {
      type: string;
      trusted: boolean;
      fingerprint?: string;
      platform?: string;
    };
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
    sensitive: boolean;
    redacted: string[];
    size?: number; // bytes
  };
  compliance: {
    frameworks: string[];
    requirements: Array<{
      framework: string;
      requirement: string;
      met: boolean;
    }>;
    retention: {
      required: number; // days
      policy: string;
      deleteAt?: string;
    };
    encryption: {
      encrypted: boolean;
      algorithm?: string;
      keyId?: string;
    };
  };
  investigation: {
    flagged: boolean;
    flags: Array<{
      type: string;
      reason: string;
      severity: string;
      addedBy: string;
      addedAt: string;
    }>;
    case?: {
      id: string;
      status: string;
      assignee: string;
    };
    notes: Array<{
      id: string;
      content: string;
      author: string;
      timestamp: string;
      classification: string;
    }>;
  };
  verification: {
    integrity: {
      hash: string;
      algorithm: string;
      verified: boolean;
      verifiedAt?: string;
    };
    signature?: {
      signed: boolean;
      signedAt?: string;
      signer?: string;
      algorithm?: string;
    };
    immutable: boolean;
  };
  metadata: {
    source: string;
    version: string;
    ingested: string;
    processed: string;
    indexed: boolean;
    archived: boolean;
    tags: string[];
  };
}

export interface AuditPolicy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'testing' | 'deprecated';
  scope: {
    global: boolean;
    events: Array<{
      type: string;
      actions?: string[];
      severity?: string[];
    }>;
    actors: Array<{
      type: string;
      ids?: string[];
      roles?: string[];
      conditions?: Record<string, any>;
    }>;
    targets: Array<{
      type: string;
      patterns?: string[];
      classifications?: string[];
      conditions?: Record<string, any>;
    }>;
    contexts: Array<{
      type: string;
      conditions: Record<string, any>;
    }>;
  };
  rules: {
    collection: {
      enabled: boolean;
      sampling: {
        rate: number; // 0-100 percentage
        strategy: 'random' | 'priority' | 'risk_based' | 'round_robin';
        conditions?: Record<string, any>;
      };
      enrichment: {
        enabled: boolean;
        sources: string[];
        fields: string[];
      };
      filtering: {
        exclude: Array<{
          condition: string;
          reason: string;
        }>;
        include: Array<{
          condition: string;
          priority: number;
        }>;
      };
    };
    processing: {
      realTime: boolean;
      batch: {
        enabled: boolean;
        frequency: number; // minutes
        size: number; // records
      };
      transformation: {
        enabled: boolean;
        rules: Array<{
          field: string;
          transform: string;
          parameters: Record<string, any>;
        }>;
      };
      anonymization: {
        enabled: boolean;
        fields: string[];
        method: 'hash' | 'mask' | 'tokenize' | 'remove';
      };
    };
    retention: {
      default: number; // days
      byCategory: Record<string, number>;
      compliance: Array<{
        framework: string;
        minimum: number; // days
        maximum?: number; // days
      }>;
      archiving: {
        enabled: boolean;
        after: number; // days
        location: string;
        compressed: boolean;
      };
    };
    alerts: Array<{
      id: string;
      name: string;
      condition: string;
      threshold: number;
      timeWindow: number; // minutes
      severity: string;
      actions: Array<{
        type: 'email' | 'webhook' | 'ticket' | 'block';
        configuration: Record<string, any>;
      }>;
      enabled: boolean;
    }>;
  };
  compliance: {
    frameworks: string[];
    requirements: Array<{
      framework: string;
      requirement: string;
      implementation: string;
      evidence: string[];
    }>;
    controls: Array<{
      control: string;
      description: string;
      implementation: string;
      testing: {
        frequency: string;
        lastTest?: string;
        passed: boolean;
      };
    }>;
  };
  performance: {
    metrics: {
      throughput: number; // events/second
      latency: number; // milliseconds
      errorRate: number; // percentage
      storage: number; // bytes
    };
    optimization: {
      indexing: {
        strategy: string;
        fields: string[];
      };
      compression: {
        enabled: boolean;
        algorithm: string;
        ratio: number;
      };
      partitioning: {
        strategy: 'time' | 'size' | 'hash';
        parameters: Record<string, any>;
      };
    };
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    approvedBy?: string;
    approvedAt?: string;
    tags: string[];
  };
}

export interface AuditQuery {
  id?: string;
  name?: string;
  description?: string;
  filters: {
    timeRange: {
      start: string;
      end: string;
      timezone?: string;
    };
    events?: {
      types?: string[];
      actions?: string[];
      categories?: string[];
      severities?: string[];
      outcomes?: string[];
    };
    actors?: {
      types?: string[];
      ids?: string[];
      roles?: string[];
      departments?: string[];
    };
    targets?: {
      types?: string[];
      ids?: string[];
      classifications?: string[];
      patterns?: string[];
    };
    context?: {
      ipAddresses?: string[];
      countries?: string[];
      devices?: string[];
      sessions?: string[];
    };
    compliance?: {
      frameworks?: string[];
      requirements?: string[];
      violations?: boolean;
    };
    investigation?: {
      flagged?: boolean;
      caseId?: string;
      investigator?: string;
    };
    custom?: Record<string, any>;
  };
  aggregations?: Array<{
    field: string;
    type: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'terms' | 'date_histogram';
    parameters?: Record<string, any>;
  }>;
  sorting?: Array<{
    field: string;
    order: 'asc' | 'desc';
  }>;
  pagination: {
    page: number;
    size: number;
    total?: number;
  };
  format: {
    output: 'json' | 'csv' | 'excel' | 'pdf';
    fields?: string[];
    includeMetadata: boolean;
    redactSensitive: boolean;
  };
  metadata: {
    executedBy?: string;
    executedAt?: string;
    duration?: number; // milliseconds
    cached?: boolean;
    approximateResults?: boolean;
  };
}

export interface ComplianceReport {
  id: string;
  name: string;
  description: string;
  framework: string;
  status: 'generating' | 'completed' | 'failed' | 'expired';
  scope: {
    timeRange: {
      start: string;
      end: string;
    };
    entities: {
      users?: string[];
      systems?: string[];
      applications?: string[];
      departments?: string[];
    };
    requirements: string[];
  };
  findings: {
    summary: {
      compliant: number;
      nonCompliant: number;
      partiallyCompliant: number;
      notApplicable: number;
      overallScore: number; // percentage
    };
    details: Array<{
      requirement: string;
      status: 'compliant' | 'non_compliant' | 'partially_compliant' | 'not_applicable';
      score: number; // percentage
      evidence: Array<{
        type: string;
        description: string;
        source: string;
        timestamp: string;
        verified: boolean;
      }>;
      gaps: Array<{
        description: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        remediation: string;
        timeline: string;
        responsible: string;
      }>;
    }>;
    violations: Array<{
      id: string;
      requirement: string;
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      firstOccurrence: string;
      lastOccurrence: string;
      frequency: number;
      affected: {
        users: string[];
        systems: string[];
        data: string[];
      };
      remediation: {
        status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
        assignee?: string;
        dueDate?: string;
        actions: string[];
      };
    }>;
    trends: Array<{
      period: string;
      compliance: number; // percentage
      violations: number;
      improvements: string[];
    }>;
  };
  attestation: {
    required: boolean;
    attestor?: {
      name: string;
      title: string;
      signature?: string;
    };
    attestedAt?: string;
    statement?: string;
    conditions?: string[];
  };
  distribution: {
    internal: Array<{
      recipient: string;
      role: string;
      deliveredAt?: string;
    }>;
    external: Array<{
      authority: string;
      contact: string;
      submittedAt?: string;
      acknowledged?: boolean;
    }>;
  };
  metadata: {
    generatedBy: string;
    generatedAt: string;
    version: string;
    classification: string;
    retainUntil: string;
    tags: string[];
  };
}

export interface ForensicAnalysis {
  id: string;
  case: {
    id: string;
    name: string;
    type: 'security_incident' | 'compliance_violation' | 'fraud_investigation' | 'data_breach' | 'insider_threat';
    priority: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
    status: 'open' | 'investigating' | 'analysis' | 'resolved' | 'closed';
  };
  scope: {
    timeRange: {
      start: string;
      end: string;
      timezone: string;
    };
    entities: {
      users: string[];
      systems: string[];
      ipAddresses: string[];
      sessions: string[];
    };
    events: {
      types: string[];
      keywords: string[];
      patterns: string[];
    };
  };
  evidence: {
    collected: Array<{
      id: string;
      type: 'audit_log' | 'system_log' | 'file' | 'network_traffic' | 'memory_dump' | 'disk_image';
      source: string;
      collectedAt: string;
      collectedBy: string;
      integrity: {
        hash: string;
        algorithm: string;
        verified: boolean;
      };
      chain: Array<{
        handler: string;
        action: string;
        timestamp: string;
        location: string;
      }>;
      metadata: Record<string, any>;
    }>;
    processed: Array<{
      evidenceId: string;
      processor: string;
      processedAt: string;
      results: {
        findings: string[];
        artifacts: string[];
        indicators: Array<{
          type: string;
          value: string;
          confidence: number; // 0-100
        }>;
      };
    }>;
  };
  analysis: {
    timeline: Array<{
      timestamp: string;
      event: string;
      source: string;
      confidence: number; // 0-100
      significance: 'low' | 'medium' | 'high' | 'critical';
      details: Record<string, any>;
    }>;
    patterns: Array<{
      pattern: string;
      frequency: number;
      timeSpan: string;
      significance: string;
      related: string[];
    }>;
    anomalies: Array<{
      type: string;
      description: string;
      detected: string;
      baseline: any;
      actual: any;
      deviation: number;
      risk: string;
    }>;
    indicators: {
      compromise: Array<{
        type: string;
        indicator: string;
        confidence: number;
        first_seen: string;
        last_seen: string;
        sources: string[];
      }>;
      attack: Array<{
        technique: string;
        tactic: string;
        confidence: number;
        evidence: string[];
        mitigation: string[];
      }>;
    };
  };
  findings: {
    summary: string;
    impact: {
      severity: 'low' | 'medium' | 'high' | 'critical';
      scope: string;
      affected: {
        users: number;
        systems: number;
        data: string[];
      };
      financial?: number;
      reputation?: string;
    };
    attribution: {
      internal: boolean;
      actors: Array<{
        type: 'user' | 'group' | 'external' | 'unknown';
        identifier?: string;
        confidence: number;
        motive?: string[];
        capability?: string;
      }>;
    };
    recommendations: Array<{
      type: 'immediate' | 'short_term' | 'long_term';
      action: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      responsible: string;
      timeline: string;
      cost?: number;
    }>;
  };
  workflow: {
    investigators: Array<{
      userId: string;
      role: 'lead' | 'analyst' | 'expert' | 'observer';
      assignedAt: string;
      specialization?: string[];
    }>;
    milestones: Array<{
      name: string;
      status: 'pending' | 'in_progress' | 'completed' | 'skipped';
      deadline?: string;
      completedAt?: string;
      deliverables: string[];
    }>;
    approvals: Array<{
      step: string;
      approver: string;
      required: boolean;
      approvedAt?: string;
      comments?: string;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    classification: 'public' | 'internal' | 'confidential' | 'restricted';
    handling: string[];
    retention: number; // days
    tags: string[];
  };
}

export const auditLoggingAPI = {
  /**
   * Create audit log entry
   */
  createAuditLog: async (
    logData: Omit<AuditLog, 'id' | 'timestamp' | 'verification' | 'metadata'>
  ): Promise<AuditLog> => {
    const { data } = await api.post('/audit/logs', logData);
    return data;
  },

  /**
   * Search audit logs
   */
  searchLogs: async (query: AuditQuery): Promise<{
    results: AuditLog[];
    pagination: {
      page: number;
      size: number;
      total: number;
      totalPages: number;
    };
    aggregations?: Record<string, any>;
    metadata: {
      duration: number;
      cached: boolean;
      approximateResults: boolean;
    };
  }> => {
    const { data } = await api.post('/audit/search', query);
    return data;
  },

  /**
   * Get audit log details
   */
  getAuditLog: async (logId: string): Promise<AuditLog> => {
    const { data } = await api.get(`/audit/logs/${logId}`);
    return data;
  },

  /**
   * Create audit policy
   */
  createAuditPolicy: async (
    policyData: Omit<AuditPolicy, 'id' | 'performance' | 'metadata'>
  ): Promise<AuditPolicy> => {
    const { data } = await api.post('/audit/policies', policyData);
    return data;
  },

  /**
   * Get audit policies
   */
  getAuditPolicies: async (
    filters?: {
      status?: AuditPolicy['status'];
      framework?: string;
      scope?: string;
    }
  ): Promise<AuditPolicy[]> => {
    const { data } = await api.get('/audit/policies', { params: filters });
    return data;
  },

  /**
   * Update audit policy
   */
  updateAuditPolicy: async (
    policyId: string,
    updates: Partial<AuditPolicy>
  ): Promise<AuditPolicy> => {
    const { data } = await api.put(`/audit/policies/${policyId}`, updates);
    return data;
  },

  /**
   * Test audit policy
   */
  testAuditPolicy: async (
    policyId: string,
    testData?: {
      events?: AuditLog[];
      timeRange?: { start: string; end: string };
      dryRun?: boolean;
    }
  ): Promise<{
    matched: number;
    filtered: number;
    processed: number;
    alerts: number;
    performance: {
      duration: number;
      throughput: number;
    };
    samples: AuditLog[];
  }> => {
    const { data } = await api.post(`/audit/policies/${policyId}/test`, testData);
    return data;
  },

  /**
   * Export audit logs
   */
  exportLogs: async (
    exportConfig: {
      query: AuditQuery;
      format: 'json' | 'csv' | 'excel' | 'pdf';
      compression?: 'gzip' | 'zip';
      encryption?: {
        enabled: boolean;
        password?: string;
        certificate?: string;
      };
    }
  ): Promise<{
    downloadUrl: string;
    expiresAt: string;
    size: number;
    recordCount: number;
    checksum: string;
  }> => {
    const { data } = await api.post('/audit/export', exportConfig);
    return data;
  },

  /**
   * Import audit logs
   */
  importLogs: async (
    importConfig: {
      source: 'file' | 'api' | 'syslog' | 'database' | 'stream';
      configuration: Record<string, any>;
      validation: {
        strict: boolean;
        schema?: string;
        duplicateHandling: 'skip' | 'overwrite' | 'error';
      };
      transformation?: {
        mapping: Record<string, string>;
        filters: string[];
        enrichment: string[];
      };
    }
  ): Promise<{
    jobId: string;
    status: 'queued' | 'processing';
    estimatedCompletion?: string;
    progress: {
      processed: number;
      imported: number;
      errors: number;
      skipped: number;
    };
  }> => {
    const { data } = await api.post('/audit/import', importConfig);
    return data;
  },

  /**
   * Get import status
   */
  getImportStatus: async (
    jobId: string
  ): Promise<{
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: {
      processed: number;
      imported: number;
      errors: number;
      skipped: number;
    };
    errors: Array<{
      line: number;
      error: string;
      record?: any;
    }>;
    completedAt?: string;
  }> => {
    const { data } = await api.get(`/audit/import/${jobId}`);
    return data;
  },

  /**
   * Generate compliance report
   */
  generateComplianceReport: async (
    reportConfig: {
      framework: string;
      scope: ComplianceReport['scope'];
      format?: 'pdf' | 'excel' | 'json';
      template?: string;
      customization?: {
        logo?: string;
        branding?: Record<string, any>;
        sections?: string[];
      };
    }
  ): Promise<{
    reportId: string;
    status: 'generating';
    estimatedCompletion: string;
    downloadUrl?: string;
  }> => {
    const { data } = await api.post('/audit/compliance/reports', reportConfig);
    return data;
  },

  /**
   * Get compliance reports
   */
  getComplianceReports: async (
    filters?: {
      framework?: string;
      status?: ComplianceReport['status'];
      timeRange?: { start: string; end: string };
    }
  ): Promise<ComplianceReport[]> => {
    const { data } = await api.get('/audit/compliance/reports', { params: filters });
    return data;
  },

  /**
   * Get compliance report details
   */
  getComplianceReport: async (reportId: string): Promise<ComplianceReport> => {
    const { data } = await api.get(`/audit/compliance/reports/${reportId}`);
    return data;
  },

  /**
   * Attest compliance report
   */
  attestComplianceReport: async (
    reportId: string,
    attestation: {
      attestor: {
        name: string;
        title: string;
        signature?: string;
      };
      statement: string;
      conditions?: string[];
    }
  ): Promise<ComplianceReport> => {
    const { data } = await api.post(`/audit/compliance/reports/${reportId}/attest`, attestation);
    return data;
  },

  /**
   * Create forensic analysis
   */
  createForensicAnalysis: async (
    analysisData: Omit<ForensicAnalysis, 'id' | 'evidence' | 'analysis' | 'findings' | 'metadata'>
  ): Promise<ForensicAnalysis> => {
    const { data } = await api.post('/audit/forensics', analysisData);
    return data;
  },

  /**
   * Get forensic analyses
   */
  getForensicAnalyses: async (
    filters?: {
      caseType?: ForensicAnalysis['case']['type'];
      status?: ForensicAnalysis['case']['status'];
      priority?: ForensicAnalysis['case']['priority'];
      investigator?: string;
    }
  ): Promise<ForensicAnalysis[]> => {
    const { data } = await api.get('/audit/forensics', { params: filters });
    return data;
  },

  /**
   * Collect evidence
   */
  collectEvidence: async (
    analysisId: string,
    evidence: {
      type: string;
      source: string;
      timeRange?: { start: string; end: string };
      criteria?: Record<string, any>;
      preservation?: {
        method: string;
        location: string;
        encryption: boolean;
      };
    }
  ): Promise<{
    evidenceId: string;
    status: 'collecting';
    estimatedCompletion?: string;
    preservationLocation: string;
  }> => {
    const { data } = await api.post(`/audit/forensics/${analysisId}/evidence`, evidence);
    return data;
  },

  /**
   * Process evidence
   */
  processEvidence: async (
    analysisId: string,
    evidenceId: string,
    processing: {
      type: 'extraction' | 'correlation' | 'timeline' | 'pattern_analysis' | 'indicator_extraction';
      parameters?: Record<string, any>;
      tools?: string[];
    }
  ): Promise<{
    processingId: string;
    status: 'processing';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/audit/forensics/${analysisId}/evidence/${evidenceId}/process`, processing);
    return data;
  },

  /**
   * Get audit statistics
   */
  getAuditStatistics: async (
    timeframe: { start: string; end: string },
    breakdown?: 'day' | 'week' | 'month'
  ): Promise<{
    summary: {
      totalEvents: number;
      uniqueActors: number;
      securityEvents: number;
      complianceViolations: number;
      criticalEvents: number;
      averageEventsPerDay: number;
    };
    trends: Array<{
      period: string;
      events: number;
      actors: number;
      violations: number;
    }>;
    distribution: {
      byEventType: Record<string, number>;
      byAction: Record<string, number>;
      bySeverity: Record<string, number>;
      byOutcome: Record<string, number>;
      byActor: Record<string, number>;
    };
    compliance: {
      frameworks: Record<string, {
        covered: number;
        violations: number;
        score: number;
      }>;
      requirements: Array<{
        framework: string;
        requirement: string;
        compliance: number;
        lastViolation?: string;
      }>;
    };
  }> => {
    const { data } = await api.get('/audit/statistics', {
      params: { ...timeframe, breakdown },
    });
    return data;
  },

  /**
   * Create alert rule
   */
  createAlertRule: async (
    rule: {
      name: string;
      description: string;
      condition: string;
      threshold: number;
      timeWindow: number; // minutes
      severity: 'low' | 'medium' | 'high' | 'critical';
      actions: Array<{
        type: 'email' | 'webhook' | 'ticket' | 'block' | 'escalate';
        configuration: Record<string, any>;
        delay?: number; // seconds
      }>;
      enabled?: boolean;
    }
  ): Promise<{
    ruleId: string;
    status: 'active' | 'inactive';
    created: string;
  }> => {
    const { data } = await api.post('/audit/alerts/rules', rule);
    return data;
  },

  /**
   * Get alert rules
   */
  getAlertRules: async (
    filters?: {
      enabled?: boolean;
      severity?: string;
      type?: string;
    }
  ): Promise<Array<{
    id: string;
    name: string;
    description: string;
    severity: string;
    enabled: boolean;
    triggered: number;
    lastTriggered?: string;
    created: string;
  }>> => {
    const { data } = await api.get('/audit/alerts/rules', { params: filters });
    return data;
  },

  /**
   * Test alert rule
   */
  testAlertRule: async (
    ruleId: string,
    testData?: {
      events?: AuditLog[];
      timeRange?: { start: string; end: string };
      simulate?: boolean;
    }
  ): Promise<{
    triggered: boolean;
    matches: number;
    threshold: number;
    timeTaken: number;
    actions: Array<{
      type: string;
      executed: boolean;
      result?: any;
      error?: string;
    }>;
  }> => {
    const { data } = await api.post(`/audit/alerts/rules/${ruleId}/test`, testData);
    return data;
  },

  /**
   * Get triggered alerts
   */
  getTriggeredAlerts: async (
    filters?: {
      ruleId?: string;
      severity?: string;
      status?: 'open' | 'acknowledged' | 'resolved' | 'false_positive';
      timeRange?: { start: string; end: string };
    }
  ): Promise<Array<{
    id: string;
    ruleId: string;
    ruleName: string;
    severity: string;
    status: string;
    triggeredAt: string;
    acknowledgedAt?: string;
    resolvedAt?: string;
    events: number;
    description: string;
    metadata: Record<string, any>;
  }>> => {
    const { data } = await api.get('/audit/alerts', { params: filters });
    return data;
  },

  /**
   * Acknowledge alert
   */
  acknowledgeAlert: async (
    alertId: string,
    acknowledgment: {
      acknowledgedBy: string;
      notes?: string;
      action?: 'investigating' | 'escalating' | 'ignoring';
    }
  ): Promise<{
    alertId: string;
    acknowledgedAt: string;
    status: string;
  }> => {
    const { data } = await api.post(`/audit/alerts/${alertId}/acknowledge`, acknowledgment);
    return data;
  },

  /**
   * Resolve alert
   */
  resolveAlert: async (
    alertId: string,
    resolution: {
      resolvedBy: string;
      resolution: 'fixed' | 'false_positive' | 'accepted_risk' | 'duplicate';
      notes?: string;
      preventive_measures?: string[];
    }
  ): Promise<{
    alertId: string;
    resolvedAt: string;
    status: string;
  }> => {
    const { data } = await api.post(`/audit/alerts/${alertId}/resolve`, resolution);
    return data;
  },

  /**
   * Configure retention policy
   */
  configureRetention: async (
    policy: {
      name: string;
      default: number; // days
      categories: Record<string, number>;
      compliance: Array<{
        framework: string;
        requirement: number; // days
      }>;
      archiving: {
        enabled: boolean;
        after: number; // days
        location: string;
        compression: boolean;
      };
      deletion: {
        automatic: boolean;
        approval: 'none' | 'single' | 'dual';
        notification: string[];
      };
    }
  ): Promise<{
    policyId: string;
    status: 'active';
    effectiveDate: string;
  }> => {
    const { data } = await api.post('/audit/retention', policy);
    return data;
  },

  /**
   * Verify log integrity
   */
  verifyIntegrity: async (
    verification: {
      logIds?: string[];
      timeRange?: { start: string; end: string };
      comprehensive?: boolean;
    }
  ): Promise<{
    verified: number;
    failed: number;
    missing: number;
    corrupted: Array<{
      logId: string;
      issue: string;
      detected: string;
    }>;
    summary: {
      integrityScore: number; // percentage
      lastVerification: string;
      recommendations: string[];
    };
  }> => {
    const { data } = await api.post('/audit/verify-integrity', verification);
    return data;
  },
};

export default auditLoggingAPI;