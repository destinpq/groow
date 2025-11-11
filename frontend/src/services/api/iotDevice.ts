/**
 * IoT Device Management API Services
 * Complete IoT device lifecycle management with monitoring and control
 */
import { api } from './client';

export interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'gateway' | 'controller' | 'smart_device' | 'beacon' | 'camera' | 'environmental';
  category: 'inventory_tracking' | 'environmental_monitoring' | 'security' | 'automation' | 'analytics' | 'warehouse' | 'retail';
  manufacturer: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  hardwareVersion: string;
  status: 'online' | 'offline' | 'maintenance' | 'error' | 'inactive' | 'updating';
  location: {
    facilityId: string;
    facilityName: string;
    zone: string;
    coordinates: {
      latitude: number;
      longitude: number;
      altitude?: number;
    };
    address: string;
    floor?: string;
    room?: string;
  };
  connectivity: {
    protocol: 'wifi' | 'ethernet' | 'bluetooth' | 'zigbee' | 'lora' | '4g' | '5g' | 'satellite';
    ipAddress?: string;
    macAddress: string;
    signalStrength?: number;
    networkId?: string;
    lastConnected: string;
    connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  capabilities: {
    sensors: Array<{
      type: string;
      unit: string;
      range: { min: number; max: number };
      accuracy: number;
      samplingRate: number;
    }>;
    actuators: Array<{
      type: string;
      commands: string[];
      power: number;
      responseTime: number;
    }>;
    storage: {
      capacity: number;
      used: number;
      type: 'flash' | 'sd_card' | 'cloud';
    };
    processing: {
      cpu: string;
      memory: number;
      edgeComputing: boolean;
    };
  };
  configuration: {
    samplingInterval: number;
    reportingInterval: number;
    alertThresholds: Record<string, {
      min?: number;
      max?: number;
      condition: string;
    }>;
    powerSettings: {
      mode: 'always_on' | 'low_power' | 'scheduled' | 'event_driven';
      batteryLevel?: number;
      batteryType?: string;
      powerSource: 'battery' | 'ac_power' | 'solar' | 'usb';
    };
    updateSettings: {
      autoUpdate: boolean;
      updateWindow?: string;
      channel: 'stable' | 'beta' | 'development';
    };
  };
  health: {
    overallStatus: 'healthy' | 'warning' | 'critical' | 'unknown';
    uptime: number;
    lastMaintenance?: string;
    nextMaintenance?: string;
    issues: Array<{
      type: 'hardware' | 'software' | 'connectivity' | 'power' | 'sensor' | 'performance';
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      reportedAt: string;
      resolved: boolean;
    }>;
    metrics: {
      cpuUsage: number;
      memoryUsage: number;
      temperature?: number;
      powerConsumption?: number;
      dataTransmitted: number;
      errorRate: number;
    };
  };
  metadata: {
    installationDate: string;
    installedBy: string;
    warrantyExpiry?: string;
    cost: number;
    vendor: string;
    tags: string[];
    notes: string;
    groupMemberships: string[];
  };
  createdAt: string;
  updatedAt: string;
  lastDataReceived?: string;
}

export interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  type: 'location' | 'function' | 'vendor' | 'custom';
  devices: string[];
  rules: {
    autoAssignment: {
      enabled: boolean;
      criteria: Record<string, any>;
    };
    alerts: {
      groupAlerts: boolean;
      escalation: Array<{
        condition: string;
        action: string;
        delay: number;
      }>;
    };
    actions: {
      bulkOperations: boolean;
      syncSettings: boolean;
      groupUpdates: boolean;
    };
  };
  statistics: {
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    errorDevices: number;
    avgUptime: number;
    dataVolumePerDay: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DeviceCommand {
  id: string;
  deviceId: string;
  command: string;
  parameters: Record<string, any>;
  type: 'configuration' | 'action' | 'maintenance' | 'update' | 'diagnostic';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledAt?: string;
  executedAt?: string;
  completedAt?: string;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  result?: {
    success: boolean;
    data?: any;
    error?: string;
    executionTime: number;
  };
  retry: {
    maxAttempts: number;
    currentAttempt: number;
    backoffStrategy: 'linear' | 'exponential';
  };
  createdBy: string;
  createdAt: string;
}

export interface DeviceAlert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'threshold_exceeded' | 'device_offline' | 'battery_low' | 'sensor_malfunction' | 'connectivity_issue' | 'security_breach' | 'maintenance_due';
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  title: string;
  message: string;
  data: Record<string, any>;
  conditions: {
    trigger: string;
    value?: number;
    threshold?: number;
    duration?: number;
  };
  status: 'active' | 'acknowledged' | 'resolved' | 'suppressed';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  suppressedUntil?: string;
  escalation: {
    level: number;
    escalatedTo?: string[];
    escalatedAt?: string;
    autoEscalate: boolean;
  };
  actions: Array<{
    type: 'email' | 'sms' | 'webhook' | 'auto_fix' | 'notification';
    triggered: boolean;
    triggeredAt?: string;
    result?: string;
  }>;
  recurrence: {
    isRecurring: boolean;
    frequency?: string;
    lastOccurrence?: string;
    count: number;
  };
  createdAt: string;
}

