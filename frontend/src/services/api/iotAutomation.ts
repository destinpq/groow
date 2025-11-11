/**
 * IoT Automation Rules API Services
 * Workflow automation, triggers, and smart device orchestration
 */
import { api } from './client';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: 'safety' | 'efficiency' | 'maintenance' | 'security' | 'comfort' | 'energy' | 'custom';
  status: 'active' | 'inactive' | 'paused' | 'error' | 'testing';
  priority: 'low' | 'normal' | 'high' | 'critical';
  triggers: Array<{
    id: string;
    type: 'sensor_threshold' | 'schedule' | 'device_event' | 'external_api' | 'manual' | 'pattern_detected' | 'anomaly';
    configuration: {
      deviceId?: string;
      sensorType?: string;
      condition?: 'greater_than' | 'less_than' | 'equals' | 'between' | 'change_detected' | 'no_data';
      value?: number;
      threshold?: number;
      range?: { min: number; max: number };
      schedule?: {
        type: 'cron' | 'interval' | 'once';
        expression: string;
        timezone?: string;
      };
      duration?: number; // seconds
      hysteresis?: number;
    };
    enabled: boolean;
    lastTriggered?: string;
    triggerCount: number;
  }>;
  conditions: Array<{
    id: string;
    type: 'and' | 'or' | 'not';
    rules: Array<{
      deviceId?: string;
      sensorType?: string;
      operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte' | 'in' | 'between';
      value: any;
      valueType: 'static' | 'sensor' | 'calculated' | 'external';
    }>;
    timeout?: number; // seconds
  }>;
  actions: Array<{
    id: string;
    type: 'device_command' | 'notification' | 'webhook' | 'email' | 'sms' | 'data_log' | 'script' | 'api_call' | 'escalation';
    configuration: {
      deviceId?: string;
      command?: string;
      parameters?: Record<string, any>;
      webhookUrl?: string;
      emailTo?: string[];
      smsTo?: string[];
      message?: string;
      scriptPath?: string;
      apiEndpoint?: string;
      escalationLevel?: number;
    };
    delay?: number; // seconds
    retry?: {
      maxAttempts: number;
      backoff: 'linear' | 'exponential';
      interval: number;
    };
    enabled: boolean;
    executionCount: number;
    lastExecuted?: string;
    lastResult?: {
      success: boolean;
      message: string;
      executionTime: number;
    };
  }>;
  schedule: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
    days?: string[]; // ['monday', 'tuesday', ...]
    timezone?: string;
    exceptions?: Array<{
      date: string;
      action: 'skip' | 'force';
    }>;
  };
  variables: Array<{
    name: string;
    type: 'number' | 'string' | 'boolean' | 'object';
    value: any;
    source: 'static' | 'sensor' | 'calculated' | 'user_input';
    description?: string;
  }>;
  statistics: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageExecutionTime: number;
    lastExecution?: string;
    nextScheduledExecution?: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    permissions: {
      read: string[];
      write: string[];
      execute: string[];
    };
  };
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'loop' | 'state_machine';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'error';
  steps: Array<{
    id: string;
    name: string;
    type: 'action' | 'condition' | 'delay' | 'loop' | 'branch' | 'merge' | 'parallel' | 'script';
    configuration: Record<string, any>;
    dependencies: string[]; // step IDs
    timeout?: number;
    retryPolicy?: {
      maxAttempts: number;
      backoff: string;
    };
    onError: 'stop' | 'continue' | 'retry' | 'branch';
    position: { x: number; y: number };
  }>;
  triggers: AutomationRule['triggers'];
  variables: Record<string, any>;
  execution: {
    currentStep?: string;
    startedAt?: string;
    completedAt?: string;
    status: 'waiting' | 'running' | 'completed' | 'error' | 'cancelled';
    progress: number; // 0-100
    logs: Array<{
      stepId: string;
      timestamp: string;
      level: 'info' | 'warning' | 'error';
      message: string;
      data?: any;
    }>;
  };
  schedule?: AutomationRule['schedule'];
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    category: string;
  };
}

