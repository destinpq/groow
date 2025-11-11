/**
 * IoT Sensor Data API Services
 * Real-time sensor data collection, processing, and analytics
 */
import { api } from './client';

export interface SensorReading {
  id: string;
  deviceId: string;
  sensorType: 'temperature' | 'humidity' | 'pressure' | 'motion' | 'light' | 'sound' | 'air_quality' | 'vibration' | 'proximity' | 'weight' | 'flow' | 'level' | 'ph' | 'gas' | 'radiation' | 'magnetic' | 'acceleration';
  sensorId: string;
  value: number;
  unit: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'invalid';
  accuracy: number;
  confidence: number;
  calibration: {
    lastCalibrated: string;
    calibrationFactor: number;
    drift: number;
  };
  context: {
    location: {
      zone: string;
      coordinates?: {
        x: number;
        y: number;
        z: number;
      };
    };
    environment: {
      ambientTemperature?: number;
      humidity?: number;
      pressure?: number;
    };
    operational: {
      mode: string;
      powerLevel: number;
      samplingRate: number;
    };
  };
  metadata: {
    source: string;
    messageId: string;
    protocol: string;
    encoding: string;
    compression?: string;
  };
  timestamp: string;
  processedAt: string;
  tags?: Record<string, string>;
}

export interface SensorDataStream {
  id: string;
  deviceId: string;
  sensorType: SensorReading['sensorType'];
  status: 'active' | 'paused' | 'error' | 'maintenance';
  configuration: {
    samplingRate: number; // Hz
    reportingInterval: number; // seconds
    bufferSize: number;
    compression: {
      enabled: boolean;
      algorithm?: string;
      ratio?: number;
    };
    filtering: {
      enabled: boolean;
      type?: 'low_pass' | 'high_pass' | 'band_pass' | 'moving_average';
      parameters?: Record<string, number>;
    };
    aggregation: {
      enabled: boolean;
      methods: Array<'min' | 'max' | 'avg' | 'sum' | 'count' | 'std_dev'>;
      windowSize: number;
    };
  };
  thresholds: {
    min?: number;
    max?: number;
    critical?: {
      min?: number;
      max?: number;
    };
    warning?: {
      min?: number;
      max?: number;
    };
  };
  statistics: {
    totalReadings: number;
    lastReading: string;
    averageValue: number;
    minValue: number;
    maxValue: number;
    standardDeviation: number;
    dataRate: number; // readings per second
    errorRate: number;
  };
  retention: {
    policy: 'time_based' | 'size_based' | 'custom';
    duration?: number; // days
    maxSize?: number; // MB
    archiveAfter?: number; // days
  };
  createdAt: string;
  updatedAt: string;
}

export interface DataAggregation {
  id: string;
  deviceId: string;
  sensorType: SensorReading['sensorType'];
  aggregationType: 'minute' | 'hour' | 'day' | 'week' | 'month';
  timeWindow: {
    start: string;
    end: string;
  };
  metrics: {
    count: number;
    sum: number;
    average: number;
    minimum: number;
    maximum: number;
    standardDeviation: number;
    variance: number;
    median?: number;
    percentiles?: {
      p25: number;
      p50: number;
      p75: number;
      p90: number;
      p95: number;
      p99: number;
    };
  };
  quality: {
    validReadings: number;
    invalidReadings: number;
    missingReadings: number;
    interpolatedValues: number;
    confidence: number;
  };
  trends: {
    slope: number;
    correlation: number;
    seasonality?: {
      detected: boolean;
      period?: number;
      strength?: number;
    };
  };
  createdAt: string;
}

