/**
 * Security Monitoring API Services
 * Real-time threat detection, incident response, and security operations center (SOC)
 */
import { api } from './client';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'authentication' | 'authorization' | 'network' | 'application' | 'system' | 'data' | 'endpoint' | 'cloud' | 'iot';
  subtype: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  status: 'new' | 'investigating' | 'contained' | 'resolved' | 'closed' | 'false_positive';
  source: {
    type: 'sensor' | 'agent' | 'log' | 'api' | 'manual' | 'integration';
    id: string;
    name: string;
    location?: string;
    technology?: string;
    version?: string;
  };
  detection: {
    rule: {
      id: string;
      name: string;
      category: string;
      technique?: string[];
      tactic?: string[];
      confidence: number; // 0-100
    };
    method: 'signature' | 'anomaly' | 'heuristic' | 'behavior' | 'ml' | 'correlation' | 'manual';
    engine: string;
    modelVersion?: string;
  };
  target: {
    type: 'user' | 'host' | 'network' | 'application' | 'data' | 'service' | 'infrastructure';
    identifier: string;
    name?: string;
    criticality: 'low' | 'medium' | 'high' | 'critical';
    owner?: string;
    department?: string;
    location?: string;
  };
  threat: {
    category: 'malware' | 'intrusion' | 'data_breach' | 'denial_of_service' | 'fraud' | 'insider' | 'compliance' | 'misconfiguration';
    subcategory?: string;
    indicators: Array<{
      type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'user' | 'file' | 'process' | 'registry';
      value: string;
      confidence: number; // 0-100
      source?: string;
      firstSeen?: string;
      lastSeen?: string;
    }>;
    mitre: {
      tactics: string[];
      techniques: string[];
      procedures?: string[];
    };
    killChain?: {
      phase: string;
      description: string;
    };
  };
  impact: {
    scope: 'local' | 'network' | 'organization' | 'external' | 'global';
    affected: {
      users: string[];
      systems: string[];
      applications: string[];
      data: string[];
    };
    business: {
      availability: 'none' | 'minimal' | 'moderate' | 'significant' | 'severe';
      confidentiality: 'none' | 'minimal' | 'moderate' | 'significant' | 'severe';
      integrity: 'none' | 'minimal' | 'moderate' | 'significant' | 'severe';
      financial?: number;
      reputation?: 'none' | 'minimal' | 'moderate' | 'significant' | 'severe';
    };
  };
  evidence: {
    raw: Array<{
      type: string;
      content: string;
      hash?: string;
      size?: number;
      timestamp: string;
    }>;
    processed: Array<{
      type: string;
      analysis: string;
      findings: string[];
      confidence: number;
      analyst?: string;
    }>;
    artifacts: Array<{
      type: string;
      value: string;
      description: string;
      extracted: string;
    }>;
  };
  context: {
    network: {
      sourceIP?: string;
      destinationIP?: string;
      protocol?: string;
      ports?: number[];
      bytes?: number;
      packets?: number;
      country?: string;
      asn?: string;
      reputation?: number; // 0-100
    };
    process: {
      name?: string;
      pid?: number;
      ppid?: number;
      commandLine?: string;
      user?: string;
      hash?: string;
      signed?: boolean;
    };
    file: {
      name?: string;
      path?: string;
      size?: number;
      hash?: string;
      type?: string;
      created?: string;
      modified?: string;
    };
    user: {
      account?: string;
      domain?: string;
      privileges?: string[];
      lastLogin?: string;
      riskScore?: number;
    };
  };
  timeline: Array<{
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    automated: boolean;
  }>;
  enrichment: {
    threatIntelligence: Array<{
      source: string;
      type: string;
      value: string;
      confidence: number;
      reputation: number;
      categories: string[];
      firstSeen?: string;
      lastSeen?: string;
    }>;
    geolocation: {
      country?: string;
      region?: string;
      city?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
      isp?: string;
      organization?: string;
    };
    assetInfo: {
      owner?: string;
      criticality?: string;
      environment?: string;
      compliance?: string[];
      vulnerabilities?: number;
      patches?: string[];
    };
  };
  response: {
    assigned: {
      analyst?: string;
      team?: string;
      assignedAt?: string;
      escalated?: boolean;
      escalationLevel?: number;
    };
    actions: Array<{
      id: string;
      type: 'investigate' | 'contain' | 'mitigate' | 'remediate' | 'communicate' | 'document';
      action: string;
      automated: boolean;
      status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
      executedBy?: string;
      executedAt?: string;
      result?: string;
      error?: string;
    }>;
    playbook?: {
      id: string;
      name: string;
      step: number;
      totalSteps: number;
    };
  };
  metadata: {
    correlationId?: string;
    parentEvent?: string;
    childEvents?: string[];
    tags: string[];
    customFields: Record<string, any>;
    lastUpdated: string;
    version: number;
  };
}

