import api from './client';
import { PaginatedResponse } from '../../types/api/common';
import {
  Notification as NotificationPOJO,
  NotificationPreference,
  NotificationTemplate,
  NotificationType,
  NotificationStatus,
  NotificationPriority,
  NotificationCategory,
  SendNotificationRequest,
  SendNotificationResponse,
  GetNotificationsResponse,
  GetNotificationResponse,
  UpdatePreferencesRequest,
  UpdatePreferencesResponse
} from '../../types/api/notification';

// Re-export types for convenience
export type Notification = NotificationPOJO;
export type NotificationPreferences = NotificationPreference;

// Notifications API Service with typed POJOs
export const notificationsAPI = {
  // Get all notifications with typed filters
  getAll: async (filters?: {
    type?: NotificationType;
    status?: NotificationStatus;
    priority?: NotificationPriority;
    category?: NotificationCategory;
    isRead?: boolean;
    limit?: number;
  }): Promise<Notification[]> => {
    const response = await api.get<GetNotificationsResponse>('/notifications', {
      params: filters,
    });
    return response.data.notifications.items;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  // Clear all notifications
  clearAll: async (): Promise<void> => {
    await api.delete('/notifications/clear-all');
  },

  // Get notification preferences with typed response
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await api.get<{ preferences: NotificationPreference }>('/notifications/preferences');
    return response.data.preferences;
  },

  // Update notification preferences with typed request/response
  updatePreferences: async (preferences: UpdatePreferencesRequest): Promise<NotificationPreferences> => {
    const response = await api.put<UpdatePreferencesResponse>('/notifications/preferences', preferences);
    return response.data.preferences;
  },

  // Subscribe to push notifications
  subscribePush: async (subscription: PushSubscription): Promise<void> => {
    await api.post('/notifications/push/subscribe', { subscription });
  },

  // Unsubscribe from push notifications
  unsubscribePush: async (): Promise<void> => {
    await api.post('/notifications/push/unsubscribe');
  },

  // Send notification with typed request (admin feature)
  sendNotification: async (request: SendNotificationRequest): Promise<Notification> => {
    const response = await api.post<SendNotificationResponse>('/notifications/send', request);
    return response.data.notification;
  },
};

export default notificationsAPI;
