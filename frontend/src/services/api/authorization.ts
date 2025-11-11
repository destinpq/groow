/**
 * Authorization API Services
 * Role-based access control, permissions management, and fine-grained authorization
 */
import { api } from './client';

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'system' | 'organization' | 'project' | 'custom';
  status: 'active' | 'inactive' | 'deprecated';
  level: number; // hierarchy level (1-10)
  category: 'admin' | 'management' | 'user' | 'service' | 'guest';
  scope: {
    global: boolean;
    organizations?: string[];
    projects?: string[];
    resources?: string[];
    conditions?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  permissions: {
    granted: Array<{
      id: string;
      resource: string;
      action: string;
      effect: 'allow' | 'deny';
      conditions?: Record<string, any>;
      inherited: boolean;
      source?: string;
    }>;
    denied: Array<{
      id: string;
      resource: string;
      action: string;
      reason: string;
      inherited: boolean;
      source?: string;
    }>;
    effective: string[]; // computed permissions
  };
  inheritance: {
    parent?: string;
    children: string[];
    depth: number;
    inherits: boolean;
    overrides: string[];
  };
  assignments: {
    users: Array<{
      userId: string;
      assignedAt: string;
      assignedBy: string;
      expiresAt?: string;
      conditions?: Record<string, any>;
    }>;
    groups: Array<{
      groupId: string;
      assignedAt: string;
      assignedBy: string;
      conditions?: Record<string, any>;
    }>;
    count: {
      total: number;
      active: number;
      expired: number;
    };
  };
  constraints: {
    maxUsers?: number;
    maxDuration?: number; // seconds
    requireApproval: boolean;
    requireMFA: boolean;
    ipRestrictions?: string[];
    timeRestrictions?: {
      allowedHours: { start: string; end: string };
      timezone: string;
      daysOfWeek: number[];
    };
    deviceRestrictions?: {
      allowedTypes: string[];
      trustedOnly: boolean;
    };
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    priority: number;
    protected: boolean; // cannot be deleted
    system: boolean; // system-defined role
  };
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  name: string;
  description: string;
  category: 'data' | 'functionality' | 'system' | 'security' | 'admin';
  level: 'read' | 'write' | 'admin' | 'owner' | 'custom';
  scope: {
    global: boolean;
    contextual: boolean;
    conditions: Array<{
      field: string;
      type: 'string' | 'number' | 'boolean' | 'array';
      operators: string[];
      description: string;
    }>;
  };
  dependencies: {
    requires: string[]; // permissions that must also be granted
    conflicts: string[]; // permissions that cannot be granted together
    implies: string[]; // permissions automatically granted with this one
  };
  risk: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    impact: string;
    mitigation: string[];
  };
  usage: {
    roles: Array<{
      roleId: string;
      roleName: string;
      inherited: boolean;
    }>;
    users: number;
    frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
    lastUsed?: string;
  };
  validation: {
    rules: Array<{
      rule: string;
      parameters: Record<string, any>;
      errorMessage: string;
    }>;
    examples: Array<{
      context: Record<string, any>;
      expected: boolean;
      description: string;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    system: boolean;
    deprecated: boolean;
    replacedBy?: string;
  };
}

export interface Group {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'department' | 'team' | 'project' | 'functional' | 'temporary' | 'custom';
  status: 'active' | 'inactive' | 'archived';
  hierarchy: {
    parent?: string;
    children: string[];
    level: number;
    path: string[];
  };
  members: {
    users: Array<{
      userId: string;
      role: 'owner' | 'admin' | 'member' | 'guest';
      joinedAt: string;
      addedBy: string;
      expiresAt?: string;
      status: 'active' | 'pending' | 'suspended';
    }>;
    groups: Array<{
      groupId: string;
      relationship: 'parent' | 'child' | 'sibling';
      connectedAt: string;
    }>;
    count: {
      direct: number;
      inherited: number;
      total: number;
    };
  };
  roles: Array<{
    roleId: string;
    roleName: string;
    assignedAt: string;
    assignedBy: string;
    inherited: boolean;
    source?: string;
    conditions?: Record<string, any>;
  }>;
  permissions: {
    granted: string[];
    denied: string[];
    effective: string[];
    inherited: string[];
  };
  settings: {
    visibility: 'public' | 'internal' | 'private';
    joinPolicy: 'open' | 'approval' | 'invitation' | 'closed';
    memberLimit?: number;
    autoExpiry?: number; // days
    requireApproval: boolean;
  };
  attributes: {
    department?: string;
    location?: string;
    costCenter?: string;
    manager?: string;
    budget?: number;
    classification?: string;
    customFields: Record<string, any>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    system: boolean;
    protected: boolean;
  };
}

