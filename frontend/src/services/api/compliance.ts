/**
 * Compliance API Services
 * International trade compliance, regulations, and legal requirements
 */
import { api } from './client';

export interface ComplianceRegulation {
  id: string;
  code: string; // regulation code (e.g., 'GDPR', 'CCPA', 'SOX', 'HIPAA')
  name: string;
  fullName: string;
  description: string;
  type: 'data_protection' | 'financial' | 'healthcare' | 'trade' | 'environmental' | 'labor' | 'safety' | 'tax' | 'other';
  category: 'privacy' | 'security' | 'financial_reporting' | 'import_export' | 'product_safety' | 'employment' | 'environmental' | 'consumer_protection';
  jurisdiction: {
    type: 'country' | 'region' | 'state' | 'industry' | 'global';
    coverage: string[]; // countries, states, or regions
    enforcement: Array<{
      authority: string;
      type: 'government' | 'regulatory' | 'industry';
      contact: {
        website?: string;
        email?: string;
        phone?: string;
      };
      powers: string[]; // enforcement powers
    }>;
  };
  scope: {
    entities: Array<{
      type: 'business' | 'individual' | 'non_profit' | 'government';
      criteria: Record<string, any>; // size, revenue, etc.
      exemptions?: string[];
    }>;
    activities: string[]; // business activities covered
    dataTypes?: string[]; // types of data covered
    threshold?: {
      revenue?: { amount: number; currency: string };
      employees?: number;
      users?: number;
      transactions?: number;
      dataRecords?: number;
    };
    geographicScope: {
      countries: string[];
      extraterritorial: boolean; // applies outside jurisdiction
      dataTransfer: boolean; // covers cross-border data transfer
    };
  };
  requirements: Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    mandatory: boolean;
    implementation: {
      deadline?: string;
      phaseInPeriod?: string;
      gracePeriod?: string;
      conditions?: string[];
    };
    evidence: Array<{
      type: 'policy' | 'procedure' | 'documentation' | 'audit' | 'certification' | 'training';
      description: string;
      frequency?: 'one_time' | 'annual' | 'quarterly' | 'monthly' | 'continuous';
      retention?: string; // retention period
    }>;
    controls: Array<{
      control: string;
      description: string;
      testing: string;
      frequency: string;
    }>;
  }>;
  penalties: Array<{
    violation: string;
    type: 'monetary' | 'suspension' | 'revocation' | 'criminal' | 'administrative';
    amount?: {
      fixed?: number;
      percentage?: number;
      maximum?: number;
      currency: string;
      basis?: string; // what the percentage is based on
    };
    description: string;
    precedents?: Array<{
      case: string;
      penalty: string;
      year: number;
      amount?: number;
    }>;
  }>;
  timeline: {
    enacted: string;
    effective: string;
    lastAmended?: string;
    nextReview?: string;
    sunset?: string; // expiration date
    phases?: Array<{
      phase: string;
      effectiveDate: string;
      requirements: string[];
    }>;
  };
  updates: Array<{
    date: string;
    type: 'amendment' | 'guidance' | 'interpretation' | 'enforcement';
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    url?: string;
  }>;
  compliance: {
    assessmentFrequency: 'annual' | 'biannual' | 'quarterly' | 'continuous';
    reportingDeadlines: Array<{
      type: string;
      frequency: string;
      deadline: string;
      recipient: string;
    }>;
    auditRequirements: {
      internal: boolean;
      external: boolean;
      frequency: string;
      certificationRequired: boolean;
    };
    dataRetention: {
      compliance: string; // retention for compliance records
      evidence: string; // retention for evidence
      breach: string; // retention after breach
    };
  };
  resources: Array<{
    type: 'guide' | 'template' | 'checklist' | 'tool' | 'training' | 'consultation';
    title: string;
    description: string;
    provider: string;
    url?: string;
    cost?: number;
    language: string[];
  }>;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    status: 'active' | 'superseded' | 'proposed' | 'draft';
    reliability: number; // 0-100 data quality score
    sources: Array<{
      type: 'official' | 'legal' | 'guidance' | 'interpretation';
      url: string;
      date: string;
      reliability: number;
    }>;
    tags: string[];
  };
}