export interface DeviceMaintenanceRecord {
  id: string;
  deviceId: string;
  type: 'preventive' | 'corrective' | 'predictive' | 'emergency';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  technician: {
    id: string;
    name: string;
    email: string;
    specialization: string[];
  };
  tasks: Array<{
    id: string;
    description: string;
    type: 'inspection' | 'cleaning' | 'calibration' | 'replacement' | 'update' | 'testing';
    status: 'pending' | 'completed' | 'skipped' | 'failed';
    duration?: number;
    notes?: string;
    parts?: Array<{
      partNumber: string;
      description: string;
      quantity: number;
      cost: number;
    }>;
  }>;
  summary: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    duration: number;
    cost: number;
    issues: string[];
    recommendations: string[];
  };
  nextMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceUpdate {
  id: string;
  deviceId: string;
  updateType: 'firmware' | 'software' | 'configuration' | 'security_patch';
  version: {
    from: string;
    to: string;
  };
  status: 'available' | 'downloading' | 'installing' | 'completed' | 'failed' | 'rollback';
  priority: 'critical' | 'high' | 'medium' | 'low';
  size: number;
  downloadProgress?: number;
  installProgress?: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  changelog: string;
  requirements: {
    minimumBatteryLevel?: number;
    networkConnection: boolean;
    diskSpace: number;
    compatibleVersions: string[];
  };
  rollback: {
    available: boolean;
    automaticOnFailure: boolean;
    rollbackVersion?: string;
  };
  verification: {
    checksum: string;
    signature: string;
    verified: boolean;
  };
  error?: {
    code: string;
    message: string;
    details: string;
  };
  createdAt: string;
}