export interface AccessRequest {
  id: string;
  type: 'role' | 'permission' | 'resource' | 'group';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requester: {
    userId: string;
    userName: string;
    email: string;
    department?: string;
    manager?: string;
  };
  target: {
    type: string;
    id: string;
    name: string;
    description?: string;
    risk: string;
  };
  justification: {
    reason: string;
    businessJustification: string;
    duration?: number; // days
    urgency: string;
    manager?: string;
    project?: string;
  };
  approval: {
    workflow: string;
    steps: Array<{
      step: number;
      approver: {
        type: 'user' | 'role' | 'group' | 'auto';
        id: string;
        name: string;
      };
      status: 'pending' | 'approved' | 'rejected' | 'skipped';
      decision?: {
        action: 'approve' | 'reject' | 'request_info';
        reason?: string;
        conditions?: string[];
        decidedAt: string;
        decidedBy: string;
      };
      deadline?: string;
      escalation?: {
        after: number; // hours
        to: string;
      };
    }>;
    currentStep: number;
    autoApprove: boolean;
    consensus: boolean;
  };
  review: {
    required: boolean;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    reviewer: {
      type: 'user' | 'role' | 'group' | 'auto';
      id: string;
      name: string;
    };
    nextReview?: string;
    history: Array<{
      reviewedAt: string;
      reviewedBy: string;
      decision: 'continue' | 'modify' | 'revoke';
      notes?: string;
    }>;
  };
  implementation: {
    status: 'pending' | 'implementing' | 'completed' | 'failed';
    scheduledAt?: string;
    implementedAt?: string;
    implementedBy?: string;
    rollbackPlan?: string;
    verification: {
      required: boolean;
      method: 'automatic' | 'manual' | 'both';
      verifiedAt?: string;
      verifiedBy?: string;
    };
  };
  audit: {
    trail: Array<{
      action: string;
      actor: string;
      timestamp: string;
      details: Record<string, any>;
      ipAddress?: string;
    }>;
    compliance: {
      framework: string[];
      requirements: string[];
      evidence: string[];
    };
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
    source: string;
    correlationId?: string;
    tags: string[];
  };
}

export interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  type: 'rbac' | 'abac' | 'dac' | 'mac' | 'hybrid';
  status: 'active' | 'inactive' | 'testing' | 'deprecated';
  scope: {
    resources: string[];
    users?: string[];
    roles?: string[];
    groups?: string[];
    conditions?: Record<string, any>;
  };
  rules: Array<{
    id: string;
    name: string;
    priority: number;
    effect: 'allow' | 'deny';
    conditions: {
      subject: Array<{
        type: 'user' | 'role' | 'group' | 'attribute';
        matcher: string;
        value: any;
      }>;
      resource: Array<{
        type: 'id' | 'type' | 'attribute' | 'pattern';
        matcher: string;
        value: any;
      }>;
      action: Array<{
        type: 'exact' | 'pattern' | 'category';
        matcher: string;
        value: any;
      }>;
      context?: Array<{
        type: 'time' | 'location' | 'risk' | 'custom';
        matcher: string;
        value: any;
      }>;
    };
    exceptions: Array<{
      condition: string;
      effect: 'allow' | 'deny' | 'skip';
      reason: string;
    }>;
  }>;
  decision: {
    algorithm: 'first_applicable' | 'deny_overrides' | 'permit_overrides' | 'consensus';
    defaultAction: 'allow' | 'deny' | 'abstain';
    conflictResolution: 'deny_wins' | 'permit_wins' | 'first_wins' | 'last_wins';
  };
  evaluation: {
    mode: 'strict' | 'permissive' | 'advisory';
    caching: {
      enabled: boolean;
      ttl: number; // seconds
      strategy: 'aggressive' | 'conservative' | 'adaptive';
    };
    performance: {
      maxEvaluationTime: number; // milliseconds
      optimizations: string[];
      metrics: {
        averageTime: number;
        cacheHitRate: number;
        evaluations: number;
      };
    };
  };
  compliance: {
    frameworks: string[];
    requirements: Array<{
      framework: string;
      requirement: string;
      status: 'compliant' | 'partial' | 'non_compliant';
      evidence: string[];
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      validUntil: string;
      requirements: string[];
    }>;
  };
  monitoring: {
    enabled: boolean;
    events: string[];
    alerts: Array<{
      condition: string;
      threshold: number;
      action: string;
      recipients: string[];
    }>;
    analytics: {
      enabled: boolean;
      retention: number; // days
      aggregations: string[];
    };
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    system: boolean;
  };
}

