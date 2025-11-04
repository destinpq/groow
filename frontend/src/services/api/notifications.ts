import api from './client';

// Types
export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'payment' | 'product' | 'rfq' | 'review' | 'system' | 'promotion';
  title: string;
  message: string;
  icon?: string;
  link?: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  email: {
    orders: boolean;
    promotions: boolean;
    newsletters: boolean;
    productUpdates: boolean;
  };
  push: {
    orders: boolean;
    promotions: boolean;
    messages: boolean;
  };
  sms: {
    orders: boolean;
    promotions: boolean;
  };
}

// Notifications API Service
export const notificationsAPI = {
  // Get all notifications
  getAll: async (filters?: {
    type?: string;
    isRead?: boolean;
    limit?: number;
  }): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications', {
      params: filters,
    });
    return response.data;
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

  // Get notification preferences
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await api.get<NotificationPreferences>('/notifications/preferences');
    return response.data;
  },

  // Update notification preferences
  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    const response = await api.put<NotificationPreferences>('/notifications/preferences', preferences);
    return response.data;
  },

  // Subscribe to push notifications
  subscribePush: async (subscription: PushSubscription): Promise<void> => {
    await api.post('/notifications/push/subscribe', { subscription });
  },

  // Unsubscribe from push notifications
  unsubscribePush: async (): Promise<void> => {
    await api.post('/notifications/push/unsubscribe');
  },
};

export default notificationsAPI;