export const iotDeviceAPI = {
  /**
   * Register new IoT device
   */
  registerDevice: async (
    deviceData: Omit<IoTDevice, 'id' | 'createdAt' | 'updatedAt' | 'health' | 'lastDataReceived'>
  ): Promise<IoTDevice> => {
    const { data } = await api.post('/iot/devices', deviceData);
    return data;
  },

  /**
   * Get all IoT devices
   */
  getDevices: async (
    filters?: {
      status?: IoTDevice['status'];
      type?: IoTDevice['type'];
      category?: IoTDevice['category'];
      facilityId?: string;
      groupId?: string;
      health?: IoTDevice['health']['overallStatus'];
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    devices: IoTDevice[];
    total: number;
    summary: {
      online: number;
      offline: number;
      error: number;
      maintenance: number;
    };
  }> => {
    const { data } = await api.get('/iot/devices', { params: filters });
    return data;
  },

  /**
   * Get device details by ID
   */
  getDevice: async (deviceId: string): Promise<IoTDevice> => {
    const { data } = await api.get(`/iot/devices/${deviceId}`);
    return data;
  },

  /**
   * Update device configuration
   */
  updateDevice: async (
    deviceId: string,
    updates: Partial<Pick<IoTDevice, 'name' | 'location' | 'configuration' | 'metadata'>>
  ): Promise<IoTDevice> => {
    const { data } = await api.put(`/iot/devices/${deviceId}`, updates);
    return data;
  },

  /**
   * Delete device
   */
  deleteDevice: async (deviceId: string): Promise<void> => {
    await api.delete(`/iot/devices/${deviceId}`);
  },

  /**
   * Send command to device
   */
  sendCommand: async (
    deviceId: string,
    commandData: Omit<DeviceCommand, 'id' | 'deviceId' | 'status' | 'createdAt' | 'result'>
  ): Promise<DeviceCommand> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/commands`, commandData);
    return data;
  },

  /**
   * Send bulk command to multiple devices
   */
  sendBulkCommand: async (
    deviceIds: string[],
    commandData: Omit<DeviceCommand, 'id' | 'deviceId' | 'status' | 'createdAt' | 'result'>
  ): Promise<DeviceCommand[]> => {
    const { data } = await api.post('/iot/devices/bulk-command', {
      deviceIds,
      command: commandData,
    });
    return data;
  },

  /**
   * Get device command history
   */
  getCommandHistory: async (
    deviceId: string,
    options?: {
      limit?: number;
      status?: DeviceCommand['status'];
      type?: DeviceCommand['type'];
      from?: string;
      to?: string;
    }
  ): Promise<DeviceCommand[]> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/commands`, {
      params: options,
    });
    return data;
  },

  /**
   * Get command status
   */
  getCommandStatus: async (commandId: string): Promise<DeviceCommand> => {
    const { data } = await api.get(`/iot/commands/${commandId}`);
    return data;
  },

  /**
   * Cancel pending command
   */
  cancelCommand: async (commandId: string): Promise<DeviceCommand> => {
    const { data } = await api.put(`/iot/commands/${commandId}/cancel`);
    return data;
  },

  /**
   * Create device group
   */
  createGroup: async (
    groupData: Omit<DeviceGroup, 'id' | 'statistics' | 'createdAt' | 'updatedAt'>
  ): Promise<DeviceGroup> => {
    const { data } = await api.post('/iot/device-groups', groupData);
    return data;
  },

  /**
   * Get device groups
   */
  getGroups: async (): Promise<DeviceGroup[]> => {
    const { data } = await api.get('/iot/device-groups');
    return data;
  },

  /**
   * Update device group
   */
  updateGroup: async (
    groupId: string,
    updates: Partial<DeviceGroup>
  ): Promise<DeviceGroup> => {
    const { data } = await api.put(`/iot/device-groups/${groupId}`, updates);
    return data;
  },

  /**
   * Add devices to group
   */
  addDevicesToGroup: async (
    groupId: string,
    deviceIds: string[]
  ): Promise<DeviceGroup> => {
    const { data } = await api.post(`/iot/device-groups/${groupId}/devices`, {
      deviceIds,
    });
    return data;
  },

  /**
   * Remove devices from group
   */
  removeDevicesFromGroup: async (
    groupId: string,
    deviceIds: string[]
  ): Promise<DeviceGroup> => {
    const { data } = await api.delete(`/iot/device-groups/${groupId}/devices`, {
      data: { deviceIds },
    });
    return data;
  },

  /**
   * Get device alerts
   */
  getAlerts: async (
    deviceId?: string,
    filters?: {
      severity?: DeviceAlert['severity'];
      status?: DeviceAlert['status'];
      type?: DeviceAlert['type'];
      from?: string;
      to?: string;
      limit?: number;
    }
  ): Promise<DeviceAlert[]> => {
    const { data } = await api.get('/iot/alerts', {
      params: { deviceId, ...filters },
    });
    return data;
  },

  /**
   * Acknowledge alert
   */
  acknowledgeAlert: async (
    alertId: string,
    note?: string
  ): Promise<DeviceAlert> => {
    const { data } = await api.put(`/iot/alerts/${alertId}/acknowledge`, { note });
    return data;
  },

  /**
   * Resolve alert
   */
  resolveAlert: async (
    alertId: string,
    resolution: string
  ): Promise<DeviceAlert> => {
    const { data } = await api.put(`/iot/alerts/${alertId}/resolve`, { resolution });
    return data;
  },

  /**
   * Suppress alert temporarily
   */
  suppressAlert: async (
    alertId: string,
    suppressUntil: string,
    reason: string
  ): Promise<DeviceAlert> => {
    const { data } = await api.put(`/iot/alerts/${alertId}/suppress`, {
      suppressUntil,
      reason,
    });
    return data;
  },

  /**
   * Schedule device maintenance
   */
  scheduleMaintenance: async (
    deviceId: string,
    maintenanceData: Omit<DeviceMaintenanceRecord, 'id' | 'deviceId' | 'createdAt' | 'updatedAt' | 'summary'>
  ): Promise<DeviceMaintenanceRecord> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/maintenance`, maintenanceData);
    return data;
  },

  /**
   * Get maintenance records
   */
  getMaintenanceRecords: async (
    deviceId?: string,
    filters?: {
      status?: DeviceMaintenanceRecord['status'];
      type?: DeviceMaintenanceRecord['type'];
      from?: string;
      to?: string;
    }
  ): Promise<DeviceMaintenanceRecord[]> => {
    const { data } = await api.get('/iot/maintenance', {
      params: { deviceId, ...filters },
    });
    return data;
  },

  /**
   * Update maintenance record
   */
  updateMaintenanceRecord: async (
    recordId: string,
    updates: Partial<DeviceMaintenanceRecord>
  ): Promise<DeviceMaintenanceRecord> => {
    const { data } = await api.put(`/iot/maintenance/${recordId}`, updates);
    return data;
  },

  /**
   * Check for device updates
   */
  checkForUpdates: async (deviceId: string): Promise<DeviceUpdate[]> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/updates`);
    return data;
  },

  /**
   * Install device update
   */
  installUpdate: async (
    deviceId: string,
    updateId: string,
    options?: {
      scheduledAt?: string;
      priority?: DeviceUpdate['priority'];
    }
  ): Promise<DeviceUpdate> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/updates/${updateId}/install`, options);
    return data;
  },

  /**
   * Get update status
   */
  getUpdateStatus: async (updateId: string): Promise<DeviceUpdate> => {
    const { data } = await api.get(`/iot/updates/${updateId}`);
    return data;
  },

  /**
   * Rollback device update
   */
  rollbackUpdate: async (
    deviceId: string,
    updateId: string
  ): Promise<DeviceUpdate> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/updates/${updateId}/rollback`);
    return data;
  },

  /**
   * Get device health summary
   */
  getDeviceHealth: async (deviceId: string): Promise<IoTDevice['health']> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/health`);
    return data;
  },

  /**
   * Run device diagnostics
   */
  runDiagnostics: async (
    deviceId: string,
    tests?: string[]
  ): Promise<{
    deviceId: string;
    results: Array<{
      test: string;
      status: 'pass' | 'fail' | 'warning';
      details: string;
      metrics?: Record<string, number>;
    }>;
    summary: {
      totalTests: number;
      passed: number;
      failed: number;
      warnings: number;
    };
    runAt: string;
  }> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/diagnostics`, { tests });
    return data;
  },

  /**
   * Get device connectivity status
   */
  getConnectivityStatus: async (deviceId: string): Promise<IoTDevice['connectivity']> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/connectivity`);
    return data;
  },

  /**
   * Reset device to factory settings
   */
  resetDevice: async (
    deviceId: string,
    options?: {
      preserveConfiguration?: boolean;
      preserveData?: boolean;
      confirmationCode?: string;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/reset`, options);
    return data;
  },

  /**
   * Get device statistics
   */
  getDeviceStatistics: async (
    deviceId: string,
    timeRange: { from: string; to: string }
  ): Promise<{
    uptime: {
      percentage: number;
      totalHours: number;
      outageEvents: number;
    };
    connectivity: {
      averageSignalStrength: number;
      connectionDrops: number;
      dataTransmitted: number;
      dataReceived: number;
    };
    performance: {
      averageResponseTime: number;
      errorRate: number;
      successRate: number;
      throughput: number;
    };
    health: {
      alertsGenerated: number;
      criticalAlerts: number;
      maintenanceEvents: number;
      averageHealth: number;
    };
  }> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/statistics`, {
      params: timeRange,
    });
    return data;
  },

  /**
   * Export device data
   */
  exportDeviceData: async (
    deviceId: string,
    options: {
      format: 'csv' | 'json' | 'xml';
      dateRange: { from: string; to: string };
      includeAlerts?: boolean;
      includeCommands?: boolean;
      includeMaintenance?: boolean;
    }
  ): Promise<Blob> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/export`, options, {
      responseType: 'blob',
    });
    return data;
  },
};

export default iotDeviceAPI;