export interface AccessDecision {
  id: string;
  requestId?: string;
  subject: {
    type: 'user' | 'service' | 'system';
    id: string;
    attributes: Record<string, any>;
  };
  resource: {
    type: string;
    id: string;
    attributes: Record<string, any>;
  };
  action: string;
  context: {
    timestamp: string;
    location?: {
      ip: string;
      country?: string;
      region?: string;
    };
    device?: {
      type: string;
      trusted: boolean;
      fingerprint?: string;
    };
    session?: {
      id: string;
      risk: number;
      mfa: boolean;
    };
    custom?: Record<string, any>;
  };
  decision: {
    effect: 'permit' | 'deny' | 'indeterminate';
    reason: string;
    confidence: number; // 0-100
    policies: Array<{
      policyId: string;
      policyName: string;
      effect: 'allow' | 'deny' | 'abstain';
      rule?: string;
      weight: number;
    }>;
  };
  evaluation: {
    duration: number; // milliseconds
    cached: boolean;
    steps: Array<{
      step: string;
      duration: number;
      result: any;
    }>;
    warnings: string[];
    errors: string[];
  };
  obligations: Array<{
    type: 'log' | 'notify' | 'transform' | 'verify' | 'approve';
    action: string;
    parameters: Record<string, any>;
    fulfilled: boolean;
    fulfilledAt?: string;
  }>;
  audit: {
    logged: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    correlationId?: string;
    sessionId?: string;
    traceId?: string;
  };
  metadata: {
    engine: string;
    version: string;
    timestamp: string;
    ttl?: number;
  };
}

export interface AccessReview {
  id: string;
  name: string;
  description: string;
  type: 'user' | 'role' | 'group' | 'resource' | 'policy';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  scope: {
    users?: string[];
    roles?: string[];
    groups?: string[];
    resources?: string[];
    policies?: string[];
    departments?: string[];
    locations?: string[];
  };
  schedule: {
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'ad_hoc';
    nextReview: string;
    lastReview?: string;
    timezone: string;
    automated: boolean;
  };
  reviewers: Array<{
    type: 'user' | 'role' | 'group';
    id: string;
    name: string;
    responsibility: 'primary' | 'secondary' | 'observer';
    status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
    deadline?: string;
  }>;
  findings: Array<{
    id: string;
    type: 'excessive_access' | 'inactive_user' | 'orphaned_account' | 'policy_violation' | 'compliance_issue';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    evidence: string[];
    recommendations: string[];
    status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
    assignee?: string;
    dueDate?: string;
    resolution?: {
      action: string;
      notes: string;
      resolvedBy: string;
      resolvedAt: string;
    };
  }>;
  metrics: {
    usersReviewed: number;
    rolesReviewed: number;
    accessRemoved: number;
    accessModified: number;
    findingsCount: number;
    complianceScore: number;
  };
  workflow: {
    steps: Array<{
      name: string;
      status: 'pending' | 'in_progress' | 'completed' | 'skipped';
      assignee?: string;
      deadline?: string;
      duration?: number;
    }>;
    currentStep: number;
    escalation: Array<{
      condition: string;
      action: string;
      recipient: string;
    }>;
  };
  compliance: {
    frameworks: string[];
    requirements: Array<{
      framework: string;
      requirement: string;
      status: 'met' | 'partial' | 'not_met';
      evidence: string[];
    }>;
    attestation: {
      required: boolean;
      attestor?: string;
      attestedAt?: string;
      statement?: string;
    };
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    tags: string[];
    automated: boolean;
  };
}