export interface SensorAlert {
  id: string;
  deviceId: string;
  sensorType: SensorReading['sensorType'];
  alertType: 'threshold_exceeded' | 'anomaly_detected' | 'data_missing' | 'sensor_malfunction' | 'calibration_due' | 'pattern_deviation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  triggerValue?: number;
  thresholdValue?: number;
  conditions: {
    rule: string;
    duration?: number;
    frequency?: number;
    pattern?: string;
  };
  context: {
    currentValue?: number;
    previousValue?: number;
    trend?: string;
    anomalyScore?: number;
    confidence?: number;
  };
  status: 'active' | 'acknowledged' | 'resolved' | 'suppressed';
  actions: Array<{
    type: 'notification' | 'email' | 'sms' | 'webhook' | 'auto_adjust' | 'maintenance_request';
    executed: boolean;
    result?: string;
    executedAt?: string;
  }>;
  metadata: {
    relatedReadings: string[];
    affectedSystems?: string[];
    businessImpact?: string;
    priority: number;
  };
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface DataQuery {
  deviceIds?: string[];
  sensorTypes?: SensorReading['sensorType'][];
  timeRange: {
    start: string;
    end: string;
  };
  filters?: {
    valueRange?: { min: number; max: number };
    quality?: SensorReading['quality'][];
    tags?: Record<string, string>;
    zones?: string[];
  };
  aggregation?: {
    method: 'raw' | 'average' | 'min' | 'max' | 'sum' | 'count';
    interval: number; // seconds
  };
  limit?: number;
  offset?: number;
  format?: 'json' | 'csv' | 'parquet';
}

export interface DataExport {
  id: string;
  query: DataQuery;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'expired';
  progress: number;
  estimatedCompletion?: string;
  fileSize?: number;
  downloadUrl?: string;
  expiresAt: string;
  metadata: {
    recordCount: number;
    compressionRatio?: number;
    processingTime?: number;
  };
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface AnomalyDetection {
  id: string;
  deviceId: string;
  sensorType: SensorReading['sensorType'];
  algorithm: 'statistical' | 'machine_learning' | 'time_series' | 'clustering' | 'neural_network';
  configuration: {
    sensitivity: number;
    learningPeriod: number; // days
    modelUpdateInterval: number; // hours
    features: string[];
    parameters: Record<string, any>;
  };
  model: {
    version: string;
    lastTrained: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    trainingDataSize: number;
  };
  status: 'training' | 'active' | 'paused' | 'error';
  statistics: {
    totalPredictions: number;
    anomaliesDetected: number;
    falsePositives: number;
    truePositives: number;
    accuracy: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DataPattern {
  id: string;
  name: string;
  description: string;
  deviceIds: string[];
  sensorTypes: SensorReading['sensorType'][];
  pattern: {
    type: 'cyclical' | 'trend' | 'seasonal' | 'anomaly' | 'correlation' | 'threshold';
    parameters: Record<string, any>;
    confidence: number;
  };
  discovery: {
    method: 'automatic' | 'manual' | 'scheduled';
    algorithm: string;
    discoveredAt: string;
    lastValidated: string;
  };
  validation: {
    confirmed: boolean;
    accuracy: number;
    businessRelevance: number;
    actionable: boolean;
  };
  insights: {
    summary: string;
    recommendations: string[];
    businessImpact: string;
    priority: number;
  };
  monitoring: {
    enabled: boolean;
    alertOnDeviation: boolean;
    deviationThreshold: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const iotSensorDataAPI = {
  /**
   * Get real-time sensor readings
   */
  getRealTimeData: async (
    deviceId: string,
    sensorTypes?: SensorReading['sensorType'][]
  ): Promise<SensorReading[]> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/data/realtime`, {
      params: { sensorTypes: sensorTypes?.join(',') },
    });
    return data;
  },

  /**
   * Query historical sensor data
   */
  queryData: async (query: DataQuery): Promise<{
    data: SensorReading[];
    total: number;
    aggregated?: DataAggregation[];
    hasMore: boolean;
  }> => {
    const { data } = await api.post('/iot/data/query', query);
    return data;
  },

  /**
   * Get latest sensor readings for device
   */
  getLatestReadings: async (
    deviceId: string,
    limit: number = 10
  ): Promise<SensorReading[]> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/data/latest`, {
      params: { limit },
    });
    return data;
  },

  /**
   * Get data streams for device
   */
  getDataStreams: async (deviceId: string): Promise<SensorDataStream[]> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/streams`);
    return data;
  },

  /**
   * Configure data stream
   */
  configureStream: async (
    deviceId: string,
    sensorType: SensorReading['sensorType'],
    configuration: SensorDataStream['configuration']
  ): Promise<SensorDataStream> => {
    const { data } = await api.put(`/iot/devices/${deviceId}/streams/${sensorType}`, {
      configuration,
    });
    return data;
  },

  /**
   * Start data stream
   */
  startStream: async (
    deviceId: string,
    sensorType: SensorReading['sensorType']
  ): Promise<SensorDataStream> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/streams/${sensorType}/start`);
    return data;
  },

  /**
   * Stop data stream
   */
  stopStream: async (
    deviceId: string,
    sensorType: SensorReading['sensorType']
  ): Promise<SensorDataStream> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/streams/${sensorType}/stop`);
    return data;
  },

  /**
   * Get aggregated data
   */
  getAggregatedData: async (
    deviceId: string,
    sensorType: SensorReading['sensorType'],
    aggregationType: DataAggregation['aggregationType'],
    timeRange: { start: string; end: string }
  ): Promise<DataAggregation[]> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/data/aggregated`, {
      params: {
        sensorType,
        aggregationType,
        ...timeRange,
      },
    });
    return data;
  },

