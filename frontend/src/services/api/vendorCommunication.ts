/**
 * Vendor Communication API Services
 * Messaging, notifications, and customer communication tools
 */
import { api } from './client';

export interface VendorMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'vendor' | 'customer' | 'admin' | 'system';
  recipientId: string;
  recipientType: 'vendor' | 'customer' | 'admin';
  subject?: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video' | 'order_related' | 'product_inquiry';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'sent' | 'delivered' | 'read' | 'replied';
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  relatedOrder?: string;
  relatedProduct?: string;
  tags: string[];
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    type: 'vendor' | 'customer' | 'admin';
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  subject: string;
  lastMessage: {
    content: string;
    senderId: string;
    timestamp: string;
  };
  unreadCount: number;
  status: 'open' | 'closed' | 'escalated' | 'pending' | 'resolved';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'general' | 'order' | 'product' | 'refund' | 'complaint' | 'inquiry';
  tags: string[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  category: 'order' | 'product' | 'promotion' | 'system' | 'custom';
  variables: Array<{
    name: string;
    description: string;
    required: boolean;
    default?: string;
  }>;
  active: boolean;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'promotion' | 'update' | 'warning';
  audience: {
    type: 'all' | 'segments' | 'specific';
    criteria?: Record<string, any>;
    customerIds?: string[];
  };
  channels: Array<'email' | 'sms' | 'push' | 'in_app'>;
  scheduledAt?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  };
  createdAt: string;
  sentAt?: string;
}

export interface AutoResponder {
  id: string;
  name: string;
  trigger: {
    type: 'keyword' | 'time_based' | 'event' | 'absence';
    conditions: Record<string, any>;
  };
  response: {
    type: 'template' | 'custom';
    content: string;
    delay?: number;
  };
  active: boolean;
  priority: number;
  createdAt: string;
}

export interface CommunicationStats {
  overview: {
    totalConversations: number;
    activeConversations: number;
    averageResponseTime: number;
    resolutionRate: number;
    customerSatisfaction: number;
  };
  channels: Array<{
    channel: string;
    messages: number;
    responseTime: number;
    satisfaction: number;
  }>;
  trends: Array<{
    date: string;
    conversations: number;
    messages: number;
    responseTime: number;
  }>;
  categories: Array<{
    category: string;
    count: number;
    percentage: number;
    averageResolution: number;
  }>;
}