export interface ComplianceRequirement {
  id: string;
  regulationId: string;
  regulationCode: string;
  category: string;
  title: string;
  description: string;
  type: 'policy' | 'procedure' | 'technical' | 'documentation' | 'training' | 'audit' | 'reporting';
  priority: 'low' | 'medium' | 'high' | 'critical';
  mandatory: boolean;
  applicability: {
    entityTypes: string[];
    activities: string[];
    conditions: Record<string, any>;
    exemptions?: Array<{
      condition: string;
      description: string;
      documentation?: string;
    }>;
  };
  implementation: {
    steps: Array<{
      order: number;
      step: string;
      description: string;
      responsible: string[]; // roles responsible
      deadline?: string;
      dependencies?: string[];
      resources?: string[];
    }>;
    timeline: {
      estimatedDuration: string;
      deadline?: string;
      milestones?: Array<{
        name: string;
        date: string;
        deliverables: string[];
      }>;
    };
    cost: {
      implementation: { min: number; max: number; currency: string };
      ongoing: { annual: number; currency: string };
      components: Array<{
        component: string;
        cost: number;
        type: 'one_time' | 'recurring';
      }>;
    };
  };
  verification: {
    methods: Array<{
      type: 'self_assessment' | 'audit' | 'certification' | 'testing' | 'review';
      description: string;
      frequency: string;
      responsible: string;
      documentation: string[];
    }>;
    evidence: Array<{
      type: string;
      description: string;
      format: string[];
      retention: string;
      location?: string;
    }>;
    monitoring: {
      continuous: boolean;
      metrics: Array<{
        metric: string;
        target: string;
        measurement: string;
        frequency: string;
      }>;
      alerts: Array<{
        trigger: string;
        threshold: string;
        action: string;
        recipients: string[];
      }>;
    };
  };
  dependencies: Array<{
    type: 'requires' | 'supports' | 'conflicts';
    requirementId: string;
    description: string;
  }>;
  risks: Array<{
    risk: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high' | 'critical';
    mitigation: string[];
    owner: string;
  }>;
  status: {
    implementationStatus: 'not_started' | 'planning' | 'in_progress' | 'testing' | 'completed' | 'failed';
    complianceStatus: 'compliant' | 'non_compliant' | 'partially_compliant' | 'unknown';
    lastAssessed: string;
    nextAssessment: string;
    notes?: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    assignedTo?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    version: number;
    tags: string[];
  };
}

export interface ComplianceAssessment {
  id: string;
  name: string;
  description?: string;
  type: 'self_assessment' | 'internal_audit' | 'external_audit' | 'certification' | 'gap_analysis';
  scope: {
    regulations: string[]; // regulation IDs
    requirements?: string[]; // specific requirement IDs
    entityScope: {
      departments?: string[];
      locations?: string[];
      systems?: string[];
      processes?: string[];
    };
    timeframe: {
      start: string;
      end: string;
      cutoffDate: string; // assessment cutoff
    };
  };
  methodology: {
    framework: string; // assessment framework used
    approach: 'risk_based' | 'comprehensive' | 'sampling' | 'targeted';
    procedures: Array<{
      procedure: string;
      description: string;
      evidence: string[];
      testing?: string;
    }>;
    criteria: {
      rating: 'pass_fail' | 'scored' | 'risk_based' | 'maturity';
      scale?: Array<{
        level: string;
        description: string;
        criteria: string[];
      }>;
    };
  };
  team: {
    lead: {
      id: string;
      name: string;
      role: string;
      qualifications: string[];
    };
    members: Array<{
      id: string;
      name: string;
      role: string;
      responsibilities: string[];
      availability: { start: string; end: string };
    }>;
    external?: Array<{
      firm: string;
      contact: string;
      role: string;
      scope: string[];
    }>;
  };
  results: {
    summary: {
      overallStatus: 'compliant' | 'non_compliant' | 'partially_compliant';
      score?: number; // if scored assessment
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
      completionRate: number; // percentage
    };
    byRegulation: Record<string, {
      status: 'compliant' | 'non_compliant' | 'partially_compliant';
      score?: number;
      findings: number;
      criticalFindings: number;
      recommendations: number;
    }>;
    findings: Array<{
      id: string;
      requirementId: string;
      type: 'gap' | 'deficiency' | 'weakness' | 'observation' | 'non_compliance';
      severity: 'low' | 'medium' | 'high' | 'critical';
      title: string;
      description: string;
      evidence: string[];
      impact: string;
      recommendation: string;
      responsible: string;
      deadline?: string;
      status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
    }>;
    recommendations: Array<{
      id: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      title: string;
      description: string;
      benefits: string[];
      implementation: {
        steps: string[];
        timeline: string;
        cost?: number;
        resources: string[];
      };
      responsible: string;
      deadline?: string;
    }>;
  };
  timeline: {
    plannedStart: string;
    actualStart?: string;
    plannedEnd: string;
    actualEnd?: string;
    phases: Array<{
      phase: string;
      start: string;
      end?: string;
      status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
      deliverables: Array<{
        deliverable: string;
        due: string;
        status: 'pending' | 'completed' | 'overdue';
      }>;
    }>;
  };
  documentation: Array<{
    id: string;
    type: 'plan' | 'evidence' | 'report' | 'certification' | 'correspondence';
    title: string;
    description?: string;
    url: string;
    uploadedAt: string;
    uploadedBy: string;
    confidential: boolean;
    retention: string;
  }>;
  followUp: {
    required: boolean;
    schedule?: Array<{
      activity: string;
      date: string;
      responsible: string;
      status: 'scheduled' | 'completed' | 'overdue';
    }>;
    nextAssessment?: string;
    continuousMonitoring: boolean;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    status: 'planning' | 'in_progress' | 'under_review' | 'completed' | 'cancelled';
    confidentiality: 'public' | 'internal' | 'restricted' | 'confidential';
    tags: string[];
  };
}