export interface ThreatIntelligence {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'user' | 'file' | 'certificate' | 'cve' | 'yara';
  value: string;
  category: 'malicious' | 'suspicious' | 'unknown' | 'benign' | 'whitelisted';
  subcategory?: string;
  confidence: number; // 0-100
  reputation: number; // 0-100 (100 = good, 0 = bad)
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  sources: Array<{
    name: string;
    type: 'commercial' | 'open_source' | 'government' | 'community' | 'internal';
    url?: string;
    confidence: number;
    firstSeen: string;
    lastSeen: string;
    tags: string[];
  }>;
  attributes: {
    malwareFamily?: string[];
    threatGroup?: string[];
    country?: string;
    killChainPhase?: string[];
    mitreAttack?: string[];
    industry?: string[];
    targetedSectors?: string[];
  };
  context: {
    campaigns: Array<{
      id: string;
      name: string;
      startDate: string;
      endDate?: string;
      active: boolean;
    }>;
    related: Array<{
      type: string;
      value: string;
      relationship: string;
      confidence: number;
    }>;
    geolocation?: {
      country: string;
      region?: string;
      city?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
      asn?: string;
      isp?: string;
    };
    infrastructure?: {
      hosting?: string;
      registrar?: string;
      registrationDate?: string;
      expirationDate?: string;
      nameservers?: string[];
      whoisContact?: Record<string, any>;
    };
  };
  analysis: {
    behavioral: Array<{
      behavior: string;
      description: string;
      severity: string;
      confidence: number;
    }>;
    technical: {
      fileType?: string;
      size?: number;
      entropy?: number;
      packers?: string[];
      imports?: string[];
      sections?: Array<{
        name: string;
        virtualSize: number;
        entropy: number;
      }>;
      capabilities?: string[];
    };
    network: {
      communicatesTo?: string[];
      protocols?: string[];
      ports?: number[];
      dnsRequests?: string[];
      httpRequests?: Array<{
        method: string;
        url: string;
        userAgent?: string;
      }>;
    };
  };
  detection: {
    signatures: Array<{
      type: 'yara' | 'snort' | 'suricata' | 'sigma' | 'custom';
      name: string;
      content: string;
      author?: string;
      created: string;
    }>;
    iocs: Array<{
      type: string;
      value: string;
      description: string;
      confidence: number;
    }>;
    patterns: Array<{
      type: string;
      pattern: string;
      description: string;
      falsePositiveRate?: number;
    }>;
  };
  lifecycle: {
    firstSeen: string;
    lastSeen: string;
    status: 'active' | 'inactive' | 'retired' | 'false_positive';
    ttl?: number; // time to live in seconds
    expiresAt?: string;
    updates: Array<{
      timestamp: string;
      source: string;
      changes: string[];
      confidence: number;
    }>;
  };
  sharing: {
    tlp: 'white' | 'green' | 'amber' | 'red'; // Traffic Light Protocol
    sharing: Array<{
      platform: string;
      shared: boolean;
      sharedAt?: string;
      feedback?: Array<{
        source: string;
        feedback: string;
        timestamp: string;
      }>;
    }>;
    communities: string[];
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    source: string;
    tags: string[];
    customFields: Record<string, any>;
  };
}