export const authorizationAPI = {
  /**
   * Create role
   */
  createRole: async (
    roleData: Omit<Role, 'id' | 'permissions' | 'assignments' | 'metadata'>
  ): Promise<Role> => {
    const { data } = await api.post('/authz/roles', roleData);
    return data;
  },

  /**
   * Get roles
   */
  getRoles: async (
    filters?: {
      type?: Role['type'];
      status?: Role['status'];
      category?: Role['category'];
      search?: string;
      withPermissions?: boolean;
    }
  ): Promise<Role[]> => {
    const { data } = await api.get('/authz/roles', { params: filters });
    return data;
  },

  /**
   * Get role details
   */
  getRole: async (roleId: string): Promise<Role> => {
    const { data } = await api.get(`/authz/roles/${roleId}`);
    return data;
  },

  /**
   * Update role
   */
  updateRole: async (
    roleId: string,
    updates: Partial<Role>
  ): Promise<Role> => {
    const { data } = await api.put(`/authz/roles/${roleId}`, updates);
    return data;
  },

  /**
   * Delete role
   */
  deleteRole: async (
    roleId: string,
    options?: {
      force?: boolean;
      transferTo?: string; // role ID to transfer assignments to
    }
  ): Promise<{
    success: boolean;
    transferredAssignments: number;
  }> => {
    const { data } = await api.delete(`/authz/roles/${roleId}`, { params: options });
    return data;
  },

  /**
   * Assign role to user
   */
  assignRole: async (
    assignment: {
      userId: string;
      roleId: string;
      expiresAt?: string;
      conditions?: Record<string, any>;
      reason?: string;
    }
  ): Promise<{
    success: boolean;
    assignment: Role['assignments']['users'][0];
  }> => {
    const { data } = await api.post('/authz/role-assignments', assignment);
    return data;
  },

  /**
   * Remove role from user
   */
  removeRole: async (
    userId: string,
    roleId: string,
    reason?: string
  ): Promise<{
    success: boolean;
    removedAt: string;
  }> => {
    const { data } = await api.delete(`/authz/role-assignments/${userId}/${roleId}`, {
      params: { reason },
    });
    return data;
  },

  /**
   * Get user roles
   */
  getUserRoles: async (
    userId: string,
    options?: {
      includeInherited?: boolean;
      includeExpired?: boolean;
      effective?: boolean;
    }
  ): Promise<Array<Role & { assignment: Role['assignments']['users'][0] }>> => {
    const { data } = await api.get(`/authz/users/${userId}/roles`, { params: options });
    return data;
  },

  /**
   * Check user permission
   */
  checkPermission: async (
    check: {
      userId: string;
      resource: string;
      action: string;
      context?: Record<string, any>;
    }
  ): Promise<AccessDecision> => {
    const { data } = await api.post('/authz/check', check);
    return data;
  },

  /**
   * Bulk permission check
   */
  bulkCheckPermissions: async (
    checks: Array<{
      userId: string;
      resource: string;
      action: string;
      context?: Record<string, any>;
    }>
  ): Promise<AccessDecision[]> => {
    const { data } = await api.post('/authz/bulk-check', { checks });
    return data;
  },

  /**
   * Get effective permissions
   */
  getEffectivePermissions: async (
    userId: string,
    options?: {
      resource?: string;
      includeInherited?: boolean;
      resolveConflicts?: boolean;
    }
  ): Promise<{
    permissions: Array<{
      resource: string;
      actions: string[];
      source: 'direct' | 'role' | 'group' | 'inherited';
      conditions?: Record<string, any>;
    }>;
    summary: {
      total: number;
      bySource: Record<string, number>;
      byResource: Record<string, number>;
    };
  }> => {
    const { data } = await api.get(`/authz/users/${userId}/permissions`, { params: options });
    return data;
  },

  /**
   * Create permission
   */
  createPermission: async (
    permissionData: Omit<Permission, 'id' | 'usage' | 'metadata'>
  ): Promise<Permission> => {
    const { data } = await api.post('/authz/permissions', permissionData);
    return data;
  },

  /**
   * Get permissions
   */
  getPermissions: async (
    filters?: {
      resource?: string;
      action?: string;
      category?: Permission['category'];
      level?: Permission['level'];
      search?: string;
    }
  ): Promise<Permission[]> => {
    const { data } = await api.get('/authz/permissions', { params: filters });
    return data;
  },

  /**
   * Create group
   */
  createGroup: async (
    groupData: Omit<Group, 'id' | 'members' | 'roles' | 'permissions' | 'metadata'>
  ): Promise<Group> => {
    const { data } = await api.post('/authz/groups', groupData);
    return data;
  },

  /**
   * Get groups
   */
  getGroups: async (
    filters?: {
      type?: Group['type'];
      status?: Group['status'];
      parent?: string;
      search?: string;
    }
  ): Promise<Group[]> => {
    const { data } = await api.get('/authz/groups', { params: filters });
    return data;
  },

  /**
   * Add user to group
   */
  addToGroup: async (
    groupId: string,
    userId: string,
    role: string = 'member',
    expiresAt?: string
  ): Promise<{
    success: boolean;
    membership: Group['members']['users'][0];
  }> => {
    const { data } = await api.post(`/authz/groups/${groupId}/members`, {
      userId,
      role,
      expiresAt,
    });
    return data;
  },

  /**
   * Remove user from group
   */
  removeFromGroup: async (
    groupId: string,
    userId: string,
    reason?: string
  ): Promise<{
    success: boolean;
    removedAt: string;
  }> => {
    const { data } = await api.delete(`/authz/groups/${groupId}/members/${userId}`, {
      params: { reason },
    });
    return data;
  },

  /**
   * Create access request
   */
  createAccessRequest: async (
    requestData: Omit<AccessRequest, 'id' | 'approval' | 'implementation' | 'audit' | 'metadata'>
  ): Promise<AccessRequest> => {
    const { data } = await api.post('/authz/access-requests', requestData);
    return data;
  },

  /**
   * Get access requests
   */
  getAccessRequests: async (
    filters?: {
      status?: AccessRequest['status'];
      type?: AccessRequest['type'];
      requester?: string;
      approver?: string;
      pending?: boolean;
    }
  ): Promise<AccessRequest[]> => {
    const { data } = await api.get('/authz/access-requests', { params: filters });
    return data;
  },

  /**
   * Approve/reject access request
   */
  decideAccessRequest: async (
    requestId: string,
    decision: {
      action: 'approve' | 'reject' | 'request_info';
      reason?: string;
      conditions?: string[];
    }
  ): Promise<AccessRequest> => {
    const { data } = await api.post(`/authz/access-requests/${requestId}/decide`, decision);
    return data;
  },

  /**
   * Create access policy
   */
  createAccessPolicy: async (
    policyData: Omit<AccessPolicy, 'id' | 'evaluation' | 'metadata'>
  ): Promise<AccessPolicy> => {
    const { data } = await api.post('/authz/policies', policyData);
    return data;
  },

  /**
   * Get access policies
   */
  getAccessPolicies: async (
    filters?: {
      type?: AccessPolicy['type'];
      status?: AccessPolicy['status'];
      resource?: string;
    }
  ): Promise<AccessPolicy[]> => {
    const { data } = await api.get('/authz/policies', { params: filters });
    return data;
  },

  /**
   * Evaluate policy
   */
  evaluatePolicy: async (
    policyId: string,
    context: {
      subject: Record<string, any>;
      resource: Record<string, any>;
      action: string;
      environment?: Record<string, any>;
    }
  ): Promise<AccessDecision> => {
    const { data } = await api.post(`/authz/policies/${policyId}/evaluate`, context);
    return data;
  },

  /**
   * Create access review
   */
  createAccessReview: async (
    reviewData: Omit<AccessReview, 'id' | 'findings' | 'metrics' | 'metadata'>
  ): Promise<AccessReview> => {
    const { data } = await api.post('/authz/access-reviews', reviewData);
    return data;
  },

  /**
   * Get access reviews
   */
  getAccessReviews: async (
    filters?: {
      status?: AccessReview['status'];
      type?: AccessReview['type'];
      reviewer?: string;
      overdue?: boolean;
    }
  ): Promise<AccessReview[]> => {
    const { data } = await api.get('/authz/access-reviews', { params: filters });
    return data;
  },

  /**
   * Start access review
   */
  startAccessReview: async (
    reviewId: string,
    options?: {
      automated?: boolean;
      scope?: Record<string, any>;
    }
  ): Promise<{
    success: boolean;
    status: string;
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/authz/access-reviews/${reviewId}/start`, options);
    return data;
  },

  /**
   * Submit review findings
   */
  submitReviewFindings: async (
    reviewId: string,
    findings: Array<{
      type: string;
      description: string;
      evidence: string[];
      recommendations: string[];
      severity: string;
    }>
  ): Promise<AccessReview> => {
    const { data } = await api.post(`/authz/access-reviews/${reviewId}/findings`, { findings });
    return data;
  },

  /**
   * Get access analytics
   */
  getAccessAnalytics: async (
    timeframe: { start: string; end: string },
    metrics?: string[]
  ): Promise<{
    summary: {
      totalUsers: number;
      activeUsers: number;
      rolesAssigned: number;
      permissionsGranted: number;
      accessRequests: number;
      violations: number;
    };
    trends: Array<{
      date: string;
      metrics: Record<string, number>;
    }>;
    distribution: {
      byRole: Record<string, number>;
      byPermission: Record<string, number>;
      byDepartment: Record<string, number>;
    };
    anomalies: Array<{
      type: string;
      description: string;
      severity: string;
      timestamp: string;
      details: Record<string, any>;
    }>;
  }> => {
    const { data } = await api.get('/authz/analytics', {
      params: { ...timeframe, metrics },
    });
    return data;
  },

  /**
   * Generate compliance report
   */
  generateComplianceReport: async (
    config: {
      framework: string;
      scope?: Record<string, any>;
      format: 'pdf' | 'excel' | 'json';
      includeEvidence?: boolean;
    }
  ): Promise<Blob | object> => {
    const { data } = await api.post('/authz/compliance/report', config, {
      responseType: config.format === 'json' ? 'json' : 'blob',
    });
    return data;
  },

  /**
   * Sync with external directory
   */
  syncDirectory: async (
    options?: {
      provider?: string;
      incremental?: boolean;
      dryRun?: boolean;
    }
  ): Promise<{
    jobId: string;
    status: 'started';
    estimatedCompletion?: string;
    changes?: {
      users: { added: number; updated: number; removed: number };
      groups: { added: number; updated: number; removed: number };
      roles: { added: number; updated: number; removed: number };
    };
  }> => {
    const { data } = await api.post('/authz/directory/sync', options);
    return data;
  },

  /**
   * Get sync status
   */
  getSyncStatus: async (
    jobId: string
  ): Promise<{
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    logs: Array<{
      level: string;
      message: string;
      timestamp: string;
    }>;
    results?: {
      users: { processed: number; success: number; errors: number };
      groups: { processed: number; success: number; errors: number };
      duration: number;
    };
  }> => {
    const { data } = await api.get(`/authz/directory/sync/${jobId}`);
    return data;
  },

  /**
   * Emergency access
   */
  emergencyAccess: async (
    request: {
      reason: string;
      duration: number; // hours
      permissions: string[];
      approver?: string;
      justification: string;
    }
  ): Promise<{
    approved: boolean;
    accessId?: string;
    expiresAt?: string;
    restrictions?: string[];
    monitoring: boolean;
  }> => {
    const { data } = await api.post('/authz/emergency-access', request);
    return data;
  },

  /**
   * Revoke emergency access
   */
  revokeEmergencyAccess: async (
    accessId: string,
    reason?: string
  ): Promise<{
    success: boolean;
    revokedAt: string;
  }> => {
    const { data } = await api.delete(`/authz/emergency-access/${accessId}`, {
      params: { reason },
    });
    return data;
  },
};

export default authorizationAPI;