export interface ComplianceRisk {
  id: string;
  name: string;
  description: string;
  category: 'regulatory' | 'operational' | 'financial' | 'reputational' | 'strategic' | 'legal';
  type: 'inherent' | 'residual' | 'emerging' | 'historical';
  probability: {
    current: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
    trend: 'increasing' | 'stable' | 'decreasing';
    factors: Array<{
      factor: string;
      impact: 'increases' | 'decreases' | 'neutral';
      weight: number; // 0-100
    }>;
  };
  impact: {
    financial?: {
      min: number;
      max: number;
      currency: string;
      basis: string; // revenue, profit, etc.
    };
    operational?: {
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      areas: string[];
    };
    reputational?: {
      severity: 'low' | 'medium' | 'high' | 'critical';
      stakeholders: string[];
      duration: string;
    };
    legal?: {
      penalties: Array<{
        type: string;
        amount?: number;
        description: string;
      }>;
      enforcement: string[];
      precedents?: string[];
    };
  };
  regulations: Array<{
    regulationId: string;
    requirementIds?: string[];
    relationship: 'violation' | 'non_compliance' | 'inadequate_control';
  }>;
  controls: Array<{
    id: string;
    type: 'preventive' | 'detective' | 'corrective';
    description: string;
    effectiveness: 'ineffective' | 'partially_effective' | 'effective' | 'highly_effective';
    frequency: string;
    owner: string;
    testing: {
      method: string;
      frequency: string;
      lastTested?: string;
      nextTest?: string;
      results?: string;
    };
    gaps?: string[];
  }>;
  mitigation: {
    strategy: 'accept' | 'avoid' | 'mitigate' | 'transfer';
    actions: Array<{
      id: string;
      action: string;
      type: 'preventive' | 'detective' | 'corrective' | 'compensating';
      responsible: string;
      deadline?: string;
      status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
      cost?: number;
      effectiveness?: number; // 0-100 expected reduction
    }>;
    monitoring: {
      kri: Array<{ // Key Risk Indicators
        indicator: string;
        threshold: string;
        measurement: string;
        frequency: string;
        owner: string;
      }>;
      reporting: {
        frequency: string;
        recipients: string[];
        escalation: Array<{
          level: string;
          trigger: string;
          recipients: string[];
          timeline: string;
        }>;
      };
    };
  };
  assessment: {
    inherentRisk: {
      probability: number; // 1-5
      impact: number; // 1-5
      score: number; // probability × impact
    };
    residualRisk: {
      probability: number; // 1-5
      impact: number; // 1-5
      score: number; // probability × impact
    };
    lastAssessed: string;
    nextAssessment: string;
    assessor: string;
    methodology: string;
  };
  incidents: Array<{
    id: string;
    date: string;
    description: string;
    impact: string;
    response: string[];
    lessons: string[];
    status: 'open' | 'investigating' | 'resolved' | 'closed';
  }>;
  metadata: {
    createdAt: string;
    updatedAt: string;
    owner: string;
    reviewers: string[];
    lastReview: string;
    nextReview: string;
    tags: string[];
  };
}

