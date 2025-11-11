/**
 * Mobile App API Services
 * Native mobile app integration with push notifications and offline capabilities
 */
import { api } from './client';

export interface DeviceRegistration {
  deviceId: string;
  userId: string;
  platform: 'ios' | 'android' | 'web';
  deviceToken: string;
  appVersion: string;
  osVersion: string;
  deviceModel: string;
  timeZone: string;
  language: string;
  pushEnabled: boolean;
  preferences: {
    notifications: {
      orders: boolean;
      promotions: boolean;
      priceDrops: boolean;
      backInStock: boolean;
      messages: boolean;
      reminders: boolean;
    };
    quietHours: {
      enabled: boolean;
      start: string; // HH:mm format
      end: string;
    };
    categories: string[];
  };
  metadata: {
    installDate: string;
    lastActiveDate: string;
    sessionCount: number;
    crashCount: number;
  };
}

export interface PushNotification {
  id: string;
  userId: string;
  deviceId?: string;
  type: 'order' | 'promotion' | 'price_drop' | 'stock' | 'message' | 'reminder' | 'system';
  title: string;
  body: string;
  data: Record<string, any>;
  imageUrl?: string;
  actionButtons?: Array<{
    id: string;
    title: string;
    action: string;
    icon?: string;
  }>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduled?: {
    sendAt: string;
    timezone?: string;
  };
  targeting: {
    userIds?: string[];
    deviceIds?: string[];
    segments?: string[];
    platforms?: ('ios' | 'android' | 'web')[];
    appVersions?: string[];
    locations?: Array<{
      latitude: number;
      longitude: number;
      radius: number;
    }>;
  };
  analytics: {
    sentCount: number;
    deliveredCount: number;
    openedCount: number;
    clickedCount: number;
    dismissedCount: number;
    errors: Array<{
      code: string;
      message: string;
      count: number;
    }>;
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
}

export interface OfflineData {
  id: string;
  type: 'product' | 'category' | 'vendor' | 'order' | 'cart' | 'wishlist' | 'search';
  data: any;
  version: number;
  lastModified: string;
  expiresAt?: string;
  priority: 'low' | 'normal' | 'high';
  size: number; // in bytes
  dependencies?: string[]; // other offline data IDs this depends on
}

export interface SyncStatus {
  id: string;
  type: 'full' | 'incremental' | 'manual';
  status: 'idle' | 'syncing' | 'completed' | 'failed' | 'paused';
  progress: {
    total: number;
    completed: number;
    failed: number;
    percentage: number;
  };
  startTime: string;
  endTime?: string;
  errors?: Array<{
    code: string;
    message: string;
    item?: string;
  }>;
  stats: {
    uploaded: number;
    downloaded: number;
    conflicts: number;
    resolved: number;
  };
}

export interface MobileAppConfig {
  id: string;
  version: string;
  features: {
    offlineMode: boolean;
    pushNotifications: boolean;
    biometric: boolean;
    darkMode: boolean;
    voiceSearch: boolean;
    visualSearch: boolean;
    ar: boolean;
    geolocation: boolean;
  };
  limits: {
    maxOfflineStorage: number; // in MB
    maxImageCacheSize: number;
    maxSearchHistory: number;
    sessionTimeout: number; // in minutes
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  ui: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    iconSet: string;
    animations: boolean;
  };
  analytics: {
    enabled: boolean;
    trackingId: string;
    events: string[];
  };
  security: {
    certificatePinning: boolean;
    requestSigning: boolean;
    encryptLocalStorage: boolean;
  };
}

export interface AppSession {
  sessionId: string;
  userId?: string;
  deviceId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  activities: Array<{
    type: string;
    timestamp: string;
    data: Record<string, any>;
  }>;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  };
  network: {
    type: 'wifi' | 'cellular' | 'none';
    strength: number;
    provider?: string;
  };
  performance: {
    appStartTime: number;
    screenLoadTimes: Record<string, number>;
    apiResponseTimes: Record<string, number>;
    memoryUsage: number;
    batteryLevel: number;
  };
}

export interface GeofenceEvent {
  id: string;
  userId: string;
  deviceId: string;
  type: 'enter' | 'exit' | 'dwell';
  geofence: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    type: 'store' | 'warehouse' | 'event' | 'competitor';
  };
  timestamp: string;
  accuracy: number;
  actions: Array<{
    type: 'notification' | 'promotion' | 'analytics' | 'reminder';
    executed: boolean;
    data: Record<string, any>;
  }>;
}