  /**
   * Get sensor alerts
   */
  getSensorAlerts: async (
    deviceId?: string,
    filters?: {
      sensorType?: SensorReading['sensorType'];
      severity?: SensorAlert['severity'];
      status?: SensorAlert['status'];
      from?: string;
      to?: string;
    }
  ): Promise<SensorAlert[]> => {
    const { data } = await api.get('/iot/data/alerts', {
      params: { deviceId, ...filters },
    });
    return data;
  },

  /**
   * Create data alert rule
   */
  createAlertRule: async (
    deviceId: string,
    sensorType: SensorReading['sensorType'],
    rule: {
      name: string;
      description: string;
      conditions: SensorAlert['conditions'];
      severity: SensorAlert['severity'];
      actions: Array<{
        type: SensorAlert['actions'][0]['type'];
        configuration: Record<string, any>;
      }>;
    }
  ): Promise<{ id: string; active: boolean }> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/alert-rules`, {
      sensorType,
      ...rule,
    });
    return data;
  },

  /**
   * Update alert rule
   */
  updateAlertRule: async (
    ruleId: string,
    updates: {
      conditions?: SensorAlert['conditions'];
      severity?: SensorAlert['severity'];
      active?: boolean;
    }
  ): Promise<{ success: boolean }> => {
    const { data } = await api.put(`/iot/alert-rules/${ruleId}`, updates);
    return data;
  },

  /**
   * Acknowledge sensor alert
   */
  acknowledgeAlert: async (
    alertId: string,
    note?: string
  ): Promise<SensorAlert> => {
    const { data } = await api.put(`/iot/data/alerts/${alertId}/acknowledge`, { note });
    return data;
  },

  /**
   * Export sensor data
   */
  exportData: async (
    query: DataQuery,
    exportOptions?: {
      compression?: boolean;
      includeMetadata?: boolean;
      notifyWhenReady?: boolean;
    }
  ): Promise<DataExport> => {
    const { data } = await api.post('/iot/data/export', {
      query,
      options: exportOptions,
    });
    return data;
  },

  /**
   * Get export status
   */
  getExportStatus: async (exportId: string): Promise<DataExport> => {
    const { data } = await api.get(`/iot/data/exports/${exportId}`);
    return data;
  },

  /**
   * Download exported data
   */
  downloadExport: async (exportId: string): Promise<Blob> => {
    const { data } = await api.get(`/iot/data/exports/${exportId}/download`, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Setup anomaly detection
   */
  setupAnomalyDetection: async (
    deviceId: string,
    sensorType: SensorReading['sensorType'],
    config: Pick<AnomalyDetection, 'algorithm' | 'configuration'>
  ): Promise<AnomalyDetection> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/anomaly-detection`, {
      sensorType,
      ...config,
    });
    return data;
  },

  /**
   * Get anomaly detection status
   */
  getAnomalyDetection: async (detectionId: string): Promise<AnomalyDetection> => {
    const { data } = await api.get(`/iot/anomaly-detection/${detectionId}`);
    return data;
  },

  /**
   * Train anomaly detection model
   */
  trainAnomalyModel: async (
    detectionId: string,
    trainingData?: {
      startDate: string;
      endDate: string;
      excludeAnomalies: boolean;
    }
  ): Promise<{ success: boolean; jobId: string }> => {
    const { data } = await api.post(`/iot/anomaly-detection/${detectionId}/train`, trainingData);
    return data;
  },

  /**
   * Detect anomalies in real-time
   */
  detectAnomalies: async (
    deviceId: string,
    sensorType: SensorReading['sensorType'],
    readings: SensorReading[]
  ): Promise<Array<{
    reading: SensorReading;
    anomalyScore: number;
    isAnomaly: boolean;
    confidence: number;
    explanation?: string;
  }>> => {
    const { data } = await api.post('/iot/data/detect-anomalies', {
      deviceId,
      sensorType,
      readings,
    });
    return data;
  },

  /**
   * Discover data patterns
   */
  discoverPatterns: async (
    query: DataQuery,
    options?: {
      algorithms?: string[];
      minConfidence?: number;
      maxPatterns?: number;
    }
  ): Promise<DataPattern[]> => {
    const { data } = await api.post('/iot/data/discover-patterns', {
      query,
      options,
    });
    return data;
  },

  /**
   * Get discovered patterns
   */
  getPatterns: async (
    deviceId?: string,
    filters?: {
      type?: DataPattern['pattern']['type'];
      minConfidence?: number;
      validated?: boolean;
    }
  ): Promise<DataPattern[]> => {
    const { data } = await api.get('/iot/data/patterns', {
      params: { deviceId, ...filters },
    });
    return data;
  },

  /**
   * Validate data pattern
   */
  validatePattern: async (
    patternId: string,
    validation: {
      confirmed: boolean;
      businessRelevance: number;
      actionable: boolean;
      notes?: string;
    }
  ): Promise<DataPattern> => {
    const { data } = await api.put(`/iot/data/patterns/${patternId}/validate`, validation);
    return data;
  },

  /**
   * Get data quality metrics
   */
  getDataQuality: async (
    deviceId: string,
    timeRange: { start: string; end: string },
    sensorType?: SensorReading['sensorType']
  ): Promise<{
    overall: {
      score: number;
      grade: 'A' | 'B' | 'C' | 'D' | 'F';
    };
    metrics: {
      completeness: number;
      accuracy: number;
      consistency: number;
      timeliness: number;
      validity: number;
    };
    issues: Array<{
      type: string;
      severity: string;
      count: number;
      description: string;
    }>;
    recommendations: string[];
  }> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/data-quality`, {
      params: { ...timeRange, sensorType },
    });
    return data;
  },

  /**
   * Calibrate sensor
   */
  calibrateSensor: async (
    deviceId: string,
    sensorType: SensorReading['sensorType'],
    calibrationData: {
      referenceValue: number;
      measuredValue: number;
      calibrationMethod: 'offset' | 'scale' | 'polynomial' | 'lookup_table';
      notes?: string;
    }
  ): Promise<{
    success: boolean;
    calibrationFactor: number;
    expectedImprovement: number;
    nextCalibrationDue: string;
  }> => {
    const { data } = await api.post(`/iot/devices/${deviceId}/calibrate/${sensorType}`, calibrationData);
    return data;
  },

  /**
   * Get sensor statistics
   */
  getSensorStatistics: async (
    deviceId: string,
    sensorType: SensorReading['sensorType'],
    timeRange: { start: string; end: string }
  ): Promise<{
    readingCount: number;
    dataRate: number;
    statistics: DataAggregation['metrics'];
    distribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    trends: {
      direction: 'increasing' | 'decreasing' | 'stable';
      slope: number;
      correlation: number;
    };
    outliers: {
      count: number;
      percentage: number;
      values: number[];
    };
  }> => {
    const { data } = await api.get(`/iot/devices/${deviceId}/sensors/${sensorType}/statistics`, {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get data retention policies
   */
  getRetentionPolicies: async (): Promise<Array<{
    id: string;
    name: string;
    description: string;
    rules: {
      deviceTypes: string[];
      sensorTypes: string[];
      retentionPeriod: number;
      archivePolicy: string;
    };
  }>> => {
    const { data } = await api.get('/iot/data/retention-policies');
    return data;
  },

  /**
   * Create data retention policy
   */
  createRetentionPolicy: async (
    policy: {
      name: string;
      description: string;
      rules: {
        deviceTypes: string[];
        sensorTypes: string[];
        retentionPeriod: number;
        archivePolicy: string;
      };
    }
  ): Promise<{ id: string; active: boolean }> => {
    const { data } = await api.post('/iot/data/retention-policies', policy);
    return data;
  },
};

export default iotSensorDataAPI;