export interface ComplianceProgram {
  id: string;
  name: string;
  description: string;
  type: 'comprehensive' | 'focused' | 'pilot' | 'remediation';
  status: 'planning' | 'implementing' | 'operating' | 'reviewing' | 'improving' | 'suspended';
  scope: {
    regulations: string[];
    businessUnits: string[];
    geographies: string[];
    systems: string[];
    processes: string[];
  };
  objectives: Array<{
    objective: string;
    measurable: boolean;
    target: string;
    deadline: string;
    owner: string;
    metrics: Array<{
      metric: string;
      baseline?: number;
      target: number;
      current?: number;
      unit: string;
    }>;
  }>;
  governance: {
    sponsor: {
      id: string;
      name: string;
      role: string;
      responsibilities: string[];
    };
    steeringCommittee: Array<{
      id: string;
      name: string;
      role: string;
      organization: string;
      responsibilities: string[];
    }>;
    complianceOfficer: {
      id: string;
      name: string;
      qualifications: string[];
      authority: string[];
      reportingLine: string;
    };
    workingGroups: Array<{
      name: string;
      purpose: string;
      lead: string;
      members: string[];
      deliverables: string[];
    }>;
  };
  policies: Array<{
    id: string;
    name: string;
    version: string;
    description: string;
    scope: string[];
    owner: string;
    approver: string;
    effectiveDate: string;
    reviewDate: string;
    status: 'draft' | 'approved' | 'effective' | 'superseded';
    url?: string;
    training: {
      required: boolean;
      audience: string[];
      frequency: string;
    };
  }>;
  procedures: Array<{
    id: string;
    name: string;
    policyId: string;
    process: string;
    steps: Array<{
      step: string;
      responsible: string;
      inputs: string[];
      outputs: string[];
      controls: string[];
    }>;
    frequency: string;
    documentation: string[];
    training: boolean;
  }>;
  controls: Array<{
    id: string;
    name: string;
    type: 'policy' | 'procedure' | 'technical' | 'physical';
    objective: string;
    description: string;
    frequency: string;
    owner: string;
    effectiveness: number; // 0-100
    testing: {
      method: string;
      frequency: string;
      lastTest?: string;
      nextTest?: string;
      tester: string;
    };
  }>;
  training: {
    programs: Array<{
      id: string;
      name: string;
      audience: string[];
      content: string[];
      delivery: 'online' | 'classroom' | 'blended';
      duration: string;
      frequency: string;
      mandatory: boolean;
      tracking: boolean;
    }>;
    completion: {
      overall: number; // percentage
      byProgram: Record<string, number>;
      overdue: number;
    };
  };
  monitoring: {
    kpi: Array<{
      indicator: string;
      description: string;
      target: string;
      current?: string;
      trend: 'improving' | 'stable' | 'declining';
      frequency: string;
      owner: string;
    }>;
    reporting: {
      frequency: string;
      recipients: Array<{
        role: string;
        name: string;
        reports: string[];
      }>;
      dashboards: Array<{
        name: string;
        audience: string[];
        metrics: string[];
        frequency: string;
      }>;
    };
    audits: {
      schedule: Array<{
        type: 'internal' | 'external' | 'regulatory';
        frequency: string;
        scope: string[];
        next: string;
      }>;
      findings: {
        open: number;
        overdue: number;
        critical: number;
        byCategory: Record<string, number>;
      };
    };
  };
  budget: {
    total: number;
    currency: string;
    breakdown: {
      personnel: number;
      technology: number;
      training: number;
      external: number;
      other: number;
    };
    actual: {
      spent: number;
      committed: number;
      remaining: number;
    };
    forecast: Array<{
      period: string;
      amount: number;
      category: string;
    }>;
  };
  timeline: {
    start: string;
    phases: Array<{
      phase: string;
      start: string;
      end: string;
      status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
      deliverables: Array<{
        deliverable: string;
        due: string;
        responsible: string;
        status: 'pending' | 'completed' | 'overdue';
      }>;
    }>;
    milestones: Array<{
      milestone: string;
      date: string;
      dependencies: string[];
      critical: boolean;
      status: 'pending' | 'achieved' | 'missed';
    }>;
  };
  metrics: {
    maturity: {
      current: number; // 1-5
      target: number; // 1-5
      areas: Record<string, number>;
      improvement: Array<{
        area: string;
        gap: number;
        actions: string[];
      }>;
    };
    effectiveness: {
      overall: number; // 0-100
      byRegulation: Record<string, number>;
      trends: Array<{
        date: string;
        score: number;
      }>;
    };
    incidents: {
      total: number;
      byType: Record<string, number>;
      resolved: number;
      avgResolutionTime: number; // days
    };
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    lastReview: string;
    nextReview: string;
    tags: string[];
  };
}