export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  category: 'detection' | 'prevention' | 'response' | 'compliance' | 'correlation';
  type: 'signature' | 'anomaly' | 'behavior' | 'threshold' | 'correlation' | 'ml' | 'custom';
  status: 'active' | 'inactive' | 'testing' | 'deprecated';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  scope: {
    sources: string[];
    targets: string[];
    networks: string[];
    applications: string[];
    users?: string[];
    timeWindows?: Array<{
      days: string[];
      hours: { start: string; end: string };
      timezone: string;
    }>;
  };
  logic: {
    condition: string;
    query: string;
    threshold?: {
      operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne';
      value: number;
      timeWindow: number; // minutes
      aggregation?: 'count' | 'sum' | 'avg' | 'max' | 'min';
    };
    correlation?: {
      events: Array<{
        type: string;
        condition: string;
        timeWindow: number; // minutes
        required: boolean;
      }>;
      groupBy: string[];
      within: number; // minutes
    };
    machine_learning?: {
      model: string;
      algorithm: string;
      threshold: number;
      features: string[];
      trainingData: string;
    };
  };
  mitre: {
    tactics: string[];
    techniques: string[];
    subtechniques?: string[];
  };
  response: {
    automated: boolean;
    actions: Array<{
      type: 'alert' | 'block' | 'quarantine' | 'notify' | 'execute' | 'escalate';
      configuration: Record<string, any>;
      condition?: string;
      delay?: number; // seconds
    }>;
    playbook?: {
      id: string;
      name: string;
      trigger: 'immediate' | 'manual' | 'conditional';
    };
    notifications: Array<{
      channel: 'email' | 'sms' | 'webhook' | 'slack' | 'teams' | 'siem';
      recipients: string[];
      template?: string;
      throttling?: {
        rate: number; // per time window
        window: number; // minutes
      };
    }>;
  };
  testing: {
    testCases: Array<{
      name: string;
      input: Record<string, any>;
      expectedOutput: boolean;
      description: string;
    }>;
    lastTested?: string;
    testResults?: {
      passed: number;
      failed: number;
      falsePositives: number;
      falseNegatives: number;
      accuracy: number; // percentage
    };
    tuning: {
      enabled: boolean;
      method: 'manual' | 'automated' | 'ml';
      lastTuned?: string;
      improvements: Array<{
        metric: string;
        before: number;
        after: number;
        improvement: number; // percentage
      }>;
    };
  };
  performance: {
    triggers: number;
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    accuracy: number; // percentage
    precision: number; // percentage
    recall: number; // percentage
    f1Score: number;
    processingTime: number; // milliseconds
    resourceUsage: {
      cpu: number; // percentage
      memory: number; // MB
      storage: number; // MB
    };
  };
  deployment: {
    environments: string[];
    version: string;
    deployedAt: string;
    deployedBy: string;
    rollbackPlan?: string;
    dependencies: Array<{
      type: 'rule' | 'data' | 'model' | 'service';
      id: string;
      version?: string;
    }>;
  };
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    references: Array<{
      type: 'documentation' | 'research' | 'vendor' | 'cve' | 'advisory';
      url: string;
      description?: string;
    }>;
  };
}