export interface CustomerSupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  subject: string;
  description: string;
  category: 'general' | 'order' | 'product' | 'refund' | 'complaint' | 'technical';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  assignedTo?: string;
  tags: string[];
  relatedOrder?: string;
  relatedProduct?: string;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  responses: Array<{
    id: string;
    authorId: string;
    authorType: 'customer' | 'vendor' | 'admin';
    content: string;
    isPublic: boolean;
    attachments: Array<{
      id: string;
      name: string;
      url: string;
    }>;
    createdAt: string;
  }>;
  satisfaction?: {
    rating: number;
    feedback: string;
    submittedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export const vendorCommunicationAPI = {
  /**
   * Get conversations
   */
  getConversations: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: Conversation['status'];
      priority?: Conversation['priority'];
      category?: Conversation['category'];
      search?: string;
      unreadOnly?: boolean;
    } = {}
  ) => {
    const { data } = await api.get('/vendor/communication/conversations', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get conversation details
   */
  getConversation: async (conversationId: string): Promise<Conversation> => {
    const { data } = await api.get(`/vendor/communication/conversations/${conversationId}`);
    return data;
  },

  /**
   * Get conversation messages
   */
  getMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<VendorMessage[]> => {
    const { data } = await api.get(`/vendor/communication/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return data;
  },

  /**
   * Send message
   */
  sendMessage: async (messageData: {
    conversationId?: string;
    recipientId?: string;
    recipientType?: 'customer' | 'admin';
    subject?: string;
    content: string;
    type?: VendorMessage['type'];
    priority?: VendorMessage['priority'];
    attachments?: File[];
    relatedOrder?: string;
    relatedProduct?: string;
  }): Promise<VendorMessage> => {
    const formData = new FormData();
    
    Object.entries(messageData).forEach(([key, value]) => {
      if (key === 'attachments' && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const { data } = await api.post('/vendor/communication/messages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Reply to message
   */
  replyToMessage: async (
    messageId: string,
    content: string,
    attachments?: File[]
  ): Promise<VendorMessage> => {
    const formData = new FormData();
    formData.append('content', content);
    
    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const { data } = await api.post(`/vendor/communication/messages/${messageId}/reply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Mark message as read
   */
  markMessageRead: async (messageId: string): Promise<void> => {
    await api.put(`/vendor/communication/messages/${messageId}/read`);
  },

  /**
   * Mark conversation as read
   */
  markConversationRead: async (conversationId: string): Promise<void> => {
    await api.put(`/vendor/communication/conversations/${conversationId}/read`);
  },

  /**
   * Update conversation status
   */
  updateConversationStatus: async (
    conversationId: string,
    status: Conversation['status'],
    note?: string
  ): Promise<Conversation> => {
    const { data } = await api.put(`/vendor/communication/conversations/${conversationId}/status`, {
      status,
      note,
    });
    return data;
  },

  /**
   * Add tags to conversation
   */
  addConversationTags: async (conversationId: string, tags: string[]): Promise<void> => {
    await api.post(`/vendor/communication/conversations/${conversationId}/tags`, { tags });
  },

  /**
   * Remove tags from conversation
   */
  removeConversationTags: async (conversationId: string, tags: string[]): Promise<void> => {
    await api.delete(`/vendor/communication/conversations/${conversationId}/tags`, {
      data: { tags },
    });
  },

  /**
   * Get notification templates
   */
  getNotificationTemplates: async (): Promise<NotificationTemplate[]> => {
    const { data } = await api.get('/vendor/communication/notification-templates');
    return data;
  },

  /**
   * Create notification template
   */
  createNotificationTemplate: async (template: {
    name: string;
    subject: string;
    content: string;
    type: NotificationTemplate['type'];
    category: NotificationTemplate['category'];
    variables?: Array<{
      name: string;
      description: string;
      required: boolean;
      default?: string;
    }>;
  }): Promise<NotificationTemplate> => {
    const { data } = await api.post('/vendor/communication/notification-templates', template);
    return data;
  },

  /**
   * Update notification template
   */
  updateNotificationTemplate: async (
    templateId: string,
    updates: Partial<NotificationTemplate>
  ): Promise<NotificationTemplate> => {
    const { data } = await api.put(`/vendor/communication/notification-templates/${templateId}`, updates);
    return data;
  },

  /**
   * Delete notification template
   */
  deleteNotificationTemplate: async (templateId: string): Promise<void> => {
    await api.delete(`/vendor/communication/notification-templates/${templateId}`);
  },

  /**
   * Send notification using template
   */
  sendTemplateNotification: async (
    templateId: string,
    recipients: string[],
    variables: Record<string, any>,
    channels?: Array<'email' | 'sms' | 'push' | 'in_app'>
  ) => {
    const { data } = await api.post(`/vendor/communication/notification-templates/${templateId}/send`, {
      recipients,
      variables,
      channels,
    });
    return data;
  },

  /**
   * Get broadcast messages
   */
  getBroadcastMessages: async (
    page: number = 1,
    limit: number = 20,
    status?: BroadcastMessage['status']
  ) => {
    const { data } = await api.get('/vendor/communication/broadcasts', {
      params: { page, limit, status },
    });
    return data;
  },

  /**
   * Create broadcast message
   */
  createBroadcastMessage: async (broadcast: {
    title: string;
    content: string;
    type: BroadcastMessage['type'];
    audience: BroadcastMessage['audience'];
    channels: BroadcastMessage['channels'];
    scheduledAt?: string;
  }): Promise<BroadcastMessage> => {
    const { data } = await api.post('/vendor/communication/broadcasts', broadcast);
    return data;
  },

  /**
   * Update broadcast message
   */
  updateBroadcastMessage: async (
    broadcastId: string,
    updates: Partial<BroadcastMessage>
  ): Promise<BroadcastMessage> => {
    const { data } = await api.put(`/vendor/communication/broadcasts/${broadcastId}`, updates);
    return data;
  },

  /**
   * Send broadcast message
   */
  sendBroadcastMessage: async (broadcastId: string): Promise<void> => {
    await api.post(`/vendor/communication/broadcasts/${broadcastId}/send`);
  },

  /**
   * Cancel scheduled broadcast
   */
  cancelBroadcast: async (broadcastId: string): Promise<void> => {
    await api.post(`/vendor/communication/broadcasts/${broadcastId}/cancel`);
  },

  /**
   * Get auto responders
   */
  getAutoResponders: async (): Promise<AutoResponder[]> => {
    const { data } = await api.get('/vendor/communication/auto-responders');
    return data;
  },

  /**
   * Create auto responder
   */
  createAutoResponder: async (responder: {
    name: string;
    trigger: AutoResponder['trigger'];
    response: AutoResponder['response'];
    priority?: number;
  }): Promise<AutoResponder> => {
    const { data } = await api.post('/vendor/communication/auto-responders', responder);
    return data;
  },

  /**
   * Update auto responder
   */
  updateAutoResponder: async (
    responderId: string,
    updates: Partial<AutoResponder>
  ): Promise<AutoResponder> => {
    const { data } = await api.put(`/vendor/communication/auto-responders/${responderId}`, updates);
    return data;
  },

  /**
   * Delete auto responder
   */
  deleteAutoResponder: async (responderId: string): Promise<void> => {
    await api.delete(`/vendor/communication/auto-responders/${responderId}`);
  },

  /**
   * Toggle auto responder status
   */
  toggleAutoResponder: async (responderId: string, active: boolean): Promise<AutoResponder> => {
    const { data } = await api.put(`/vendor/communication/auto-responders/${responderId}/toggle`, {
      active,
    });
    return data;
  },

  /**
   * Get support tickets
   */
  getSupportTickets: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: CustomerSupportTicket['status'];
      priority?: CustomerSupportTicket['priority'];
      category?: CustomerSupportTicket['category'];
      assignedTo?: string;
      search?: string;
    } = {}
  ) => {
    const { data } = await api.get('/vendor/communication/support-tickets', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get support ticket details
   */
  getSupportTicket: async (ticketId: string): Promise<CustomerSupportTicket> => {
    const { data } = await api.get(`/vendor/communication/support-tickets/${ticketId}`);
    return data;
  },

  /**
   * Respond to support ticket
   */
  respondToTicket: async (
    ticketId: string,
    content: string,
    isPublic: boolean = true,
    attachments?: File[]
  ) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('isPublic', isPublic.toString());

    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const { data } = await api.post(`/vendor/communication/support-tickets/${ticketId}/respond`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Update support ticket
   */
  updateSupportTicket: async (
    ticketId: string,
    updates: {
      status?: CustomerSupportTicket['status'];
      priority?: CustomerSupportTicket['priority'];
      assignedTo?: string;
      tags?: string[];
    }
  ): Promise<CustomerSupportTicket> => {
    const { data } = await api.put(`/vendor/communication/support-tickets/${ticketId}`, updates);
    return data;
  },

  /**
   * Assign support ticket
   */
  assignTicket: async (ticketId: string, assigneeId: string): Promise<void> => {
    await api.put(`/vendor/communication/support-tickets/${ticketId}/assign`, {
      assigneeId,
    });
  },

  /**
   * Escalate support ticket
   */
  escalateTicket: async (ticketId: string, reason: string): Promise<void> => {
    await api.post(`/vendor/communication/support-tickets/${ticketId}/escalate`, {
      reason,
    });
  },

  /**
   * Get communication statistics
   */
  getCommunicationStats: async (
    timeRange?: { from: string; to: string }
  ): Promise<CommunicationStats> => {
    const { data } = await api.get('/vendor/communication/stats', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get real-time communication metrics
   */
  getRealTimeMetrics: async () => {
    const { data } = await api.get('/vendor/communication/realtime-metrics');
    return data;
  },

  /**
   * Search messages
   */
  searchMessages: async (
    query: string,
    filters: {
      conversationId?: string;
      senderId?: string;
      type?: VendorMessage['type'];
      dateRange?: { from: string; to: string };
    } = {},
    page: number = 1,
    limit: number = 20
  ) => {
    const { data } = await api.get('/vendor/communication/messages/search', {
      params: { query, ...filters, page, limit },
    });
    return data;
  },

  /**
   * Export communication data
   */
  exportCommunicationData: async (
    type: 'conversations' | 'messages' | 'tickets',
    format: 'csv' | 'xlsx' | 'pdf',
    filters?: Record<string, any>,
    timeRange?: { from: string; to: string }
  ) => {
    const { data } = await api.get('/vendor/communication/export', {
      params: { type, format, ...filters, ...timeRange },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get communication settings
   */
  getCommunicationSettings: async () => {
    const { data } = await api.get('/vendor/communication/settings');
    return data;
  },

  /**
   * Update communication settings
   */
  updateCommunicationSettings: async (settings: {
    autoReply?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    businessHours?: {
      enabled: boolean;
      timezone: string;
      schedule: Record<string, { start: string; end: string; enabled: boolean }>;
    };
    responseTargets?: {
      firstResponse: number;
      resolution: number;
    };
  }) => {
    const { data } = await api.put('/vendor/communication/settings', settings);
    return data;
  },

  /**
   * Get customer communication history
   */
  getCustomerHistory: async (customerId: string, limit: number = 20) => {
    const { data } = await api.get(`/vendor/communication/customers/${customerId}/history`, {
      params: { limit },
    });
    return data;
  },

  /**
   * Block/unblock customer communication
   */
  toggleCustomerBlock: async (customerId: string, blocked: boolean, reason?: string) => {
    const { data } = await api.put(`/vendor/communication/customers/${customerId}/block`, {
      blocked,
      reason,
    });
    return data;
  },

  /**
   * Get communication analytics insights
   */
  getCommunicationInsights: async (timeRange?: { from: string; to: string }) => {
    const { data } = await api.get('/vendor/communication/insights', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Test communication channel
   */
  testCommunicationChannel: async (
    channel: 'email' | 'sms' | 'push',
    recipient: string,
    testMessage?: string
  ) => {
    const { data } = await api.post('/vendor/communication/test-channel', {
      channel,
      recipient,
      testMessage,
    });
    return data;
  },
};

export default vendorCommunicationAPI;