export interface AutomationScene {
  id: string;
  name: string;
  description: string;
  category: 'morning' | 'evening' | 'away' | 'home' | 'vacation' | 'work' | 'security' | 'custom';
  devices: Array<{
    deviceId: string;
    actions: Array<{
      type: 'set_value' | 'toggle' | 'activate' | 'deactivate' | 'script';
      parameters: Record<string, any>;
      delay?: number;
      condition?: {
        check: string;
        value: any;
      };
    }>;
  }>;
  conditions: {
    timeRange?: { start: string; end: string };
    days?: string[];
    weather?: string[];
    occupancy?: boolean;
    securityMode?: string;
    customConditions?: Array<{
      deviceId: string;
      sensorType: string;
      operator: string;
      value: any;
    }>;
  };
  execution: {
    type: 'sequential' | 'parallel';
    totalDuration?: number;
    rollback?: boolean;
    rollbackActions?: Array<{
      deviceId: string;
      action: Record<string, any>;
    }>;
  };
  statistics: {
    activationCount: number;
    lastActivated?: string;
    averageDuration: number;
    successRate: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    favorite: boolean;
  };
}

export interface AutomationLog {
  id: string;
  ruleId?: string;
  workflowId?: string;
  sceneId?: string;
  type: 'rule_execution' | 'workflow_step' | 'scene_activation' | 'trigger_fired' | 'error' | 'manual_override';
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  data: {
    triggerDetails?: Record<string, any>;
    actionResults?: Array<{
      actionId: string;
      success: boolean;
      result: any;
      duration: number;
    }>;
    deviceStates?: Record<string, any>;
    variables?: Record<string, any>;
    error?: {
      code: string;
      message: string;
      stack?: string;
    };
  };
  context: {
    userId?: string;
    sessionId?: string;
    source: 'automatic' | 'manual' | 'scheduled' | 'api';
    location?: string;
  };
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: AutomationRule['category'];
  type: 'rule' | 'workflow' | 'scene';
  template: {
    triggers: AutomationRule['triggers'];
    actions: AutomationRule['actions'];
    conditions?: AutomationRule['conditions'];
    variables?: AutomationRule['variables'];
  };
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'device_id' | 'sensor_type';
    required: boolean;
    default?: any;
    description: string;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      options?: string[];
    };
  }>;
  compatibility: {
    deviceTypes: string[];
    sensorTypes: string[];
    minimumFirmware?: string;
  };
  metadata: {
    author: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    downloads: number;
    rating: number;
    tags: string[];
  };
}

export interface AutomationExecution {
  id: string;
  ruleId?: string;
  workflowId?: string;
  sceneId?: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  trigger: {
    type: string;
    source: string;
    timestamp: string;
    data: Record<string, any>;
  };
  steps: Array<{
    stepId: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startedAt?: string;
    completedAt?: string;
    duration?: number;
    result?: any;
    error?: string;
  }>;
  variables: Record<string, any>;
  metrics: {
    totalDuration: number;
    queueTime: number;
    executionTime: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      network: number;
    };
  };
  createdAt: string;
  completedAt?: string;
}