export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  type: 'security_breach' | 'malware' | 'phishing' | 'dos_attack' | 'data_breach' | 'insider_threat' | 'compliance_violation' | 'other';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  priority: 'p1' | 'p2' | 'p3' | 'p4';
  status: 'new' | 'assigned' | 'investigating' | 'containing' | 'eradicating' | 'recovering' | 'resolved' | 'closed';
  classification: {
    confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
    tlp: 'white' | 'green' | 'amber' | 'red';
    handling: string[];
  };
  timeline: {
    detected: string;
    reported?: string;
    acknowledged?: string;
    contained?: string;
    eradicated?: string;
    recovered?: string;
    resolved?: string;
    closed?: string;
    sla: {
      acknowledgment: number; // minutes
      containment: number; // hours
      resolution: number; // hours
    };
  };
  detection: {
    method: 'automated' | 'manual' | 'external' | 'customer';
    source: string;
    events: string[];
    confidence: number; // 0-100
    falsePositive: boolean;
  };
  impact: {
    scope: 'isolated' | 'limited' | 'moderate' | 'extensive' | 'organization_wide';
    affected: {
      users: Array<{
        id: string;
        type: 'employee' | 'customer' | 'partner' | 'external';
        impact: string;
      }>;
      systems: Array<{
        id: string;
        name: string;
        type: string;
        criticality: string;
        impact: string;
      }>;
      data: Array<{
        type: string;
        classification: string;
        volume: string;
        impact: string;
      }>;
    };
    business: {
      availability: number; // percentage affected
      financial: number; // estimated cost
      reputation: 'none' | 'minimal' | 'moderate' | 'significant' | 'severe';
      compliance: string[]; // violated regulations
    };
  };
  attribution: {
    internal: boolean;
    actors: Array<{
      type: 'individual' | 'group' | 'nation_state' | 'criminal' | 'insider' | 'unknown';
      name?: string;
      confidence: number; // 0-100
      motive: string[];
      capability: 'low' | 'medium' | 'high' | 'advanced';
      indicators: Array<{
        type: string;
        value: string;
        confidence: number;
      }>;
    }>;
    campaign?: {
      id: string;
      name: string;
      relatedIncidents: string[];
    };
  };
  investigation: {
    lead: {
      userId: string;
      name: string;
      contact: string;
      assignedAt: string;
    };
    team: Array<{
      userId: string;
      role: 'investigator' | 'analyst' | 'expert' | 'coordinator' | 'communicator';
      assignedAt: string;
      expertise: string[];
    }>;
    external: Array<{
      organization: string;
      contact: string;
      role: 'law_enforcement' | 'vendor' | 'consultant' | 'legal' | 'insurance';
      engaged: boolean;
      engagedAt?: string;
    }>;
    evidence: Array<{
      id: string;
      type: string;
      description: string;
      collectedAt: string;
      collectedBy: string;
      chain: Array<{
        handler: string;
        action: string;
        timestamp: string;
      }>;
    }>;
    findings: Array<{
      category: string;
      description: string;
      evidence: string[];
      confidence: number;
      impact: string;
      recommendations: string[];
    }>;
  };
  containment: {
    strategy: 'isolation' | 'shutdown' | 'patch' | 'policy' | 'monitoring' | 'none';
    actions: Array<{
      id: string;
      action: string;
      system?: string;
      executedAt?: string;
      executedBy?: string;
      result?: string;
      automated: boolean;
    }>;
    effectiveness: number; // 0-100
    sideEffects: Array<{
      description: string;
      impact: string;
      mitigation?: string;
    }>;
  };
  eradication: {
    rootCause: Array<{
      category: string;
      description: string;
      evidence: string[];
      confidence: number;
    }>;
    actions: Array<{
      id: string;
      action: string;
      system?: string;
      executedAt?: string;
      executedBy?: string;
      result?: string;
      verification?: string;
    }>;
    verification: {
      methods: string[];
      results: Array<{
        method: string;
        result: 'clean' | 'infected' | 'unknown';
        timestamp: string;
        verifiedBy: string;
      }>;
    };
  };
  recovery: {
    plan: string;
    actions: Array<{
      id: string;
      action: string;
      system?: string;
      priority: number;
      executedAt?: string;
      executedBy?: string;
      result?: string;
    }>;
    validation: {
      methods: string[];
      results: Array<{
        method: string;
        result: 'pass' | 'fail' | 'partial';
        timestamp: string;
        validatedBy: string;
        notes?: string;
      }>;
    };
  };
  communication: {
    internal: Array<{
      audience: string;
      message: string;
      channel: string;
      sentAt: string;
      sentBy: string;
    }>;
    external: Array<{
      audience: string;
      message: string;
      channel: string;
      approved: boolean;
      approvedBy?: string;
      sentAt?: string;
      sentBy?: string;
    }>;
    regulatory: Array<{
      authority: string;
      requirement: string;
      deadline: string;
      notified: boolean;
      notifiedAt?: string;
      response?: string;
    }>;
  };
  lessons: {
    learned: Array<{
      category: string;
      description: string;
      impact: string;
      recommendations: string[];
      owner: string;
      dueDate?: string;
      status: 'open' | 'in_progress' | 'completed';
    }>;
    improvements: Array<{
      area: string;
      current: string;
      proposed: string;
      justification: string;
      cost?: number;
      timeline?: string;
      priority: 'low' | 'medium' | 'high';
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    references: string[];
    customFields: Record<string, any>;
  };
}