export interface ComplianceIncident {
  id: string;
  title: string;
  description: string;
  type: 'violation' | 'breach' | 'near_miss' | 'complaint' | 'audit_finding' | 'regulatory_inquiry';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved' | 'closed' | 'escalated';
  regulations: Array<{
    regulationId: string;
    requirementIds?: string[];
    violationType: 'technical' | 'procedural' | 'reporting' | 'disclosure';
  }>;
  discovery: {
    date: string;
    method: 'self_discovery' | 'audit' | 'complaint' | 'regulatory_review' | 'third_party';
    discoveredBy: string;
    reportedDate: string;
    reportedBy: string;
  };
  details: {
    whatHappened: string;
    whenOccurred: { start: string; end?: string };
    whereOccurred: string[];
    whoInvolved: string[];
    whyCaused: string[];
    howDetected: string;
  };
  impact: {
    financial?: {
      loss: number;
      potential: number;
      currency: string;
    };
    operational?: {
      description: string;
      duration: string;
      systemsAffected: string[];
    };
    regulatory?: {
      violations: string[];
      reportingRequired: boolean;
      authorities: string[];
      deadlines: Array<{
        authority: string;
        deadline: string;
        status: 'pending' | 'submitted' | 'overdue';
      }>;
    };
    reputational?: {
      description: string;
      stakeholders: string[];
      mediaAttention: boolean;
    };
    customers?: {
      affected: number;
      dataTypes?: string[];
      notificationRequired: boolean;
      notificationDeadline?: string;
    };
  };
  investigation: {
    lead: string;
    team: string[];
    methodology: string;
    timeline: {
      started: string;
      targetCompletion: string;
      actualCompletion?: string;
    };
    findings: Array<{
      finding: string;
      evidence: string[];
      responsible: string[];
      contributing: string[];
    }>;
    rootCause: {
      primary: string;
      contributing: string[];
      category: 'process' | 'people' | 'technology' | 'external';
    };
  };
  response: {
    immediate: Array<{
      action: string;
      responsible: string;
      completedAt?: string;
      effective: boolean;
    }>;
    corrective: Array<{
      action: string;
      responsible: string;
      deadline: string;
      status: 'planned' | 'in_progress' | 'completed' | 'overdue';
      verification?: string;
    }>;
    preventive: Array<{
      action: string;
      responsible: string;
      deadline: string;
      scope: string[];
      status: 'planned' | 'in_progress' | 'completed';
    }>;
  };
  communication: {
    internal: Array<{
      audience: string;
      method: string;
      date: string;
      message: string;
      response?: string;
    }>;
    external: Array<{
      recipient: string;
      method: string;
      date: string;
      purpose: string;
      response?: string;
      followUp?: string;
    }>;
    regulatory: Array<{
      authority: string;
      requirement: string;
      method: string;
      date: string;
      reference: string;
      response?: string;
    }>;
  };
  documentation: Array<{
    type: 'evidence' | 'correspondence' | 'report' | 'analysis' | 'notification';
    title: string;
    url: string;
    uploadedAt: string;
    confidential: boolean;
  }>;
  lessons: {
    learned: string[];
    improvements: Array<{
      area: string;
      improvement: string;
      responsible: string;
      deadline?: string;
      status?: string;
    }>;
    training: {
      required: boolean;
      audience?: string[];
      content?: string[];
    };
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    assignedTo: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    confidentiality: 'public' | 'internal' | 'restricted' | 'confidential';
    tags: string[];
  };
}