export const iotAutomationAPI = {
  /**
   * Create automation rule
   */
  createRule: async (
    ruleData: Omit<AutomationRule, 'id' | 'statistics' | 'metadata'>
  ): Promise<AutomationRule> => {
    const { data } = await api.post('/iot/automation/rules', ruleData);
    return data;
  },

  /**
   * Get automation rules
   */
  getRules: async (
    filters?: {
      status?: AutomationRule['status'];
      category?: AutomationRule['category'];
      priority?: AutomationRule['priority'];
      tags?: string[];
      deviceId?: string;
    }
  ): Promise<AutomationRule[]> => {
    const { data } = await api.get('/iot/automation/rules', { params: filters });
    return data;
  },

  /**
   * Get rule details
   */
  getRule: async (ruleId: string): Promise<AutomationRule> => {
    const { data } = await api.get(`/iot/automation/rules/${ruleId}`);
    return data;
  },

  /**
   * Update automation rule
   */
  updateRule: async (
    ruleId: string,
    updates: Partial<AutomationRule>
  ): Promise<AutomationRule> => {
    const { data } = await api.put(`/iot/automation/rules/${ruleId}`, updates);
    return data;
  },

  /**
   * Delete automation rule
   */
  deleteRule: async (ruleId: string): Promise<void> => {
    await api.delete(`/iot/automation/rules/${ruleId}`);
  },

  /**
   * Enable/disable rule
   */
  toggleRule: async (
    ruleId: string,
    enabled: boolean
  ): Promise<AutomationRule> => {
    const { data } = await api.put(`/iot/automation/rules/${ruleId}/toggle`, { enabled });
    return data;
  },

  /**
   * Test automation rule
   */
  testRule: async (
    ruleId: string,
    simulatedData?: Record<string, any>
  ): Promise<{
    success: boolean;
    results: Array<{
      step: string;
      success: boolean;
      result: any;
      duration: number;
    }>;
    warnings: string[];
    errors: string[];
  }> => {
    const { data } = await api.post(`/iot/automation/rules/${ruleId}/test`, {
      simulatedData,
    });
    return data;
  },

  /**
   * Execute rule manually
   */
  executeRule: async (
    ruleId: string,
    overrides?: {
      variables?: Record<string, any>;
      skipConditions?: boolean;
    }
  ): Promise<AutomationExecution> => {
    const { data } = await api.post(`/iot/automation/rules/${ruleId}/execute`, overrides);
    return data;
  },

  /**
   * Create automation workflow
   */
  createWorkflow: async (
    workflowData: Omit<AutomationWorkflow, 'id' | 'execution' | 'metadata'>
  ): Promise<AutomationWorkflow> => {
    const { data } = await api.post('/iot/automation/workflows', workflowData);
    return data;
  },

  /**
   * Get automation workflows
   */
  getWorkflows: async (
    filters?: {
      status?: AutomationWorkflow['status'];
      type?: AutomationWorkflow['type'];
      category?: string;
    }
  ): Promise<AutomationWorkflow[]> => {
    const { data } = await api.get('/iot/automation/workflows', { params: filters });
    return data;
  },

  /**
   * Get workflow details
   */
  getWorkflow: async (workflowId: string): Promise<AutomationWorkflow> => {
    const { data } = await api.get(`/iot/automation/workflows/${workflowId}`);
    return data;
  },

  /**
   * Update workflow
   */
  updateWorkflow: async (
    workflowId: string,
    updates: Partial<AutomationWorkflow>
  ): Promise<AutomationWorkflow> => {
    const { data } = await api.put(`/iot/automation/workflows/${workflowId}`, updates);
    return data;
  },

  /**
   * Execute workflow
   */
  executeWorkflow: async (
    workflowId: string,
    inputs?: Record<string, any>
  ): Promise<AutomationExecution> => {
    const { data } = await api.post(`/iot/automation/workflows/${workflowId}/execute`, {
      inputs,
    });
    return data;
  },

  /**
   * Stop workflow execution
   */
  stopWorkflow: async (workflowId: string): Promise<AutomationWorkflow> => {
    const { data } = await api.post(`/iot/automation/workflows/${workflowId}/stop`);
    return data;
  },

  /**
   * Create automation scene
   */
  createScene: async (
    sceneData: Omit<AutomationScene, 'id' | 'statistics' | 'metadata'>
  ): Promise<AutomationScene> => {
    const { data } = await api.post('/iot/automation/scenes', sceneData);
    return data;
  },

  /**
   * Get automation scenes
   */
  getScenes: async (
    category?: AutomationScene['category']
  ): Promise<AutomationScene[]> => {
    const { data } = await api.get('/iot/automation/scenes', {
      params: { category },
    });
    return data;
  },

  /**
   * Get scene details
   */
  getScene: async (sceneId: string): Promise<AutomationScene> => {
    const { data } = await api.get(`/iot/automation/scenes/${sceneId}`);
    return data;
  },

  /**
   * Update scene
   */
  updateScene: async (
    sceneId: string,
    updates: Partial<AutomationScene>
  ): Promise<AutomationScene> => {
    const { data } = await api.put(`/iot/automation/scenes/${sceneId}`, updates);
    return data;
  },

  /**
   * Activate scene
   */
  activateScene: async (
    sceneId: string,
    options?: {
      force?: boolean;
      dryRun?: boolean;
    }
  ): Promise<{
    success: boolean;
    activationId: string;
    results: Array<{
      deviceId: string;
      success: boolean;
      message: string;
    }>;
  }> => {
    const { data } = await api.post(`/iot/automation/scenes/${sceneId}/activate`, options);
    return data;
  },

  /**
   * Get automation logs
   */
  getLogs: async (
    filters?: {
      ruleId?: string;
      workflowId?: string;
      sceneId?: string;
      type?: AutomationLog['type'];
      level?: AutomationLog['level'];
      from?: string;
      to?: string;
      limit?: number;
    }
  ): Promise<AutomationLog[]> => {
    const { data } = await api.get('/iot/automation/logs', { params: filters });
    return data;
  },

  /**
   * Get execution history
   */
  getExecutionHistory: async (
    filters?: {
      ruleId?: string;
      workflowId?: string;
      sceneId?: string;
      status?: AutomationExecution['status'];
      from?: string;
      to?: string;
      limit?: number;
    }
  ): Promise<AutomationExecution[]> => {
    const { data } = await api.get('/iot/automation/executions', { params: filters });
    return data;
  },

  /**
   * Get execution details
   */
  getExecutionDetails: async (executionId: string): Promise<AutomationExecution> => {
    const { data } = await api.get(`/iot/automation/executions/${executionId}`);
    return data;
  },

  /**
   * Cancel execution
   */
  cancelExecution: async (executionId: string): Promise<AutomationExecution> => {
    const { data } = await api.post(`/iot/automation/executions/${executionId}/cancel`);
    return data;
  },

  /**
   * Get automation templates
   */
  getTemplates: async (
    filters?: {
      category?: AutomationTemplate['category'];
      type?: AutomationTemplate['type'];
      deviceTypes?: string[];
      tags?: string[];
    }
  ): Promise<AutomationTemplate[]> => {
    const { data } = await api.get('/iot/automation/templates', { params: filters });
    return data;
  },

  /**
   * Create automation from template
   */
  createFromTemplate: async (
    templateId: string,
    parameters: Record<string, any>,
    customizations?: {
      name?: string;
      description?: string;
      schedule?: AutomationRule['schedule'];
    }
  ): Promise<AutomationRule | AutomationWorkflow | AutomationScene> => {
    const { data } = await api.post(`/iot/automation/templates/${templateId}/create`, {
      parameters,
      customizations,
    });
    return data;
  },

  /**
   * Validate automation configuration
   */
  validateConfiguration: async (
    type: 'rule' | 'workflow' | 'scene',
    configuration: any
  ): Promise<{
    valid: boolean;
    errors: Array<{
      field: string;
      message: string;
      severity: 'error' | 'warning';
    }>;
    suggestions: string[];
  }> => {
    const { data } = await api.post('/iot/automation/validate', {
      type,
      configuration,
    });
    return data;
  },

  /**
   * Get automation analytics
   */
  getAnalytics: async (
    timeRange: { start: string; end: string },
    filters?: {
      ruleIds?: string[];
      workflowIds?: string[];
      sceneIds?: string[];
      categories?: string[];
    }
  ): Promise<{
    overview: {
      totalExecutions: number;
      successfulExecutions: number;
      failedExecutions: number;
      averageExecutionTime: number;
    };
    performance: {
      executionTrends: Array<{
        date: string;
        executions: number;
        successRate: number;
        avgDuration: number;
      }>;
      topPerformers: Array<{
        id: string;
        name: string;
        type: string;
        executions: number;
        successRate: number;
      }>;
      bottlenecks: Array<{
        id: string;
        name: string;
        avgDuration: number;
        issue: string;
      }>;
    };
    usage: {
      mostTriggered: Array<{
        id: string;
        name: string;
        triggerCount: number;
      }>;
      deviceUtilization: Array<{
        deviceId: string;
        usageCount: number;
        automations: string[];
      }>;
    };
  }> => {
    const { data } = await api.get('/iot/automation/analytics', {
      params: { ...timeRange, ...filters },
    });
    return data;
  },

  /**
   * Export automation configuration
   */
  exportConfiguration: async (
    ids: string[],
    type: 'rule' | 'workflow' | 'scene',
    format: 'json' | 'yaml'
  ): Promise<Blob> => {
    const { data } = await api.post('/iot/automation/export', {
      ids,
      type,
      format,
    }, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Import automation configuration
   */
  importConfiguration: async (
    file: File,
    options?: {
      overwriteExisting?: boolean;
      validateOnly?: boolean;
    }
  ): Promise<{
    success: boolean;
    imported: Array<{
      id: string;
      name: string;
      type: string;
      status: 'imported' | 'updated' | 'skipped' | 'error';
      message?: string;
    }>;
    errors: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const { data } = await api.post('/iot/automation/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Get system variables
   */
  getSystemVariables: async (): Promise<Record<string, {
    value: any;
    type: string;
    description: string;
    readOnly: boolean;
    lastUpdated: string;
  }>> => {
    const { data } = await api.get('/iot/automation/system-variables');
    return data;
  },

  /**
   * Update system variable
   */
  updateSystemVariable: async (
    name: string,
    value: any
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.put('/iot/automation/system-variables', {
      name,
      value,
    });
    return data;
  },
};

export default iotAutomationAPI;