export interface VulnerabilityAssessment {
  id: string;
  name: string;
  description: string;
  type: 'network' | 'web_application' | 'mobile' | 'api' | 'infrastructure' | 'code' | 'configuration' | 'comprehensive';
  status: 'scheduled' | 'running' | 'completed' | 'failed' | 'cancelled';
  scope: {
    targets: Array<{
      type: 'ip_range' | 'hostname' | 'url' | 'application' | 'repository' | 'container';
      value: string;
      description?: string;
      criticality: 'low' | 'medium' | 'high' | 'critical';
    }>;
    exclusions: Array<{
      type: string;
      value: string;
      reason: string;
    }>;
    constraints: {
      timeWindows: Array<{
        start: string;
        end: string;
        timezone: string;
      }>;
      bandwidth: number; // Mbps
      concurrent: number; // max concurrent scans
      throttling: number; // delay between requests (ms)
    };
  };
  configuration: {
    tools: Array<{
      name: string;
      version: string;
      enabled: boolean;
      configuration: Record<string, any>;
    }>;
    techniques: string[];
    depth: 'surface' | 'standard' | 'deep' | 'comprehensive';
    authentication: Array<{
      type: 'basic' | 'form' | 'api_key' | 'oauth' | 'certificate';
      target: string;
      credentials?: Record<string, any>;
    }>;
    compliance: string[];
  };
  execution: {
    startedAt?: string;
    completedAt?: string;
    duration?: number; // seconds
    executedBy: string;
    environment: 'production' | 'staging' | 'development' | 'test';
    automated: boolean;
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
      nextRun?: string;
    };
  };
  results: {
    summary: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
      info: number;
      falsePositives: number;
      riskScore: number; // 0-100
    };
    vulnerabilities: Array<{
      id: string;
      cve?: string;
      title: string;
      description: string;
      severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
      cvss: {
        version: '3.1' | '3.0' | '2.0';
        vector: string;
        score: number;
        rating: string;
      };
      target: {
        host: string;
        port?: number;
        service?: string;
        url?: string;
        component?: string;
      };
      category: string;
      confidence: number; // 0-100
      exploitability: 'not_defined' | 'unproven' | 'poc' | 'functional' | 'high';
      impact: {
        confidentiality: 'none' | 'low' | 'medium' | 'high';
        integrity: 'none' | 'low' | 'medium' | 'high';
        availability: 'none' | 'low' | 'medium' | 'high';
        scope: 'unchanged' | 'changed';
      };
      evidence: Array<{
        type: 'request' | 'response' | 'screenshot' | 'output' | 'proof';
        content: string;
        description?: string;
      }>;
      remediation: {
        effort: 'low' | 'medium' | 'high';
        recommendation: string;
        steps: string[];
        references: Array<{
          type: 'vendor' | 'cve' | 'advisory' | 'article';
          url: string;
          description?: string;
        }>;
      };
      status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'false_positive' | 'risk_accepted';
      assignedTo?: string;
      dueDate?: string;
    }>;
    assets: Array<{
      target: string;
      type: string;
      services: Array<{
        port: number;
        protocol: string;
        service: string;
        version?: string;
        state: 'open' | 'closed' | 'filtered';
      }>;
      technologies: Array<{
        name: string;
        version?: string;
        component: string;
      }>;
      certificates: Array<{
        subject: string;
        issuer: string;
        expiry: string;
        valid: boolean;
      }>;
    }>;
    compliance: Array<{
      framework: string;
      score: number; // percentage
      passed: number;
      failed: number;
      requirements: Array<{
        requirement: string;
        status: 'pass' | 'fail' | 'warning' | 'info';
        details: string;
      }>;
    }>;
  };
  reporting: {
    formats: string[];
    distribution: Array<{
      recipient: string;
      format: string;
      delivered: boolean;
      deliveredAt?: string;
    }>;
    executive: {
      summary: string;
      riskRating: string;
      priorities: string[];
      timeline: string;
      budget?: number;
    };
  };
  tracking: {
    baseline?: string; // previous assessment ID
    trends: Array<{
      metric: string;
      change: number;
      direction: 'improved' | 'degraded' | 'stable';
    }>;
    remediation: {
      totalItems: number;
      completed: number;
      inProgress: number;
      overdue: number;
      averageTime: number; // days
    };
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    customFields: Record<string, any>;
  };
}