export const complianceAPI = {
  /**
   * Get compliance regulations
   */
  getRegulations: async (
    filters?: {
      type?: ComplianceRegulation['type'];
      category?: ComplianceRegulation['category'];
      jurisdiction?: string;
      status?: ComplianceRegulation['metadata']['status'];
      search?: string;
    }
  ): Promise<ComplianceRegulation[]> => {
    const { data } = await api.get('/compliance/regulations', { params: filters });
    return data;
  },

  /**
   * Get regulation details
   */
  getRegulation: async (regulationId: string): Promise<ComplianceRegulation> => {
    const { data } = await api.get(`/compliance/regulations/${regulationId}`);
    return data;
  },

  /**
   * Check applicability
   */
  checkApplicability: async (
    profile: {
      entityType: string;
      jurisdiction: string[];
      activities: string[];
      size?: {
        revenue?: number;
        employees?: number;
        users?: number;
      };
      dataTypes?: string[];
    }
  ): Promise<{
    applicable: Array<{
      regulationId: string;
      regulationCode: string;
      name: string;
      applicabilityScore: number; // 0-100
      mandatoryRequirements: number;
      recommendedRequirements: number;
      deadlines: Array<{
        requirement: string;
        deadline: string;
        status: 'upcoming' | 'due' | 'overdue';
      }>;
    }>;
    notApplicable: Array<{
      regulationId: string;
      reason: string;
    }>;
    uncertain: Array<{
      regulationId: string;
      factors: string[];
      recommendation: string;
    }>;
  }> => {
    const { data } = await api.post('/compliance/regulations/applicability', profile);
    return data;
  },

  /**
   * Get compliance requirements
   */
  getRequirements: async (
    filters?: {
      regulationId?: string;
      category?: string;
      type?: ComplianceRequirement['type'];
      priority?: ComplianceRequirement['priority'];
      status?: string;
    }
  ): Promise<ComplianceRequirement[]> => {
    const { data } = await api.get('/compliance/requirements', { params: filters });
    return data;
  },

  /**
   * Get requirement details
   */
  getRequirement: async (requirementId: string): Promise<ComplianceRequirement> => {
    const { data } = await api.get(`/compliance/requirements/${requirementId}`);
    return data;
  },

  /**
   * Update requirement status
   */
  updateRequirementStatus: async (
    requirementId: string,
    status: {
      implementationStatus: ComplianceRequirement['status']['implementationStatus'];
      complianceStatus: ComplianceRequirement['status']['complianceStatus'];
      notes?: string;
      evidence?: string[];
    }
  ): Promise<ComplianceRequirement> => {
    const { data } = await api.put(`/compliance/requirements/${requirementId}/status`, status);
    return data;
  },

  /**
   * Create assessment
   */
  createAssessment: async (
    assessmentData: Omit<ComplianceAssessment, 'id' | 'results' | 'metadata'>
  ): Promise<ComplianceAssessment> => {
    const { data } = await api.post('/compliance/assessments', assessmentData);
    return data;
  },

  /**
   * Get assessments
   */
  getAssessments: async (
    filters?: {
      type?: ComplianceAssessment['type'];
      status?: ComplianceAssessment['metadata']['status'];
      regulation?: string;
      dateRange?: { start: string; end: string };
    }
  ): Promise<ComplianceAssessment[]> => {
    const { data } = await api.get('/compliance/assessments', { params: filters });
    return data;
  },

  /**
   * Get assessment details
   */
  getAssessment: async (assessmentId: string): Promise<ComplianceAssessment> => {
    const { data } = await api.get(`/compliance/assessments/${assessmentId}`);
    return data;
  },

  /**
   * Update assessment
   */
  updateAssessment: async (
    assessmentId: string,
    updates: Partial<ComplianceAssessment>
  ): Promise<ComplianceAssessment> => {
    const { data } = await api.put(`/compliance/assessments/${assessmentId}`, updates);
    return data;
  },

  /**
   * Add assessment finding
   */
  addFinding: async (
    assessmentId: string,
    finding: ComplianceAssessment['results']['findings'][0]
  ): Promise<ComplianceAssessment> => {
    const { data } = await api.post(`/compliance/assessments/${assessmentId}/findings`, finding);
    return data;
  },

  /**
   * Update finding
   */
  updateFinding: async (
    assessmentId: string,
    findingId: string,
    updates: Partial<ComplianceAssessment['results']['findings'][0]>
  ): Promise<ComplianceAssessment> => {
    const { data } = await api.put(`/compliance/assessments/${assessmentId}/findings/${findingId}`, updates);
    return data;
  },

  /**
   * Generate assessment report
   */
  generateAssessmentReport: async (
    assessmentId: string,
    options?: {
      format: 'pdf' | 'word' | 'excel';
      sections?: string[];
      confidential?: boolean;
    }
  ): Promise<{
    reportId: string;
    downloadUrl?: string;
    status: 'generating' | 'ready';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/compliance/assessments/${assessmentId}/report`, options);
    return data;
  },

  /**
   * Get compliance risks
   */
  getRisks: async (
    filters?: {
      category?: ComplianceRisk['category'];
      type?: ComplianceRisk['type'];
      riskLevel?: string;
      owner?: string;
      regulation?: string;
    }
  ): Promise<ComplianceRisk[]> => {
    const { data } = await api.get('/compliance/risks', { params: filters });
    return data;
  },

  /**
   * Create risk
   */
  createRisk: async (
    riskData: Omit<ComplianceRisk, 'id' | 'incidents' | 'metadata'>
  ): Promise<ComplianceRisk> => {
    const { data } = await api.post('/compliance/risks', riskData);
    return data;
  },

  /**
   * Update risk
   */
  updateRisk: async (
    riskId: string,
    updates: Partial<ComplianceRisk>
  ): Promise<ComplianceRisk> => {
    const { data } = await api.put(`/compliance/risks/${riskId}`, updates);
    return data;
  },

  /**
   * Assess risk
   */
  assessRisk: async (
    riskId: string,
    assessment: {
      inherentRisk: { probability: number; impact: number };
      residualRisk: { probability: number; impact: number };
      methodology: string;
      notes?: string;
    }
  ): Promise<ComplianceRisk> => {
    const { data } = await api.post(`/compliance/risks/${riskId}/assess`, assessment);
    return data;
  },

  /**
   * Add risk control
   */
  addRiskControl: async (
    riskId: string,
    control: ComplianceRisk['controls'][0]
  ): Promise<ComplianceRisk> => {
    const { data } = await api.post(`/compliance/risks/${riskId}/controls`, control);
    return data;
  },

  /**
   * Get compliance programs
   */
  getPrograms: async (
    filters?: {
      type?: ComplianceProgram['type'];
      status?: ComplianceProgram['status'];
      regulation?: string;
    }
  ): Promise<ComplianceProgram[]> => {
    const { data } = await api.get('/compliance/programs', { params: filters });
    return data;
  },

  /**
   * Create program
   */
  createProgram: async (
    programData: Omit<ComplianceProgram, 'id' | 'metrics' | 'metadata'>
  ): Promise<ComplianceProgram> => {
    const { data } = await api.post('/compliance/programs', programData);
    return data;
  },

  /**
   * Update program
   */
  updateProgram: async (
    programId: string,
    updates: Partial<ComplianceProgram>
  ): Promise<ComplianceProgram> => {
    const { data } = await api.put(`/compliance/programs/${programId}`, updates);
    return data;
  },

  /**
   * Get program dashboard
   */
  getProgramDashboard: async (
    programId: string
  ): Promise<{
    overview: {
      status: string;
      completion: number; // percentage
      compliance: number; // percentage
      risks: { high: number; medium: number; low: number };
    };
    objectives: Array<{
      objective: string;
      progress: number; // percentage
      status: 'on_track' | 'at_risk' | 'delayed';
    }>;
    milestones: Array<{
      milestone: string;
      date: string;
      status: 'pending' | 'achieved' | 'missed';
      critical: boolean;
    }>;
    kpi: Array<{
      indicator: string;
      current: number;
      target: number;
      trend: 'improving' | 'stable' | 'declining';
    }>;
    findings: {
      open: number;
      critical: number;
      overdue: number;
      resolved: number;
    };
  }> => {
    const { data } = await api.get(`/compliance/programs/${programId}/dashboard`);
    return data;
  },

  /**
   * Get compliance incidents
   */
  getIncidents: async (
    filters?: {
      type?: ComplianceIncident['type'];
      severity?: ComplianceIncident['severity'];
      status?: ComplianceIncident['status'];
      regulation?: string;
      dateRange?: { start: string; end: string };
    }
  ): Promise<ComplianceIncident[]> => {
    const { data } = await api.get('/compliance/incidents', { params: filters });
    return data;
  },

  /**
   * Report incident
   */
  reportIncident: async (
    incidentData: Omit<ComplianceIncident, 'id' | 'investigation' | 'response' | 'communication' | 'lessons' | 'metadata'>
  ): Promise<ComplianceIncident> => {
    const { data } = await api.post('/compliance/incidents', incidentData);
    return data;
  },

  /**
   * Update incident
   */
  updateIncident: async (
    incidentId: string,
    updates: Partial<ComplianceIncident>
  ): Promise<ComplianceIncident> => {
    const { data } = await api.put(`/compliance/incidents/${incidentId}`, updates);
    return data;
  },

  /**
   * Add incident response action
   */
  addIncidentAction: async (
    incidentId: string,
    action: {
      type: 'immediate' | 'corrective' | 'preventive';
      action: string;
      responsible: string;
      deadline?: string;
    }
  ): Promise<ComplianceIncident> => {
    const { data } = await api.post(`/compliance/incidents/${incidentId}/actions`, action);
    return data;
  },

  /**
   * Close incident
   */
  closeIncident: async (
    incidentId: string,
    closure: {
      resolution: string;
      lessons: string[];
      improvements: string[];
      verified: boolean;
    }
  ): Promise<ComplianceIncident> => {
    const { data } = await api.post(`/compliance/incidents/${incidentId}/close`, closure);
    return data;
  },

  /**
   * Get compliance analytics
   */
  getAnalytics: async (
    timeframe: { start: string; end: string },
    dimensions?: string[]
  ): Promise<{
    overview: {
      regulations: number;
      requirements: number;
      assessments: number;
      incidents: number;
      risks: number;
      programs: number;
    };
    compliance: {
      overall: number; // percentage
      byRegulation: Record<string, number>;
      trend: Array<{
        date: string;
        score: number;
      }>;
    };
    risks: {
      total: number;
      byLevel: Record<string, number>;
      byCategory: Record<string, number>;
      trend: 'improving' | 'stable' | 'deteriorating';
    };
    incidents: {
      total: number;
      byType: Record<string, number>;
      bySeverity: Record<string, number>;
      avgResolutionTime: number; // days
      trend: Array<{
        date: string;
        count: number;
      }>;
    };
    assessments: {
      completed: number;
      scheduled: number;
      overdue: number;
      avgScore: number;
    };
    costs: {
      compliance: number;
      incidents: number;
      assessments: number;
      training: number;
      currency: string;
    };
    maturity: {
      overall: number; // 1-5
      byArea: Record<string, number>;
      improvement: Array<{
        area: string;
        gap: number;
        priority: string;
      }>;
    };
  }> => {
    const { data } = await api.get('/compliance/analytics', {
      params: { ...timeframe, dimensions },
    });
    return data;
  },

  /**
   * Check regulatory updates
   */
  checkRegulatoryUpdates: async (
    regulations?: string[]
  ): Promise<{
    updates: Array<{
      regulationId: string;
      type: 'amendment' | 'guidance' | 'interpretation' | 'enforcement';
      date: string;
      title: string;
      summary: string;
      impact: 'low' | 'medium' | 'high' | 'critical';
      url?: string;
      actionRequired: boolean;
      deadline?: string;
    }>;
    lastChecked: string;
    nextCheck: string;
  }> => {
    const { data } = await api.post('/compliance/regulatory-updates', { regulations });
    return data;
  },

  /**
   * Generate compliance report
   */
  generateComplianceReport: async (
    reportConfig: {
      type: 'compliance_status' | 'risk_register' | 'assessment_summary' | 'incident_report' | 'program_status';
      scope?: {
        regulations?: string[];
        programs?: string[];
        timeframe?: { start: string; end: string };
      };
      format: 'pdf' | 'word' | 'excel' | 'csv';
      audience: 'board' | 'management' | 'regulators' | 'auditors' | 'operational';
    }
  ): Promise<{
    reportId: string;
    status: 'generating';
    estimatedCompletion: string;
    downloadUrl?: string;
  }> => {
    const { data } = await api.post('/compliance/reports', reportConfig);
    return data;
  },

  /**
   * Upload compliance document
   */
  uploadDocument: async (
    file: File,
    metadata: {
      type: 'policy' | 'procedure' | 'evidence' | 'certificate' | 'audit' | 'training';
      name: string;
      description?: string;
      regulation?: string;
      requirement?: string;
      confidential?: boolean;
      retention?: string;
      tags?: string[];
    }
  ): Promise<{
    documentId: string;
    url: string;
    uploadedAt: string;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const { data } = await api.post('/compliance/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Get compliance calendar
   */
  getComplianceCalendar: async (
    timeframe: { start: string; end: string }
  ): Promise<{
    deadlines: Array<{
      date: string;
      type: 'filing' | 'assessment' | 'training' | 'audit' | 'review';
      regulation: string;
      requirement: string;
      description: string;
      responsible: string;
      status: 'upcoming' | 'due' | 'overdue' | 'completed';
      priority: 'low' | 'medium' | 'high' | 'critical';
    }>;
    milestones: Array<{
      date: string;
      program: string;
      milestone: string;
      status: 'pending' | 'achieved' | 'missed';
    }>;
    assessments: Array<{
      date: string;
      type: string;
      scope: string[];
      lead: string;
      status: 'scheduled' | 'in_progress' | 'completed';
    }>;
  }> => {
    const { data } = await api.get('/compliance/calendar', { params: timeframe });
    return data;
  },

  /**
   * Import compliance data
   */
  importComplianceData: async (
    file: File,
    importConfig: {
      type: 'regulations' | 'requirements' | 'assessments' | 'risks';
      format: 'csv' | 'xlsx' | 'json';
      options: {
        overwrite: boolean;
        validate: boolean;
        dryRun: boolean;
      };
    }
  ): Promise<{
    importId: string;
    status: 'processing';
    estimatedCompletion: string;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('config', JSON.stringify(importConfig));

    const { data } = await api.post('/compliance/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Export compliance data
   */
  exportComplianceData: async (
    exportConfig: {
      type: 'regulations' | 'requirements' | 'assessments' | 'risks' | 'incidents';
      format: 'csv' | 'xlsx' | 'json';
      filters?: Record<string, any>;
    }
  ): Promise<{
    exportId: string;
    downloadUrl?: string;
    status: 'ready' | 'generating';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post('/compliance/export', exportConfig);
    return data;
  },
};

export default complianceAPI;