export const mobileAppAPI = {
  /**
   * Register device for push notifications
   */
  registerDevice: async (deviceData: Omit<DeviceRegistration, 'metadata'>): Promise<DeviceRegistration> => {
    const { data } = await api.post('/mobile/devices/register', deviceData);
    return data;
  },

  /**
   * Update device registration
   */
  updateDevice: async (
    deviceId: string,
    updates: Partial<DeviceRegistration>
  ): Promise<DeviceRegistration> => {
    const { data } = await api.put(`/mobile/devices/${deviceId}`, updates);
    return data;
  },

  /**
   * Unregister device
   */
  unregisterDevice: async (deviceId: string): Promise<void> => {
    await api.delete(`/mobile/devices/${deviceId}`);
  },

  /**
   * Get device registration details
   */
  getDevice: async (deviceId: string): Promise<DeviceRegistration> => {
    const { data } = await api.get(`/mobile/devices/${deviceId}`);
    return data;
  },

  /**
   * Send push notification
   */
  sendPushNotification: async (
    notification: Omit<PushNotification, 'id' | 'analytics' | 'status' | 'createdAt' | 'sentAt'>
  ): Promise<PushNotification> => {
    const { data } = await api.post('/mobile/notifications/send', notification);
    return data;
  },

  /**
   * Send bulk push notifications
   */
  sendBulkNotifications: async (
    notifications: Array<Omit<PushNotification, 'id' | 'analytics' | 'status' | 'createdAt' | 'sentAt'>>
  ): Promise<PushNotification[]> => {
    const { data } = await api.post('/mobile/notifications/bulk', { notifications });
    return data;
  },

  /**
   * Schedule push notification
   */
  scheduleNotification: async (
    notification: Omit<PushNotification, 'id' | 'analytics' | 'status' | 'createdAt' | 'sentAt'>,
    scheduleTime: string
  ): Promise<PushNotification> => {
    const { data } = await api.post('/mobile/notifications/schedule', {
      ...notification,
      scheduled: { sendAt: scheduleTime },
    });
    return data;
  },

  /**
   * Get notification history
   */
  getNotificationHistory: async (
    userId?: string,
    deviceId?: string,
    limit: number = 50
  ): Promise<PushNotification[]> => {
    const { data } = await api.get('/mobile/notifications/history', {
      params: { userId, deviceId, limit },
    });
    return data;
  },

  /**
   * Mark notification as read
   */
  markNotificationRead: async (notificationId: string): Promise<void> => {
    await api.put(`/mobile/notifications/${notificationId}/read`);
  },

  /**
   * Get notification analytics
   */
  getNotificationAnalytics: async (
    notificationId?: string,
    timeRange?: { from: string; to: string }
  ): Promise<{
    totalSent: number;
    delivered: number;
    opened: number;
    clicked: number;
    dismissed: number;
    openRate: number;
    clickRate: number;
    deliveryRate: number;
    byPlatform: Record<string, any>;
    byType: Record<string, any>;
    byTimeOfDay: Array<{ hour: number; count: number }>;
  }> => {
    const { data } = await api.get('/mobile/notifications/analytics', {
      params: { notificationId, ...timeRange },
    });
    return data;
  },

  /**
   * Store data for offline access
   */
  storeOfflineData: async (
    type: OfflineData['type'],
    data: any,
    options?: {
      priority?: OfflineData['priority'];
      expiresAt?: string;
      dependencies?: string[];
    }
  ): Promise<OfflineData> => {
    const { data: result } = await api.post('/mobile/offline/store', {
      type,
      data,
      ...options,
    });
    return result;
  },

  /**
   * Get offline data
   */
  getOfflineData: async (
    type: OfflineData['type'],
    id?: string
  ): Promise<OfflineData[]> => {
    const { data } = await api.get('/mobile/offline/data', {
      params: { type, id },
    });
    return data;
  },

  /**
   * Update offline data
   */
  updateOfflineData: async (
    id: string,
    data: any,
    version: number
  ): Promise<OfflineData> => {
    const { data: result } = await api.put(`/mobile/offline/data/${id}`, {
      data,
      version,
    });
    return result;
  },

  /**
   * Delete offline data
   */
  deleteOfflineData: async (id: string): Promise<void> => {
    await api.delete(`/mobile/offline/data/${id}`);
  },

  /**
   * Sync offline changes with server
   */
  syncOfflineData: async (
    changes: Array<{
      id: string;
      type: OfflineData['type'];
      action: 'create' | 'update' | 'delete';
      data?: any;
      version: number;
    }>
  ): Promise<{
    successful: Array<{ id: string; newVersion: number }>;
    conflicts: Array<{ id: string; serverVersion: number; clientVersion: number; data: any }>;
    errors: Array<{ id: string; error: string }>;
  }> => {
    const { data } = await api.post('/mobile/offline/sync', { changes });
    return data;
  },

  /**
   * Get sync status
   */
  getSyncStatus: async (): Promise<SyncStatus[]> => {
    const { data } = await api.get('/mobile/offline/sync/status');
    return data;
  },

  /**
   * Start full sync
   */
  startFullSync: async (): Promise<SyncStatus> => {
    const { data } = await api.post('/mobile/offline/sync/full');
    return data;
  },

  /**
   * Pause/resume sync
   */
  controlSync: async (
    syncId: string,
    action: 'pause' | 'resume' | 'cancel'
  ): Promise<SyncStatus> => {
    const { data } = await api.put(`/mobile/offline/sync/${syncId}/${action}`);
    return data;
  },

  /**
   * Get mobile app configuration
   */
  getAppConfig: async (
    platform: 'ios' | 'android' | 'web',
    version?: string
  ): Promise<MobileAppConfig> => {
    const { data } = await api.get('/mobile/config', {
      params: { platform, version },
    });
    return data;
  },

  /**
   * Update app configuration
   */
  updateAppConfig: async (
    configId: string,
    updates: Partial<MobileAppConfig>
  ): Promise<MobileAppConfig> => {
    const { data } = await api.put(`/mobile/config/${configId}`, updates);
    return data;
  },

  /**
   * Start app session tracking
   */
  startSession: async (
    sessionData: Omit<AppSession, 'sessionId' | 'endTime' | 'duration'>
  ): Promise<AppSession> => {
    const { data } = await api.post('/mobile/sessions/start', sessionData);
    return data;
  },

  /**
   * Update session with activity
   */
  trackActivity: async (
    sessionId: string,
    activity: AppSession['activities'][0]
  ): Promise<void> => {
    await api.put(`/mobile/sessions/${sessionId}/activity`, activity);
  },

  /**
   * End session
   */
  endSession: async (sessionId: string): Promise<AppSession> => {
    const { data } = await api.put(`/mobile/sessions/${sessionId}/end`);
    return data;
  },

  /**
   * Get session analytics
   */
  getSessionAnalytics: async (
    timeRange: { from: string; to: string },
    userId?: string
  ): Promise<{
    totalSessions: number;
    uniqueUsers: number;
    averageSessionDuration: number;
    bounceRate: number;
    topActivities: Array<{ activity: string; count: number }>;
    topScreens: Array<{ screen: string; views: number; avgTime: number }>;
    crashRate: number;
    retentionRate: Record<string, number>;
  }> => {
    const { data } = await api.get('/mobile/sessions/analytics', {
      params: { ...timeRange, userId },
    });
    return data;
  },

  /**
   * Create geofence
   */
  createGeofence: async (geofence: {
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    type: GeofenceEvent['geofence']['type'];
    actions: Array<{
      trigger: 'enter' | 'exit' | 'dwell';
      type: 'notification' | 'promotion' | 'analytics' | 'reminder';
      data: Record<string, any>;
    }>;
  }): Promise<{ id: string }> => {
    const { data } = await api.post('/mobile/geofences', geofence);
    return data;
  },

  /**
   * Update user location
   */
  updateLocation: async (
    userId: string,
    location: {
      latitude: number;
      longitude: number;
      accuracy: number;
      timestamp: string;
    }
  ): Promise<GeofenceEvent[]> => {
    const { data } = await api.post(`/mobile/location/${userId}`, location);
    return data;
  },

  /**
   * Get geofence events
   */
  getGeofenceEvents: async (
    userId?: string,
    timeRange?: { from: string; to: string }
  ): Promise<GeofenceEvent[]> => {
    const { data } = await api.get('/mobile/geofences/events', {
      params: { userId, ...timeRange },
    });
    return data;
  },

  /**
   * Get app crash reports
   */
  getCrashReports: async (
    deviceId?: string,
    timeRange?: { from: string; to: string }
  ): Promise<Array<{
    id: string;
    deviceId: string;
    userId?: string;
    timestamp: string;
    appVersion: string;
    osVersion: string;
    stackTrace: string;
    metadata: Record<string, any>;
    resolved: boolean;
  }>> => {
    const { data } = await api.get('/mobile/crashes', {
      params: { deviceId, ...timeRange },
    });
    return data;
  },

  /**
   * Report app crash
   */
  reportCrash: async (crashData: {
    deviceId: string;
    userId?: string;
    appVersion: string;
    osVersion: string;
    stackTrace: string;
    metadata: Record<string, any>;
  }): Promise<{ id: string }> => {
    const { data } = await api.post('/mobile/crashes/report', crashData);
    return data;
  },

  /**
   * Get app performance metrics
   */
  getPerformanceMetrics: async (
    timeRange: { from: string; to: string },
    deviceId?: string
  ): Promise<{
    averageAppStartTime: number;
    averageScreenLoadTime: number;
    averageApiResponseTime: number;
    averageMemoryUsage: number;
    crashFrequency: number;
    anrFrequency: number; // Application Not Responding
    networkFailureRate: number;
    byPlatform: Record<string, any>;
    byVersion: Record<string, any>;
  }> => {
    const { data } = await api.get('/mobile/performance', {
      params: { ...timeRange, deviceId },
    });
    return data;
  },

  /**
   * Report performance data
   */
  reportPerformance: async (performanceData: {
    deviceId: string;
    sessionId: string;
    metrics: {
      appStartTime?: number;
      screenLoadTimes?: Record<string, number>;
      apiResponseTimes?: Record<string, number>;
      memoryUsage?: number;
      batteryLevel?: number;
    };
  }): Promise<void> => {
    await api.post('/mobile/performance/report', performanceData);
  },

  /**
   * Update notification preferences
   */
  updateNotificationPreferences: async (
    deviceId: string,
    preferences: DeviceRegistration['preferences']
  ): Promise<DeviceRegistration> => {
    const { data } = await api.put(`/mobile/devices/${deviceId}/preferences`, preferences);
    return data;
  },
};

export default mobileAppAPI;