export const securityMonitoringAPI = {
  /**
   * Get security events
   */
  getSecurityEvents: async (
    filters?: {
      timeRange?: { start: string; end: string };
      types?: SecurityEvent['type'][];
      severities?: SecurityEvent['severity'][];
      statuses?: SecurityEvent['status'][];
      sources?: string[];
      assignee?: string;
      limit?: number;
    }
  ): Promise<SecurityEvent[]> => {
    const { data } = await api.get('/security/events', { params: filters });
    return data;
  },

  /**
   * Get security event details
   */
  getSecurityEvent: async (eventId: string): Promise<SecurityEvent> => {
    const { data } = await api.get(`/security/events/${eventId}`);
    return data;
  },

  /**
   * Update security event status
   */
  updateSecurityEventStatus: async (
    eventId: string,
    update: {
      status: SecurityEvent['status'];
      assignee?: string;
      notes?: string;
    }
  ): Promise<SecurityEvent> => {
    const { data } = await api.put(`/security/events/${eventId}/status`, update);
    return data;
  },

  /**
   * Correlate security events
   */
  correlateEvents: async (
    correlation: {
      eventIds: string[];
      type: 'manual' | 'automated';
      reason: string;
      timeWindow?: number; // minutes
    }
  ): Promise<{
    correlationId: string;
    events: SecurityEvent[];
    confidence: number;
    patterns: string[];
  }> => {
    const { data } = await api.post('/security/events/correlate', correlation);
    return data;
  },

  /**
   * Create threat intelligence entry
   */
  createThreatIntelligence: async (
    intel: Omit<ThreatIntelligence, 'id' | 'lifecycle' | 'metadata'>
  ): Promise<ThreatIntelligence> => {
    const { data } = await api.post('/security/threat-intelligence', intel);
    return data;
  },

  /**
   * Get threat intelligence
   */
  getThreatIntelligence: async (
    filters?: {
      types?: ThreatIntelligence['type'][];
      categories?: ThreatIntelligence['category'][];
      severities?: ThreatIntelligence['severity'][];
      search?: string;
      active?: boolean;
    }
  ): Promise<ThreatIntelligence[]> => {
    const { data } = await api.get('/security/threat-intelligence', { params: filters });
    return data;
  },

  /**
   * Lookup threat intelligence
   */
  lookupThreatIntelligence: async (
    indicators: Array<{
      type: string;
      value: string;
    }>
  ): Promise<Array<ThreatIntelligence & {
    indicator: { type: string; value: string };
    matches: number;
    confidence: number;
  }>> => {
    const { data } = await api.post('/security/threat-intelligence/lookup', { indicators });
    return data;
  },

  /**
   * Enrich security event
   */
  enrichSecurityEvent: async (
    eventId: string,
    enrichment?: {
      threatIntel?: boolean;
      geolocation?: boolean;
      assetInfo?: boolean;
      reputation?: boolean;
      dns?: boolean;
      whois?: boolean;
    }
  ): Promise<SecurityEvent> => {
    const { data } = await api.post(`/security/events/${eventId}/enrich`, enrichment);
    return data;
  },

  /**
   * Create security rule
   */
  createSecurityRule: async (
    rule: Omit<SecurityRule, 'id' | 'performance' | 'deployment' | 'metadata'>
  ): Promise<SecurityRule> => {
    const { data } = await api.post('/security/rules', rule);
    return data;
  },

  /**
   * Get security rules
   */
  getSecurityRules: async (
    filters?: {
      categories?: SecurityRule['category'][];
      types?: SecurityRule['type'][];
      statuses?: SecurityRule['status'][];
      search?: string;
    }
  ): Promise<SecurityRule[]> => {
    const { data } = await api.get('/security/rules', { params: filters });
    return data;
  },

  /**
   * Test security rule
   */
  testSecurityRule: async (
    ruleId: string,
    testData: {
      events?: any[];
      timeRange?: { start: string; end: string };
      dryRun?: boolean;
    }
  ): Promise<{
    triggered: boolean;
    matches: number;
    falsePositives: number;
    performance: {
      executionTime: number;
      resourceUsage: Record<string, number>;
    };
    recommendations: string[];
  }> => {
    const { data } = await api.post(`/security/rules/${ruleId}/test`, testData);
    return data;
  },

  /**
   * Deploy security rule
   */
  deploySecurityRule: async (
    ruleId: string,
    deployment: {
      environments: string[];
      rollout: 'immediate' | 'gradual' | 'scheduled';
      schedule?: string;
      rollbackPlan?: string;
    }
  ): Promise<{
    deploymentId: string;
    status: 'deploying' | 'deployed' | 'failed';
    environments: Record<string, string>; // environment -> status
  }> => {
    const { data } = await api.post(`/security/rules/${ruleId}/deploy`, deployment);
    return data;
  },

  /**
   * Create security incident
   */
  createSecurityIncident: async (
    incident: Omit<SecurityIncident, 'id' | 'timeline' | 'investigation' | 'metadata'>
  ): Promise<SecurityIncident> => {
    const { data } = await api.post('/security/incidents', incident);
    return data;
  },

  /**
   * Get security incidents
   */
  getSecurityIncidents: async (
    filters?: {
      types?: SecurityIncident['type'][];
      severities?: SecurityIncident['severity'][];
      statuses?: SecurityIncident['status'][];
      assignee?: string;
      timeRange?: { start: string; end: string };
    }
  ): Promise<SecurityIncident[]> => {
    const { data } = await api.get('/security/incidents', { params: filters });
    return data;
  },

  /**
   * Get security incident details
   */
  getSecurityIncident: async (incidentId: string): Promise<SecurityIncident> => {
    const { data } = await api.get(`/security/incidents/${incidentId}`);
    return data;
  },

  /**
   * Update incident status
   */
  updateIncidentStatus: async (
    incidentId: string,
    update: {
      status: SecurityIncident['status'];
      notes?: string;
      assignee?: string;
    }
  ): Promise<SecurityIncident> => {
    const { data } = await api.put(`/security/incidents/${incidentId}/status`, update);
    return data;
  },

  /**
   * Add incident action
   */
  addIncidentAction: async (
    incidentId: string,
    action: {
      type: string;
      action: string;
      automated?: boolean;
      assignee?: string;
      dueDate?: string;
    }
  ): Promise<SecurityIncident> => {
    const { data } = await api.post(`/security/incidents/${incidentId}/actions`, action);
    return data;
  },

  /**
   * Create vulnerability assessment
   */
  createVulnerabilityAssessment: async (
    assessment: Omit<VulnerabilityAssessment, 'id' | 'results' | 'tracking' | 'metadata'>
  ): Promise<VulnerabilityAssessment> => {
    const { data } = await api.post('/security/vulnerability-assessments', assessment);
    return data;
  },

  /**
   * Get vulnerability assessments
   */
  getVulnerabilityAssessments: async (
    filters?: {
      types?: VulnerabilityAssessment['type'][];
      statuses?: VulnerabilityAssessment['status'][];
      targets?: string[];
      timeRange?: { start: string; end: string };
    }
  ): Promise<VulnerabilityAssessment[]> => {
    const { data } = await api.get('/security/vulnerability-assessments', { params: filters });
    return data;
  },

  /**
   * Start vulnerability assessment
   */
  startVulnerabilityAssessment: async (
    assessmentId: string,
    options?: {
      immediate?: boolean;
      schedule?: string;
      notify?: string[];
    }
  ): Promise<{
    assessmentId: string;
    status: 'started' | 'scheduled';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/security/vulnerability-assessments/${assessmentId}/start`, options);
    return data;
  },

  /**
   * Get vulnerability assessment results
   */
  getVulnerabilityResults: async (
    assessmentId: string,
    filters?: {
      severities?: string[];
      statuses?: string[];
      components?: string[];
    }
  ): Promise<VulnerabilityAssessment['results']> => {
    const { data } = await api.get(`/security/vulnerability-assessments/${assessmentId}/results`, {
      params: filters,
    });
    return data;
  },

  /**
   * Update vulnerability status
   */
  updateVulnerabilityStatus: async (
    assessmentId: string,
    vulnerabilityId: string,
    update: {
      status: string;
      assignedTo?: string;
      dueDate?: string;
      notes?: string;
    }
  ): Promise<VulnerabilityAssessment['results']['vulnerabilities'][0]> => {
    const { data } = await api.put(
      `/security/vulnerability-assessments/${assessmentId}/vulnerabilities/${vulnerabilityId}`,
      update
    );
    return data;
  },

  /**
   * Get security dashboard
   */
  getSecurityDashboard: async (
    timeframe?: { start: string; end: string }
  ): Promise<{
    summary: {
      events: {
        total: number;
        critical: number;
        new: number;
        investigating: number;
      };
      incidents: {
        total: number;
        open: number;
        critical: number;
        avgResolutionTime: number;
      };
      vulnerabilities: {
        total: number;
        critical: number;
        high: number;
        unresolved: number;
      };
      threats: {
        blocked: number;
        detected: number;
        active: number;
        campaigns: number;
      };
    };
    metrics: {
      mttr: number; // mean time to response
      mttc: number; // mean time to containment
      mttr_resolution: number; // mean time to resolution
      falsePositiveRate: number;
      coverage: number; // percentage
      effectiveness: number; // percentage
    };
    trends: Array<{
      date: string;
      events: number;
      incidents: number;
      vulnerabilities: number;
      threats: number;
    }>;
    topThreats: Array<{
      type: string;
      count: number;
      severity: string;
      trend: 'up' | 'down' | 'stable';
    }>;
    topTargets: Array<{
      target: string;
      type: string;
      events: number;
      riskScore: number;
    }>;
    alerts: Array<{
      id: string;
      type: string;
      message: string;
      severity: string;
      timestamp: string;
    }>;
  }> => {
    const { data } = await api.get('/security/dashboard', { params: timeframe });
    return data;
  },

  /**
   * Export security report
   */
  exportSecurityReport: async (
    reportConfig: {
      type: 'events' | 'incidents' | 'vulnerabilities' | 'threats' | 'comprehensive';
      timeframe: { start: string; end: string };
      format: 'pdf' | 'excel' | 'csv' | 'json';
      filters?: Record<string, any>;
      sections?: string[];
    }
  ): Promise<{
    downloadUrl: string;
    expiresAt: string;
    size: number;
    format: string;
  }> => {
    const { data } = await api.post('/security/reports/export', reportConfig);
    return data;
  },

  /**
   * Configure threat feed
   */
  configureThreatFeed: async (
    feed: {
      name: string;
      type: 'commercial' | 'open_source' | 'government' | 'community';
      url: string;
      format: 'json' | 'xml' | 'csv' | 'stix' | 'misp';
      authentication?: Record<string, any>;
      schedule: {
        frequency: 'hourly' | 'daily' | 'weekly';
        time?: string;
      };
      processing: {
        filters: string[];
        enrichment: boolean;
        deduplication: boolean;
      };
    }
  ): Promise<{
    feedId: string;
    status: 'configured';
    nextSync: string;
  }> => {
    const { data } = await api.post('/security/threat-feeds', feed);
    return data;
  },

  /**
   * Get threat feeds
   */
  getThreatFeeds: async (): Promise<Array<{
    id: string;
    name: string;
    type: string;
    status: 'active' | 'inactive' | 'error';
    lastSync: string;
    nextSync: string;
    records: number;
    errors: number;
  }>> => {
    const { data } = await api.get('/security/threat-feeds');
    return data;
  },

  /**
   * Sync threat feed
   */
  syncThreatFeed: async (
    feedId: string,
    options?: {
      immediate?: boolean;
      fullSync?: boolean;
    }
  ): Promise<{
    syncId: string;
    status: 'started';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/security/threat-feeds/${feedId}/sync`, options);
    return data;
  },

  /**
   * Hunt threats
   */
  huntThreats: async (
    hunt: {
      name: string;
      description: string;
      hypothesis: string;
      queries: Array<{
        name: string;
        query: string;
        timeRange: { start: string; end: string };
        dataSource: string;
      }>;
      indicators?: Array<{
        type: string;
        value: string;
      }>;
    }
  ): Promise<{
    huntId: string;
    status: 'started';
    estimatedCompletion?: string;
    queries: number;
  }> => {
    const { data } = await api.post('/security/threat-hunting', hunt);
    return data;
  },

  /**
   * Get threat hunting results
   */
  getThreatHuntingResults: async (
    huntId: string
  ): Promise<{
    huntId: string;
    status: 'running' | 'completed' | 'failed';
    progress: number; // percentage
    results: Array<{
      query: string;
      matches: number;
      confidence: number;
      findings: Array<{
        type: string;
        description: string;
        evidence: any[];
        risk: string;
      }>;
    }>;
    summary: {
      totalFindings: number;
      highConfidence: number;
      recommendations: string[];
    };
  }> => {
    const { data } = await api.get(`/security/threat-hunting/${huntId}`);
    return data;
  },

  /**
   * Configure SOAR playbook
   */
  configurePlaybook: async (
    playbook: {
      name: string;
      description: string;
      triggers: Array<{
        type: 'event' | 'incident' | 'alert' | 'manual';
        condition: string;
        enabled: boolean;
      }>;
      actions: Array<{
        id: string;
        type: 'investigate' | 'contain' | 'notify' | 'enrich' | 'escalate' | 'custom';
        configuration: Record<string, any>;
        condition?: string;
        timeout?: number;
        retries?: number;
      }>;
      approval?: {
        required: boolean;
        approvers: string[];
        timeout: number;
      };
    }
  ): Promise<{
    playbookId: string;
    status: 'active';
    triggers: number;
    actions: number;
  }> => {
    const { data } = await api.post('/security/playbooks', playbook);
    return data;
  },

  /**
   * Execute playbook
   */
  executePlaybook: async (
    playbookId: string,
    context: {
      triggerType: string;
      entityId: string;
      parameters?: Record<string, any>;
      manual?: boolean;
    }
  ): Promise<{
    executionId: string;
    status: 'started';
    estimatedCompletion?: string;
    actions: number;
  }> => {
    const { data } = await api.post(`/security/playbooks/${playbookId}/execute`, context);
    return data;
  },

  /**
   * Get playbook execution status
   */
  getPlaybookExecution: async (
    executionId: string
  ): Promise<{
    executionId: string;
    playbookId: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    progress: number; // percentage
    actions: Array<{
      id: string;
      name: string;
      status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
      startedAt?: string;
      completedAt?: string;
      result?: any;
      error?: string;
    }>;
    metadata: {
      startedAt: string;
      completedAt?: string;
      duration?: number;
      triggeredBy: string;
    };
  }> => {
    const { data } = await api.get(`/security/playbooks/executions/${executionId}`);
    return data;
  },
};

export default securityMonitoringAPI;